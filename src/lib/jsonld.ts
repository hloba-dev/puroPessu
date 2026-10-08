import type {Locale} from '@/i18n/routing';
import {l10n} from '@/lib/format';
import {SITE_URL} from '@/lib/site';
import type {Review, Service, Settings} from '@/lib/types';

type Ld = Record<string, unknown>;

export const BUSINESS_ID = `${SITE_URL}/#business`;

const eur = (cents: number) => (cents / 100).toFixed(2);

/** NAP here must stay identical to the footer and the contact page: all three read the same settings. */
export function localBusinessLd(opts: {
  settings: Settings;
  locale: Locale;
  url: string;
  description: string;
  areaServed: string[];
  reviews: Review[];
  priceFromCents: number;
  priceToCents: number;
}): Ld {
  const {settings, reviews} = opts;
  const sameAs = Object.values(settings.social).filter(Boolean);
  const ld: Ld = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    // schema.org has no upholstery-cleaning type: the closest parent plus a precise external concept
    additionalType: ['https://schema.org/HomeAndConstructionBusiness', 'http://www.productontology.org/id/Upholstery'],
    name: settings.companyName,
    legalName: settings.legalName,
    description: opts.description,
    url: opts.url,
    logo: `${SITE_URL}/brand/logo-512.png`,
    image: `${SITE_URL}/og-default.png`,
    telephone: settings.phone.replace(/\s/g, ''),
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address.street,
      postalCode: settings.address.postalCode,
      addressLocality: settings.address.city,
      addressCountry: 'FI'
    },
    geo: {'@type': 'GeoCoordinates', latitude: settings.baseLat, longitude: settings.baseLng},
    areaServed: opts.areaServed.map((name) => ({'@type': 'City', name})),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: settings.openFrom,
        closes: settings.openTo
      }
    ],
    priceRange: `${Math.round(opts.priceFromCents / 100)}–${Math.round(opts.priceToCents / 100)} €`,
    currenciesAccepted: 'EUR',
    knowsLanguage: ['fi', 'ru', 'en']
  };
  if (sameAs.length) ld.sameAs = sameAs;
  // aggregateRating only when real, published reviews exist in the database
  if (reviews.length > 0) {
    ld.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5
    };
  }
  return ld;
}

export function faqLd(items: {q: string; a: string}[]): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {'@type': 'Answer', text: item.a}
    }))
  };
}

export function breadcrumbLd(items: {name: string; url: string}[]): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

function offer(service: Service, locale: Locale, url: string): Ld {
  return {
    '@type': 'Offer',
    name: l10n(service.name, locale),
    url,
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    ...(service.priceFrom
      ? {priceSpecification: {'@type': 'PriceSpecification', minPrice: eur(service.priceCents), priceCurrency: 'EUR'}}
      : {price: eur(service.priceCents)}),
    ...(service.unit === 'm2' ? {unitText: 'm²'} : {})
  };
}

/** Service + offers; prices come straight from the catalog (database). */
export function serviceLd(opts: {
  name: string;
  description: string;
  url: string;
  locale: Locale;
  services: Service[];
  areaServed: string[];
  serviceType?: string;
}): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    serviceType: opts.serviceType ?? opts.name,
    provider: {'@id': BUSINESS_ID},
    areaServed: opts.areaServed.map((name) => ({'@type': 'City', name})),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: opts.name,
      itemListElement: opts.services.map((s) => offer(s, opts.locale, opts.url))
    }
  };
}

export function offerCatalogLd(opts: {
  name: string;
  url: string;
  locale: Locale;
  groups: {name: string; services: Service[]}[];
}): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: opts.name,
    url: opts.url,
    provider: {'@id': BUSINESS_ID},
    itemListElement: opts.groups.map((group) => ({
      '@type': 'OfferCatalog',
      name: group.name,
      itemListElement: group.services.map((s) => offer(s, opts.locale, opts.url))
    }))
  };
}

export function articleLd(opts: {
  title: string;
  description: string;
  url: string;
  locale: Locale;
  published: string;
  modified?: string;
  publisher: string;
}): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    inLanguage: opts.locale,
    mainEntityOfPage: opts.url,
    url: opts.url,
    datePublished: opts.published,
    dateModified: opts.modified ?? opts.published,
    image: `${SITE_URL}/og-default.png`,
    author: {'@type': 'Organization', name: opts.publisher, url: SITE_URL},
    publisher: {
      '@type': 'Organization',
      name: opts.publisher,
      logo: {'@type': 'ImageObject', url: `${SITE_URL}/brand/logo-512.png`}
    }
  };
}
