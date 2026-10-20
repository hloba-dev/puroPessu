import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {MDXRemote} from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import {Link} from '@/i18n/navigation';
import {locales, type Locale} from '@/i18n/routing';
import {articles} from '@/content/articles';
import {getArticle, listArticles} from '@/lib/blog';
import {getActiveCatalog, getSettings} from '@/lib/data/public';
import {formatDate} from '@/lib/format';
import {articleLd} from '@/lib/jsonld';
import {localizedUrl, pageMetadata, type Href} from '@/lib/seo';
import {mdxComponents} from '@/components/blog/mdx';
import {Breadcrumbs} from '@/components/sections/Breadcrumbs';
import {JsonLd} from '@/components/seo/JsonLd';
import {GlowButton} from '@/components/ui/GlowButton';

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams({params}: {params: {locale: string}}) {
  return articles.map((article) => ({slug: article.slugs[params.locale as Locale]}));
}

/** Slugs differ per language, so hreflang needs the article's own URL in every locale. */
function articleHrefs(slugs: Record<Locale, string>) {
  return Object.fromEntries(locales.map((l) => [l, {pathname: '/vinkit/[slug]', params: {slug: slugs[l]}}])) as Record<Locale, Href>;
}

export async function generateMetadata({params}: PageProps<'/[locale]/vinkit/[slug]'>): Promise<Metadata> {
  const {locale, slug} = (await params) as {locale: Locale; slug: string};
  const article = await getArticle(locale, slug);
  if (!article) return {};
  return pageMetadata({
    locale,
    href: articleHrefs(article.entry.slugs),
    title: article.meta.title,
    description: article.meta.description,
    type: 'article',
    publishedTime: article.meta.published,
    modifiedTime: article.meta.updated ?? article.meta.published
  });
}

export default async function ArticlePage({params}: PageProps<'/[locale]/vinkit/[slug]'>) {
  const {locale, slug} = (await params) as {locale: Locale; slug: string};
  setRequestLocale(locale);
  const article = await getArticle(locale, slug);
  if (!article) notFound();

  const [t, tc, catalog, settings, all] = await Promise.all([
    getTranslations('blog'),
    getTranslations('common'),
    getActiveCatalog(),
    getSettings(),
    listArticles(locale)
  ]);
  const {meta, toc} = article;
  const url = localizedUrl({pathname: '/vinkit/[slug]', params: {slug}}, locale);
  // same category first, then the newest of the rest
  const related = [
    ...all.filter((a) => a.id !== meta.id && a.category === meta.category),
    ...all.filter((a) => a.id !== meta.id && a.category !== meta.category)
  ].slice(0, 3);

  return (
    <article className="page-top section">
      <div className="container-x">
        <Breadcrumbs items={[{label: t('title'), href: '/vinkit'}, {label: meta.title}]} />

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <p className="eyebrow">{t(`categories.${meta.category}`)}</p>
            <h1 className="mt-3 text-[clamp(30px,4.4vw,48px)] leading-[1.1] font-black tracking-tight text-balance">{meta.title}</h1>
            <p className="mt-4 text-sm text-muted">
              {t('published', {date: formatDate(meta.published, locale)})} · {t('readingTime', {minutes: meta.readingMinutes})}
            </p>

            <div className="prose-puro mt-8 max-w-[72ch]">
              <MDXRemote
                source={article.body}
                components={mdxComponents(locale, catalog, {tip: t('tip'), warning: t('warning')})}
                options={{mdxOptions: {remarkPlugins: [remarkGfm]}}}
              />
            </div>

            <aside className="glass mt-12 max-w-[72ch] p-7">
              <h2 className="h3">{t('ctaTitle')}</h2>
              <p className="mt-2 text-muted">{t('ctaText')}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <GlowButton href="/varaa-aika">{tc('book')}</GlowButton>
                <GlowButton href="/hinnasto" variant="ghost">
                  {tc('seePrices')}
                </GlowButton>
              </div>
            </aside>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            {toc.length > 0 && (
              <nav aria-label={t('toc')} className="glass p-6">
                <h2 className="text-sm font-semibold tracking-widest uppercase">{t('toc')}</h2>
                <ol className="mt-4 space-y-2.5 text-base">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="text-muted hover:text-text">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </aside>
        </div>

        <section className="mt-16" aria-labelledby="related-title">
          <h2 id="related-title" className="h3">
            {t('related')}
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <Link
                  href={{pathname: '/vinkit/[slug]', params: {slug: item.slug}}}
                  className="glass flex h-full flex-col p-6 transition-colors hover:border-teal-2"
                >
                  <p className="text-sm text-teal-1">{t(`categories.${item.category}`)}</p>
                  <h3 className="mt-2 text-lg leading-snug font-semibold">{item.title}</h3>
                  <p className="mt-2 text-base text-muted">{item.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <JsonLd
        data={articleLd({
          title: meta.title,
          description: meta.description,
          url,
          locale,
          published: meta.published,
          modified: meta.updated,
          publisher: settings.companyName
        })}
      />
    </article>
  );
}
