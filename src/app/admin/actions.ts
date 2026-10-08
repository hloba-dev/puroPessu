'use server';

import {randomBytes} from 'node:crypto';
import {revalidatePath, revalidateTag} from 'next/cache';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {locales, type Locale} from '@/i18n/routing';
import {requireAdmin} from '@/lib/admin/auth';
import {slugify, uniqueSlug} from '@/lib/admin/slug';
import {blockFromRow, dayRangeInterval, planClose, planOpen, type DayRange} from '@/lib/booking/blocks';
import {priceCart} from '@/lib/booking/cart';
import {describePromo} from '@/lib/booking/promo-details';
import {normalizePhone} from '@/lib/booking/schema';
import {busyEnd} from '@/lib/booking/slots';
import {quoteTravel} from '@/lib/booking/travel';
import {parseHm, zonedToUtc} from '@/lib/booking/tz';
import {settingKey} from '@/lib/data/mappers';
import {CACHE_TAGS, getCatalog, getSettings} from '@/lib/data/public';
import {getStore} from '@/lib/data/store';
import {bookingFromRows} from '@/lib/data/store.supabase';
import {sendBookingEmails} from '@/lib/email/booking';
import {emailLayout, esc, sendMail} from '@/lib/email/send';
import {GIFT_VALID_MONTHS} from '@/lib/forms/schema';
import {formatEur, l10n} from '@/lib/format';
import {parseEuro} from '@/lib/money';
import {buildGiftCardPdf} from '@/lib/giftcard-pdf';
import {localizedUrl} from '@/lib/seo';
import type {Enums, Json} from '@/lib/supabase/database.types';
import {createServiceClient} from '@/lib/supabase/service';
import type {Settings} from '@/lib/types';

const str = (form: FormData, key: string) => String(form.get(key) ?? '').trim();
const int = (form: FormData, key: string) => Math.round(Number(str(form, key).replace(',', '.')) || 0);
/** A price field: anything that is not a clean amount is refused (never silently saved as 0 €). */
function money(form: FormData, key: string, back: string): number {
  const value = parseEuro(str(form, key));
  if (value === null) fail(back, `Некорректная сумма «${str(form, key)}»: введите число, например 150 или 12,50`);
  return value;
}
const bool = (form: FormData, key: string) => form.get(key) === 'on' || form.get(key) === 'true';
const trilingual = (form: FormData, prefix: string) => ({
  fi: str(form, `${prefix}_fi`),
  ru: str(form, `${prefix}_ru`),
  en: str(form, `${prefix}_en`)
});

