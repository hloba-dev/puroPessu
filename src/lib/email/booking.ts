import 'server-only';
import {getTranslations} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import type {BookingRecord} from '@/lib/data/store';
import {promoLabel} from '@/lib/booking/promo-details';
import {formatDuration, formatEur} from '@/lib/format';
import {localizedUrl} from '@/lib/seo';
import type {Settings} from '@/lib/types';
import {emailButton, emailLayout, emailRow, esc, ownerEmail, sendMail} from './send';

export function formatBookingTime(iso: string, locale: Locale, timezone: string) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale === 'ru' ? 'ru-RU' : 'fi-FI', {
    timeZone: timezone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(iso));
}

function itemsTable(booking: BookingRecord, locale: Locale) {
  return booking.items
    .map(
      (item) =>
        `<tr><td style="padding:6px 12px 6px 0">${esc(item.name)} × ${item.qty}</td><td style="padding:6px 0;text-align:right;white-space:nowrap">${formatEur(item.unitPriceCents * item.qty, locale)}</td></tr>`
    )
    .join('');
}

const moneyRow = (label: string, value: string, bold = false) =>
  `<tr><td style="padding:6px 12px 6px 0;${bold ? 'font-weight:bold;border-top:1px solid #dbe1e8;padding-top:10px' : 'color:#5b6675'}">${label}</td><td style="padding:6px 0;text-align:right;white-space:nowrap;${bold ? 'font-weight:bold;font-size:18px;border-top:1px solid #dbe1e8;padding-top:10px' : ''}">${value}</td></tr>`;

type Kind = 'created' | 'confirmed' | 'rescheduled' | 'cancelled';

