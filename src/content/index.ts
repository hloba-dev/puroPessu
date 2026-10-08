import type {Locale} from '@/i18n/routing';
import type {CitySlug, SiteContent} from './types';

const loaders: Record<Locale, () => Promise<{default: SiteContent}>> = {
  fi: () => import('./fi'),
  ru: () => import('./ru'),
  en: () => import('./en')
};

/** Long-form page copy for one locale (see src/content/types.ts). */
export async function getContent(locale: Locale): Promise<SiteContent> {
  return (await loaders[locale]()).default;
}

/** City landing pages: URL slug → municipality name as it appears in the postal code data. */
export const CITY_MUNICIPALITY: Record<CitySlug, string> = {
  helsinki: 'Helsinki',
  espoo: 'Espoo',
  vantaa: 'Vantaa',
  kauniainen: 'Kauniainen',
  kerava: 'Kerava',
  jarvenpaa: 'Järvenpää',
  tuusula: 'Tuusula',
  sipoo: 'Sipoo',
  kirkkonummi: 'Kirkkonummi',
  nurmijarvi: 'Nurmijärvi',
  porvoo: 'Porvoo',
  hyvinkaa: 'Hyvinkää'
};

export const CITY_SLUGS = Object.keys(CITY_MUNICIPALITY) as CitySlug[];

export const isCitySlug = (value: string): value is CitySlug => value in CITY_MUNICIPALITY;
