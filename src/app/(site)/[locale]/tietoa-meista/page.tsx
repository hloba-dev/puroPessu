import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getContent} from '@/content';
import {getSettings} from '@/lib/data/public';
import {fill, formatEur, shortHour} from '@/lib/format';
import {pageMetadata} from '@/lib/seo';
import {CardGrid, Paragraphs} from '@/components/sections/blocks';
import {CtaBand} from '@/components/sections/CtaBand';
import {PageHero} from '@/components/sections/PageHero';
import {SectionHeader} from '@/components/sections/SectionHeader';
import {GlowButton} from '@/components/ui/GlowButton';

export const revalidate = 300;

export async function generateMetadata({params}: PageProps<'/[locale]/tietoa-meista'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const {about} = await getContent(locale);
  return pageMetadata({locale, href: '/tietoa-meista', title: about.metaTitle, description: about.metaDescription});
}

export default async function AboutPageRoute({params}: PageProps<'/[locale]/tietoa-meista'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const [{about: content}, settings, t] = await Promise.all([getContent(locale), getSettings(), getTranslations('common')]);
  const vars = {
    from: shortHour(settings.openFrom),
    to: shortHour(settings.openTo),
    min: formatEur(settings.minOrderCents, locale)
  };

  return (
    <>
      <PageHero crumbs={[{label: content.h1}]} title={content.h1} intro={content.intro}>
        <GlowButton href="/varaa-aika">{t('book')}</GlowButton>
        <GlowButton href="/yhteystiedot" variant="ghost">
          {t('contactUs')}
        </GlowButton>
      </PageHero>

      <section className="border-y border-hairline bg-surface-2" aria-label={content.h1}>
        <div className="container-x py-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {content.facts.map((fact) => (
              <li key={fact.title}>
                <p className="text-lg font-semibold text-teal-1">{fill(fact.title, vars)}</p>
                <p className="mt-1 text-base text-muted">{fill(fact.text, vars)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="about-story">
        <div className="container-x max-w-4xl">
          <SectionHeader id="about-story" title={content.story.title} />
          <Paragraphs items={content.story.paragraphs} className="mt-6 text-[17px] text-text" />
        </div>
      </section>

      <section className="section bg-surface-2" aria-labelledby="about-values">
        <div className="container-x">
          <SectionHeader id="about-values" title={content.values.title} />
          <div className="mt-10">
            <CardGrid items={content.values.items} columns={4} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="about-method">
        <div className="container-x max-w-4xl">
          <SectionHeader id="about-method" title={content.method.title} />
          <Paragraphs items={content.method.paragraphs} className="mt-6 text-[17px] text-text" />
        </div>
      </section>

      <CtaBand title={content.cta.title} text={content.cta.text} />
    </>
  );
}
