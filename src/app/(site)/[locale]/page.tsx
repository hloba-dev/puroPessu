import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale, StaticPathname} from '@/i18n/routing';
import {getActiveCatalog, getGallery, getReviews, getSettings} from '@/lib/data/public';
import {getMunicipalityFees} from '@/lib/data/areas';
import {fill, formatEur, shortHour} from '@/lib/format';
import {localBusinessLd} from '@/lib/jsonld';
import {localizedUrl, pageMetadata} from '@/lib/seo';
import type {Catalog} from '@/lib/types';
import {Hero} from '@/components/home/Hero';
import {CtaBand} from '@/components/sections/CtaBand';
import {Faq, type FaqItem} from '@/components/sections/Faq';
import {GalleryGrid} from '@/components/sections/GalleryGrid';
import {PriceRows, priceLabel} from '@/components/sections/PriceRows';
import {PromoOffers} from '@/components/sections/PromoOffers';
import {ReviewsBlock} from '@/components/sections/ReviewsBlock';
import {SectionHeader} from '@/components/sections/SectionHeader';
import {SnapCarousel} from '@/components/ui/SnapCarousel';
import {ServiceZones} from '@/components/sections/ServiceZones';
import {TravelZones} from '@/components/sections/TravelZones';
import {JsonLd} from '@/components/seo/JsonLd';
import {GlowButton} from '@/components/ui/GlowButton';
import {
  IconArrow,
  IconCalendar,
  IconCheck,
  IconClock,
  IconHome,
  IconLeaf,
  IconShield,
  IconSparkle,
  IconSteam,
  IconWind
} from '@/components/ui/icons';

export const revalidate = 300;

type TitleText = {title: string; text: string};

/** Cheapest bookable price in the catalog — the "alk." figure in titles and the hero. */
function fromPrice(catalog: Catalog) {
  const prices = catalog.services
    .filter((s) => !s.isAddon && s.unit === 'item' && s.categorySlug === 'sofas' && s.slug !== 'ottoman-s' && s.slug !== 'ottoman-l')
    .map((s) => s.priceCents);
  return prices.length ? Math.min(...prices) : 0;
}

export async function generateMetadata({params}: PageProps<'/[locale]'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const [t, catalog, settings] = await Promise.all([
    getTranslations({locale, namespace: 'home'}),
    getActiveCatalog(),
    getSettings()
  ]);
  // price and opening hours in the title come from the database, like everywhere else
  const vars = {
    price: formatEur(fromPrice(catalog), locale),
    from: shortHour(settings.openFrom),
    to: shortHour(settings.openTo)
  };
  return pageMetadata({
    locale,
    href: '/',
    title: t('metaTitle', vars),
    description: t('metaDescription', vars),
    absoluteTitle: true,
    ownOgImage: true
  });
}

// service cards: [message key, landing page, service slug that gives the "from" price]
const SERVICE_CARDS: {key: string; href: StaticPathname; hash?: string; priceSlug: string; category: string}[] = [
  {key: 'sofas', href: '/sohvan-pesu', priceSlug: 'sofa-2', category: 'sofas'},
  {key: 'armchairs', href: '/sohvan-pesu', priceSlug: 'ottoman-s', category: 'sofas'},
  {key: 'leather', href: '/nahkasohvan-puhdistus', priceSlug: 'leather-armchair', category: 'leather'},
  {key: 'beds', href: '/patjan-pesu', priceSlug: 'bed-single', category: 'beds'},
  {key: 'chairs', href: '/palvelut', hash: 'tuolit', priceSlug: 'chair-seat', category: 'chairs'},
  {key: 'odor', href: '/hajunpoisto', priceSlug: 'odor-removal', category: 'odor'},
  {key: 'vehicles', href: '/auton-verhoilupesu', priceSlug: 'car-seat', category: 'vehicles'}
];
const MINI_PRICE_SLUGS = ['armchair', 'sofa-2', 'sofa-3', 'corner', 'bed-double', 'chair-full'];
const BENEFIT_ICONS = [IconClock, IconHome, IconWind, IconShield];
const WHY_ICONS = [IconWind, IconSteam, IconLeaf, IconSparkle, IconCheck, IconShield];

