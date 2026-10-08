import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getContent} from '@/content';
import {getActiveCatalog} from '@/lib/data/public';
import {fill, formatEur} from '@/lib/format';
import {pageMetadata} from '@/lib/seo';
import {QuoteForm} from '@/components/forms/QuoteForm';
import {CardGrid, CheckList, Paragraphs} from '@/components/sections/blocks';
import {Faq} from '@/components/sections/Faq';
import {PageHero} from '@/components/sections/PageHero';
import {PriceRows} from '@/components/sections/PriceRows';
import {SectionHeader} from '@/components/sections/SectionHeader';
import {GlowButton} from '@/components/ui/GlowButton';

export const revalidate = 300;

const FORM_ANCHOR = 'tarjouspyynto';
// business price rows of the catalog (category "business"), plus the sofa sizes they refer to
const PRICE_EXAMPLES = ['b2b-office-chair', 'b2b-dining-chair', 'b2b-lobby-sofa', 'sofa-2', 'sofa-3', 'corner'];
// the worked contract example: 20 office chairs + a lobby sofa, four visits a year
const EXAMPLE = {chairs: 20, times: 4};

export async function generateMetadata({params}: PageProps<'/[locale]/yrityksille'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const {business} = await getContent(locale);
  return pageMetadata({locale, href: '/yrityksille', title: business.metaTitle, description: business.metaDescription, ownOgImage: true});
}

export default async function BusinessPageRoute({params}: PageProps<'/[locale]/yrityksille'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const [{business: content}, catalog, tp] = await Promise.all([getContent(locale), getActiveCatalog(), getTranslations('pages')]);

  const bySlug = new Map(catalog.services.map((s) => [s.slug, s]));
  const examples = PRICE_EXAMPLES.map((slug) => bySlug.get(slug)).filter((s) => s !== undefined);
  const chair = bySlug.get('b2b-office-chair');
  const sofa = bySlug.get('sofa-3');
  const exampleVars =
    chair && sofa
      ? {
          ...EXAMPLE,
          chairPrice: formatEur(chair.priceCents, locale),
          sofaPrice: formatEur(sofa.priceCents, locale),
          total: formatEur(EXAMPLE.chairs * chair.priceCents + sofa.priceCents, locale)
        }
      : null;

  return (
    <>
      <PageHero crumbs={[{label: content.h1}]} badge={content.badge} title={content.h1} intro={content.intro}>
        <GlowButton externalHref={`#${FORM_ANCHOR}`}>{tp('requestQuote')}</GlowButton>
        <GlowButton href="/hinnasto" variant="ghost">
          {tp('priceList')}
        </GlowButton>
      </PageHero>

      <section className="section bg-surface-2" aria-labelledby="b2b-method">
        <div className="container-x max-w-4xl">
          <SectionHeader id="b2b-method" title={content.method.title} />
          <Paragraphs items={content.method.paragraphs} className="mt-6 text-[17px] text-[#d3d7dd]" />
        </div>
      </section>

      <section className="section" aria-label={content.h1}>
        <div className="container-x grid gap-6 md:grid-cols-2">
          {content.segments.map((segment) => (
            <article key={segment.id} id={segment.id} className="glass scroll-mt-28 p-7">
              <h2 className="h3">{segment.title}</h2>
              <p className="mt-3 text-[#d3d7dd]">{segment.text}</p>
              <CheckList items={segment.bullets} className="mt-5 text-[15px] text-[#d3d7dd]" />
            </article>
          ))}
        </div>
      </section>

      <section className="section bg-surface-2" aria-labelledby="b2b-prices">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader id="b2b-prices" title={content.prices.title} lead={content.prices.lead} />
            <div className="mt-6">
              <PriceRows services={examples} locale={locale} bookable={false} />
            </div>
            <p className="mt-5 text-[15px] text-muted">{content.prices.note}</p>
          </div>
          {exampleVars && (
            <aside className="paper h-fit p-7 sm:p-9">
              <h2 className="h3">{content.example.title}</h2>
              <p className="mt-3 text-ink-muted">{fill(content.example.lead, exampleVars)}</p>
              <ul className="mt-5 space-y-2 border-t border-black/10 pt-5">
                {content.example.lines.map((line) => (
                  <li key={line}>{fill(line, exampleVars)}</li>
                ))}
              </ul>
              <p className="mt-4 text-xl font-bold">{fill(content.example.total, exampleVars)}</p>
              <p className="mt-3 text-[15px] text-ink-muted">{content.example.note}</p>
            </aside>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="b2b-terms">
        <div className="container-x">
          <SectionHeader id="b2b-terms" title={content.terms.title} />
          <div className="mt-10">
            <CardGrid items={content.terms.items} columns={4} />
          </div>
        </div>
      </section>

      <section id={FORM_ANCHOR} className="section scroll-mt-24 bg-surface-2" aria-labelledby="b2b-form">
        <div className="container-x max-w-3xl">
          <SectionHeader id="b2b-form" title={content.form.title} lead={content.form.lead} />
          <div className="mt-8">
            <QuoteForm />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="b2b-faq">
        <div className="container-x max-w-4xl">
          <SectionHeader id="b2b-faq" title={content.faqTitle} />
          <div className="mt-8">
            <Faq items={content.faq} />
          </div>
        </div>
      </section>
    </>
  );
}
