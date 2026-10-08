'use client';

import {useTranslations} from 'next-intl';
import type {Locale} from '@/i18n/routing';
import type {CustomerKind, Quote} from '@/lib/booking/cart';
import {formatDuration, formatEur, l10n} from '@/lib/format';
import type {Promotions} from '@/lib/types';
import {IconCheck} from '@/components/ui/icons';

interface Props {
  quote: Quote;
  locale: Locale;
  minOrderCents: number;
  promotions: Promotions;
  customer: CustomerKind;
  travelKnown: boolean;
  slotLabel: string | null;
}

/** "Your order": recalculated on every change with the same function the server uses. */
export function Summary({quote, locale, minOrderCents, promotions, customer, travelKnown, slotLabel}: Props) {
  const t = useTranslations('booking.summary');
  // what the promotion row is called and what it consists of
  const promoLabel =
    quote.promoKind === 'bundle'
      ? t('promoBundle')
      : quote.promoKind === 'both'
        ? t('promoBoth', {percent: quote.percent})
        : t('promoPercent', {percent: quote.percent});
  const promoReasons = [
    ...quote.bundles.map((bundle) => t(`bundles.${bundle.kind}`, {count: promotions.bundleChairsCount})),
    ...(quote.promoKind === 'percent' || quote.promoKind === 'both'
      ? [
          customer === 'first' ? t('reasonFirst') : customer === 'repeat' ? t('reasonRepeat') : '',
          quote.itemCount >= promotions.multiItemMin ? t('reasonMulti', {min: promotions.multiItemMin}) : ''
        ]
      : [])
  ].filter(Boolean);
  const tb = useTranslations('booking');
  const trust = tb.raw('trust') as string[];
  const row = 'flex justify-between gap-4';

  return (
    <aside className="glass p-6 lg:sticky lg:top-28" aria-labelledby="summary-title" data-testid="booking-summary">
      <h2 id="summary-title" className="text-lg font-semibold">
        {t('title')}
      </h2>

      {quote.lines.length === 0 ? (
        <p className="mt-3 text-[15px] text-muted">{t('empty')}</p>
      ) : (
        <>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {quote.lines.map((line) => (
              <li key={line.service.slug} className={row}>
                <span>
                  {l10n(line.service.name, locale)} × {line.qty}
                  {line.optionSlugs.length > 0 && (
                    <span className="block text-sm text-muted">
                      {line.service.options
                        .filter((o) => line.optionSlugs.includes(o.slug))
                        .map((o) => l10n(o.name, locale))
                        .join(', ')}
                    </span>
                  )}
                </span>
                <span className="font-medium whitespace-nowrap">{formatEur(line.lineCents, locale)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-hairline pt-4 text-[15px]">
            <div className={row}>
              <dt className="text-muted">{t('subtotal')}</dt>
              <dd data-testid="sum-subtotal">{formatEur(quote.subtotalCents, locale)}</dd>
            </div>
            {quote.minFillCents > 0 && (
              <div className={row}>
                <dt className="text-muted">{t('minFill', {min: formatEur(minOrderCents, locale)})}</dt>
                <dd data-testid="sum-minfill">{formatEur(quote.minFillCents, locale)}</dd>
              </div>
            )}
            {quote.promoCents > 0 && (
              <div className={row}>
                <dt className="text-cyan-1">
                  {promoLabel}
                  <span className="block text-sm text-muted">{promoReasons.join(' · ')}</span>
                </dt>
                <dd className="font-medium whitespace-nowrap text-cyan-1" data-testid="sum-promo">
                  −{formatEur(quote.promoCents, locale)}
                </dd>
              </div>
            )}
            <div className={row}>
              <dt className="text-muted">{t('travel')}</dt>
              <dd data-testid="sum-travel">{travelKnown ? formatEur(quote.travelCents, locale) : t('travelPending')}</dd>
            </div>
            {quote.discountCents > 0 && (
              <div className={row}>
                <dt className="text-muted">{t('giftCard')}</dt>
                <dd>−{formatEur(quote.discountCents, locale)}</dd>
              </div>
            )}
            <div className={`${row} border-t border-hairline pt-3 text-lg font-bold`}>
              <dt>{t('total')}</dt>
              <dd data-testid="sum-total">
                {quote.hasFromPrice ? `${t('from')} ` : ''}
                {formatEur(quote.totalCents, locale)}
              </dd>
            </div>
            <div className={row}>
              <dt className="text-muted">{t('duration')}</dt>
              <dd>{formatDuration(quote.durationMin, locale)}</dd>
            </div>
          </dl>

          {customer === 'unknown' && promotions.firstOrderPct > 0 && (
            <p className="mt-3 rounded-xl border border-cyan-4 bg-cyan-4/15 px-3 py-2 text-sm text-cyan-1">
              {t('promoHint', {first: promotions.firstOrderPct, repeat: promotions.repeatOrderPct})}
            </p>
          )}
          {slotLabel && <p className="mt-3 text-[15px] font-medium text-cyan-1 first-letter:uppercase">{slotLabel}</p>}
        </>
      )}

      <ul className="mt-5 space-y-2 border-t border-hairline pt-4 text-sm text-muted">
        {trust.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <IconCheck width={16} height={16} className="shrink-0 text-cyan-2" /> {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
