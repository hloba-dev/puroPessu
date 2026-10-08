import type {MetadataRoute} from 'next';
import {locales} from '@/i18n/routing';
import {localizedPath} from '@/lib/seo';
import {SITE_URL} from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // booking confirmation and private manage pages, in every language
  const privatePaths = locales.flatMap((locale) =>
    (['/varaa-aika/kiitos/[token]', '/varaa-aika/hallinnoi/[token]'] as const).map((pathname) =>
      localizedPath({pathname, params: {token: 'x'}}, locale).replace(/x$/, '')
    )
  );

  return {
    rules: [{userAgent: '*', allow: '/', disallow: ['/admin', '/api/', ...privatePaths]}],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
