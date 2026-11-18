'use client';

import {useTranslations} from 'next-intl';
import type {Locale} from '@/i18n/routing';
import {MAX_QTY, SOFA_SLUGS, type CartLine, type Quote} from '@/lib/booking/cart';
import {bundleAddition, bundleOffers, exampleSofa, type BundleOffer} from '@/lib/booking/offers';
import {formatEur, l10n} from '@/lib/format';
import type {Catalog, Promotions} from '@/lib/types';
import {IconBed, IconChair, IconCheck, IconPlus, IconSofa, IconTag} from '@/components/ui/icons';
import styles from './BundleOffers.module.css';

export const BUNDLE_OFFERS_ID = 'bundle-offers';

const ADDED_ICON = {
  chairs: IconChair,
  'mattress-single': IconBed,
  'mattress-double': IconBed
};

interface Props {
  catalog: Catalog;
  promotions: Promotions;
  cart: CartLine[];
  /** the live quote: tells which bundles are already counted */
  quote: Quote;
  onChange: (cart: CartLine[]) => void;
  locale: Locale;
}

/** The cart with the offer in it: the added items in the needed quantity and, if there is none yet, a sofa. */
function withBundle(cart: CartLine[], offer: BundleOffer, promotions: Promotions, sofaSlug: string | null): CartLine[] {
  const {slug, qty} = bundleAddition(offer.kind, promotions);
  const line = (s: string, q: number): CartLine => ({
    slug: s,
    qty: q,
    options: [],
    veryDirty: false
  });
  let next = cart.some((l) => l.slug === slug)
    ? cart.map((l) => (l.slug === slug ? {...l, qty: Math.min(MAX_QTY, Math.max(l.qty, qty))} : l))
    : [...cart, line(slug, qty)];
  if (sofaSlug && !next.some((l) => SOFA_SLUGS.includes(l.slug))) next = [line(sofaSlug, 1), ...next];
  return next;
}

/** Step 1 of the booking: the bundle offers as small cards that put the bundle in the cart. */
export function BundleOffers({catalog, promotions, cart, quote, onChange, locale}: Props) {
  const t = useTranslations('booking.bundles');
  const ts = useTranslations('booking.summary');
  const offers = bundleOffers(catalog, promotions);
  const example = exampleSofa(catalog);
  if (offers.length === 0 || !example) return null;

  // prices are shown for the sofa already in the order, otherwise for the example one
  const cartSofa = catalog.services.find((s) => SOFA_SLUGS.includes(s.slug) && cart.some((l) => l.slug === s.slug));
  const sofa = cartSofa ?? example;
  const eur = (cents: number) => formatEur(cents, locale);

  return (
    <section
      id={BUNDLE_OFFERS_ID}
      className="glass min-w-0 scroll-mt-28 overflow-hidden p-5"
      aria-labelledby="bundle-offers-title"
      data-testid="bundle-offers"
    >
      <h3 id="bundle-offers-title" className="flex items-center gap-2 text-lg font-semibold">
        <IconTag width={20} height={20} className="text-accent" />
        {t('title')}
      </h3>
      <p className="mt-1 text-base text-muted">{t('lead')}</p>

      <div className="mt-4">
        <ul className={styles.row}>
          {offers.map((offer) => {
            const Added = ADDED_ICON[offer.kind];
            const active = quote.bundles.some((b) => b.kind === offer.kind);
            // the items are in the order even when another bundle or the percent discount won
            const addition = bundleAddition(offer.kind, promotions);
            const inCart = active || (Boolean(cartSofa) && cart.some((l) => l.slug === addition.slug && l.qty >= addition.qty));
            const title = ts(`bundles.${offer.kind}`, {
              count: promotions.bundleChairsCount
            });
            return (
              <li key={offer.kind} className={styles.card} data-active={active} data-bundle={offer.kind}>
                <div className="flex items-center gap-2">
                  <span className={styles.icons} aria-hidden="true">
                    <IconSofa width={24} height={24} />
                    <IconPlus width={14} height={14} />
                    <Added width={24} height={24} />
                  </span>
                  <span className={styles.saving}>{t('save', {amount: eur(offer.savingCents)})}</span>
                </div>
                <p className="mt-3 leading-snug font-semibold">{title}</p>
                <p className="mt-1 text-sm text-muted">{t('formula', {extra: eur(offer.extraCents)})}</p>
                <p className="mt-2.5 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-xl font-bold">{eur(sofa.priceCents + offer.extraCents)}</span>
                  <s className="text-sm text-muted">
                    {t('instead', {
                      price: eur(sofa.priceCents + offer.addedCents)
                    })}
                  </s>
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {t(cartSofa ? 'inOrder' : 'example', {
                    sofa: l10n(sofa.name, locale)
                  })}
                </p>
                <div>
                  {inCart ? (
                    <p className={styles.added}>
                      <IconCheck width={18} height={18} /> {t('added')}
                    </p>
                  ) : (
                    <button
                      type="button"
                      className={styles.add}
                      aria-label={`${t('add')}: ${title}`}
                      onClick={() => onChange(withBundle(cart, offer, promotions, example.slug))}
                    >
                      <IconPlus width={16} height={16} /> {t('add')}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {!cartSofa && <p className="mt-3 text-sm text-muted">{t('sofaNote', {sofa: l10n(example.name, locale)})}</p>}
    </section>
  );
}

/** "Your order": one line that a bundle would be cheaper, linking to the offers. */
export function BundleHint({savingCents, locale}: {savingCents: number; locale: Locale}) {
  const t = useTranslations('booking.bundles');
  return (
    <a href={`#${BUNDLE_OFFERS_ID}`} className={styles.pill} data-testid="bundle-hint">
      <IconTag width={20} height={20} />
      <span>
        <strong>{t('pillTitle', {amount: formatEur(savingCents, locale)})}</strong> {t('pillText')}
      </span>
    </a>
  );
}
