import type {Catalog, Promotions, Service} from '@/lib/types';

/** One line of the booking cart, as sent by the client. Prices never come from the client. */
export interface CartLine {
  slug: string;
  qty: number;
  /** option slugs applied to every unit of the line, e.g. ['protect'] */
  options: string[];
  /** "very dirty": the cleaner estimates the item on site before starting */
  veryDirty: boolean;
}

export interface PricedLine {
  service: Service;
  qty: number;
  optionSlugs: string[];
  optionIds: number[];
  /** per unit, options included */
  unitCents: number;
  lineCents: number;
  /** whole line */
  durationMin: number;
  veryDirty: boolean;
}

export interface Quote {
  lines: PricedLine[];
  /** slugs that cannot be booked: unknown, inactive or price-list-only services */
  invalid: string[];
  subtotalCents: number;
  /** top-up to the minimum order, shown as its own row */
  minFillCents: number;
  travelCents: number;
  /** number of items in the order (m² lines count as one) */
  itemCount: number;
  /** bundle offers found in the cart, one per sofa at most */
  bundles: AppliedBundle[];
  /** what the bundles would save */
  bundleCents: number;
  /** percentage discount the order qualifies for (first / returning customer + item count) */
  percent: number;
  /** promotion actually taken off the price, and where it comes from */
  promoCents: number;
  promoKind: 'none' | 'bundle' | 'percent' | 'both';
  /** gift card amount used */
  discountCents: number;
  totalCents: number;
  durationMin: number;
  hasFromPrice: boolean;
  needsEstimate: boolean;
  /** false when a service gift card was given but its service is not in the cart */
  giftCardApplicable: boolean;
}

/**
 * A validated gift card: a value card with its remaining balance, or a card for one specific service.
 * Value cards pay anything on the booking up to the balance. A service card covers one unit of its
 * service (base price, no options) and never the travel fee — as stated in the gift card terms.
 */
export interface GiftCardValue {
  amountCents?: number | null;
  serviceId?: number | null;
}

export interface AppliedBundle {
  kind: 'chairs' | 'mattress-single' | 'mattress-double';
  savingCents: number;
}

/** 'unknown' = before the contact details are known: only the item-count discount can be shown. */
export type CustomerKind = 'first' | 'repeat' | 'unknown';

// Which catalog rows take part in the bundle offers of the price sheet.
const SOFA_SLUGS = ['sofa-2', 'sofa-3', 'sofa-4', 'corner', 'corner-large', 'sofa-5-6', 'leather-sofa-2', 'leather-sofa-3', 'leather-corner'];
const BUNDLE_CHAIR = 'chair-full';
const BUNDLE_MATTRESS = {single: 'bed-single', double: 'bed-double'};

/**
 * Bundle offers: "sofa + 4 dining chairs = sofa price + X" and "sofa + mattress = sofa price + Y".
 * Every sofa in the cart can carry one bundle; the most valuable ones are used first.
 */
function findBundles(lines: PricedLine[], promotions: Promotions): AppliedBundle[] {
  const qty = (slugs: string[]) => lines.filter((l) => slugs.includes(l.service.slug)).reduce((sum, l) => sum + l.qty, 0);
  const basePrice = (slug: string) => lines.find((l) => l.service.slug === slug)?.service.priceCents ?? 0;

  let sofas = qty(SOFA_SLUGS);
  const offers: (AppliedBundle & {available: number})[] = [
    {
      kind: 'chairs' as const,
      savingCents: promotions.bundleChairsCount * basePrice(BUNDLE_CHAIR) - promotions.bundleChairsExtraCents,
      available: promotions.bundleChairsCount > 0 ? Math.floor(qty([BUNDLE_CHAIR]) / promotions.bundleChairsCount) : 0
    },
    {
      kind: 'mattress-single' as const,
      savingCents: basePrice(BUNDLE_MATTRESS.single) - promotions.bundleMattressSingleExtraCents,
      available: qty([BUNDLE_MATTRESS.single])
    },
    {
      kind: 'mattress-double' as const,
      savingCents: basePrice(BUNDLE_MATTRESS.double) - promotions.bundleMattressDoubleExtraCents,
      available: qty([BUNDLE_MATTRESS.double])
    }
  ]
    .filter((offer) => offer.savingCents > 0 && offer.available > 0)
    .sort((a, b) => b.savingCents - a.savingCents);

  const applied: AppliedBundle[] = [];
  for (const offer of offers) {
    while (sofas > 0 && offer.available > 0) {
      applied.push({kind: offer.kind, savingCents: offer.savingCents});
      offer.available--;
      sofas--;
    }
  }
  return applied;
}

export const MAX_QTY = 50;
export const MAX_QTY_M2 = 200;

/**
 * Cart preset from a deep link: `?item=sofa-3` (price list buttons) or
 * `?items=sofa-3:1,chair-full:4` (bundle offers). Unknown slugs are dropped later, against the catalog.
 */
export function cartFromQuery(item: unknown, items: unknown): {slug: string; qty: number}[] {
  const parts = [
    ...(typeof item === 'string' ? [`${item}:1`] : []),
    ...(typeof items === 'string' ? items.split(',').slice(0, 10) : [])
  ];
  const cart = new Map<string, number>();
  for (const part of parts) {
    const [slug, qty] = part.split(':');
    if (!slug) continue;
    const count = Math.max(1, Math.floor(Number(qty)) || 1);
    cart.set(slug, Math.min(MAX_QTY, (cart.get(slug) ?? 0) + count));
  }
  return [...cart].map(([slug, qty]) => ({slug, qty}));
}

