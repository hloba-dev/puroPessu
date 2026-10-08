import type {MetadataRoute} from 'next';
import {defaultLocale, locales} from '@/i18n/routing';
import {CITY_SLUGS} from '@/content';
import {articles} from '@/content/articles';
import {LANDINGS} from '@/components/landing/landing-page';
import {landingIsActive} from '@/components/landing/ServiceLandingView';
import {getActiveCatalog} from '@/lib/data/public';
import {localizedUrl, type LocalizedHref} from '@/lib/seo';

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

/** One sitemap entry per language version, each listing all its alternates (hreflang). */
function localized(href: LocalizedHref, options: Pick<Entry, 'lastModified' | 'changeFrequency' | 'priority'>): Entry[] {
  const languages = Object.fromEntries([
    ...locales.map((locale) => [locale, localizedUrl(href, locale)]),
    ['x-default', localizedUrl(href, defaultLocale)]
  ]);
  return locales.map((locale) => ({url: localizedUrl(href, locale), alternates: {languages}, ...options}));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getActiveCatalog();
  const now = new Date();
  const page = (href: LocalizedHref, priority: number, changeFrequency: Entry['changeFrequency'] = 'monthly') =>
    localized(href, {lastModified: now, changeFrequency, priority});

  return [
    ...page('/', 1, 'weekly'),
    ...page('/varaa-aika', 0.9, 'weekly'),
    ...page('/hinnasto', 0.9, 'weekly'),
    ...page('/palvelut', 0.8),
    // service landings — car and boat only while their category is switched on
    ...Object.values(LANDINGS)
      .filter((config) => landingIsActive(catalog, config))
      .flatMap((config) => page(config.href, 0.9, 'weekly')),
    ...page('/hajunpoisto', 0.8),
    ...page('/yrityksille', 0.8),
    ...page('/lahjakortti', 0.6),
    ...page('/vuokrapesuri-vai-ammattilainen', 0.6),
    ...page('/hoitotuotteet', 0.4),
    ...page('/tietoa-meista', 0.5),
    ...page('/yhteystiedot', 0.7),
    ...page('/tietosuoja', 0.2, 'yearly'),
    ...page('/tietojen-poisto', 0.2, 'yearly'),
    ...CITY_SLUGS.flatMap((city) => [
      ...page({pathname: '/sohvan-pesu/[city]', params: {city}}, 0.7),
      ...page({pathname: '/patjan-pesu/[city]', params: {city}}, 0.6)
    ]),
    ...page('/vinkit', 0.6, 'weekly'),
    ...articles.flatMap((article) =>
      localized(
        Object.fromEntries(
          locales.map((locale) => [locale, {pathname: '/vinkit/[slug]', params: {slug: article.slugs[locale]}}])
        ) as LocalizedHref,
        {lastModified: new Date(article.updated ?? article.published), changeFrequency: 'yearly', priority: 0.5}
      )
    )
  ];
}
