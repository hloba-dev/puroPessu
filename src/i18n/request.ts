import {getRequestConfig} from 'next-intl/server';
import {hasLocale, type AbstractIntlMessages} from 'next-intl';
import {routing} from './routing';

type Tree = {[key: string]: unknown};

const isTree = (value: unknown): value is Tree =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Finnish is the source language: a key missing from ru/en falls back to it instead of breaking the page. */
function withFallback(base: Tree, override: Tree): Tree {
  const out: Tree = {...base};
  for (const [key, value] of Object.entries(override)) {
    const baseValue = base[key];
    out[key] = isTree(value) && isTree(baseValue) ? withFallback(baseValue, value) : value;
  }
  return out;
}

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const fi = (await import('../../messages/fi.json')).default as Tree;
  const messages =
    locale === 'fi' ? fi : withFallback(fi, (await import(`../../messages/${locale}.json`)).default as Tree);

  return {locale, timeZone: 'Europe/Helsinki', messages: messages as AbstractIntlMessages};
});
