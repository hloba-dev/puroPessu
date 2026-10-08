import 'server-only';
import {unstable_cache} from 'next/cache';
import {isSupabaseConfigured} from '@/lib/supabase/env';
import {createPublicClient} from '@/lib/supabase/service';
import type {Catalog, GalleryItem, Review, Settings} from '@/lib/types';
import {
  categoryFromRow,
  galleryFromRow,
  optionFromRow,
  reviewFromRow,
  serviceFromRow,
  settingsFromRows
} from './mappers';
import {seedCategories, seedGallery, seedServices, seedSettings} from './seed-data';

/**
 * Public, cacheable reads. The database is the single source of prices and settings;
 * seed data is used only in demo mode (no Supabase env) or, for display, while the database is
 * unreachable — that fallback is never cached, and bookings are priced with the strict readers.
 * Admin actions call revalidateTag() with the tags below.
 */
export const CACHE_TAGS = {settings: 'settings', catalog: 'catalog', gallery: 'gallery', reviews: 'reviews'} as const;
const REVALIDATE = 300;

interface Reader<T> {
  /** Database value, or seed data in demo mode / while the database is unreachable (never cached). */
  read: () => Promise<T>;
  /** Database value or an error — for code that must not act on stale defaults (pricing a booking). */
  strict: () => Promise<T>;
}

function reader<T>(tag: string, load: () => Promise<T>, fallback: T): Reader<T> {
  if (!isSupabaseConfigured) {
    const demo = async () => fallback;
    return {read: demo, strict: demo};
  }
  // only successful reads end up in the data cache: `load` throws on any database error
  const strict = unstable_cache(load, [tag], {tags: [tag], revalidate: REVALIDATE});
  return {
    strict,
    read: async () => {
      try {
        return await strict();
      } catch (error) {
        console.error(`[data] failed to load ${tag} from Supabase, serving seed data for this request`, error);
        return fallback;
      }
    }
  };
}

const settingsReader = reader<Settings>(
  CACHE_TAGS.settings,
  async () => {
    const {data, error} = await createPublicClient().from('settings').select('key, value');
    if (error) throw error;
    return settingsFromRows(data);
  },
  seedSettings
);
export const getSettings = settingsReader.read;
export const getSettingsStrict = settingsReader.strict;

/** Everything anonymous visitors may read: RLS already hides inactive categories and services. */
const catalogReader = reader<Catalog>(
  CACHE_TAGS.catalog,
  async () => {
    const db = createPublicClient();
    const [categories, services, options] = await Promise.all([
      db.from('service_categories').select('*').order('sort'),
      db.from('services').select('*').order('sort'),
      db.from('service_options').select('*').order('id')
    ]);
    if (categories.error) throw categories.error;
    if (services.error) throw services.error;
    if (options.error) throw options.error;

    const slugById = new Map(categories.data.map((c) => [c.id, c.slug]));
    const allOptions = options.data.map(optionFromRow);
    return {
      categories: categories.data.map(categoryFromRow),
      services: services.data
        .filter((s) => slugById.has(s.category_id))
        .map((s) =>
          serviceFromRow(
            s,
            slugById.get(s.category_id)!,
            allOptions.filter((o) => o.serviceId === s.id)
          )
        )
    };
  },
  {categories: seedCategories, services: seedServices}
);
export const getCatalog = catalogReader.read;

function onlyActive({categories, services}: Catalog): Catalog {
  const active = categories.filter((c) => c.isActive);
  const ids = new Set(active.map((c) => c.id));
  return {categories: active, services: services.filter((s) => s.isActive && ids.has(s.categoryId))};
}

/** Active categories and services only — what visitors can see and book. */
export const getActiveCatalog = async () => onlyActive(await getCatalog());
export const getActiveCatalogStrict = async () => onlyActive(await catalogReader.strict());

export const getGallery = reader<GalleryItem[]>(
  CACHE_TAGS.gallery,
  async () => {
    const {data, error} = await createPublicClient().from('gallery_items').select('*').order('sort');
    if (error) throw error;
    return data.map(galleryFromRow);
  },
  seedGallery
).read;

/** Published reviews only (RLS enforces it too). Empty in demo mode: no invented reviews on the site. */
export const getReviews = reader<Review[]>(
  CACHE_TAGS.reviews,
  async () => {
    const {data, error} = await createPublicClient()
      .from('reviews')
      .select('*')
      .eq('is_published', true)
      .order('date', {ascending: false});
    if (error) throw error;
    return data.map(reviewFromRow);
  },
  []
).read;

export function pickService(catalog: Catalog, slug: string) {
  return catalog.services.find((s) => s.slug === slug);
}
