import type {Catalog, Promotions, Service} from '@/lib/types';

/** Bundle offers priced from the catalog and the promotion settings — for the offer cards and tables. */

export interface BundleOffer {
  kind: 'chairs' | 'mattress-single' | 'mattress-double';
  /** the "+ X €" of "sofa price + X €" */
  extraCents: number;
  /** what the added items cost on their own */
  addedCents: number;
  savingCents: number;
  /** booking deep link: `?items=…` */
  items: string;
}

export interface BundleRow {
  sofa: Service;
  separatelyCents: number;
  bundleCents: number;
}

const SOFAS = ['sofa-2', 'sofa-3', 'sofa-4', 'corner', 'corner-large', 'sofa-5-6'];
const EXAMPLE_SOFA = 'sofa-3';

export function bundleOffers(catalog: Catalog, promotions: Promotions): BundleOffer[] {
  const price = (slug: string) => catalog.services.find((s) => s.slug === slug)?.priceCents;
  const chair = price('chair-full');
  const single = price('bed-single');
  const double = price('bed-double');
  const offers: (BundleOffer | null)[] = [
    chair !== undefined
      ? {
          kind: 'chairs',
          extraCents: promotions.bundleChairsExtraCents,
          addedCents: chair * promotions.bundleChairsCount,
          savingCents: chair * promotions.bundleChairsCount - promotions.bundleChairsExtraCents,
          items: `${EXAMPLE_SOFA}:1,chair-full:${promotions.bundleChairsCount}`
        }
      : null,
    single !== undefined
      ? {
          kind: 'mattress-single',
          extraCents: promotions.bundleMattressSingleExtraCents,
          addedCents: single,
          savingCents: single - promotions.bundleMattressSingleExtraCents,
          items: `${EXAMPLE_SOFA}:1,bed-single:1`
        }
      : null,
    double !== undefined
      ? {
          kind: 'mattress-double',
          extraCents: promotions.bundleMattressDoubleExtraCents,
          addedCents: double,
          savingCents: double - promotions.bundleMattressDoubleExtraCents,
          items: `${EXAMPLE_SOFA}:1,bed-double:1`
        }
      : null
  ];
  // an offer that saves nothing (e.g. after a price change in /admin) is simply not shown
  return offers.filter((offer): offer is BundleOffer => offer !== null && offer.savingCents > 0);
}

export function exampleSofa(catalog: Catalog) {
  return catalog.services.find((s) => s.slug === EXAMPLE_SOFA) ?? null;
}

/** One table row per sofa size: price separately vs. as a bundle. */
export function bundleRows(catalog: Catalog, offer: BundleOffer): BundleRow[] {
  return SOFAS.map((slug) => catalog.services.find((s) => s.slug === slug))
    .filter((sofa): sofa is Service => sofa !== undefined)
    .map((sofa) => ({
      sofa,
      separatelyCents: sofa.priceCents + offer.addedCents,
      bundleCents: sofa.priceCents + offer.extraCents
    }));
}
