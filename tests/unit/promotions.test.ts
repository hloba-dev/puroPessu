/** Price policy v3: discounts and bundle offers (source: the owner's price sheet). */
import {describe, expect, it} from 'vitest';
import {cartFromQuery, priceCart, type CartLine, type GiftCardValue} from '@/lib/booking/cart';
import {describePromo, promoLabel} from '@/lib/booking/promo-details';
import {normalizePhone} from '@/lib/booking/schema';
import {seedCategories, seedServices, seedSettings} from '@/lib/data/seed-data';
import type {Catalog, Promotions} from '@/lib/types';

const catalog: Catalog = {categories: seedCategories, services: seedServices};
const line = (slug: string, qty = 1): CartLine => ({slug, qty, options: [], veryDirty: false});
const promotions = seedSettings.promotions;

const price = (
  cart: CartLine[],
  customer: 'first' | 'repeat' | 'unknown',
  extra: {travelCents?: number; promotions?: Promotions; giftCard?: GiftCardValue} = {}
) => priceCart(cart, catalog, {minOrderCents: seedSettings.minOrderCents, promotions, customer, ...extra});

describe('seed follows the price sheet', () => {
  const eur = (slug: string) => seedServices.find((s) => s.slug === slug)!.priceCents / 100;

  it('has the listed prices and a 100 € minimum order', () => {
    expect(
      ['armchair', 'sofa-2', 'sofa-3', 'sofa-4', 'corner', 'corner-large', 'sofa-5-6', 'ottoman-s', 'ottoman-l'].map(eur)
    ).toEqual([50, 109, 149, 169, 169, 199, 199, 25, 40]);
    expect(['chair-seat', 'chair-full', 'office-chair', 'bed-single', 'bed-double'].map(eur)).toEqual([14, 20, 40, 99, 160]);
    expect(['car-5', 'car-seat', 'camper', 'boat-textiles', 'stroller', 'soft-toy'].map(eur)).toEqual([179, 40, 149, 100, 25, 20]);
    expect(seedSettings.minOrderCents).toBe(10000);
  });

  it('offers no fabric protection, rugs or wall textiles', () => {
    const slugs = seedServices.map((s) => s.slug).join(' ');
    expect(slugs).not.toMatch(/protect|rug|raanu/);
    expect(seedServices.flatMap((s) => s.options.map((o) => o.slug))).not.toContain('protect');
    expect(seedCategories.map((c) => c.slug)).not.toContain('protection');
  });
});

describe('percentage discounts', () => {
  it('reproduces the example from the price sheet: first order, 3-seater + 2 dining chairs', () => {
    const q = price([line('sofa-3'), line('chair-full', 2)], 'first');
    // 149 + 2 × 20 = 189 €; −10 % first order −5 % for 3 items = −28.35 €
    expect(q).toMatchObject({subtotalCents: 18900, percent: 15, promoCents: 2835, promoKind: 'percent', totalCents: 16065});
  });

  it('gives a returning customer 5 %, plus 5 % from three items', () => {
    expect(price([line('sofa-3')], 'repeat')).toMatchObject({percent: 5, promoCents: 745, totalCents: 14155});
    expect(price([line('sofa-3'), line('armchair', 2)], 'repeat')).toMatchObject({percent: 10, promoCents: 2490});
  });

  it('never combines the first-order and the returning-customer discount', () => {
    expect(price([line('sofa-3')], 'first').percent).toBe(10);
    expect(price([line('chair-full', 6)], 'first').percent).toBe(15);
  });

  it('applies only the item-count discount while the customer is still unknown', () => {
    expect(price([line('sofa-3')], 'unknown')).toMatchObject({percent: 0, promoCents: 0});
    expect(price([line('chair-full', 6)], 'unknown')).toMatchObject({percent: 5, promoCents: 600});
  });

  it('counts the minimum order before discounts and never discounts the travel fee', () => {
    // armchair 50 € → topped up to 100 € → −10 % = 90 €, then + 25 € travel
    const q = price([line('armchair')], 'first', {travelCents: 2500});
    expect(q).toMatchObject({subtotalCents: 5000, minFillCents: 5000, promoCents: 1000, travelCents: 2500, totalCents: 11500});
  });
});

