import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getContent} from '@/content';
import {pageMetadata} from '@/lib/seo';
import {CheckList} from '@/components/sections/blocks';
import {CtaBand} from '@/components/sections/CtaBand';
import {PageHero} from '@/components/sections/PageHero';

export const revalidate = 300;

export async function generateMetadata({params}: PageProps<'/[locale]/hoitotuotteet'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const {careProducts} = await getContent(locale);
  return pageMetadata({locale, href: '/hoitotuotteet', title: careProducts.metaTitle, description: careProducts.metaDescription});
}

export default async function CareProductsPageRoute({params}: PageProps<'/[locale]/hoitotuotteet'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const {careProducts: content} = await getContent(locale);

  return (
    <>
      <PageHero crumbs={[{label: content.h1}]} title={content.h1} intro={content.intro} />

      <section className="pb-20">
        <div className="container-x">
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {content.products.map((product) => (
              <li key={product.title} className="glass flex flex-col p-6">
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="mt-2 flex-1 text-[15px] text-[#d3d7dd]">{product.text}</p>
                <p className="mt-4 border-t border-hairline pt-4 text-[15px] text-muted">{product.use}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[20px] border border-[#ffb86b]/30 bg-[#ffb86b]/[0.06] p-7">
              <h2 className="h3 text-[#ffd9ad]">{content.avoid.title}</h2>
              <CheckList items={content.avoid.items} className="mt-5 text-[#d3d7dd]" />
            </div>
            <p className="glass h-fit p-7 text-[#d3d7dd]">{content.note}</p>
          </div>
        </div>
      </section>

      <CtaBand title={content.cta.title} text={content.cta.text} />
    </>
  );
}
