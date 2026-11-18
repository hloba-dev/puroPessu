import {parseEuro} from '@/lib/money';

/** How the price of a booking entered by hand is discounted. */
export type PromoMode = 'auto' | 'manual' | 'none';
export type DiscountUnit = 'eur' | 'pct';

export const PROMO_MODES: readonly PromoMode[] = ['auto', 'manual', 'none'];

/**
 * The operator's own discount in cents, taken off the cleaning price (items + minimum-order top-up):
 * like the site's promotions it never touches the travel fee and cannot exceed what it is taken from.
 * Returns null when the typed value is not a clean amount or percentage.
 */
export function manualDiscountCents(baseCents: number, value: string, unit: DiscountUnit): number | null {
  const text = value.trim();
  if (text === '') return 0;
  if (unit === 'pct') {
    const pct = Number(text.replace(',', '.'));
    if (!/^\d{1,3}([.,]\d{1,2})?$/.test(text) || pct > 100) return null;
    return Math.round((baseCents * pct) / 100);
  }
  const cents = parseEuro(text);
  return cents === null ? null : Math.min(cents, baseCents);
}