/** Public pages cache catalog data for a few minutes: drop the cache right after an admin edit. */
function refresh(...tags: (keyof typeof CACHE_TAGS)[]) {
  for (const tag of tags) revalidateTag(CACHE_TAGS[tag], {expire: 0});
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

// ---------- bookings ----------

const BOOKING_STATUSES = ['pending', 'confirmed', 'done', 'cancelled'] as const;

export async function setBookingStatus(form: FormData) {
  const {supabase} = await requireAdmin();
  const id = str(form, 'id');
  const status = z.enum(BOOKING_STATUSES).parse(str(form, 'status'));
  const {data: before} = await supabase.from('bookings').select('status').eq('id', id).maybeSingle();
  const {data: row, error} = await supabase.from('bookings').update({status}).eq('id', id).select('*').maybeSingle();
  if (error || !row) fail('/admin/bookings', error?.message ?? 'Бронь не найдена');

  // tell the customer when the booking is confirmed or cancelled by us
  if (before?.status !== status && (status === 'confirmed' || status === 'cancelled')) {
    const [{data: items}, settings] = await Promise.all([
      supabase.from('booking_items').select('*').eq('booking_id', id).order('id'),
      getSettings()
    ]);
    await sendBookingEmails(bookingFromRows(row, items ?? []), settings, status, {customerOnly: true}).catch((e) =>
      console.error('[admin] booking e-mail failed', e)
    );
  }
  revalidatePath('/admin', 'layout');
}

export async function createManualBooking(form: FormData) {
  await requireAdmin();
  const back = '/admin/bookings/new';
  const [catalog, settings] = await Promise.all([getCatalog(), getSettings()]);

  const slugs = form.getAll('item_slug').map(String);
  const qtys = form.getAll('item_qty').map((v) => Number(v) || 0);
  const cart = slugs
    .map((slug, i) => ({slug, qty: qtys[i], options: [] as string[], veryDirty: false}))
    .filter((line) => line.slug && line.qty > 0);
  if (cart.length === 0) fail(back, 'Добавьте хотя бы одну позицию');

  const postalCode = str(form, 'postal_code');
  const travel = quoteTravel(await getStore().findPostalCode(postalCode), settings);
  const phone = normalizePhone(str(form, 'phone'));
  const customer = (await getStore().isReturningCustomer(str(form, 'email'), phone)) ? 'repeat' : 'first';
  const quote = priceCart(cart, catalog, {
    minOrderCents: settings.minOrderCents,
    travelCents: travel.status === 'ok' ? travel.feeCents : money(form, 'travel_eur', back),
    // the same discounts and bundle offers as in the online booking
    promotions: bool(form, 'no_promo') ? null : settings.promotions,
    customer
  });
  if (quote.invalid.length > 0 || quote.durationMin <= 0) fail(back, `Недоступные позиции: ${quote.invalid.join(', ')}`);

  const date = str(form, 'date');
  const time = str(form, 'time');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) fail(back, 'Укажите дату и время');
  const startsAt = zonedToUtc(date, parseHm(time), settings.timezone).toISOString();
  const locale = z.enum(locales).catch('fi').parse(str(form, 'locale')) as Locale;

  const result = await getStore().createBooking({
    locale,
    customerType: str(form, 'company') ? 'business' : 'private',
    name: str(form, 'name'),
    phone,
    email: str(form, 'email'),
    company: str(form, 'company') || undefined,
    yTunnus: str(form, 'y_tunnus') || undefined,
    address: str(form, 'address'),
    postalCode,
    city: str(form, 'city'),
    notes: str(form, 'notes') || undefined,
    startsAt,
    endsAt: busyEnd(startsAt, quote.durationMin, settings.bufferMin),
    durationMin: quote.durationMin,
    subtotalCents: quote.subtotalCents,
    travelCents: quote.travelCents,
    minFillCents: quote.minFillCents,
    promoCents: quote.promoCents,
    promoDetails: describePromo(quote, customer, settings.promotions),
    discountCents: 0,
    totalCents: quote.totalCents,
    marketingConsent: false,
    items: quote.lines.map((line) => ({
      serviceId: line.service.id,
      serviceSlug: line.service.slug,
      name: l10n(line.service.name, locale),
      optionIds: [],
      optionSlugs: [],
      qty: line.qty,
      unitPriceCents: line.unitCents,
      durationMin: line.durationMin,
      veryDirty: false
    }))
  });
  if (!result.ok) fail(back, result.error === 'slot_taken' ? 'Это время уже занято' : 'Не удалось создать бронь');

  // a booking entered by the owner is confirmed straight away
  const {supabase} = await requireAdmin();
  await supabase.from('bookings').update({status: 'confirmed'}).eq('id', result.booking.id);
  if (bool(form, 'send_email') && result.booking.email) {
    await sendBookingEmails({...result.booking, status: 'confirmed'}, settings, 'confirmed', {customerOnly: true}).catch(() => undefined);
  }
  revalidatePath('/admin', 'layout');
  redirect('/admin/bookings');
}

// ---------- blocked times ----------

export async function addBlockedTime(form: FormData) {
  const {supabase} = await requireAdmin();
  const settings = await getSettings();
  const from = str(form, 'from_date');
  const to = str(form, 'to_date') || from;
  if (!from) fail('/admin/blocked', 'Укажите дату');
  const startsAt = zonedToUtc(from, parseHm(str(form, 'from_time') || '00:00'), settings.timezone);
  // an empty end time blocks until the end of the last day
  const endTime = str(form, 'to_time');
  const endsAt = zonedToUtc(to, endTime ? parseHm(endTime) : 24 * 60, settings.timezone);
  if (endsAt <= startsAt) fail('/admin/blocked', 'Конец должен быть позже начала');
  const staffId = int(form, 'staff_id');
  const {error} = await supabase.from('blocked_times').insert({
    staff_id: staffId || null,
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    reason: str(form, 'reason') || null
  });
  if (error) fail('/admin/blocked', error.message);
  revalidatePath('/admin/blocked');
}

