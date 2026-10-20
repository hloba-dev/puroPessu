import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getContent} from '@/content';
import {getActiveCatalog, getSettings} from '@/lib/data/public';
import {fill, formatEur, l10n} from '@/lib/format';
import {offerCatalogLd} from '@/lib/jsonld';
import {localizedUrl, pageMetadata} from '@/lib/seo';
import {waLink} from '@/lib/site';
import type {Catalog, Settings} from '@/lib/types';
import {CardGrid} from '@/components/sections/blocks';
import {CtaBand} from '@/components/sections/CtaBand';
import {Faq} from '@/components/sections/Faq';
import {PageHero} from '@/components/sections/PageHero';
import {PriceRows} from '@/components/sections/PriceRows';
import {PromoTables} from '@/components/sections/PromoOffers';
import {SectionHeader} from '@/components/sections/SectionHeader';
import {ServiceZones} from '@/components/sections/ServiceZones';
import {TravelZones} from '@/components/sections/TravelZones';
import {JsonLd} from '@/components/seo/JsonLd';
import {GlowButton} from '@/components/ui/GlowButton';

export const revalidate = 300;

function vars(catalog: Catalog, settings: Settings, locale: Locale) {
  const prices = catalog.services.filter((s) => !s.isAddon && s.categorySlug === 'sofas' && !s.slug.startsWith('ottoman')).map((s) => s.priceCents);
  return {
    price: formatEur(prices.length ? Math.min(...prices) : 0, locale),
    min: formatEur(settings.minOrderCents, locale)
  };
}

export async function generateMetadata({params}: PageProps<'/[locale]/hinnasto'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const [{pricing}, catalog, settings] = await Promise.all([getContent(locale), getActiveCatalog(), getSettings()]);
  const v = vars(catalog, settings, locale);
  return pageMetadata({
    locale,
    href: '/hinnasto',
    title: fill(pricing.metaTitle, v),
    description: fill(pricing.metaDescription, v),
    ownOgImage: true
  });
}

export default async function PricingPageRoute({params}: PageProps<'/[locale]/hinnasto'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const [{pricing: content}, catalog, settings, t, tpromo] = await Promise.all([
    getContent(locale),
    getActiveCatalog(),
    getSettings(),
    getTranslations('common'),
    getTranslations('promo')
  ]);
  const v = vars(catalog, settings, locale);
  const f = (text: string) => fill(text, v);

  const groups = catalog.categories.map((category) => ({
    name: l10n(category.name, locale),
    slug: category.slug,
    services: catalog.services.filter((s) => s.categoryId === category.id)
  }));

  return (
    <>
      <PageHero crumbs={[{label: content.h1}]} title={content.h1} intro={f(content.intro)}>
        <GlowButton href="/varaa-aika">{t('book')}</GlowButton>
      </PageHero>

      {/* the price list itself: straight from the catalog, the same rows the booking form sells */}
      <section className="pb-20">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          {groups.map((group) => (
            <div key={group.slug} className="glass px-6 pt-6 pb-2" id={group.slug}>
              <h2 className="h3">{group.name}</h2>
              <div className="mt-2">
                <PriceRows services={group.services} locale={locale} detailed />
              </div>
            </div>
          ))}
        </div>
        <div className="container-x mt-6">
          <p className="text-base text-muted">
            <a href={waLink(settings.whatsapp)} className="link py-2" rel="noopener" target="_blank">
              {content.photoHint}
            </a>
          </p>
        </div>
      </section>

      <section className="section bg-surface-2" aria-labelledby="pricing-promo">
        <div className="container-x">
          <SectionHeader id="pricing-promo" eyebrow={tpromo('eyebrow')} title={tpromo('title')} lead={tpromo('drying')} />
          <div className="mt-10">
            <PromoTables catalog={catalog} promotions={settings.promotions} locale={locale} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="pricing-rules">
        <div className="container-x">
          <SectionHeader id="pricing-rules" title={content.rules.title} />
          <div className="mt-10">
            <CardGrid items={content.rules.items.map((item) => ({title: f(item.title), text: f(item.text)}))} />
          </div>
        </div>
      </section>

      <section className="section bg-surface-2" aria-labelledby="pricing-travel">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader id="pricing-travel" title={content.travel.title} lead={content.travel.lead} />
            <div className="glass mt-6 p-6">
              <TravelZones settings={settings} locale={locale} />
            </div>
          </div>
          <ServiceZones settings={settings} locale={locale} />
        </div>
      </section>

      <section className="section" aria-labelledby="pricing-faq">
        <div className="container-x max-w-4xl">
          <SectionHeader id="pricing-faq" title={content.faqTitle} />
          <div className="mt-8">
            <Faq items={content.faq.map((item) => ({q: f(item.q), a: f(item.a)}))} />
          </div>
        </div>
      </section>

      <CtaBand title={content.cta.title} text={f(content.cta.text)} />

      <JsonLd data={offerCatalogLd({name: content.h1, url: localizedUrl('/hinnasto', locale), locale, groups})} />
    </>
  );
}