describe('bundle offers', () => {
  it('sofa + 4 dining chairs = sofa price + 30 €', () => {
    const q = price([line('sofa-3'), line('chair-full', 4)], 'unknown');
    expect(q).toMatchObject({subtotalCents: 22900, bundleCents: 5000, promoKind: 'bundle', totalCents: 17900});
    expect(price([line('sofa-2'), line('chair-full', 4)], 'unknown').totalCents).toBe(13900);
    expect(price([line('corner-large'), line('chair-full', 4)], 'unknown').totalCents).toBe(22900);
  });

  it('sofa + mattress = sofa price + 50 € (single) or + 75 € (double)', () => {
    expect(price([line('sofa-3'), line('bed-single')], 'unknown')).toMatchObject({bundleCents: 4900, totalCents: 19900});
    expect(price([line('sofa-3'), line('bed-double')], 'unknown')).toMatchObject({bundleCents: 8500, totalCents: 22400});
    expect(price([line('sofa-5-6'), line('bed-double')], 'unknown').totalCents).toBe(27400);
  });

  it('needs a sofa: chairs or a mattress alone get no bundle', () => {
    expect(price([line('chair-full', 4), line('bed-double')], 'unknown').bundleCents).toBe(0);
    expect(price([line('armchair'), line('chair-full', 4)], 'unknown').bundleCents).toBe(0);
    expect(price([line('sofa-3'), line('chair-full', 3)], 'unknown').bundleCents).toBe(0);
  });

  it('gives one bundle per sofa and picks the most valuable one', () => {
    // one sofa, both offers possible: the double mattress (−85 €) beats the chairs (−50 €)
    const one = price([line('sofa-3'), line('chair-full', 4), line('bed-double')], 'unknown');
    expect(one.bundles.map((b) => b.kind)).toEqual(['mattress-double']);
    expect(one.bundleCents).toBe(8500);
    // two sofas: both offers apply
    const two = price([line('sofa-3', 2), line('chair-full', 4), line('bed-double')], 'unknown');
    expect(two.bundles.map((b) => b.kind).sort()).toEqual(['chairs', 'mattress-double']);
    expect(two.bundleCents).toBe(13500);
  });

  it('does not stack with percentage discounts by default: the better of the two is used', () => {
    // first order, sofa + 4 chairs: 15 % of 229 € = 34.35 € < 50 € bundle saving
    expect(price([line('sofa-3'), line('chair-full', 4)], 'first')).toMatchObject({promoKind: 'bundle', promoCents: 5000, totalCents: 17900});
    // a big first order where 15 % is worth more than the bundle
    const big = price([line('sofa-5-6', 2), line('corner-large'), line('chair-full', 4)], 'first');
    expect(big.promoKind).toBe('percent');
    expect(big.promoCents).toBe(Math.round((19900 * 3 + 8000) * 0.15));
  });

  it('can be configured to stack: the percentage is then taken from the bundle price', () => {
    const q = price([line('sofa-3'), line('chair-full', 4)], 'first', {promotions: {...promotions, stackBundlesWithPercent: true}});
    // 229 − 50 = 179 € → −15 % = 26.85 €
    expect(q).toMatchObject({promoKind: 'both', promoCents: 5000 + 2685, totalCents: 15215});
  });

  it('a gift card is applied after the promotions', () => {
    const q = price([line('sofa-3'), line('chair-full', 4)], 'unknown', {giftCard: {amountCents: 5000}});
    expect(q).toMatchObject({promoCents: 5000, discountCents: 5000, totalCents: 12900});
  });
});