export async function deleteBlockedTime(form: FormData) {
  const {supabase} = await requireAdmin();
  await supabase.from('blocked_times').delete().eq('id', str(form, 'id'));
  revalidatePath('/admin/blocked');
}

const minuteOfDay = z.number().int().min(0).max(24 * 60);
const dayBlockInput = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  range: z.union([z.literal('all'), z.object({from: minuteOfDay, to: minuteOfDay}).refine((slot) => slot.from < slot.to)]),
  blocked: z.boolean()
});

/**
 * One click in the calendar: closes or opens a whole day or one two-hour slot of it.
 * Called from a client component, so a problem comes back as text instead of a redirect.
 */
export async function setDayBlocked(input: {date: string; range: DayRange; blocked: boolean}): Promise<{error?: string}> {
  const {supabase} = await requireAdmin();
  const parsed = dayBlockInput.safeParse(input);
  if (!parsed.success) return {error: 'Некорректная дата'};
  const {date, range, blocked} = parsed.data;
  const settings = await getSettings();
  const interval = dayRangeInterval(date, range, settings.timezone);

  // everything that overlaps the interval or touches its edge
  const {data, error} = await supabase
    .from('blocked_times')
    .select('*')
    .lte('starts_at', new Date(interval.end).toISOString())
    .gte('ends_at', new Date(interval.start).toISOString());
  if (error) return {error: error.message};

  const blocks = data.map(blockFromRow);
  const plan = blocked ? planClose(blocks, interval) : planOpen(blocks, interval);
  if (plan.insert.length > 0) {
    const added = await supabase.from('blocked_times').insert(
      plan.insert.map((b) => ({
        staff_id: b.staffId,
        starts_at: new Date(b.start).toISOString(),
        ends_at: new Date(b.end).toISOString(),
        reason: b.reason
      }))
    );
    if (added.error) return {error: added.error.message};
  }
  if (plan.deleteIds.length > 0) {
    const removed = await supabase.from('blocked_times').delete().in('id', plan.deleteIds);
    if (removed.error) return {error: removed.error.message};
  }
  revalidatePath('/admin/blocked');
  return {};
}

// ---------- catalog ----------

export async function updateCategory(form: FormData) {
  const {supabase} = await requireAdmin();
  const {error} = await supabase
    .from('service_categories')
    .update({name: trilingual(form, 'name'), is_active: bool(form, 'is_active'), sort: int(form, 'sort')})
    .eq('id', int(form, 'id'));
  if (error) fail('/admin/services', error.message);
  refresh('catalog');
  revalidatePath('/admin/services');
}

export async function updateService(form: FormData) {
  const {supabase} = await requireAdmin();
  const priceCents = money(form, 'price', '/admin/services');
  const {error} = await supabase
    .from('services')
    .update({
      name: trilingual(form, 'name'),
      description: trilingual(form, 'description'),
      price_cents: priceCents,
      price_from: bool(form, 'price_from'),
      duration_min: int(form, 'duration_min'),
      is_small: priceCents <= 5000,
      is_active: bool(form, 'is_active'),
      sort: int(form, 'sort')
    })
    .eq('id', int(form, 'id'));
  if (error) fail('/admin/services', error.message);
  refresh('catalog');
  revalidatePath('/admin/services');
}

const UNITS = ['item', 'piece', 'm2'] as const;

