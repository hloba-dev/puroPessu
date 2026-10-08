import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getContent} from '@/content';
import {getSettings} from '@/lib/data/public';
import {fill, formatDate} from '@/lib/format';
import {pageMetadata} from '@/lib/seo';
import {Breadcrumbs} from '@/components/sections/Breadcrumbs';

export const revalidate = 300;

export async function generateMetadata({params}: PageProps<'/[locale]/tietosuoja'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const {privacy} = await getContent(locale);
  return pageMetadata({locale, href: '/tietosuoja', title: privacy.metaTitle, description: privacy.metaDescription});
}

export default async function PrivacyPageRoute({params}: PageProps<'/[locale]/tietosuoja'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const [{privacy: content}, settings] = await Promise.all([getContent(locale), getSettings()]);
  // controller details come from settings, never from the copy
  const vars = {
    company: settings.legalName,
    yTunnus: settings.yTunnus,
    address: `${settings.address.street}, ${settings.address.postalCode} ${settings.address.city}`,
    email: settings.email,
    phone: settings.phone
  };
  const f = (text: string) => fill(text, vars);

  return (
    <article className="page-top section">
      <div className="container-x max-w-3xl">
        <Breadcrumbs items={[{label: content.h1}]} />
        <h1 className="h2 mt-7">{content.h1}</h1>
        <p className="mt-3 text-sm text-muted">
          {content.updatedLabel} <time dateTime={content.updated}>{formatDate(content.updated, locale)}</time>
        </p>
        <div className="prose-puro mt-8">
          <p>{f(content.intro)}</p>
          {content.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph.slice(0, 48)}>{f(paragraph)}</p>)}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet.slice(0, 48)}>{f(bullet)}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
