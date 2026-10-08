'use server';

import {randomUUID} from 'node:crypto';
import {after} from 'next/server';
import {normalizePhone} from '@/lib/booking/schema';
import {getActiveCatalog, getSettings} from '@/lib/data/public';
import {getStore} from '@/lib/data/store';
import {emailLayout, emailRow, esc, ownerEmail, sendMail} from '@/lib/email/send';
import {
  GIFT_CUSTOM,
  contactRequest,
  deletionRequest,
  giftCardRequest,
  quoteRequest,
  type FormResult,
  type QuoteResult
} from '@/lib/forms/schema';
import {withinRateLimit} from '@/lib/server/guard';

/** Common gate of every public form: the honeypot is checked by the schema, the rate limit per IP here. */
async function gate(action: string, max = 5) {
  if (!(await withinRateLimit(action, max, 600))) return {ok: false as const, error: 'rate_limited' as const};
  return null;
}

/** Owner notification (in Russian) by e-mail. Never blocks the response. */
function notifyOwner(title: string, rows: [string, string | undefined][], replyTo?: string) {
  after(async () => {
    const filled = rows.filter((row): row is [string, string] => Boolean(row[1]));
    const to = ownerEmail((await getSettings()).email);
    if (!to) return;
    await sendMail({
      to,
      subject: title,
      replyTo,
      html: emailLayout({
        title: esc(title),
        body: `<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:15px">${filled
          .map(([label, value]) => emailRow(esc(label), esc(value).replace(/\n/g, '<br>')))
          .join('')}</table>`,
        footer: 'Заявка также сохранена в админке: /admin'
      })
    }).catch((error) => console.error('[forms] notify failed', error));
  });
}

const phoneOrUndefined = (value: string) => (value ? normalizePhone(value) : undefined);

export async function sendContactAction(input: unknown): Promise<FormResult> {
  const parsed = contactRequest.safeParse(input);
  if (!parsed.success) return {ok: false, error: 'invalid'};
  const blocked = await gate('contact');
  if (blocked) return blocked;

  const {name, email, phone, message, locale} = parsed.data;
  const ok = await getStore().insertContactMessage({name, email, phone: phoneOrUndefined(phone), message, locale});
  if (!ok) return {ok: false, error: 'failed'};
  notifyOwner(`Сообщение с сайта — ${name}`, [['Имя', name], ['E-mail', email], ['Телефон', phone], ['Язык', locale], ['Сообщение', message]], email);
  return {ok: true};
}

/**
 * B2B quote request. Photos are uploaded by the browser straight into the private bucket, but the
 * signed upload URLs are issued only here — after validation and the rate limit — and
 * every issued path is recorded on the stored request, so uploads cannot exist without a request.
 */
export async function sendQuoteAction(input: unknown): Promise<QuoteResult> {
  const parsed = quoteRequest.safeParse(input);
  if (!parsed.success) return {ok: false, error: 'invalid'};
  const blocked = await gate('quote', 3);
  if (blocked) return blocked;

  const data = parsed.data;
  const store = getStore();
  const uploads = data.files.length > 0 ? await store.createQuoteUploads(randomUUID(), data.files) : [];
  const photos = uploads.map((upload) => upload.path);

  const ok = await store.insertQuoteRequest({
    contactName: data.contactName,
    company: data.company,
    email: data.email,
    phone: phoneOrUndefined(data.phone),
    yTunnus: data.yTunnus || undefined,
    sector: data.sector,
    items: data.items,
    preferredTime: data.preferredTime,
    billingAddress: data.billingAddress || undefined,
    notes: data.notes || undefined,
    photos,
    locale: data.locale
  });
  if (!ok) return {ok: false, error: 'failed'};
  notifyOwner(
    `Запрос КП — ${data.company}`,
    [
      ['Компания', data.company],
      ['Y-tunnus', data.yTunnus],
      ['Контакт', data.contactName],
      ['E-mail', data.email],
      ['Телефон', data.phone],
      ['Сектор', data.sector],
      ['Объект и количество', data.items],
      ['Желаемое время', data.preferredTime],
      ['Адрес для счёта', data.billingAddress],
      ['Комментарий', data.notes],
      ['Фото', data.files.length ? `${data.files.length} шт. — смотрите в /admin/quotes` : undefined]
    ],
    data.email
  );
  return {ok: true, uploads};
}

export async function sendGiftCardAction(input: unknown): Promise<FormResult> {
  const parsed = giftCardRequest.safeParse(input);
  if (!parsed.success) return {ok: false, error: 'invalid'};
  const blocked = await gate('giftcard-order');
  if (blocked) return blocked;

  const data = parsed.data;
  let amountCents: number | undefined;
  let serviceId: number | undefined;
  let label: string;
  if (data.option === GIFT_CUSTOM) {
    amountCents = Math.round(Number(data.amount.replace(',', '.')) * 100);
    label = `${amountCents / 100} €`;
  } else {
    // a service gift card must point at a real, bookable service — its price is read from the catalog
    const service = (await getActiveCatalog()).services.find((s) => s.slug === data.option && !s.isAddon);
    if (!service) return {ok: false, error: 'invalid'};
    serviceId = service.id;
    label = `${service.name.fi} (${service.priceCents / 100} €)`;
  }

  const ok = await getStore().insertGiftCardRequest({
    amountCents,
    serviceId,
    buyerName: data.buyerName,
    buyerEmail: data.buyerEmail,
    buyerPhone: phoneOrUndefined(data.buyerPhone),
    recipientName: data.recipientName || undefined,
    message: data.message || undefined,
    locale: data.locale
  });
  if (!ok) return {ok: false, error: 'failed'};
  notifyOwner(
    `Заказ подарочного сертификата — ${label}`,
    [
      ['Сертификат', label],
      ['Покупатель', data.buyerName],
      ['E-mail', data.buyerEmail],
      ['Телефон', data.buyerPhone],
      ['Получатель', data.recipientName],
      ['Текст', data.message],
      ['Язык', data.locale]
    ],
    data.buyerEmail
  );
  return {ok: true};
}

export async function sendDeletionAction(input: unknown): Promise<FormResult> {
  const parsed = deletionRequest.safeParse(input);
  if (!parsed.success) return {ok: false, error: 'invalid'};
  const blocked = await gate('deletion');
  if (blocked) return blocked;

  const {email, phone, details, locale} = parsed.data;
  const ok = await getStore().insertDeletionRequest({email, phone: phoneOrUndefined(phone), details: details || undefined, locale});
  if (!ok) return {ok: false, error: 'failed'};
  notifyOwner('Запрос на удаление данных (GDPR)', [['E-mail', email], ['Телефон', phone], ['Детали', details], ['Язык', locale]], email);
  return {ok: true};
}