export async function createService(form: FormData) {
  const {supabase} = await requireAdmin();
  const back = '/admin/services';
  const name = trilingual(form, 'name');
  if (!name.fi) fail(back, 'Укажите название на финском: оно показывается и там, где нет перевода');
  const priceCents = money(form, 'price', back);
  const durationMin = int(form, 'duration_min');
  if (durationMin <= 0) fail(back, 'Укажите длительность работы в минутах: по ней считается свободное время в записи');
  const categoryId = int(form, 'category_id');

  const existing = await supabase.from('services').select('slug, sort, category_id');
  if (existing.error) fail(back, existing.error.message);
  const {data: row, error} = await supabase
    .from('services')
    .insert({
      category_id: categoryId,
      slug: uniqueSlug(slugify(name.fi) || 'service', existing.data.map((s) => s.slug)),
      name,
      description: trilingual(form, 'description'),
      price_cents: priceCents,
      price_from: bool(form, 'price_from'),
      unit: z.enum(UNITS).catch('item').parse(str(form, 'unit')),
      duration_min: durationMin,
      is_small: priceCents <= 5000,
      is_active: bool(form, 'is_active'),
      // new services go to the end of their category
      sort: Math.max(0, ...existing.data.filter((s) => s.category_id === categoryId).map((s) => s.sort)) + 10
    })
    .select('id')
    .single();
  if (error) fail(back, error.message);
  refresh('catalog');
  revalidatePath(back);
  redirect(`${back}?added=${row.id}#service-${row.id}`);
}

export async function updateOption(form: FormData) {
  const {supabase} = await requireAdmin();
  const {error} = await supabase
    .from('service_options')
    .update({price_cents: money(form, 'price', '/admin/services'), duration_min: int(form, 'duration_min')})
    .eq('id', int(form, 'id'));
  if (error) fail('/admin/services', error.message);
  refresh('catalog');
  revalidatePath('/admin/services');
}

// ---------- gallery ----------

export async function addGalleryItem(input: {
  beforeUrl: string;
  afterUrl: string;
  caption: {fi: string; ru: string; en: string};
  serviceSlug: string;
  isFeatured: boolean;
}) {
  const {supabase} = await requireAdmin();
  const parsed = z
    .object({
      beforeUrl: z.string().min(1).max(600),
      afterUrl: z.string().min(1).max(600),
      caption: z.object({fi: z.string().min(1).max(80), ru: z.string().max(80), en: z.string().max(80)}),
      serviceSlug: z.string().min(1).max(40),
      isFeatured: z.boolean()
    })
    .safeParse(input);
  if (!parsed.success) return {ok: false as const, error: 'Заполните подпись и загрузите оба фото'};
  const {data: last} = await supabase.from('gallery_items').select('sort').order('sort', {ascending: false}).limit(1).maybeSingle();
  const {error} = await supabase.from('gallery_items').insert({
    before_url: parsed.data.beforeUrl,
    after_url: parsed.data.afterUrl,
    caption: parsed.data.caption,
    service_slug: parsed.data.serviceSlug,
    is_featured: parsed.data.isFeatured,
    sort: (last?.sort ?? 0) + 10
  });
  if (error) return {ok: false as const, error: error.message};
  refresh('gallery');
  revalidatePath('/admin/gallery');
  return {ok: true as const};
}

export async function updateGalleryItem(form: FormData) {
  const {supabase} = await requireAdmin();
  const {error} = await supabase
    .from('gallery_items')
    .update({
      caption: trilingual(form, 'caption'),
      service_slug: str(form, 'service_slug'),
      sort: int(form, 'sort'),
      is_featured: bool(form, 'is_featured')
    })
    .eq('id', str(form, 'id'));
  if (error) fail('/admin/gallery', error.message);
  refresh('gallery');
  revalidatePath('/admin/gallery');
}

const GALLERY_MARKER = '/storage/v1/object/public/gallery/';
/** Object path of an uploaded gallery photo; null for the seed placeholders in /public. */
const galleryPath = (url: string | null | undefined) =>
  url?.includes(GALLERY_MARKER) ? url.slice(url.indexOf(GALLERY_MARKER) + GALLERY_MARKER.length) : null;

