import {getLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {JsonLd} from '@/components/seo/JsonLd';
import {breadcrumbLd} from '@/lib/jsonld';
import {localizedUrl, type Href} from '@/lib/seo';

export interface Crumb {
  label: string;
  /** omitted for the current page */
  href?: Href;
}

export async function Breadcrumbs({items}: {items: Crumb[]}) {
  const [t, locale] = await Promise.all([getTranslations('common'), getLocale() as Promise<Locale>]);
  const all: Crumb[] = [{label: t('home'), href: '/'}, ...items];

  return (
    <>
      <nav aria-label={t('breadcrumbs')} className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((crumb, index) => (
            <li key={crumb.label} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-text">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-text">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={breadcrumbLd(
          all
            .filter((c): c is Required<Crumb> => Boolean(c.href))
            .map((c) => ({name: c.label, url: localizedUrl(c.href, locale)}))
        )}
      />
    </>
  );
}
