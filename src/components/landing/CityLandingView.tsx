import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {CITY_MUNICIPALITY, CITY_SLUGS, getContent, isCitySlug} from '@/content';
import type {CitySlug} from '@/content/types';
import {getMunicipalityFees} from '@/lib/data/areas';
import {getActiveCatalog, getGallery, getSettings} from '@/lib/data/public';
import {fill, formatEur} from '@/lib/format';
import {serviceLd} from '@/lib/jsonld';
import {localizedUrl, pageMetadata} from '@/lib/seo';
import type {Settings} from '@/lib/types';
import {Paragraphs} from '@/components/sections/blocks';
import {CtaBand} from '@/components/sections/CtaBand';
import {Faq} from '@/components/sections/Faq';
import {GalleryGrid} from '@/components/sections/GalleryGrid';
import {PageHero} from '@/components/sections/PageHero';
import {PriceRows} from '@/components/sections/PriceRows';
import {SectionHeader} from '@/components/sections/SectionHeader';
import {JsonLd} from '@/components/seo/JsonLd';
import {GlowButton} from '@/components/ui/GlowButton';
import {LANDINGS} from './landing-page';
import {landingVars} from './ServiceLandingView';

export type CityKind = 'sofa' | 'mattress';
type Params = Promise<{locale: string; city: string}>;

const CITY_ROUTE = {sofa: '/sohvan-pesu/[city]', mattress: '/patjan-pesu/[city]'} as const;

export const cityStaticParams = () => CITY_SLUGS.map((city) => ({city}));

async function load(kind: CityKind, locale: Locale, city: CitySlug) {
  const [content, catalog, settings] = await Promise.all([getContent(locale), getActiveCatalog(), getSettings()]);
  const config = LANDINGS[kind];
  const cityContent = content.cities[city];
  const vars = {
    ...landingVars(catalog, settings, locale, config.fromSlug),
    city: cityContent.name,
    inCity: cityContent.inCity
  };
  return {content, catalog, settings, config, cityContent, vars};
}

/** Travel fee sentence for the city, computed from its postal codes and the zones in settings. */
function travelSentence(
  templates: {travelFree: string; travelFee: string; travelRange: string},
  settings: Settings,
  locale: Locale,
  city: CitySlug,
  names: {city: string; inCity: string}
) {
  const fee = getMunicipalityFees(settings).find((m) => m.municipality === CITY_MUNICIPALITY[city]);
  if (!fee || fee.minFeeCents !== fee.maxFeeCents) {
    return fill(templates.travelRange, {
      ...names,
      minFee: formatEur(fee?.minFeeCents ?? 0, locale),
      maxFee: formatEur(fee?.maxFeeCents ?? 0, locale)
    });
  }
  return fee.maxFeeCents === 0
    ? fill(templates.travelFree, names)
    : fill(templates.travelFee, {...names, fee: formatEur(fee.maxFeeCents, locale)});
}

export async function cityMetadata(kind: CityKind, params: Params): Promise<Metadata> {
  const {locale, city} = (await params) as {locale: Locale; city: string};
  if (!isCitySlug(city)) return {};
  const {content, vars} = await load(kind, locale, city);
  const tpl = content.cityTemplates[kind];
  return pageMetadata({
    locale,
    href: {pathname: CITY_ROUTE[kind], params: {city}},
    title: fill(tpl.metaTitle, vars),
    description: fill(tpl.metaDescription, vars)
  });
}