/** Puts a freshly uploaded photo in place of the "before" or the "after" one and removes the old file. */
export async function replaceGalleryPhoto(input: {id: string; kind: 'before' | 'after'; url: string}) {
  const {supabase} = await requireAdmin();
  const parsed = z
    .object({id: z.uuid(), kind: z.enum(['before', 'after']), url: z.string().min(1).max(600)})
    .safeParse(input);
  if (!parsed.success || !galleryPath(parsed.data.url)) return {ok: false as const, error: 'Не удалось сохранить фото'};
  const {id, kind, url} = parsed.data;

  const {data: row} = await supabase.from('gallery_items').select('before_url, after_url').eq('id', id).maybeSingle();
  if (!row) return {ok: false as const, error: 'Пара не найдена'};
  const {error} = await supabase
    .from('gallery_items')
    .update(kind === 'before' ? {before_url: url} : {after_url: url})
    .eq('id', id);
  if (error) return {ok: false as const, error: error.message};

  const oldPath = galleryPath(kind === 'before' ? row.before_url : row.after_url);
  if (oldPath) await supabase.storage.from('gallery').remove([oldPath]);
  refresh('gallery');
  revalidatePath('/admin/gallery');
  return {ok: true as const};
}

export async function deleteGalleryItem(form: FormData) {
  const {supabase} = await requireAdmin();
  const {data: row} = await supabase.from('gallery_items').delete().eq('id', str(form, 'id')).select('*').maybeSingle();
  // also remove the uploaded files (seed placeholders in /public are left alone)
  const paths = [galleryPath(row?.before_url), galleryPath(row?.after_url)].filter((path): path is string => path !== null);
  if (paths.length > 0) await supabase.storage.from('gallery').remove(paths);
  refresh('gallery');
  revalidatePath('/admin/gallery');
}

// ---------- inbound requests ----------

const REQUEST_TABLES = ['quote_requests', 'contact_messages', 'data_deletion_requests'] as const;

export async function setRequestStatus(form: FormData) {
  const {supabase} = await requireAdmin();
  const table = z.enum(REQUEST_TABLES).parse(str(form, 'table'));
  const status = z.enum(['new', 'in_progress', 'done']).parse(str(form, 'status'));
  await supabase.from(table).update({status}).eq('id', str(form, 'id'));
  revalidatePath('/admin', 'layout');
}

// ---------- gift cards ----------

const giftMail: Record<Locale, {subject: string; title: string; body: string}> = {
  fi: {
    subject: 'Lahjakorttisi — Puro',
    title: 'Lahjakorttisi on valmis',
    body: 'Kiitos tilauksesta! Lahjakortti on liitteenä PDF-tiedostona. Saaja syöttää koodin varauksen yhteydessä.'
  },
  ru: {
    subject: 'Ваш подарочный сертификат — Puro',
    title: 'Подарочный сертификат готов',
    body: 'Спасибо за заказ! Сертификат — во вложении в формате PDF. Получатель вводит код при онлайн-записи.'
  },
  en: {
    subject: 'Your gift card — Puro',
    title: 'Your gift card is ready',
    body: 'Thank you for your order! The gift card is attached as a PDF. The recipient enters the code when booking online.'
  }
};

