'use server';

import {after} from 'next/server';
import {priceCart, type GiftCardValue} from '@/lib/booking/cart';
import {describePromo} from '@/lib/booking/promo-details';
import {bookingRequestSchema, normalizePhone, type BookingError} from '@/lib/booking/schema';
import {busyEnd, validateStart} from '@/lib/booking/slots';
import {quoteTravel} from '@/lib/booking/travel';
import {isUpcoming} from '@/lib/booking/tz';
import {getActiveCatalogStrict, getSettings, getSettingsStrict} from '@/lib/data/public';
import {getStore, type UploadTarget} from '@/lib/data/store';
import {sendBookingEmails} from '@/lib/email/booking';
import {l10n} from '@/lib/format';
import {withinRateLimit} from '@/lib/server/guard';

type CreateResult =
  | {ok: true; token: string; ref: string; uploads: UploadTarget[]}
  | {ok: false; error: Exclude<BookingError, 'price_changed'>}
  /** our total differs from the one the customer confirmed: they get to see it before anything is booked */
  | {ok: false; error: 'price_changed'; totalCents: number; customer: 'first' | 'repeat'};

/**
 * Creates a booking. The client sends only what was chosen (items, address, time, contact);
 * every price, the travel fee and the duration are recomputed here from the database.
 */
export async function createBookingAction(input: unknown): Promise<CreateResult> {
  const parsed = bookingRequestSchema.safeParse(input);
  if (!parsed.success) return {ok: false, error: 'invalid'};
  const {locale, cart, address, contact, startsAt, files, shownTotalCents} = parsed.data;

  if (!(await withinRateLimit('booking', 6, 600))) return {ok: false, error: 'rate_limited'};

  const store = getStore();
  // Strict readers: if the database cannot be read, the booking fails instead of being priced from defaults.
  const loaded = await Promise.all([
    getActiveCatalogStrict(),
    getSettingsStrict(),
    store.findPostalCode(address.postalCode)
  ]).catch((error) => {
    console.error('[booking] catalog or settings unavailable', error);
    return null;
  });
  if (!loaded) return {ok: false, error: 'failed'};
  const [catalog, settings, postal] = loaded;

  const travel = quoteTravel(postal, settings);
  if (travel.status !== 'ok') return {ok: false, error: 'out_of_area'};

  let giftCard: GiftCardValue | null = null;
  const giftCardCode = contact.giftCardCode.toUpperCase();
  if (giftCardCode) {
    giftCard = await store.findGiftCard(giftCardCode);
    if (!giftCard) return {ok: false, error: 'gift_card_invalid'};
  }

  // first order or returning customer: decided here from our own bookings, never by the client
  const customer = (await store.isReturningCustomer(contact.email, contact.phone)) ? 'repeat' : 'first';

  const quote = priceCart(cart, catalog, {
    minOrderCents: settings.minOrderCents,
    travelCents: travel.feeCents,
    giftCard,
    promotions: settings.promotions,
    customer
  });
  if (quote.invalid.length > 0 || quote.lines.length === 0 || quote.durationMin <= 0) {
    return {ok: false, error: 'invalid_cart'};
  }
  // a service card only counts when its service is being booked
  if (!quote.giftCardApplicable) return {ok: false, error: 'gift_card_not_applicable'};

  if (validateStart({startsAt, durationMin: quote.durationMin, settings, now: new Date()}) !== 'ok') {
    return {ok: false, error: 'slot_unavailable'};
  }

  // The customer confirmed a total. If ours differs (they turned out to be a returning customer,
  // or a price was edited meanwhile), nothing is booked until they have seen the new one.
  if (quote.totalCents !== shownTotalCents) {
    return {ok: false, error: 'price_changed', totalCents: quote.totalCents, customer};
  }

  const result = await store.createBooking({
    locale,
    customerType: contact.customerType,
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    company: contact.customerType === 'business' ? contact.company : undefined,
    yTunnus: contact.customerType === 'business' ? contact.yTunnus : undefined,
    address: address.street,
    postalCode: address.postalCode,
    city: address.city,
    floor: address.floor || undefined,
    parking: address.parking,
    notes: address.notes || undefined,
    startsAt: new Date(startsAt).toISOString(),
    endsAt: busyEnd(startsAt, quote.durationMin, settings.bufferMin),
    durationMin: quote.durationMin,
    subtotalCents: quote.subtotalCents,
    travelCents: quote.travelCents,
    minFillCents: quote.minFillCents,
    promoCents: quote.promoCents,
    promoDetails: describePromo(quote, customer, settings.promotions),
    discountCents: quote.discountCents,
    totalCents: quote.totalCents,
    // stored only when it actually pays for something
    giftCardCode: quote.discountCents > 0 ? giftCardCode : undefined,
    marketingConsent: contact.marketing,
    items: quote.lines.map((line) => {
      const options = line.service.options.filter((o) => line.optionSlugs.includes(o.slug));
      return {
        serviceId: line.service.id,
        serviceSlug: line.service.slug,
        // snapshot in the customer's language, options included
        name: [l10n(line.service.name, locale), ...options.map((o) => l10n(o.name, locale))].join(' + '),
        optionIds: line.optionIds,
        optionSlugs: line.optionSlugs,
        qty: line.qty,
        unitPriceCents: line.unitCents,
        durationMin: line.durationMin,
        veryDirty: line.veryDirty
      };
    })
  });

  if (!result.ok) return {ok: false, error: result.error};

  // e-mails must not delay or break the confirmation
  after(() =>
    sendBookingEmails({...result.booking, photos: files.map((f) => f.name)}, settings, 'created').catch((e) =>
      console.error('[booking] notify failed', e)
    )
  );

  // photos go straight from the browser into the private bucket, to URLs issued for this booking only
  // the booking exists by now, so a failure here must not be reported as a failed booking
  const uploads =
    files.length > 0
      ? await store.createBookingUploads(result.booking.id, files).catch((error) => {
          console.error('[booking] photo upload URLs failed', error);
          return [] as UploadTarget[];
        })
      : [];

  return {ok: true, token: result.booking.manageToken, ref: result.booking.refCode, uploads};
}

