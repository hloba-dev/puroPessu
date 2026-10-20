'use client';

import {useParams} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import NextLink from 'next/link';
import {getPathname, usePathname} from '@/i18n/navigation';
import {locales, type Locale} from '@/i18n/routing';
import {findArticleBySlug} from '@/content/articles';

/** FI / RU / EN links that keep the visitor on the same page in the other language. */
export function LocaleSwitcher({className}: {className?: string}) {
  const t = useTranslations('nav');
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();

  const hrefFor = (target: Locale) => {
    const next: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (key !== 'locale' && typeof value === 'string') next[key] = value;
    }
    if (pathname === '/vinkit/[slug]' && next.slug) {
      next.slug = findArticleBySlug(current, next.slug)?.slugs[target] ?? next.slug;
    }
    // Pathname and params come from the active route, so they always match.
    const href = {pathname, params: next} as unknown as Parameters<typeof getPathname>[0]['href'];
    // getPathname (unlike <Link locale>) gives the canonical URL: no /fi prefix that would redirect.
    return getPathname({href, locale: target});
  };

  return (
    <nav aria-label={t('language')} className={className}>
      <ul className="flex items-center gap-0.5 rounded-xl border border-hairline bg-text/4 p-0.5 text-[13px] font-semibold">
        {locales.map((locale) => (
          <li key={locale}>
            {/* No prefetch: the router guesses the route of an unprefixed Finnish URL from the current
                (prefixed) one, misses the proxy rewrite and logs a 404 for the prefetch. */}
            <NextLink
              href={hrefFor(locale)}
              prefetch={false}
              hrefLang={locale}
              lang={locale}
              aria-current={locale === current ? 'true' : undefined}
              aria-label={t(`lang.${locale}`)}
              className={`flex h-9 min-w-9 items-center justify-center rounded-[10px] px-2 uppercase tracking-wide transition-colors ${
                locale === current ? 'bg-text/10 text-text' : 'text-muted hover:text-text'
              }`}
            >
              {locale}
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