/** requested → paid: assigns the code and validity, renders the PDF and e-mails it to the buyer. */
export async function markGiftCardPaid(form: FormData) {
  const {supabase} = await requireAdmin();
  const id = str(form, 'id');
  const {data: card} = await supabase.from('gift_cards').select('*').eq('id', id).maybeSingle();
  if (!card) fail('/admin/gift-cards', 'Сертификат не найден');

  // 64 random bits: not guessable even without the rate limit
  const code = card.code ?? `PURO-${randomBytes(8).toString('hex').toUpperCase().match(/.{4}/g)!.join('-')}`;
  const validUntil = new Date();
  validUntil.setMonth(validUntil.getMonth() + GIFT_VALID_MONTHS);
  const validIso = validUntil.toISOString().slice(0, 10);
  const {error} = await supabase
    .from('gift_cards')
    .update({status: 'paid', code, valid_until: validIso, balance_cents: card.amount_cents})
    .eq('id', id);
  if (error) fail('/admin/gift-cards', error.message);

  const locale = (locales as readonly string[]).includes(card.locale) ? (card.locale as Locale) : 'fi';
  const [catalog, settings] = await Promise.all([getCatalog(), getSettings()]);
  const service = catalog.services.find((s) => s.id === card.service_id);
  const value = card.amount_cents ? formatEur(card.amount_cents, locale) : service ? l10n(service.name, locale) : '';
  const pdf = await buildGiftCardPdf({
    code,
    value,
    validUntil: new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : `${locale}-FI`, {dateStyle: 'long'}).format(validUntil),
    recipientName: card.recipient_name,
    message: card.message,
    locale,
    siteUrl: localizedUrl('/varaa-aika', locale)
  });
  const mail = giftMail[locale];
  const sent = await sendMail({
    to: card.buyer_email,
    subject: mail.subject,
    replyTo: settings.email,
    html: emailLayout({
      title: esc(mail.title),
      body: `<p style="line-height:1.6">${esc(mail.body)}</p><p style="font-size:18px"><b>${esc(code)}</b> · ${esc(value)}</p>`,
      footer: `${esc(settings.legalName)} · ${esc(settings.phone)} · ${esc(settings.email)}`
    }),
    attachments: [{filename: `puro-lahjakortti-${code}.pdf`, content: pdf}]
  });
  revalidatePath('/admin/gift-cards');
  if (!sent) fail('/admin/gift-cards', `Код ${code} присвоен, но письмо не отправлено (проверьте настройки SMTP). PDF можно скачать из списка.`);
}

export async function setGiftCardStatus(form: FormData) {
  const {supabase} = await requireAdmin();
  const status = z.enum(['requested', 'paid', 'redeemed', 'expired']).parse(str(form, 'status')) as Enums<'gift_card_status'>;
  await supabase.from('gift_cards').update({status}).eq('id', str(form, 'id'));
  revalidatePath('/admin/gift-cards');
}

// ---------- reviews ----------

export async function saveReview(form: FormData) {
  const {supabase} = await requireAdmin();
  const row = {
    author: str(form, 'author'),
    rating: Math.min(5, Math.max(1, int(form, 'rating'))),
    text: str(form, 'text'),
    locale: z.enum(locales).catch('fi').parse(str(form, 'locale')),
    source: z.enum(['google', 'site']).catch('site').parse(str(form, 'source')),
    date: str(form, 'date') || new Date().toISOString().slice(0, 10),
    is_published: bool(form, 'is_published')
  };
  if (!row.author || !row.text) fail('/admin/reviews', 'Укажите автора и текст');
  const id = str(form, 'id');
  const {error} = id ? await supabase.from('reviews').update(row).eq('id', id) : await supabase.from('reviews').insert(row);
  if (error) fail('/admin/reviews', error.message);
  refresh('reviews');
  revalidatePath('/admin/reviews');
}

export async function deleteReview(form: FormData) {
  const {supabase} = await requireAdmin();
  await supabase.from('reviews').delete().eq('id', str(form, 'id'));
  refresh('reviews');
  revalidatePath('/admin/reviews');
}

// ---------- settings & staff ----------

