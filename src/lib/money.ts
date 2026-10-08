/**
 * Parses a price typed by the owner ("150", "12,5") into cents.
 * Returns null for anything that is not a clean non-negative amount — callers must refuse the input
 * rather than fall back to 0, because a saved price is published on the site immediately.
 */
export function parseEuro(input: string): number | null {
  const text = input.trim().replace(',', '.');
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(text)) return null;
  return Math.round(Number(text) * 100);
}
