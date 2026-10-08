import {getTranslations} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import type {BookingRecord} from '@/lib/data/store';
import {formatBookingTime} from '@/lib/email/booking';
import {formatDuration, formatEur} from '@/lib/format';

/** Read-only booking card used on the thank-you and manage pages. */
export async function BookingDetails({booking, locale, timezone}: {booking: BookingRecord; locale: Locale; timezone: string}) {
  const [t, ts] = await Promise.all([getTranslations('email'), getTranslations('booking.manage')]);
  const row = 'flex justify-between gap-4';

  return (
    <div className="glass p-6" data-testid="booking-details">
      <dl className="space-y-3 text-[15px]">
        <div className={row}>
          <dt className="text-muted">{t('ref')}</dt>
          <dd className="font-semibold" data-testid="booking-ref">
            {booking.refCode}
          </dd>
        </div>
        <div className={row}>
          <dt className="text-muted">{ts('statusLabel')}</dt>
          <dd className="font-semibold" data-testid="booking-status">
            {ts(`status.${booking.status}`)}
          </dd>
        </div>
        <div className={row}>
          <dt className="text-muted">{t('when')}</dt>
          <dd className="text-right font-semibold first-letter:uppercase" data-testid="booking-when">
            {formatBookingTime(booking.startsAt, locale, timezone)}
          </dd>
        </div>
        <div className={row}>
          <dt className="text-muted">{t('duration')}</dt>
          <dd>{formatDuration(booking.durationMin, locale)}</dd>
        </div>
        <div className={row}>
          <dt className="text-muted">{t('address')}</dt>
          <dd className="text-right">
            {booking.address}, {booking.postalCode} {booking.city}
          </dd>
        </div>
      </dl>

      <ul className="mt-5 space-y-2 border-t border-hairline pt-5 text-[15px]">
        {booking.items.map((item) => (
          <li key={`${item.serviceSlug}-${item.name}`} className={row}>
            <span>
              {item.name} × {item.qty}
            </span>
            <span className="whitespace-nowrap">{formatEur(item.unitPriceCents * item.qty, locale)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 border-t border-hairline pt-4 text-[15px]">
        {booking.minFillCents > 0 && (
          <div className={row}>
            <dt className="text-muted">{t('minFill')}</dt>
            <dd>{formatEur(booking.minFillCents, locale)}</dd>
          </div>
        )}
        {booking.promoCents > 0 && (
          <div className={row}>
            <dt className="text-muted">{t('promo')}</dt>
            <dd data-testid="booking-promo">−{formatEur(booking.promoCents, locale)}</dd>
          </div>
        )}
        <div className={row}>
          <dt className="text-muted">{t('travel')}</dt>
          <dd>{formatEur(booking.travelCents, locale)}</dd>
        </div>
        {booking.discountCents > 0 && (
          <div className={row}>
            <dt className="text-muted">{t('giftCard')}</dt>
            <dd>−{formatEur(booking.discountCents, locale)}</dd>
          </div>
        )}
        <div className={`${row} text-lg font-bold`}>
          <dt>{t('total')}</dt>
          <dd data-testid="booking-total">{formatEur(booking.totalCents, locale)}</dd>
        </div>
      </dl>
    </div>
  );
}
