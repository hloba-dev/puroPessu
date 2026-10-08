import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getContent} from '@/content';
import {getMunicipalityFees} from '@/lib/data/areas';
import {getActiveCatalog, getSettings} from '@/lib/data/public';
import {serviceLd} from '@/lib/jsonld';
import {localizedUrl, pageMetadata} from '@/lib/seo';
import {CardGrid, Paragraphs} from '@/components/sections/blocks';
import {CtaBand} from '@/components/sections/CtaBand';
import {Faq} from '@/components/sections/Faq';
import {PageHero} from '@/components/sections/PageHero';
import {SectionHeader} from '@/components/sections/SectionHeader';
import {JsonLd} from '@/components/seo/JsonLd';
import {GlowButton} from '@/components/ui/GlowButton';

export const revalidate = 300;

export async function generateMetadata({params}: PageProps<'/[locale]/hajunpoisto'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const {odor} = await getContent(locale);
  return pageMetadata({locale, href: '/hajunpoisto', title: odor.metaTitle, description: odor.metaDescription});
}

export default async function OdorPageRoute({params}: PageProps<'/[locale]/hajunpoisto'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const [{odor: content}, catalog, settings, t, nav] = await Promise.all([
    getContent(locale),
    getActiveCatalog(),
    getSettings(),
    getTranslations('common'),
    getTranslations('nav')
  ]);

  return (
    <>
      <PageHero
        crumbs={[{label: nav('services'), href: '/palvelut'}, {label: content.breadcrumb}]}
        badge={content.badge}
        title={content.h1}
        intro={content.intro}
      >
        <GlowButton href="/varaa-aika">{t('book')}</GlowButton>
        <GlowButton href="/hinnasto" variant="ghost">
          {t('seePrices')}
        </GlowButton>
      </PageHero>

      <section className="section bg-surface-2" aria-labelledby="odor-sources">
        <div className="container-x">
          <SectionHeader id="odor-sources" title={content.sources.title} lead={content.sources.lead} />
          <div className="mt-10">
            <CardGrid items={content.sources.items} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="odor-method">
        <div className="container-x">
          <SectionHeader id="odor-method" title={content.method.title} lead={content.method.lead} />
          <div className="mt-10">
            <CardGrid items={content.method.steps} columns={content.method.steps.length === 4 ? 4 : 3} numbered />
          </div>
        </div>
      </section>

      <section className="section bg-surface-2" aria-labelledby="odor-honest">
        <div className="container-x grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="paper p-7 sm:p-10">
            <h2 id="odor-honest" className="h2">
              {content.honest.title}
            </h2>
            <Paragraphs items={content.honest.paragraphs} className="mt-5 text-ink-muted" />
          </div>
          <div className="space-y-6">
            <div className="glass p-6">
              <h2 className="h3">{content.included.title}</h2>
              <p className="mt-3 text-[15px] text-[#d3d7dd]">{content.included.text}</p>
            </div>
            <div className="glass p-6">
              <h2 className="h3">{content.insurance.title}</h2>
              <p className="mt-3 text-[15px] text-[#d3d7dd]">{content.insurance.text}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="odor-faq">
        <div className="container-x max-w-4xl">
          <SectionHeader id="odor-faq" title={content.faqTitle} />
          <div className="mt-8">
            <Faq items={content.faq} />
          </div>
        </div>
      </section>

      <CtaBand title={content.cta.title} text={content.cta.text} />

      <JsonLd
        data={serviceLd({
          name: content.breadcrumb,
          description: content.metaDescription,
          url: localizedUrl('/hajunpoisto', locale),
          locale,
          services: catalog.services.filter((s) => s.categorySlug === 'odor'),
          areaServed: getMunicipalityFees(settings).map((m) => m.municipality)
        })}
      />
    </>
  );
}
