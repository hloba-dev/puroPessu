import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale, StaticPathname} from '@/i18n/routing';
import type {ServiceLanding} from '@/content/types';
import {getMunicipalityFees} from '@/lib/data/areas';
import {getActiveCatalog, getGallery, getReviews, getSettings} from '@/lib/data/public';
import {fill, formatEur, l10n, shortHour} from '@/lib/format';
import {serviceLd} from '@/lib/jsonld';
import {localizedUrl} from '@/lib/seo';
import type {Catalog, Settings} from '@/lib/types';
import {BeforeAfter} from '@/components/BeforeAfter';
import {CardGrid, CompareTable, Paragraphs} from '@/components/sections/blocks';
import {CtaBand} from '@/components/sections/CtaBand';
import {Faq} from '@/components/sections/Faq';
import {GalleryGrid} from '@/components/sections/GalleryGrid';
import {PageHero} from '@/components/sections/PageHero';
import {PriceRows} from '@/components/sections/PriceRows';
import {ReviewsBlock} from '@/components/sections/ReviewsBlock';
import {SectionHeader} from '@/components/sections/SectionHeader';
import {ServiceZones} from '@/components/sections/ServiceZones';
import {JsonLd} from '@/components/seo/JsonLd';
import {GlowButton} from '@/components/ui/GlowButton';

export interface LandingConfig {
  href: StaticPathname;
  /** catalog categories whose services are listed and offered on the page */
  categories: string[];
  /** service that gives the "from" price in the title and intro */
  fromSlug: string;
  /** service pre-selected by the page's main booking button */
  bookSlug: string;
}

export function landingVars(catalog: Catalog, settings: Settings, locale: Locale, fromSlug: string) {
  const service = catalog.services.find((s) => s.slug === fromSlug);
  return {
    price: formatEur(service?.priceCents ?? 0, locale),
    min: formatEur(settings.minOrderCents, locale),
    from: shortHour(settings.openFrom),
    to: shortHour(settings.openTo)
  };
}

/** Is at least one of the landing's categories switched on in the catalog? */
export function landingIsActive(catalog: Catalog, config: LandingConfig) {
  return catalog.categories.some((c) => config.categories.includes(c.slug));
}

