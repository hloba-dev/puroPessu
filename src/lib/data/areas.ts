import 'server-only';
import postalCodes from './postal-codes.json';
import {quoteTravel} from '@/lib/booking/travel';
import type {PostalCode, Settings} from '@/lib/types';

const rows: PostalCode[] = (postalCodes as [string, string, number, number][]).map(
  ([code, municipality, lat, lng]) => ({code, municipality, lat, lng})
);

/** Bundled copy of the postal code seed (same rows as the `postal_codes` table). */
export function bundledPostalCode(code: string): PostalCode | null {
  return rows.find((r) => r.code === code) ?? null;
}

export interface MunicipalityFee {
  municipality: string;
  /** Travel fee range across the municipality's postal codes */
  minFeeCents: number;
  maxFeeCents: number;
  /** Fee for the typical (median) postal code — used for grouping */
  typicalFeeCents: number;
  minKm: number;
}

/** Travel fee per municipality inside the service zones, derived from postal codes and current settings. */
export function getMunicipalityFees(settings: Settings): MunicipalityFee[] {
  const byMunicipality = new Map<string, {fees: number[]; kms: number[]}>();
  for (const row of rows) {
    const quote = quoteTravel(row, settings);
    if (quote.status !== 'ok') continue;
    const entry = byMunicipality.get(row.municipality) ?? {fees: [], kms: []};
    entry.fees.push(quote.feeCents);
    entry.kms.push(quote.km);
    byMunicipality.set(row.municipality, entry);
  }
  return [...byMunicipality.entries()]
    .map(([municipality, {fees, kms}]) => {
      const sorted = [...fees].sort((a, b) => a - b);
      return {
        municipality,
        minFeeCents: sorted[0],
        maxFeeCents: sorted[sorted.length - 1],
        typicalFeeCents: sorted[Math.floor(sorted.length / 2)],
        minKm: Math.min(...kms)
      };
    })
    .sort((a, b) => a.minKm - b.minKm);
}

/** Municipalities grouped by their typical travel fee, nearest first — for the "service area" block and JSON-LD. */
export function getServiceZones(settings: Settings) {
  const fees = getMunicipalityFees(settings);
  const zones = new Map<number, string[]>();
  for (const f of fees) {
    zones.set(f.typicalFeeCents, [...(zones.get(f.typicalFeeCents) ?? []), f.municipality]);
  }
  return [...zones.entries()].sort((a, b) => a[0] - b[0]).map(([feeCents, municipalities]) => ({feeCents, municipalities}));
}
