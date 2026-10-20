import {getTranslations} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {bundleOffers, bundleRows, exampleSofa, type BundleOffer} from '@/lib/booking/offers';
import {formatEur, l10n} from '@/lib/format';
import type {Catalog, Promotions} from '@/lib/types';
import {GlowButton} from '@/components/ui/GlowButton';
import {IconBed, IconChair, IconPlus, IconSofa, IconWind} from '@/components/ui/icons';
import styles from './PromoOffers.module.css';

interface Props {
  catalog: Catalog;
  promotions: Promotions;
  locale: Locale;
}

const TITLE_KEY = {chairs: 'chairs', 'mattress-single': 'mattressSingle', 'mattress-double': 'mattressDouble'} as const;
const ADDED_ICON = {chairs: IconChair, 'mattress-single': IconBed, 'mattress-double': IconBed};

/** Discount chips: first order, returning customer, three or more items — numbers come from settings. */
async function DiscountChips({promotions}: {promotions: Promotions}) {
  const t = await getTranslations('promo');
  const chips = [
    promotions.firstOrderPct > 0 && t('first', {pct: promotions.firstOrderPct}),
    promotions.repeatOrderPct > 0 && t('repeat', {pct: promotions.repeatOrderPct}),
    promotions.multiItemPct > 0 && t('multi', {pct: promotions.multiItemPct, min: promotions.multiItemMin})
  ].filter((chip): chip is string => Boolean(chip));
  if (chips.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <li key={chip} className={styles.chip}>
          {chip}
        </li>
      ))}
    </ul>
  );
}

/** Home page block: the three bundle offers as cards, priced with the 3-seater as the example. */
export async function PromoOffers({catalog, promotions, locale}: Props) {
  const t = await getTranslations('promo');
  const offers = bundleOffers(catalog, promotions);
  const sofa = exampleSofa(catalog);
  if (offers.length === 0 || !sofa) return null;

  return (
    <section className="section" aria-labelledby="promo-title">
      <div className="container-x">
        <div className={`on-dark ${styles.panel}`}>
          <div className="max-w-3xl">
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 id="promo-title" className="h2 mt-3">
              {t('title')}
            </h2>
            <p className="lead mt-4">{t('lead')}</p>
          </div>

          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {offers.map((offer) => {
              const Added = ADDED_ICON[offer.kind];
              const key = TITLE_KEY[offer.kind];
              return (
                <li key={offer.kind} className={`on-light ${styles.card}`}>
                  <p className={styles.saving}>{t('save', {amount: formatEur(offer.savingCents, locale)})}</p>
                  <div className={styles.icons} aria-hidden="true">
                    <span>
                      <IconSofa width={30} height={30} />
                    </span>
                    <IconPlus width={18} height={18} />
                    <span>
                      <Added width={30} height={30} />
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl leading-snug font-bold">{t(`${key}.title`, {count: promotions.bundleChairsCount})}</h3>
                  <p className="mt-1.5 text-[15px] text-ink-muted">{t(`${key}.text`)}</p>

                  <p className="mt-5 text-sm font-semibold tracking-wide text-teal-3 uppercase">
                    {t('formula', {extra: formatEur(offer.extraCents, locale)})}
                  </p>
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
                    <span className="text-4xl font-black tracking-tight">{formatEur(sofa.priceCents + offer.extraCents, locale)}</span>
                    <s className="text-ink-muted">{t('separately', {price: formatEur(sofa.priceCents + offer.addedCents, locale)})}</s>
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{t('example', {sofa: l10n(sofa.name, locale)})}</p>

                  <div className="mt-6">
                    <GlowButton href={{pathname: '/varaa-aika', query: {items: offer.items}}} size="sm" block>
                      {t('book')}
                    </GlowButton>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-sm font-semibold tracking-widest uppercase">{t('discountsTitle')}</h3>
              <div className="mt-3">
                <DiscountChips promotions={promotions} />
              </div>
              <p className="mt-3 max-w-[70ch] text-sm text-muted">{t(promotions.stackBundlesWithPercent ? 'noteStack' : 'noteBest')}</p>
            </div>
            <p className={styles.drying}>
              <IconWind width={26} height={26} className="shrink-0" />
              {t('drying')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BundleTable({caption, columns, rows}: {caption: string; columns: string[]; rows: string[][]}) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-hairline" tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
        <caption className="bg-surface p-4 text-left text-lg font-semibold">{caption}</caption>
        <thead>
          <tr className="border-t border-hairline text-sm text-muted">
            {columns.map((column, index) => (
              <th key={column} scope="col" className={`p-4 font-semibold ${index > 0 ? 'text-right' : ''}`}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-hairline">
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={index} scope="row" className="p-4 font-medium">
                    {cell}
                  </th>
                ) : (
                  <td key={index} className={`p-4 text-right whitespace-nowrap ${index === row.length - 1 ? 'text-teal-1' : ''} ${index === row.length - 2 ? 'font-semibold' : 'text-muted'}`}>
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Price-list block: discounts plus one table per bundle, a row for every sofa size. */
export async function PromoTables({catalog, promotions, locale}: Props) {
  const t = await getTranslations('promo');
  const offers = bundleOffers(catalog, promotions);
  const byKind = (kind: BundleOffer['kind']) => offers.find((o) => o.kind === kind);
  const chairs = byKind('chairs');
  const single = byKind('mattress-single');
  const double = byKind('mattress-double');
  const eur = (cents: number) => formatEur(cents, locale);

  return (
    <div className="space-y-6">
      <div className="glass p-6">
        <h3 className="text-lg font-semibold">{t('discountsTitle')}</h3>
        <div className="mt-4">
          <DiscountChips promotions={promotions} />
        </div>
        <p className="mt-4 max-w-[80ch] text-[15px] text-muted">{t(promotions.stackBundlesWithPercent ? 'noteStack' : 'noteBest')}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {chairs && (
          <BundleTable
            caption={`${t('chairs.title', {count: promotions.bundleChairsCount})} — ${t('formula', {extra: eur(chairs.extraCents)})}`}
            columns={[t('tableSofa'), t('tableSeparately'), t('tableBundle'), t('tableSaving')]}
            rows={bundleRows(catalog, chairs).map((row) => [
              l10n(row.sofa.name, locale),
              eur(row.separatelyCents),
              eur(row.bundleCents),
              `−${eur(chairs.savingCents)}`
            ])}
          />
        )}
        {(single || double) && (
          <BundleTable
            caption={[single && t('mattressSingle.title'), double && t('mattressDouble.title')].filter(Boolean).join(' / ')}
            columns={[t('tableSofa'), ...(single ? [t('tableSingle')] : []), ...(double ? [t('tableDouble')] : []), t('tableSaving')]}
            rows={bundleRows(catalog, (double ?? single)!).map((row) => [
              l10n(row.sofa.name, locale),
              ...(single ? [eur(row.sofa.priceCents + single.extraCents)] : []),
              ...(double ? [eur(row.sofa.priceCents + double.extraCents)] : []),
              [single && `−${eur(single.savingCents)}`, double && `−${eur(double.savingCents)}`].filter(Boolean).join(' / ')
            ])}
          />
        )}
      </div>
    </div>
  );
}
