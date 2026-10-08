import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {ImageResponse} from 'next/og';
import {hasLocale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {routing, type Locale} from '@/i18n/routing';
import {getContent} from '@/content';
import type {LandingKind} from '@/components/landing/landing-page';
import {LANDINGS} from '@/components/landing/landing-page';
import {landingVars} from '@/components/landing/ServiceLandingView';
import {getActiveCatalog, getSettings} from '@/lib/data/public';
import {formatEur, shortHour} from '@/lib/format';

export const ogSize = {width: 1200, height: 630};
export const ogContentType = 'image/png';

/** Open Graph card: dark background, logo, page title and the "from" price read from the catalog. */
export async function renderOg({title, price, footer}: {title: string; price?: string; footer: string}) {
  const logo = await readFile(path.join(process.cwd(), 'public/brand/logo-512.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          color: '#ffffff',
          background: 'linear-gradient(180deg, #020204 0%, #03101c 62%, #063a52 100%)'
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> */}
          <img src={logoSrc} width={96} height={96} alt="" />
          <div style={{fontSize: 44, fontWeight: 700}}>Puro</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
          <div style={{fontSize: title.length > 44 ? 58 : 72, fontWeight: 900, lineHeight: 1.08, letterSpacing: -1}}>{title}</div>
          {price && <div style={{fontSize: 46, fontWeight: 700, color: '#9ad9ec'}}>{price}</div>}
        </div>
        <div style={{fontSize: 28, color: '#a9aeb5'}}>{footer}</div>
      </div>
    ),
    ogSize
  );
}

type OgParams = {params: Promise<{locale: string}>};

async function context(params: OgParams['params']) {
  const {locale: raw} = await params;
  const locale: Locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const [content, catalog, settings, t, tp] = await Promise.all([
    getContent(locale),
    getActiveCatalog(),
    getSettings(),
    getTranslations({locale, namespace: 'home.hero'}),
    getTranslations({locale, namespace: 'prices'})
  ]);
  const footer = `${t('badge', {from: shortHour(settings.openFrom), to: shortHour(settings.openTo)})} · puropesu.fi`;
  return {locale, content, catalog, settings, footer, from: tp('from')};
}

/** OG image of a service landing: its H1 and "alk. {price}". */
export async function landingOg(kind: LandingKind, {params}: OgParams) {
  const {locale, content, catalog, settings, footer, from} = await context(params);
  const {price} = landingVars(catalog, settings, locale, LANDINGS[kind].fromSlug);
  return renderOg({title: content[kind].h1, price: `${from} ${price}`, footer});
}

/** OG image for pages with a plain title and the site-wide "from" price. */
export async function pageOg(pick: 'home' | 'pricing' | 'business' | 'booking', {params}: OgParams) {
  const {locale, content, catalog, footer, from} = await context(params);
  const cheapest = catalog.services.find((s) => s.slug === 'armchair')?.priceCents;
  const price = cheapest ? `${from} ${formatEur(cheapest, locale)}` : undefined;
  if (pick === 'home') {
    const t = await getTranslations({locale, namespace: 'home.hero'});
    return renderOg({title: `${t('h1Line1')} ${t('h1Line2')}`, price, footer});
  }
  if (pick === 'booking') {
    const t = await getTranslations({locale, namespace: 'booking'});
    return renderOg({title: t('metaTitle'), price, footer});
  }
  const title = pick === 'pricing' ? content.pricing.h1 : content.business.h1;
  return renderOg({title, price: pick === 'pricing' ? price : undefined, footer});
}