export async function CityLandingPage({kind, params}: {kind: CityKind; params: Params}) {
  const {locale, city} = (await params) as {locale: Locale; city: string};
  if (!isCitySlug(city)) notFound();
  setRequestLocale(locale);

  const [{content, catalog, settings, config, cityContent, vars}, gallery, t, nav] = await Promise.all([
    load(kind, locale, city),
    getGallery(),
    getTranslations('common'),
    getTranslations('nav')
  ]);
  const templates = content.cityTemplates;
  const tpl = templates[kind];
  const parent = content[kind];
  const f = (text: string) => fill(text, vars);

  const services = catalog.services.filter((s) => config.categories.includes(s.categorySlug) && !s.isAddon);
  const pairs = gallery.filter((g) => config.categories.includes(g.serviceSlug)).slice(0, 3);
  const route = CITY_ROUTE[kind];
  const description = f(tpl.metaDescription);

  return (
    <>
      <PageHero
        crumbs={[
          {label: nav('services'), href: '/palvelut'},
          {label: parent.breadcrumb, href: config.href},
          {label: f(tpl.breadcrumb)}
        ]}
        badge={f(templates.badge)}
        title={f(tpl.h1)}
      >
        <GlowButton href={{pathname: '/varaa-aika', query: {item: config.bookSlug}}}>{t('book')}</GlowButton>
        <GlowButton href={config.href} variant="ghost">
          {parent.breadcrumb}
        </GlowButton>
      </PageHero>

      <section className="pb-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <Paragraphs items={cityContent[kind].intro} className="text-[17px] text-text" />
          <aside className="glass h-fit p-6">
            <h2 className="text-lg font-semibold">{f(templates.travelTitle)}</h2>
            <p className="mt-3 text-base text-text">{travelSentence(templates, settings, locale, city, {city: cityContent.name, inCity: cityContent.inCity})}</p>
          </aside>
        </div>
      </section>

      <section className="section bg-surface-2" aria-labelledby="city-prices">
        <div className="container-x max-w-4xl">
          <SectionHeader id="city-prices" title={f(tpl.pricesTitle)} lead={f(parent.prices.lead)} />
          <div className="mt-6">
            <PriceRows services={services} locale={locale} detailed />
          </div>
          <p className="mt-5 max-w-[66ch] text-base text-muted">{f(parent.prices.note)}</p>
        </div>
      </section>

      <section className="section" aria-labelledby="city-districts">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 id="city-districts" className="h3">
              {f(templates.districtsTitle)}
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {cityContent.districts.map((district) => (
                <li key={district} className="rounded-xl border border-hairline bg-text/4 px-3.5 py-1.5 text-base">
                  {district}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="h3">{f(templates.arrivalTitle)}</h2>
              <p className="mt-3 text-text">{cityContent.arrival}</p>
            </div>
            <div>
              <h2 className="h3">{f(templates.homesTitle)}</h2>
              <p className="mt-3 text-text">{cityContent.homes}</p>
            </div>
          </div>
        </div>
      </section>

      {pairs.length > 0 && (
        <section className="section bg-surface-2" aria-labelledby="city-gallery">
          <div className="container-x">
            <SectionHeader id="city-gallery" title={f(templates.galleryTitle)} />
            <div className="mt-10">
              <GalleryGrid items={pairs} locale={locale} columns={3} />
            </div>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="city-faq">
        <div className="container-x max-w-4xl">
          <SectionHeader id="city-faq" title={f(templates.faqTitle)} />
          <div className="mt-8">
            <Faq items={cityContent.faq} />
          </div>
        </div>
      </section>

      {/* cross-links between the city pages */}
      <section className="pb-4" aria-labelledby="city-others">
        <div className="container-x">
          <h2 id="city-others" className="h3">
            {f(templates.otherCitiesTitle)}
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {CITY_SLUGS.filter((slug) => slug !== city).map((slug) => (
              <li key={slug}>
                <Link
                  href={{pathname: route, params: {city: slug}}}
                  className="flex min-h-11 items-center rounded-xl border border-hairline px-4 text-base hover:border-teal-2 hover:text-teal-1"
                >
                  {fill(templates.otherCityLink, {city: content.cities[slug].name})}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={f(templates.cta.title)} text={f(templates.cta.text)} item={config.bookSlug} />

      <JsonLd
        data={serviceLd({
          name: `${parent.breadcrumb} ${cityContent.name}`,
          description,
          url: localizedUrl({pathname: route, params: {city}}, locale),
          locale,
          services,
          areaServed: [CITY_MUNICIPALITY[city]],
          serviceType: parent.breadcrumb
        })}
      />
    </>
  );
}
