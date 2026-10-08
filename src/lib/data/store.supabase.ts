import 'server-only';
import type {Locale} from '@/i18n/routing';
import {createServiceClient} from '@/lib/supabase/service';
import type {Json, Tables} from '@/lib/supabase/database.types';
import type {BookingInput, BookingRecord, PromoDetails, Store, UploadTarget} from './store';

export const QUOTE_BUCKET = 'quote-photos';
export const BOOKING_BUCKET = 'booking-photos';

/** One signed upload URL per file, under `<folder>/NN.ext` in a private bucket. */
async function signedUploads(bucket: string, folder: string, files: {name: string; type: string}[]) {
  const storage = createServiceClient().storage.from(bucket);
  const uploads: UploadTarget[] = [];
  for (const [index, file] of files.entries()) {
    const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'jpg';
    const path = `${folder}/${String(index + 1).padStart(2, '0')}.${ext}`;
    const {data, error} = await storage.createSignedUploadUrl(path);
    if (error || !data) {
      console.error(`[store] signed upload url failed (${bucket})`, error);
      continue;
    }
    uploads.push({index, path: data.path, token: data.token});
  }
  return uploads;
}

function bookingPayload(input: BookingInput) {
  return {
    locale: input.locale,
    customer_type: input.customerType,
    name: input.name,
    phone: input.phone,
    email: input.email,
    company: input.company ?? '',
    y_tunnus: input.yTunnus ?? '',
    address: input.address,
    postal_code: input.postalCode,
    city: input.city,
    floor: input.floor ?? '',
    parking: input.parking ?? '',
    notes: input.notes ?? '',
    starts_at: input.startsAt,
    ends_at: input.endsAt,
    duration_min: input.durationMin,
    subtotal_cents: input.subtotalCents,
    travel_cents: input.travelCents,
    min_fill_cents: input.minFillCents,
    promo_cents: input.promoCents,
    promo_details: input.promoDetails as Record<string, Json>,
    discount_cents: input.discountCents,
    total_cents: input.totalCents,
    gift_card_code: input.giftCardCode ?? '',
    marketing_consent: input.marketingConsent
  } satisfies Record<string, Json>;
}

export function bookingFromRows(row: Tables<'bookings'>, items: Tables<'booking_items'>[]): BookingRecord {
  return {
    id: row.id,
    refCode: row.ref_code,
    manageToken: row.manage_token,
    status: row.status,
    staffId: row.staff_id,
    createdAt: row.created_at,
    locale: row.locale as Locale,
    customerType: row.customer_type,
    name: row.name,
    phone: row.phone,
    email: row.email,
    company: row.company ?? undefined,
    yTunnus: row.y_tunnus ?? undefined,
    address: row.address,
    postalCode: row.postal_code,
    city: row.city,
    floor: row.floor ?? undefined,
    parking: row.parking ?? undefined,
    notes: row.notes ?? undefined,
    startsAt: new Date(row.starts_at).toISOString(),
    endsAt: new Date(row.ends_at).toISOString(),
    durationMin: row.duration_min,
    subtotalCents: row.subtotal_cents,
    travelCents: row.travel_cents,
    minFillCents: row.min_fill_cents,
    promoCents: row.promo_cents,
    promoDetails: (row.promo_details ?? {}) as PromoDetails,
    photos: row.photos ?? [],
    discountCents: row.discount_cents,
    totalCents: row.total_cents,
    giftCardCode: row.gift_card_code ?? undefined,
    marketingConsent: row.marketing_consent,
    items: items.map((i) => ({
      serviceId: i.service_id ?? 0,
      serviceSlug: i.service_slug,
      name: i.name,
      optionIds: i.option_ids,
      optionSlugs: i.option_slugs,
      qty: i.qty,
      unitPriceCents: i.unit_price_cents,
      durationMin: i.duration_min,
      veryDirty: i.very_dirty
    }))
  };
}

async function loadBooking(token: string): Promise<BookingRecord | null> {
  const db = createServiceClient();
  const {data: row} = await db.from('bookings').select('*').eq('manage_token', token).maybeSingle();
  if (!row) return null;
  const {data: items} = await db.from('booking_items').select('*').eq('booking_id', row.id).order('id');
  return bookingFromRows(row, items ?? []);
}

const insert =
  <T>(table: 'contact_messages' | 'quote_requests' | 'gift_cards' | 'data_deletion_requests', map: (input: T) => object) =>
  async (input: T) => {
    const {error} = await createServiceClient()
      .from(table)
      .insert(map(input) as never);
    if (error) console.error(`[store] insert into ${table} failed`, error);
    return !error;
  };