/** Service landing page: every block of the brief's template, priced from the catalog. */
export async function ServiceLandingView({locale, content, config}: {locale: Locale; content: ServiceLanding; config: LandingConfig}) {
  const [t, nav, catalog, settings, gallery, reviews] = await Promise.all([
    getTranslations('common'),
    getTranslations('nav'),
    getActiveCatalog(),
    getSettings(),
    getGallery(),
    getReviews()
  ]);
  const vars = landingVars(catalog, settings, locale, config.fromSlug);
  const f = (text: string) => fill(text, vars);

  const services = catalog.services.filter((s) => config.categories.includes(s.categorySlug) && !s.isAddon);
  const pairs = gallery.filter((g) => config.categories.includes(g.serviceSlug));
  const [featured, ...rest] = pairs.length > 0 ? pairs : gallery;
  const municipalities = getMunicipalityFees(settings).map((m) => m.municipality);
  // options offered for these services in the booking (protection, leather care …)
  const optionNames = [...new Set(services.flatMap((s) => s.options.filter((o) => o.priceCents > 0).map((o) => l10n(o.name, locale))))];

  return (
    <>
      <PageHero
        crumbs={[{label: nav('services'), href: '/palvelut'}, {label: content.breadcrumb}]}
        badge={f(content.badge)}
        title={content.h1}
        intro={f(content.intro)}
        aside={
          featured && (
            <BeforeAfter
              before={featured.beforeUrl}
              after={featured.afterUrl}
              caption={l10n(featured.caption, locale)}
              sizes="(max-width: 1023px) 92vw, 480px"
              priority
              hint
            />
          )
        }
      >
        <GlowButton href={{pathname: '/varaa-aika', query: {item: config.bookSlug}}}>{t('book')}</GlowButton>
        <GlowButton href="/hinnasto" variant="ghost">
          {t('seePrices')}
        </GlowButton>
      </PageHero>

      {/* prices by size, each row with its own booking deep link */}
      <section className="section bg-surface-2" aria-labelledby="landing-prices">
        <div className="container-x max-w-4xl">
          <SectionHeader id="landing-prices" title={content.prices.title} lead={f(content.prices.lead)} />
          <div className="mt-6">
            <PriceRows services={services} locale={locale} detailed />
          </div>
          {optionNames.length > 0 && <p className="mt-5 text-base text-muted">+ {optionNames.join(' · ')}</p>}
          <p className="mt-3 max-w-[66ch] text-base text-muted">{f(content.prices.note)}</p>
        </div>
      </section>

      {rest.length > 0 && (
        <section className="section" aria-labelledby="landing-gallery">
          <div className="container-x">
            <SectionHeader id="landing-gallery" title={content.gallery.title} lead={content.gallery.lead} />
            <div className="mt-10">
              <GalleryGrid items={rest.slice(0, 6)} locale={locale} columns={3} />
            </div>
          </div>
        </section>
      )}

      {/* honest promise */}
      <section className="section bg-surface-2" aria-labelledby="landing-promise">
        <div className="container-x">
          <div className="paper p-7 sm:p-10">
            <h2 id="landing-promise" className="h2">
              {content.promise.title}
            </h2>
            <Paragraphs items={content.promise.paragraphs} className="mt-5 max-w-[70ch] text-ink-muted" />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="landing-why">
        <div className="container-x">
          <SectionHeader id="landing-why" title={content.why.title} />
          <div className="mt-10">
            <CardGrid items={content.why.items} />
          </div>
        </div>
      </section>

      <section className="section bg-surface-2" aria-labelledby="landing-process">
        <div className="container-x">
          <SectionHeader id="landing-process" title={content.process.title} />
          <div className="mt-10">
            <CardGrid items={content.process.steps} columns={content.process.steps.length === 4 ? 4 : 3} numbered />
          </div>
        </div>
      </section>

      {/* odors + written statement for the insurance company */}
      <section className="section" aria-labelledby="landing-odor">
        <div className="container-x">
          <SectionHeader id="landing-odor" title={content.odor.title} lead={content.odor.lead} />
          <div className="mt-10">
            <CardGrid items={content.odor.cases} columns={4} />
          </div>
          <p className="glass mt-6 max-w-3xl p-5 text-base text-text">{content.odor.insurance}</p>
          <p className="mt-5">
            <Link href="/hajunpoisto" className="link py-2">
              {content.odor.linkLabel}
            </Link>
          </p>
        </div>
      </section>

      <section className="section bg-surface-2" aria-labelledby="landing-materials">
        <div className="container-x">
          <SectionHeader id="landing-materials" title={content.materials.title} lead={content.materials.lead} />
          <div className="mt-10">
            <CardGrid items={content.materials.suitable} columns={4} />
          </div>
          <h3 className="h3 mt-12">{content.materials.exceptionsTitle}</h3>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {content.materials.exceptions.map((item) => (
              <li key={item.title} className="rounded-[20px] border border-warn-border bg-warn-soft p-5">
                <p className="font-semibold text-warn">{item.title}</p>
                <p className="mt-1.5 text-base text-text">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="landing-compare">
        <div className="container-x">
          <SectionHeader id="landing-compare" title={content.compare.title} lead={content.compare.lead} />
          <div className="mt-8">
            <CompareTable headers={content.compare.headers} rows={content.compare.rows} caption={content.compare.title} />
          </div>
          <p className="mt-5">
            <Link href="/vuokrapesuri-vai-ammattilainen" className="link py-2">
              {content.compare.linkLabel}
            </Link>
          </p>
        </div>
      </section>

      <ReviewsBlock reviews={reviews} settings={settings} locale={locale} />

      <section className="section bg-surface-2" aria-labelledby="landing-area">
        <div className="container-x">
          <SectionHeader id="landing-area" title={content.areaTitle} lead={content.areaLead} />
          <div className="mt-10">
            <ServiceZones settings={settings} locale={locale} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="landing-faq">
        <div className="container-x max-w-4xl">
          <SectionHeader id="landing-faq" title={content.faqTitle} />
          <div className="mt-8">
            <Faq items={content.faq.map((item) => ({q: item.q, a: f(item.a)}))} />
          </div>
        </div>
      </section>

      <CtaBand title={content.cta.title} text={f(content.cta.text)} item={config.bookSlug} />

      <JsonLd
        data={serviceLd({
          name: content.breadcrumb,
          description: f(content.metaDescription),
          url: localizedUrl(config.href, locale),
          locale,
          services,
          areaServed: municipalities
        })}
      />
    </>
  );
}
