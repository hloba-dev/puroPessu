import type {Locale} from '@/i18n/routing';

export type {Locale};
export type L10n = Record<Locale, string>;
export type Unit = 'item' | 'piece' | 'm2';

export interface Category {
  id: number;
  slug: string;
  name: L10n;
  sort: number;
  isActive: boolean;
}

export interface ServiceOption {
  id: number;
  serviceId: number;
  slug: string;
  name: L10n;
  priceCents: number;
  durationMin: number;
}

export interface Service {
  id: number;
  categoryId: number;
  categorySlug: string;
  slug: string;
  name: L10n;
  description: L10n;
  priceCents: number;
  /** "alk." price: the final amount is agreed on site before the work starts. */
  priceFrom: boolean;
  unit: Unit;
  durationMin: number;
  isSmall: boolean;
  /** Shown in the price list only; in the booking flow it is offered as a per-item option. */
  isAddon: boolean;
  isActive: boolean;
  sort: number;
  options: ServiceOption[];
}

export interface Catalog {
  categories: Category[];
  services: Service[];
}

export interface TravelZone {
  maxKm: number;
  feeCents: number;
}

/** Discounts and bundle offers of the price policy; edited in /admin → Настройки. */
export interface Promotions {
  /** % off the first order of a new customer */
  firstOrderPct: number;
  /** % off for a returning customer (never combined with the first-order discount) */
  repeatOrderPct: number;
  /** extra % when the order has at least `multiItemMin` items; adds to first/repeat */
  multiItemPct: number;
  multiItemMin: number;
  /** sofa + N dining chairs (backrest + seat) = sofa price + this amount */
  bundleChairsCount: number;
  bundleChairsExtraCents: number;
  /** sofa + mattress = sofa price + this amount */
  bundleMattressSingleExtraCents: number;
  bundleMattressDoubleExtraCents: number;
  /** false: the customer gets the better of "bundle" and "percentage"; true: both */
  stackBundlesWithPercent: boolean;
}

export interface Settings {
  companyName: string;
  legalName: string;
  phone: string;
  whatsapp: string;
  email: string;
  yTunnus: string;
  address: {street: string; postalCode: string; city: string};
  social: {facebook: string; instagram: string; googleReviews: string};
  baseLat: number;
  baseLng: number;
  roadFactor: number;
  minOrderCents: number;
  openFrom: string;
  openTo: string;
  slotStep: number;
  travelZones: TravelZone[];
  leadTimeHours: number;
  bufferMin: number;
  bookingHorizonDays: number;
  timezone: string;
  promotions: Promotions;
}

export interface GalleryItem {
  id: string;
  beforeUrl: string;
  afterUrl: string;
  caption: L10n;
  serviceSlug: string;
  sort: number;
  isFeatured: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  locale: Locale;
  source: 'google' | 'site';
  date: string;
}

export interface PostalCode {
  code: string;
  municipality: string;
  lat: number;
  lng: number;
}
