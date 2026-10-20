import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getContent} from '@/content';
import {pageMetadata} from '@/lib/seo';
import {DeletionForm} from '@/components/forms/DeletionForm';
import {Paragraphs} from '@/components/sections/blocks';
import {PageHero} from '@/components/sections/PageHero';
import {SectionHeader} from '@/components/sections/SectionHeader';

export const revalidate = 300;

export async function generateMetadata({params}: PageProps<'/[locale]/tietojen-poisto'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const {deletion} = await getContent(locale);
  return pageMetadata({locale, href: '/tietojen-poisto', title: deletion.metaTitle, description: deletion.metaDescription});
}

export default async function DeletionPageRoute({params}: PageProps<'/[locale]/tietojen-poisto'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const {deletion: content} = await getContent(locale);

  return (
    <>
      <PageHero crumbs={[{label: content.h1}]} title={content.h1} intro={content.intro} />

      <section className="pb-20">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <Paragraphs items={content.paragraphs} className="text-[17px] text-text" />
            <h2 className="h3 mt-10">{content.steps.title}</h2>
            <ol className="mt-5 space-y-3">
              {content.steps.items.map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-text/8 text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-text">{item}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeader title={content.form.title} lead={content.form.lead} />
            <div className="mt-8">
              <DeletionForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