/**
 * First order or returning customer — so the confirmation step can show the right discount.
 * The booking itself never trusts this answer: createBookingAction looks it up again.
 */
export async function checkCustomerAction(email: string, phone: string): Promise<'first' | 'repeat'> {
  const mail = String(email ?? '').trim().slice(0, 160);
  const tel = normalizePhone(String(phone ?? '')).slice(0, 20);
  if (!mail || !(await withinRateLimit('customer-check', 10, 600))) return 'first';
  return (await getStore().isReturningCustomer(mail, tel)) ? 'repeat' : 'first';
}

export async function checkGiftCardAction(
  code: string
): Promise<{valid: true; card: GiftCardValue} | {valid: false; reason: 'invalid' | 'rate_limited'}> {
  const normalized = String(code ?? '').trim().toUpperCase().slice(0, 40);
  if (!normalized) return {valid: false, reason: 'invalid'};
  // guessing codes is not an option: 10 checks per 10 minutes per IP
  if (!(await withinRateLimit('giftcard', 10, 600))) return {valid: false, reason: 'rate_limited'};
  const card = await getStore().findGiftCard(normalized);
  return card ? {valid: true, card} : {valid: false, reason: 'invalid'};
}

export async function cancelBookingAction(token: string): Promise<{ok: boolean}> {
  if (typeof token !== 'string' || token.length < 32) return {ok: false};
  if (!(await withinRateLimit('manage', 20, 600))) return {ok: false};
  const store = getStore();
  // Only before the visit: afterwards a cancel would hand a redeemed gift card back for a job already done.
  const existing = await store.getBookingByToken(token);
  if (!existing || !isUpcoming(existing.startsAt)) return {ok: false};
  const ok = await store.cancelBooking(token);
  if (ok) {
    const [booking, settings] = await Promise.all([store.getBookingByToken(token), getSettings()]);
    if (booking) after(() => sendBookingEmails(booking, settings, 'cancelled').catch(() => undefined));
  }
  return {ok};
}

export async function rescheduleBookingAction(
  token: string,
  startsAt: string
): Promise<{ok: true} | {ok: false; error: 'not_found' | 'slot_unavailable' | 'slot_taken' | 'rate_limited'}> {
  if (typeof token !== 'string' || token.length < 32) return {ok: false, error: 'not_found'};
  if (!(await withinRateLimit('manage', 20, 600))) return {ok: false, error: 'rate_limited'};
  const store = getStore();
  const [booking, settings] = await Promise.all([store.getBookingByToken(token), getSettings()]);
  if (!booking || (booking.status !== 'pending' && booking.status !== 'confirmed') || !isUpcoming(booking.startsAt)) {
    return {ok: false, error: 'not_found'};
  }
  if (validateStart({startsAt, durationMin: booking.durationMin, settings, now: new Date()}) !== 'ok') {
    return {ok: false, error: 'slot_unavailable'};
  }
  const result = await store.rescheduleBooking(
    token,
    new Date(startsAt).toISOString(),
    busyEnd(startsAt, booking.durationMin, settings.bufferMin)
  );
  if (result !== 'ok') return {ok: false, error: result};
  const updated = await store.getBookingByToken(token);
  if (updated) after(() => sendBookingEmails(updated, settings, 'rescheduled').catch(() => undefined));
  return {ok: true};
}