/**
 * The one place where a booking is priced. It runs in the browser for the live summary and again
 * on the server (with the catalog read from the database) before the booking is written.
 */
export function priceCart(
  cart: CartLine[],
  catalog: Catalog,
  opts: {
    minOrderCents: number;
    travelCents?: number;
    giftCard?: GiftCardValue | null;
    /** omit to price without discounts and bundles */
    promotions?: Promotions | null;
    customer?: CustomerKind;
  }
): Quote {
  const activeCategories = new Set(catalog.categories.filter((c) => c.isActive).map((c) => c.id));
  const lines: PricedLine[] = [];
  const invalid: string[] = [];

  for (const item of cart) {
    const service = catalog.services.find((s) => s.slug === item.slug);
    if (!service || !service.isActive || service.isAddon || !activeCategories.has(service.categoryId)) {
      invalid.push(item.slug);
      continue;
    }
    const maxQty = service.unit === 'm2' ? MAX_QTY_M2 : MAX_QTY;
    const qty = Math.min(maxQty, Math.max(1, Math.floor(item.qty) || 1));
    const options = service.options.filter((o) => item.options.includes(o.slug));
    const unitCents = service.priceCents + options.reduce((sum, o) => sum + o.priceCents, 0);
    const unitMinutes = service.durationMin + options.reduce((sum, o) => sum + o.durationMin, 0);
    lines.push({
      service,
      qty,
      optionSlugs: options.map((o) => o.slug),
      optionIds: options.map((o) => o.id),
      unitCents,
      lineCents: unitCents * qty,
      durationMin: unitMinutes * qty,
      veryDirty: item.veryDirty
    });
  }

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineCents, 0);
  const minFillCents = subtotalCents > 0 ? Math.max(0, opts.minOrderCents - subtotalCents) : 0;
  const travelCents = subtotalCents > 0 ? (opts.travelCents ?? 0) : 0;

  // --- a service gift card pays for one unit in full, so that unit takes no part in the promotions
  const card = opts.giftCard;
  const cardLine = card?.serviceId ? lines.find((l) => l.service.id === card.serviceId) : undefined;
  const cardUnitCents = cardLine ? cardLine.service.priceCents : 0;
  const promoLines = cardLine ? lines.map((l) => (l === cardLine ? {...l, qty: l.qty - 1} : l)).filter((l) => l.qty > 0) : lines;

  // --- promotions: the minimum order counts before discounts, the travel fee is never discounted
  const promoBase = subtotalCents + minFillCents - cardUnitCents;
  const itemCount = lines.reduce((sum, l) => sum + (l.service.unit === 'm2' ? 1 : l.qty), 0);
  const promotions = opts.promotions;
  const bundles = promotions ? findBundles(promoLines, promotions) : [];
  const bundleCents = Math.min(promoBase, bundles.reduce((sum, b) => sum + b.savingCents, 0));
  const customer = opts.customer ?? 'unknown';
  const percent = promotions
    ? (customer === 'first' ? promotions.firstOrderPct : customer === 'repeat' ? promotions.repeatOrderPct : 0) +
      (itemCount >= promotions.multiItemMin ? promotions.multiItemPct : 0)
    : 0;
  const percentOf = (amount: number) => Math.round((amount * percent) / 100);

  let promoCents = 0;
  let promoKind: Quote['promoKind'] = 'none';
  if (promotions?.stackBundlesWithPercent) {
    const percentCents = percentOf(promoBase - bundleCents);
    promoCents = bundleCents + percentCents;
    promoKind = bundleCents > 0 && percentCents > 0 ? 'both' : bundleCents > 0 ? 'bundle' : percentCents > 0 ? 'percent' : 'none';
  } else {
    // the customer gets whichever is worth more
    const percentCents = percentOf(promoBase);
    promoCents = Math.max(bundleCents, percentCents);
    promoKind = promoCents === 0 ? 'none' : bundleCents >= percentCents ? 'bundle' : 'percent';
  }

  // --- gift card: a way to pay, so it comes after the promotions
  const beforeDiscount = subtotalCents + minFillCents - promoCents + travelCents;
  let discountCents = 0;
  let giftCardApplicable = true;
  if (card?.serviceId) {
    giftCardApplicable = Boolean(cardLine);
    discountCents = cardUnitCents;
  } else if (card?.amountCents) {
    discountCents = Math.min(Math.max(0, card.amountCents), beforeDiscount);
  }

  return {
    lines,
    invalid,
    subtotalCents,
    minFillCents,
    travelCents,
    itemCount,
    bundles: promoKind === 'percent' ? [] : bundles,
    bundleCents,
    percent,
    promoCents,
    promoKind,
    discountCents,
    totalCents: beforeDiscount - discountCents,
    durationMin: lines.reduce((sum, l) => sum + l.durationMin, 0),
    hasFromPrice: lines.some((l) => l.service.priceFrom),
    needsEstimate: lines.some((l) => l.veryDirty || l.service.priceFrom),
    giftCardApplicable
  };
}