export const supabaseStore: Store = {
  async getSchedule(fromIso, toIso) {
    const db = createServiceClient();
    const [staff, bookings, blocked] = await Promise.all([
      db.from('staff').select('id').eq('is_active', true).order('id'),
      db
        .from('bookings')
        .select('staff_id, starts_at, ends_at')
        .in('status', ['pending', 'confirmed'])
        .lt('starts_at', toIso)
        .gt('ends_at', fromIso),
      db.from('blocked_times').select('staff_id, starts_at, ends_at').lt('starts_at', toIso).gt('ends_at', fromIso)
    ]);
    if (staff.error || bookings.error || blocked.error) {
      throw staff.error ?? bookings.error ?? blocked.error;
    }
    return {
      staffIds: staff.data.map((s) => s.id),
      busy: [...bookings.data, ...blocked.data].map((b) => ({staffId: b.staff_id, start: b.starts_at, end: b.ends_at}))
    };
  },

  async createBooking(input) {
    const db = createServiceClient();
    const {data, error} = await db.rpc('book_slot', {
      p_booking: bookingPayload(input),
      p_items: input.items.map((i) => ({
        service_id: i.serviceId,
        service_slug: i.serviceSlug,
        name: i.name,
        option_ids: i.optionIds,
        option_slugs: i.optionSlugs,
        qty: i.qty,
        unit_price_cents: i.unitPriceCents,
        duration_min: i.durationMin,
        very_dirty: i.veryDirty
      }))
    });
    if (error) {
      if (error.message.includes('slot_taken')) return {ok: false, error: 'slot_taken'};
      if (error.message.includes('gift_card_invalid')) return {ok: false, error: 'gift_card_invalid'};
      console.error('[store] book_slot failed', error);
      return {ok: false, error: 'failed'};
    }
    const result = data as {manage_token: string};
    const booking = await loadBooking(result.manage_token);
    return booking ? {ok: true, booking} : {ok: false, error: 'failed'};
  },

  getBookingByToken: loadBooking,

  async isReturningCustomer(email, phone) {
    const {data, error} = await createServiceClient().rpc('customer_has_bookings', {p_email: email, p_phone: phone});
    if (error) console.error('[store] customer lookup failed', error);
    return Boolean(data);
  },

  async createBookingUploads(bookingId, files) {
    const uploads = await signedUploads(BOOKING_BUCKET, bookingId, files);
    if (uploads.length > 0) {
      const {error} = await createServiceClient()
        .from('bookings')
        .update({photos: uploads.map((u) => u.path)})
        .eq('id', bookingId);
      if (error) console.error('[store] saving booking photos failed', error);
    }
    return uploads;
  },

  async cancelBooking(token) {
    // the database trigger gives a redeemed gift card back
    const {data, error} = await createServiceClient()
      .from('bookings')
      .update({status: 'cancelled'})
      .eq('manage_token', token)
      .in('status', ['pending', 'confirmed'])
      // a visit that has already started cannot be cancelled from the customer link
      .gt('starts_at', new Date().toISOString())
      .select('id');
    if (error) console.error('[store] cancel failed', error);
    return !error && data.length > 0;
  },

  async rescheduleBooking(token, startsAt, endsAt) {
    const {error} = await createServiceClient().rpc('reschedule_booking', {
      p_token: token,
      p_starts: startsAt,
      p_ends: endsAt
    });
    if (!error) return 'ok';
    if (error.message.includes('slot_taken')) return 'slot_taken';
    if (!error.message.includes('booking_not_found')) console.error('[store] reschedule failed', error);
    return 'not_found';
  },

  async findGiftCard(code) {
    const today = new Date().toISOString().slice(0, 10);
    const {data} = await createServiceClient()
      .from('gift_cards')
      .select('amount_cents, balance_cents, service_id, valid_until')
      .eq('code', code)
      .eq('status', 'paid')
      .maybeSingle();
    if (!data || (data.valid_until && data.valid_until < today)) return null;
    // value card: what is left on it; service card: no amount
    const balance = data.amount_cents === null ? null : (data.balance_cents ?? data.amount_cents);
    return {amountCents: balance, serviceId: data.service_id};
  },

  async findPostalCode(code) {
    const {data} = await createServiceClient().from('postal_codes').select('*').eq('code', code).maybeSingle();
    return data;
  },

  async hitRateLimit(key, windowSeconds, max) {
    const {data, error} = await createServiceClient().rpc('hit_rate_limit', {
      p_key: key,
      p_window_seconds: windowSeconds,
      p_max: max
    });
    // if the limiter itself fails, do not lock real customers out
    return error ? true : Boolean(data);
  },

  insertContactMessage: insert('contact_messages', (i: Parameters<Store['insertContactMessage']>[0]) => ({
    name: i.name,
    email: i.email,
    phone: i.phone ?? null,
    message: i.message,
    locale: i.locale
  })),

  insertQuoteRequest: insert('quote_requests', (i: Parameters<Store['insertQuoteRequest']>[0]) => ({
    contact_name: i.contactName,
    company: i.company,
    email: i.email,
    phone: i.phone ?? null,
    y_tunnus: i.yTunnus ?? null,
    sector: i.sector,
    items: i.items,
    preferred_time: i.preferredTime,
    billing_address: i.billingAddress ?? null,
    notes: i.notes ?? null,
    photos: i.photos,
    locale: i.locale
  })),

  insertGiftCardRequest: insert('gift_cards', (i: Parameters<Store['insertGiftCardRequest']>[0]) => ({
    amount_cents: i.amountCents ?? null,
    service_id: i.serviceId ?? null,
    buyer_name: i.buyerName,
    buyer_email: i.buyerEmail,
    buyer_phone: i.buyerPhone ?? null,
    recipient_name: i.recipientName ?? null,
    message: i.message ?? null,
    locale: i.locale,
    status: 'requested'
  })),

  insertDeletionRequest: insert('data_deletion_requests', (i: Parameters<Store['insertDeletionRequest']>[0]) => ({
    email: i.email,
    phone: i.phone ?? null,
    details: i.details ?? null,
    locale: i.locale
  })),

  createQuoteUploads: (uploadId, files) => signedUploads(QUOTE_BUCKET, uploadId, files)
};
