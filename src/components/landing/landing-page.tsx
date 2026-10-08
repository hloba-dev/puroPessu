import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getContent} from '@/content';
import {getActiveCatalog, getSettings} from '@/lib/data/public';
import {fill} from '@/lib/format';
import {pageMetadata} from '@/lib/seo';
import {ServiceLandingView, landingIsActive, landingVars, type LandingConfig} from './ServiceLandingView';

export type LandingKind = 'sofa' | 'leather' | 'mattress' | 'car' | 'boat';

export const LANDINGS: Record<LandingKind, LandingConfig> = {
  sofa: {href: '/sohvan-pesu', categories: ['sofas'], fromSlug: 'sofa-2', bookSlug: 'sofa-3'},
  leather: {href: '/nahkasohvan-puhdistus', categories: ['leather'], fromSlug: 'leather-sofa-2', bookSlug: 'leather-sofa-3'},
  mattress: {href: '/patjan-pesu', categories: ['beds'], fromSlug: 'bed-single', bookSlug: 'bed-double'},
  // switched off by default: the pages appear once their category is activated in /admin
  car: {href: '/auton-verhoilupesu', categories: ['vehicles'], fromSlug: 'car-seat', bookSlug: 'car-5'},
  boat: {href: '/veneen-tekstiilit', categories: ['boats'], fromSlug: 'boat-textiles', bookSlug: 'boat-textiles'}
};

// landings with an opengraph-image.tsx next to their page
const OG_IMAGE_KINDS: LandingKind[] = ['sofa', 'leather', 'mattress'];

type Params = Promise<{locale: string}>;

export async function landingMetadata(kind: LandingKind, params: Params): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const config = LANDINGS[kind];
  const [content, catalog, settings] = await Promise.all([getContent(locale), getActiveCatalog(), getSettings()]);
  if (!landingIsActive(catalog, config)) return {robots: {index: false, follow: false}};
  const vars = landingVars(catalog, settings, locale, config.fromSlug);
  return pageMetadata({
    locale,
    href: config.href,
    title: fill(content[kind].metaTitle, vars),
    description: fill(content[kind].metaDescription, vars),
    ownOgImage: OG_IMAGE_KINDS.includes(kind)
  });
}

export async function LandingPage({kind, params}: {kind: LandingKind; params: Params}) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const config = LANDINGS[kind];
  const [content, catalog] = await Promise.all([getContent(locale), getActiveCatalog()]);
  if (!landingIsActive(catalog, config)) notFound();
  return <ServiceLandingView locale={locale} content={content[kind]} config={config} />;
}
