import type {Category, GalleryItem, L10n, Review, Service, ServiceOption, Settings} from '@/lib/types';
import type {Tables} from '@/lib/supabase/database.types';
import {seedSettings} from './seed-data';

/** `settings` is a key → jsonb table; these are the keys the app understands. */
const SETTING_KEYS: Record<keyof Settings, string> = {
  companyName: 'company_name',
  legalName: 'legal_name',
  phone: 'phone',
  whatsapp: 'whatsapp',
  email: 'email',
  yTunnus: 'y_tunnus',
  address: 'address',
  social: 'social',
  baseLat: 'base_lat',
  baseLng: 'base_lng',
  roadFactor: 'road_factor',
  minOrderCents: 'min_order_cents',
  openFrom: 'open_from',
  openTo: 'open_to',
  slotStep: 'slot_step',
  travelZones: 'travel_zones',
  leadTimeHours: 'lead_time_hours',
  bufferMin: 'buffer_min',
  bookingHorizonDays: 'booking_horizon_days',
  timezone: 'timezone',
  promotions: 'promotions'
};

export function settingsToRows(settings: Settings) {
  return (Object.keys(SETTING_KEYS) as (keyof Settings)[]).map((prop) => ({
    key: SETTING_KEYS[prop],
    value: settings[prop] as unknown
  }));
}

/** Missing or malformed keys fall back to the seed defaults, so a half-filled table cannot break the site. */
export function settingsFromRows(rows: {key: string; value: unknown}[]): Settings {
  const byKey = new Map(rows.map((r) => [r.key, r.value]));
  const out = {...seedSettings} as Record<keyof Settings, unknown>;
  for (const prop of Object.keys(SETTING_KEYS) as (keyof Settings)[]) {
    const value = byKey.get(SETTING_KEYS[prop]);
    if (value === undefined || value === null) continue;
    if (typeof value !== typeof seedSettings[prop]) continue;
    out[prop] =
      typeof value === 'object' && !Array.isArray(value)
        ? {...(seedSettings[prop] as object), ...(value as object)}
        : value;
  }
  return out as Settings;
}

export const settingKey = (prop: keyof Settings) => SETTING_KEYS[prop];

const l10n = (value: unknown): L10n => {
  const v = (value ?? {}) as Partial<L10n>;
  const fi = v.fi ?? '';
  return {fi, ru: v.ru || fi, en: v.en || fi};
};

export function categoryFromRow(row: Tables<'service_categories'>): Category {
  return {id: row.id, slug: row.slug, name: l10n(row.name), sort: row.sort, isActive: row.is_active};
}

export function optionFromRow(row: Tables<'service_options'>): ServiceOption {
  return {
    id: row.id,
    serviceId: row.service_id,
    slug: row.slug,
    name: l10n(row.name),
    priceCents: row.price_cents,
    durationMin: row.duration_min
  };
}

export function serviceFromRow(
  row: Tables<'services'>,
  categorySlug: string,
  options: ServiceOption[]
): Service {
  return {
    id: row.id,
    categoryId: row.category_id,
    categorySlug,
    slug: row.slug,
    name: l10n(row.name),
    description: l10n(row.description),
    priceCents: row.price_cents,
    priceFrom: row.price_from,
    unit: row.unit,
    durationMin: row.duration_min,
    isSmall: row.is_small,
    isAddon: row.is_addon,
    isActive: row.is_active,
    sort: row.sort,
    options
  };
}

export function galleryFromRow(row: Tables<'gallery_items'>): GalleryItem {
  return {
    id: row.id,
    beforeUrl: row.before_url,
    afterUrl: row.after_url,
    caption: l10n(row.caption),
    serviceSlug: row.service_slug,
    sort: row.sort,
    isFeatured: row.is_featured
  };
}

export function reviewFromRow(row: Tables<'reviews'>): Review {
  return {
    id: row.id,
    author: row.author,
    rating: row.rating,
    text: row.text,
    locale: row.locale as Review['locale'],
    source: row.source,
    date: row.date
  };
}