describe('a service gift card pays for one unit in full, and that unit takes no part in the promotions', () => {
  const card = (slug: string) => ({serviceId: seedServices.find((s) => s.slug === slug)!.id});

  it('sofa + double mattress with a mattress card: the mattress is free, the sofa costs its normal price', () => {
    const q = price([line('sofa-3'), line('bed-double')], 'unknown', {travelCents: 2500, giftCard: card('bed-double')});
    expect(q.bundles).toEqual([]);
    expect(q.promoCents).toBe(0);
    expect(q.discountCents).toBe(16000);
    expect(q.totalCents).toBe(14900 + 2500);
  });

  it('the percentage is taken only from what the customer pays for', () => {
    // the card pays the sofa; 15 % of the two chairs (40 €) = 6 €
    const q = price([line('sofa-3'), line('chair-full', 2)], 'first', {giftCard: card('sofa-3')});
    expect(q.percent).toBe(15);
    expect(q.promoCents).toBe(600);
    expect(q.discountCents).toBe(14900);
    expect(q.totalCents).toBe(3400);
  });

  it('a chair card takes one chair out of the "sofa + 4 chairs" bundle', () => {
    const q = price([line('sofa-3'), line('chair-full', 4)], 'unknown', {giftCard: card('chair-full')});
    expect(q.bundles).toEqual([]);
    // five items → 5 % of what is left to pay for: 149 + 3 × 20 = 209 €
    expect(q.promoCents).toBe(1045);
    expect(q.totalCents).toBe(22900 - 1045 - 2000);
  });

  it('never goes below zero when the card covers the only item', () => {
    const q = price([line('armchair')], 'first', {giftCard: card('armchair')});
    // 50 € armchair + 50 € up to the minimum order; 10 % of the 50 € that is paid
    expect(q.promoCents).toBe(500);
    expect(q.totalCents).toBe(4500);
  });
});

describe('phone numbers are compared in one spelling', () => {
  it.each(['040 123 4567', '+358 40 123 4567', '+358 (0)40 123 4567', '00358 40 1234567', '+358 040-123-4567'])('%s', (raw) => {
    expect(normalizePhone(raw)).toBe('+358401234567');
  });

  it('leaves foreign numbers as typed', () => {
    expect(normalizePhone('+46 70 123 45 67')).toBe('+46701234567');
  });
});

describe('cart from a deep link', () => {
  it('reads the bundle links of the offer cards', () => {
    expect(cartFromQuery(undefined, 'sofa-3:1,chair-full:4')).toEqual([
      {slug: 'sofa-3', qty: 1},
      {slug: 'chair-full', qty: 4}
    ]);
  });

  it('keeps quantities whole and within limits, and merges repeated items', () => {
    expect(cartFromQuery(undefined, 'sofa-3:2.5')).toEqual([{slug: 'sofa-3', qty: 2}]);
    expect(cartFromQuery('sofa-3', 'sofa-3:1,chair-full:x,:3,armchair:9999')).toEqual([
      {slug: 'sofa-3', qty: 2},
      {slug: 'chair-full', qty: 1},
      {slug: 'armchair', qty: 50}
    ]);
    expect(cartFromQuery(['a', 'b'], undefined)).toEqual([]);
  });
});

describe('the owner sees in words what the discount consisted of', () => {
  const label = (cart: CartLine[], customer: 'first' | 'repeat') => promoLabel(describePromo(price(cart, customer), customer, promotions));

  it('names every part of a percentage discount', () => {
    expect(label([line('sofa-3'), line('chair-full', 2)], 'first')).toBe('15 % (первый заказ + от 3 предметов)');
    expect(label([line('sofa-3'), line('armchair')], 'repeat')).toBe('5 % (повторный заказ)');
  });

  it('names the bundle instead of printing its internal key', () => {
    expect(label([line('sofa-3'), line('bed-double')], 'first')).toBe('комплект: диван + двуспальный матрас');
    expect(label([line('sofa-3'), line('chair-full', 4)], 'repeat')).toBe('комплект: диван + стулья');
  });
});
