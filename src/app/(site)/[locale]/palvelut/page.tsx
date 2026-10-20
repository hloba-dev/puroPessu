import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale, StaticPathname} from '@/i18n/routing';
import {getContent} from '@/content';
import type {ServicesPage} from '@/content/types';
import {getActiveCatalog} from '@/lib/data/public';
import {pageMetadata} from '@/lib/seo';
import {CardGrid, CheckList} from '@/components/sections/blocks';
import {CtaBand} from '@/components/sections/CtaBand';
import {Faq} from '@/components/sections/Faq';
import {PageHero} from '@/components/sections/PageHero';
import {PriceRows} from '@/components/sections/PriceRows';
import {SectionHeader} from '@/components/sections/SectionHeader';
import {GlowButton} from '@/components/ui/GlowButton';

export const revalidate = 300;

type SectionKey = keyof ServicesPage['sections'];

// category slug → anchor on this page and (where one exists) the service's own landing page
const SECTIONS: Record<SectionKey, {anchor: string; href?: StaticPathname}> = {
  sofas: {anchor: 'sohvat', href: '/sohvan-pesu'},
  leather: {anchor: 'nahkakalusteet', href: '/nahkasohvan-puhdistus'},
  chairs: {anchor: 'tuolit'},
  beds: {anchor: 'patjat', href: '/patjan-pesu'},
  odor: {anchor: 'hajunpoisto', href: '/hajunpoisto'},
  vehicles: {anchor: 'ajoneuvot', href: '/auton-verhoilupesu'},
  boats: {anchor: 'veneet', href: '/veneen-tekstiilit'},
  other: {anchor: 'muut-tekstiilit'}
};

export async function generateMetadata({params}: PageProps<'/[locale]/palvelut'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const {services} = await getContent(locale);
  return pageMetadata({locale, href: '/palvelut', title: services.metaTitle, description: services.metaDescription});
}

export default async function ServicesPageRoute({params}: PageProps<'/[locale]/palvelut'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const [{services: content}, catalog, t] = await Promise.all([getContent(locale), getActiveCatalog(), getTranslations('common')]);

  return (
    <>
      <PageHero crumbs={[{label: content.h1}]} title={content.h1} intro={content.intro}>
        <GlowButton href="/varaa-aika">{t('book')}</GlowButton>
        <GlowButton href="/hinnasto" variant="ghost">
          {t('seePrices')}
        </GlowButton>
      </PageHero>

      {catalog.categories.map((category, index) => {
        const key = category.slug as SectionKey;
        const section = content.sections[key];
        if (!section) return null;
        const rows = catalog.services.filter((s) => s.categoryId === category.id);
        const {anchor, href} = SECTIONS[key];
        return (
          <section
            key={category.slug}
            id={anchor}
            className={`section scroll-mt-24 ${index % 2 === 0 ? 'bg-surface-2' : ''}`}
            aria-labelledby={`${anchor}-title`}
          >
            <div className="container-x grid gap-10 lg:grid-cols-2">
              <div>
                <h2 id={`${anchor}-title`} className="h2">
                  {section.title}
                </h2>
                <p className="lead mt-4">{section.text}</p>
                <CheckList items={section.bullets} className="mt-6 text-text" />
                {href && (
                  <p className="mt-6">
                    <Link href={href} className="link">
                      {content.moreLabel}: {section.title}
                    </Link>
                  </p>
                )}
              </div>
              <div className="glass h-fit px-6 py-2">
                <PriceRows services={rows} locale={locale} />
              </div>
            </div>
          </section>
        );
      })}

      <section className="section" aria-labelledby="services-process">
        <div className="container-x">
          <SectionHeader id="services-process" title={content.process.title} />
          <div className="mt-10">
            <CardGrid items={content.process.steps} columns={4} numbered />
          </div>
        </div>
      </section>

      <section className="section bg-surface-2" aria-labelledby="services-faq">
        <div className="container-x max-w-4xl">
          <SectionHeader id="services-faq" title={content.faqTitle} />
          <div className="mt-8">
            <Faq items={content.faq} />
          </div>
        </div>
      </section>

      <CtaBand title={content.cta.title} text={content.cta.text} />
    </>
  );
}