export default async function HomePage({params}: PageProps<'/[locale]'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);

  const [t, tp, tm, tc, catalog, settings, gallery, reviews] = await Promise.all([
    getTranslations('home'),
    getTranslations('prices'),
    getTranslations('meta'),
    getTranslations('common'),
    getActiveCatalog(),
    getSettings(),
    getGallery(),
    getReviews()
  ]);

  const hours = {from: shortHour(settings.openFrom), to: shortHour(settings.openTo)};
  const priceFrom = fromPrice(catalog);
  const bySlug = new Map(catalog.services.map((s) => [s.slug, s]));
  const activeCategories = new Set(catalog.categories.map((c) => c.slug));
  const cards = SERVICE_CARDS.filter((c) => activeCategories.has(c.category) && bySlug.has(c.priceSlug));
  const miniPrices = MINI_PRICE_SLUGS.map((slug) => bySlug.get(slug)).filter((s) => s !== undefined);
  const bookable = catalog.services.filter((s) => !s.isAddon && s.priceCents > 0);
  const municipalities = getMunicipalityFees(settings).map((m) => m.municipality);

  const benefits = t.raw('benefits.items') as TitleText[];
  const steps = t.raw('steps.items') as TitleText[];
  const why = t.raw('why.items') as TitleText[];
  const faq = t.raw('faq.items') as FaqItem[];
  const b2bPoints = t.raw('b2b.points') as string[];

  return (
    <>
      <Hero locale={locale} catalog={catalog} settings={settings} gallery={gallery} fromPriceCents={priceFrom} />

      {/* advantages */}
      <section className="border-y border-hairline bg-surface-2" aria-labelledby="benefits-title">
        <div className="container-x py-12">
          <h2 id="benefits-title" className="sr-only">
            {t('benefits.title')}
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item, index) => {
              const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length];
              return (
                <li key={item.title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-soft text-teal-1">
                    <Icon width={22} height={22} />
                  </span>
                  <div>
                    <h3 className="font-semibold">{fill(item.title, hours)}</h3>
                    <p className="mt-1 text-base text-muted">{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* services */}
      <section className="section" aria-labelledby="services-title">
        <div className="container-x">
          <SectionHeader id="services-title" eyebrow={t('services.eyebrow')} title={t('services.title')} lead={t('services.lead')} />
          {/* phones: a two-column price grid to scan in one screen; wider: full cards with a description */}
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-3">
            {cards.map((card) => (
              <li key={card.key}>
                <Link
                  href={card.hash ? {pathname: card.href, hash: card.hash} : card.href}
                  className="glass group flex h-full flex-col p-4 transition-colors hover:border-teal-2 sm:p-6"
                >
                  <h3 className="text-[17px] leading-tight font-semibold sm:text-[21px]">{t(`services.cards.${card.key}.title`)}</h3>
                  <p className="mt-2 hidden flex-1 text-base text-muted sm:block">{t(`services.cards.${card.key}.text`)}</p>
                  <p className="mt-3 flex items-center justify-between sm:mt-5">
                    <span className="text-base font-semibold text-teal-1 sm:text-lg">
                      {bySlug.get(card.priceSlug)!.priceCents === 0
                        ? tp('included')
                        : `${tp('from')} ${priceLabel({...bySlug.get(card.priceSlug)!, priceFrom: false}, locale, tp)}`}
                    </span>
                    <IconArrow className="hidden text-muted transition-transform group-hover:translate-x-1 group-hover:text-teal-1 sm:block" />
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 sm:mt-8">
            <Link href="/palvelut" className="link inline-flex min-h-11 items-center">
              {t('services.all')}
            </Link>
          </p>
        </div>
      </section>

      {/* bundle offers and discounts */}
      <PromoOffers catalog={catalog} promotions={settings.promotions} locale={locale} />

      {/* how it works */}
      <section className="section bg-surface-2" aria-labelledby="steps-title">
        <div className="container-x">
          <SectionHeader id="steps-title" eyebrow={t('steps.eyebrow')} title={t('steps.title')} />
          {/* phones: the four steps are swiped through one by one instead of stacking four screens high */}
          <SnapCarousel
            as="ol"
            name="steps"
            count={steps.length}
            align="center"
            label={tc('carousel.steps')}
            dotLabels={steps.map((step) => step.title)}
            prevLabel={tc('carousel.prev')}
            nextLabel={tc('carousel.next')}
            className="mt-8 sm:mt-10"
            navClassName="min-[701px]:hidden"
            trackClassName="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-1 min-[701px]:mx-0 min-[701px]:grid min-[701px]:grid-cols-2 min-[701px]:gap-5 min-[701px]:overflow-visible min-[701px]:px-0 min-[701px]:py-0 lg:grid-cols-4"
          >
            {steps.map((step, index) => (
              <li key={step.title} className="glass w-[82%] shrink-0 snap-center p-5 min-[701px]:w-auto min-[701px]:p-6">
                <span className="font-serif text-4xl font-semibold text-accent" aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-base text-muted">{step.text}</p>
              </li>
            ))}
          </SnapCarousel>
        </div>
      </section>

      {/* why us */}
      <section className="section" aria-labelledby="why-title">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader id="why-title" eyebrow={t('why.eyebrow')} title={t('why.title')} lead={t('why.lead')} />
          <ul className="space-y-3 sm:space-y-4">
            {why.map((item, index) => {
              const Icon = WHY_ICONS[index % WHY_ICONS.length];
              return (
                <li key={item.title} className="glass flex gap-4 p-4 sm:p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-soft text-teal-1">
                    <Icon width={22} height={22} />
                  </span>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-base text-muted">{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* before / after gallery */}
      <section className="section bg-surface-2" aria-labelledby="gallery-title">
        <div className="container-x">
          <SectionHeader id="gallery-title" eyebrow={t('gallery.eyebrow')} title={t('gallery.title')} lead={t('gallery.lead')} />
          <div className="mt-10">
            <GalleryGrid items={gallery.filter((g) => g.isFeatured).slice(0, 8)} locale={locale} />
          </div>
        </div>
      </section>

      {/* short price list */}
      <section className="section" aria-labelledby="pricing-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <SectionHeader id="pricing-title" eyebrow={t('pricing.eyebrow')} title={t('pricing.title')} lead={t('pricing.lead')} />
            <div className="mt-6">
              <PriceRows services={miniPrices} locale={locale} />
            </div>
            <p className="mt-6 max-w-[62ch] text-base text-muted">
              {t('pricing.minOrder', {min: formatEur(settings.minOrderCents, locale)})}
            </p>
            <div className="mt-6">
              <GlowButton href="/hinnasto" variant="ghost" size="sm">
                {t('pricing.full')}
              </GlowButton>
            </div>
          </div>
          <aside className="glass h-fit p-6">
            <h3 className="text-lg font-semibold">{t('pricing.travelTitle')}</h3>
            <div className="mt-4">
              <TravelZones settings={settings} locale={locale} />
            </div>
          </aside>
        </div>
      </section>

      {/* business */}
      <section className="section bg-surface-2" aria-labelledby="b2b-title">
        <div className="container-x">
          <div className="paper grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-teal-3">{t('b2b.eyebrow')}</p>
              <h2 id="b2b-title" className="h2 mt-3">
                {t('b2b.title')}
              </h2>
              <p className="mt-4 max-w-[58ch] text-ink-muted">{t('b2b.text')}</p>
            </div>
            <div>
              <ul className="space-y-3">
                {b2bPoints.map((point) => (
                  <li key={point} className="flex items-center gap-3 font-medium">
                    <IconCheck className="text-teal-3" /> {point}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <GlowButton href="/yrityksille">
                  <IconCalendar /> {t('b2b.cta')}
                </GlowButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReviewsBlock reviews={reviews} settings={settings} locale={locale} />

      {/* service area */}
      <section className="section" aria-labelledby="area-title">
        <div className="container-x">
          <SectionHeader id="area-title" eyebrow={t('area.eyebrow')} title={t('area.title')} lead={t('area.lead')} />
          <div className="mt-10">
            <ServiceZones settings={settings} locale={locale} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-surface-2" aria-labelledby="faq-title">
        <div className="container-x max-w-4xl">
          <SectionHeader id="faq-title" eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
          <div className="mt-8">
            <Faq items={faq} />
          </div>
          <p className="mt-6">
            <Link href={{pathname: '/yhteystiedot', hash: 'faq'}} className="link inline-flex min-h-11 items-center">
              {t('faq.all')}
            </Link>
          </p>
        </div>
      </section>

      <CtaBand title={t('cta.title')} text={t('cta.text')} />

      <JsonLd
        data={localBusinessLd({
          settings,
          locale,
          url: localizedUrl('/', locale),
          description: tm('defaultDescription'),
          areaServed: municipalities,
          reviews,
          priceFromCents: Math.min(...bookable.map((s) => s.priceCents)),
          priceToCents: Math.max(...bookable.map((s) => s.priceCents))
        })}
      />
    </>
  );
}
