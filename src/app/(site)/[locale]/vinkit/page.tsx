import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import type {ArticleCategory} from '@/content/articles';
import {listArticles} from '@/lib/blog';
import {formatDate} from '@/lib/format';
import {pageMetadata} from '@/lib/seo';
import {CtaBand} from '@/components/sections/CtaBand';
import {PageHero} from '@/components/sections/PageHero';
import {IconArrow} from '@/components/ui/icons';

export const revalidate = 3600;

const CATEGORY_ORDER: ArticleCategory[] = ['tahrat', 'hajut', 'materiaalit', 'patjat', 'yrityksille'];

export async function generateMetadata({params}: PageProps<'/[locale]/vinkit'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const t = await getTranslations({locale, namespace: 'blog'});
  return pageMetadata({locale, href: '/vinkit', title: t('metaTitle'), description: t('metaDescription')});
}

export default async function BlogIndexPage({params}: PageProps<'/[locale]/vinkit'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const [t, all] = await Promise.all([getTranslations('blog'), listArticles(locale)]);
  const categories = CATEGORY_ORDER.filter((category) => all.some((a) => a.category === category));

  return (
    <>
      <PageHero crumbs={[{label: t('title')}]} title={t('title')} intro={t('lead')}>
        <nav aria-label={t('toc')}>
          <ul className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category}>
                <a
                  href={`#${category}`}
                  className="flex min-h-11 items-center rounded-xl border border-hairline px-4 text-[15px] font-medium hover:border-cyan-2 hover:text-cyan-1"
                >
                  {t(`categories.${category}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {categories.map((category) => (
        <section key={category} id={category} className="scroll-mt-24 pb-16" aria-labelledby={`${category}-title`}>
          <div className="container-x">
            <h2 id={`${category}-title`} className="h3 text-cyan-1">
              {t(`categories.${category}`)}
            </h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {all
                .filter((article) => article.category === category)
                .map((article) => (
                  <li key={article.id}>
                    <Link
                      href={{pathname: '/vinkit/[slug]', params: {slug: article.slug}}}
                      className="glass group flex h-full flex-col p-6 transition-colors hover:border-cyan-3"
                    >
                      <p className="text-sm text-muted">
                        <time dateTime={article.published}>{formatDate(article.published, locale)}</time> ·{' '}
                        {t('readingTime', {minutes: article.readingMinutes})}
                      </p>
                      <h3 className="mt-3 text-xl leading-snug font-semibold">{article.title}</h3>
                      <p className="mt-3 flex-1 text-[15px] text-muted">{article.excerpt}</p>
                      <p className="mt-5 flex items-center gap-2 font-medium text-cyan-1">
                        {t('read')} <IconArrow className="transition-transform group-hover:translate-x-1" width={18} height={18} />
                      </p>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      ))}

      <CtaBand title={t('ctaTitle')} text={t('ctaText')} />
    </>
  );
}
