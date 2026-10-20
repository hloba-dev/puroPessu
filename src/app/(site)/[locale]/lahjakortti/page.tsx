import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getContent} from '@/content';
import {getActiveCatalog} from '@/lib/data/public';
import {GIFT_VALID_MONTHS} from '@/lib/forms/schema';
import {fill, formatEur, l10n} from '@/lib/format';
import {pageMetadata} from '@/lib/seo';
import {GiftCardForm} from '@/components/forms/GiftCardForm';
import {CardGrid, CheckList} from '@/components/sections/blocks';
import {Faq} from '@/components/sections/Faq';
import {PageHero} from '@/components/sections/PageHero';
import {SectionHeader} from '@/components/sections/SectionHeader';
import {GlowButton} from '@/components/ui/GlowButton';

export const revalidate = 300;

const FORM_ANCHOR = 'tilaa';
// services offered as ready-made gift cards; their prices are read from the catalog
const GIFT_SERVICES = ['armchair', 'sofa-2', 'sofa-3', 'corner', 'bed-double'];

export async function generateMetadata({params}: PageProps<'/[locale]/lahjakortti'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const {giftCard} = await getContent(locale);
  return pageMetadata({locale, href: '/lahjakortti', title: giftCard.metaTitle, description: giftCard.metaDescription});
}

export default async function GiftCardPageRoute({params}: PageProps<'/[locale]/lahjakortti'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const [{giftCard: content}, catalog] = await Promise.all([getContent(locale), getActiveCatalog()]);

  const options = GIFT_SERVICES.map((slug) => catalog.services.find((s) => s.slug === slug))
    .filter((s) => s !== undefined)
    .map((s) => ({value: s.slug, name: l10n(s.name, locale), price: formatEur(s.priceCents, locale)}));

  return (
    <>
      <PageHero crumbs={[{label: content.h1}]} title={content.h1} intro={content.intro}>
        <GlowButton externalHref={`#${FORM_ANCHOR}`}>{content.form.title}</GlowButton>
      </PageHero>

      <section className="section bg-surface-2" aria-labelledby="gift-how">
        <div className="container-x">
          <SectionHeader id="gift-how" title={content.how.title} />
          <div className="mt-10">
            <CardGrid items={content.how.steps} columns={4} numbered />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="gift-options">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader id="gift-options" title={content.options.title} lead={content.options.lead} />
            <ul className="mt-6 divide-y divide-hairline">
              {options.map((option) => (
                <li key={option.value} className="flex justify-between gap-4 py-3.5">
                  <span className="font-medium">{option.name}</span>
                  <span className="font-semibold text-teal-1">{option.price}</span>
                </li>
              ))}
              <li className="py-3.5 font-medium">{content.options.custom}</li>
            </ul>
          </div>
          <div className="glass h-fit p-7">
            <h2 className="h3">{content.terms.title}</h2>
            <CheckList
              items={content.terms.items.map((item) => fill(item, {months: GIFT_VALID_MONTHS}))}
              className="mt-5 text-base text-text"
            />
          </div>
        </div>
      </section>

      <section id={FORM_ANCHOR} className="section scroll-mt-24 bg-surface-2" aria-labelledby="gift-form">
        <div className="container-x max-w-3xl">
          <SectionHeader id="gift-form" title={content.form.title} lead={content.form.lead} />
          <div className="mt-8">
            <GiftCardForm
              options={options.map((o) => ({value: o.value, label: `${o.name} — ${o.price}`}))}
              customLabel={content.options.custom}
            />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="gift-faq">
        <div className="container-x max-w-4xl">
          <SectionHeader id="gift-faq" title={content.faqTitle} />
          <div className="mt-8">
            <Faq items={content.faq.map((item) => ({q: item.q, a: fill(item.a, {months: GIFT_VALID_MONTHS})}))} />
          </div>
        </div>
      </section>
    </>
  );
}
