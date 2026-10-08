import {defineRouting} from 'next-intl/routing';

export const locales = ['fi', 'ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fi';

// Internal paths are the Finnish ones; ru/en get localized slugs.
export const pathnames = {
  '/': '/',
  '/palvelut': {fi: '/palvelut', ru: '/uslugi', en: '/services'},
  '/sohvan-pesu': {fi: '/sohvan-pesu', ru: '/chistka-divana', en: '/sofa-cleaning'},
  '/sohvan-pesu/[city]': {
    fi: '/sohvan-pesu/[city]',
    ru: '/chistka-divana/[city]',
    en: '/sofa-cleaning/[city]'
  },
  '/nahkasohvan-puhdistus': {
    fi: '/nahkasohvan-puhdistus',
    ru: '/chistka-kozhanoy-mebeli',
    en: '/leather-sofa-cleaning'
  },
  '/patjan-pesu': {fi: '/patjan-pesu', ru: '/chistka-matrasa', en: '/mattress-cleaning'},
  '/patjan-pesu/[city]': {
    fi: '/patjan-pesu/[city]',
    ru: '/chistka-matrasa/[city]',
    en: '/mattress-cleaning/[city]'
  },
  '/auton-verhoilupesu': {
    fi: '/auton-verhoilupesu',
    ru: '/chistka-salona-avto',
    en: '/car-upholstery-cleaning'
  },
  '/veneen-tekstiilit': {fi: '/veneen-tekstiilit', ru: '/tekstil-lodki', en: '/boat-textiles'},
  '/hajunpoisto': {fi: '/hajunpoisto', ru: '/udalenie-zapahov', en: '/odor-removal'},
  '/yrityksille': {fi: '/yrityksille', ru: '/dlya-biznesa', en: '/business'},
  '/hinnasto': {fi: '/hinnasto', ru: '/ceny', en: '/prices'},
  '/varaa-aika': {fi: '/varaa-aika', ru: '/zapis', en: '/book'},
  '/varaa-aika/kiitos/[token]': {
    fi: '/varaa-aika/kiitos/[token]',
    ru: '/zapis/spasibo/[token]',
    en: '/book/thank-you/[token]'
  },
  '/varaa-aika/hallinnoi/[token]': {
    fi: '/varaa-aika/hallinnoi/[token]',
    ru: '/zapis/upravlenie/[token]',
    en: '/book/manage/[token]'
  },
  '/lahjakortti': {fi: '/lahjakortti', ru: '/podarochnyj-sertifikat', en: '/gift-card'},
  '/vinkit': {fi: '/vinkit', ru: '/sovety', en: '/tips'},
  '/vinkit/[slug]': {fi: '/vinkit/[slug]', ru: '/sovety/[slug]', en: '/tips/[slug]'},
  '/vuokrapesuri-vai-ammattilainen': {
    fi: '/vuokrapesuri-vai-ammattilainen',
    ru: '/arenda-pylesosa-ili-profi',
    en: '/rental-machine-vs-professional'
  },
  '/hoitotuotteet': {fi: '/hoitotuotteet', ru: '/sredstva-uhoda', en: '/care-products'},
  '/tietoa-meista': {fi: '/tietoa-meista', ru: '/o-nas', en: '/about'},
  '/yhteystiedot': {fi: '/yhteystiedot', ru: '/kontakty', en: '/contact'},
  '/tietosuoja': {fi: '/tietosuoja', ru: '/konfidencialnost', en: '/privacy'},
  '/tietojen-poisto': {fi: '/tietojen-poisto', ru: '/udalenie-dannyh', en: '/data-deletion'}
} as const;

export type AppPathname = keyof typeof pathnames;
export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  // Googlebot must always get Finnish on unprefixed URLs: no Accept-Language redirects.
  localeDetection: false,
  // hreflang is rendered in <head> via metadata (article slugs differ per locale).
  alternateLinks: false,
  pathnames
});