/** Customer e-mail in the language the booking was made in. */
async function customerMail(booking: BookingRecord, settings: Settings, kind: Kind) {
  const locale = booking.locale;
  const t = await getTranslations({locale, namespace: 'email'});
  const manageUrl = localizedUrl({pathname: '/varaa-aika/hallinnoi/[token]', params: {token: booking.manageToken}}, locale);
  const when = formatBookingTime(booking.startsAt, locale, settings.timezone);

  const totals = [
    moneyRow(t('subtotal'), formatEur(booking.subtotalCents, locale)),
    booking.minFillCents > 0 ? moneyRow(t('minFill'), formatEur(booking.minFillCents, locale)) : '',
    booking.promoCents > 0 ? moneyRow(t('promo'), `−${formatEur(booking.promoCents, locale)}`) : '',
    moneyRow(t('travel'), formatEur(booking.travelCents, locale)),
    booking.discountCents > 0 ? moneyRow(t('giftCard'), `−${formatEur(booking.discountCents, locale)}`) : '',
    moneyRow(t('total'), formatEur(booking.totalCents, locale), true)
  ].join('');

  const body = `
<p style="margin:0 0 16px;line-height:1.6">${esc(t(`${kind}.intro`, {name: booking.name}))}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:15px;margin-bottom:18px">
${emailRow(t('ref'), esc(booking.refCode))}
${emailRow(t('when'), esc(when))}
${emailRow(t('duration'), esc(formatDuration(booking.durationMin, locale)))}
${emailRow(t('address'), esc(`${booking.address}, ${booking.postalCode} ${booking.city}`))}
</table>
${
  kind === 'cancelled'
    ? ''
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px">${itemsTable(booking, locale)}${totals}</table>
<p style="margin:16px 0 0;line-height:1.6">${esc(t('payment'))}</p>
<p style="margin:10px 0 0;line-height:1.6">${esc(t(`${kind}.next`))}</p>
${emailButton(manageUrl, esc(t('manage')))}`
}
<p style="margin:16px 0 0;line-height:1.6">${esc(t('questions', {phone: settings.phone}))}</p>`;

  return sendMail({
    to: booking.email,
    subject: t(`${kind}.subject`, {ref: booking.refCode}),
    html: emailLayout({
      title: esc(t(`${kind}.title`)),
      body,
      footer: `${esc(settings.legalName)} · ${esc(settings.phone)} · ${esc(settings.email)}`
    }),
    replyTo: settings.email
  });
}

/** Owner notification (in Russian). */
async function ownerMail(booking: BookingRecord, settings: Settings, kind: Kind) {
  const titles: Record<Kind, string> = {
    created: 'Новая бронь',
    confirmed: 'Бронь подтверждена',
    rescheduled: 'Бронь перенесена клиентом',
    cancelled: 'Бронь отменена клиентом'
  };
  const when = formatBookingTime(booking.startsAt, 'ru', settings.timezone);
  const phoneDigits = booking.phone.replace(/\D/g, '');
  const body = `
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:15px;margin-bottom:18px">
${emailRow('Номер', esc(booking.refCode))}
${emailRow('Когда', esc(when))}
${emailRow('Длительность', esc(formatDuration(booking.durationMin, 'ru')))}
${emailRow('Клиент', esc(booking.name) + (booking.company ? ` (${esc(booking.company)}, ${esc(booking.yTunnus)})` : ''))}
${emailRow('Телефон', `<a href="tel:+${phoneDigits}">${esc(booking.phone)}</a> · <a href="https://wa.me/${phoneDigits}">WhatsApp</a>`)}
${emailRow('E-mail', esc(booking.email))}
${emailRow('Адрес', esc(`${booking.address}, ${booking.postalCode} ${booking.city}`))}
${booking.floor ? emailRow('Этаж / лифт', esc(booking.floor)) : ''}
${booking.parking ? emailRow('Парковка', esc(booking.parking)) : ''}
${booking.notes ? emailRow('Комментарий', esc(booking.notes)) : ''}
${booking.photos?.length ? emailRow('Фото', `${booking.photos.length} шт. — смотрите в /admin/bookings`) : ''}
${emailRow('Язык клиента', esc(booking.locale))}
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px">
${booking.items
  .map(
    (i) =>
      `<tr><td style="padding:6px 12px 6px 0">${esc(i.name)} × ${i.qty}${i.veryDirty ? ' <b>(очень грязное — оценка на месте)</b>' : ''}</td><td style="padding:6px 0;text-align:right">${formatEur(i.unitPriceCents * i.qty, 'ru')}</td></tr>`
  )
  .join('')}
${moneyRow('Работы', formatEur(booking.subtotalCents, 'ru'))}
${booking.minFillCents > 0 ? moneyRow('Доплата до минимального заказа', formatEur(booking.minFillCents, 'ru')) : ''}
${booking.promoCents > 0 ? moneyRow(`Скидка (${promoLabel(booking.promoDetails)})`, `−${formatEur(booking.promoCents, 'ru')}`) : ''}
${moneyRow('Транспорт', formatEur(booking.travelCents, 'ru'))}
${booking.discountCents > 0 ? moneyRow(`Сертификат ${esc(booking.giftCardCode)}`, `−${formatEur(booking.discountCents, 'ru')}`) : ''}
${moneyRow('Итого', formatEur(booking.totalCents, 'ru'), true)}
</table>`;

  const to = ownerEmail(settings.email);
  if (!to) return;
  await sendMail({
    to,
    subject: `${titles[kind]} ${booking.refCode} — ${when}`,
    html: emailLayout({title: titles[kind], body, footer: 'Управление бронями: /admin/bookings'}),
    replyTo: booking.email
  });
}

/** `customerOnly`: the change was made by the owner in /admin, so only the customer needs to hear about it. */
export async function sendBookingEmails(booking: BookingRecord, settings: Settings, kind: Kind, opts: {customerOnly?: boolean} = {}) {
  await Promise.all([
    customerMail(booking, settings, kind),
    opts.customerOnly ? Promise.resolve() : ownerMail(booking, settings, kind)
  ]);
}