export async function saveSettings(form: FormData) {
  const {supabase} = await requireAdmin();
  const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
  // "35=0" per line: up to 35 km → 0 €
  const zones = str(form, 'travel_zones')
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .map((line) => {
      const [km, eur] = line.split('=').map((part) => part.trim());
      return {maxKm: Number((km ?? '').replace(',', '.')), feeCents: parseEuro(eur ?? '')};
    })
    .filter((zone): zone is {maxKm: number; feeCents: number} => zone.maxKm > 0 && zone.feeCents !== null)
    .sort((a, b) => a.maxKm - b.maxKm);

  const values: Partial<Settings> = {
    companyName: str(form, 'company_name'),
    legalName: str(form, 'legal_name'),
    phone: str(form, 'phone'),
    whatsapp: str(form, 'whatsapp').replace(/\D/g, ''),
    email: str(form, 'email'),
    yTunnus: str(form, 'y_tunnus'),
    address: {street: str(form, 'street'), postalCode: str(form, 'postal_code'), city: str(form, 'city')},
    social: {facebook: str(form, 'facebook'), instagram: str(form, 'instagram'), googleReviews: str(form, 'google_reviews')},
    baseLat: Number(str(form, 'base_lat').replace(',', '.')),
    baseLng: Number(str(form, 'base_lng').replace(',', '.')),
    roadFactor: Number(str(form, 'road_factor').replace(',', '.')),
    minOrderCents: money(form, 'min_order', '/admin/settings'),
    openFrom: str(form, 'open_from'),
    openTo: str(form, 'open_to'),
    slotStep: int(form, 'slot_step'),
    leadTimeHours: int(form, 'lead_time_hours'),
    bufferMin: int(form, 'buffer_min'),
    bookingHorizonDays: int(form, 'booking_horizon_days'),
    travelZones: zones,
    promotions: {
      firstOrderPct: int(form, 'promo_first_pct'),
      repeatOrderPct: int(form, 'promo_repeat_pct'),
      multiItemPct: int(form, 'promo_multi_pct'),
      multiItemMin: int(form, 'promo_multi_min'),
      bundleChairsCount: int(form, 'bundle_chairs_count'),
      bundleChairsExtraCents: money(form, 'bundle_chairs_extra', '/admin/settings'),
      bundleMattressSingleExtraCents: money(form, 'bundle_single_extra', '/admin/settings'),
      bundleMattressDoubleExtraCents: money(form, 'bundle_double_extra', '/admin/settings'),
      stackBundlesWithPercent: bool(form, 'promo_stack')
    }
  };

  const valid =
    time.safeParse(values.openFrom).success &&
    time.safeParse(values.openTo).success &&
    values.openFrom! < values.openTo! &&
    [5, 10, 15, 20, 30, 60].includes(values.slotStep!) &&
    Number.isFinite(values.baseLat) &&
    Number.isFinite(values.baseLng) &&
    values.roadFactor! >= 1 &&
    values.roadFactor! <= 3 &&
    zones.length > 0 &&
    zones.length === str(form, 'travel_zones').split(/\r?\n/).filter((line) => line.trim() !== '').length &&
    values.bookingHorizonDays! >= 1 &&
    values.bookingHorizonDays! <= 365 &&
    [values.promotions!.firstOrderPct, values.promotions!.repeatOrderPct, values.promotions!.multiItemPct].every(
      (pct) => pct >= 0 && pct <= 50
    ) &&
    values.promotions!.multiItemMin >= 2 &&
    values.promotions!.bundleChairsCount >= 1;
  if (!valid) fail('/admin/settings', 'Проверьте часы работы, шаг слотов, координаты, зоны и скидки (0–50 %)');

  const rows = (Object.keys(values) as (keyof Settings)[]).map((prop) => ({
    key: settingKey(prop),
    value: values[prop] as Json,
    updated_at: new Date().toISOString()
  }));
  const {error} = await supabase.from('settings').upsert(rows);
  if (error) fail('/admin/settings', error.message);
  refresh('settings');
  revalidatePath('/admin/settings');
  redirect('/admin/settings?saved=1');
}

export async function saveStaff(form: FormData) {
  const {supabase} = await requireAdmin();
  const id = int(form, 'id');
  const row = {name: str(form, 'name'), is_active: bool(form, 'is_active')};
  if (!row.name) fail('/admin/settings', 'Укажите имя мастера');
  const {error} = id ? await supabase.from('staff').update(row).eq('id', id) : await supabase.from('staff').insert(row);
  if (error) fail('/admin/settings', error.message);
  revalidatePath('/admin/settings');
}

async function signedUrls(bucket: string, paths: string[]) {
  await requireAdmin();
  if (paths.length === 0) return [];
  const {data} = await createServiceClient().storage.from(bucket).createSignedUrls(paths, 600);
  return (data ?? []).map((item) => item.signedUrl).filter((url): url is string => Boolean(url));
}

/** Signed URLs for the private B2B photos (valid for 10 minutes). */
export async function quotePhotoUrls(paths: string[]) {
  return signedUrls('quote-photos', paths);
}

/** Signed URLs for the photos a customer attached to a booking (valid for 10 minutes). */
export async function bookingPhotoUrls(paths: string[]) {
  return signedUrls('booking-photos', paths);
}

export async function signOut() {
  const {supabase} = await requireAdmin();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
