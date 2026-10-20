import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getContent} from '@/content';
import {getActiveCatalog} from '@/lib/data/public';
import {fill, formatEur} from '@/lib/format';
import {pageMetadata} from '@/lib/seo';
import {CardGrid, CheckList, CompareTable, Paragraphs} from '@/components/sections/blocks';
import {CtaBand} from '@/components/sections/CtaBand';
import {Faq} from '@/components/sections/Faq';
import {PageHero} from '@/components/sections/PageHero';
import {SectionHeader} from '@/components/sections/SectionHeader';
import {GlowButton} from '@/components/ui/GlowButton';

export const revalidate = 300;

export async function generateMetadata({params}: PageProps<'/[locale]/vuokrapesuri-vai-ammattilainen'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const {compare} = await getContent(locale);
  return pageMetadata({
    locale,
    href: '/vuokrapesuri-vai-ammattilainen',
    title: compare.metaTitle,
    description: compare.metaDescription
  });
}

export default async function ComparePageRoute({params}: PageProps<'/[locale]/vuokrapesuri-vai-ammattilainen'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const [{compare: content}, catalog, t] = await Promise.all([getContent(locale), getActiveCatalog(), getTranslations('common')]);
  // our price for the comparison: the 3-seater from the catalog
  const price = formatEur(catalog.services.find((s) => s.slug === 'sofa-3')?.priceCents ?? 0, locale);
  const f = (text: string) => fill(text, {price});

  return (
    <>
      <PageHero crumbs={[{label: content.h1}]} title={content.h1} intro={content.intro}>
        <GlowButton href="/varaa-aika">{t('book')}</GlowButton>
        <GlowButton href="/hinnasto" variant="ghost">
          {t('seePrices')}
        </GlowButton>
      </PageHero>

      <section className="section bg-surface-2" aria-labelledby="compare-table">
        <div className="container-x">
          <SectionHeader id="compare-table" title={content.table.title} />
          <div className="mt-8">
            <CompareTable headers={content.table.headers} rows={content.table.rows} caption={content.table.title} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="compare-cost">
        <div className="container-x max-w-4xl">
          <SectionHeader id="compare-cost" title={content.cost.title} />
          <Paragraphs items={content.cost.paragraphs.map(f)} className="mt-6 text-[17px] text-text" />
        </div>
      </section>

      <section className="section bg-surface-2" aria-labelledby="compare-mistakes">
        <div className="container-x">
          <SectionHeader id="compare-mistakes" title={content.mistakes.title} />
          <div className="mt-10">
            <CardGrid items={content.mistakes.items} />
          </div>
        </div>
      </section>

      <section className="section" aria-label={content.h1}>
        <div className="container-x grid gap-6 md:grid-cols-2">
          <div className="glass p-7">
            <h2 className="h3">{content.whenRental.title}</h2>
            <CheckList items={content.whenRental.items} className="mt-5 text-text" />
          </div>
          <div className="glass border-teal-2 p-7">
            <h2 className="h3 text-teal-1">{content.whenPro.title}</h2>
            <CheckList items={content.whenPro.items} className="mt-5 text-text" />
          </div>
        </div>
      </section>

      <section className="section bg-surface-2" aria-labelledby="compare-faq">
        <div className="container-x max-w-4xl">
          <SectionHeader id="compare-faq" title={content.faqTitle} />
          <div className="mt-8">
            <Faq items={content.faq.map((item) => ({q: item.q, a: f(item.a)}))} />
          </div>
        </div>
      </section>

      <CtaBand title={content.cta.title} text={content.cta.text} item="sofa-3" />
    </>
  );
}
