import type {PostalCode, Settings, TravelZone} from '@/lib/types';

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export type TravelQuote =
  | {status: 'ok'; km: number; feeCents: number; municipality: string}
  /** Known postal code but beyond the last zone: "contact us". */
  | {status: 'out_of_range'; km: number; municipality: string}
  | {status: 'unknown'};

export function zoneFee(km: number, zones: TravelZone[]): number | null {
  const sorted = [...zones].sort((a, b) => a.maxKm - b.maxKm);
  const zone = sorted.find((z) => km < z.maxKm);
  return zone ? zone.feeCents : null;
}

/** Road distance ≈ straight line × road factor; the fee comes from the first zone the distance fits in. */
export function quoteTravel(
  postal: PostalCode | null,
  settings: Pick<Settings, 'baseLat' | 'baseLng' | 'roadFactor' | 'travelZones'>
): TravelQuote {
  if (!postal) return {status: 'unknown'};
  const km =
    Math.round(haversineKm(settings.baseLat, settings.baseLng, postal.lat, postal.lng) * settings.roadFactor * 10) / 10;
  const feeCents = zoneFee(km, settings.travelZones);
  if (feeCents === null) return {status: 'out_of_range', km, municipality: postal.municipality};
  return {status: 'ok', km, feeCents, municipality: postal.municipality};
}
