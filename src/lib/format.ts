import type {Locale} from '@/i18n/routing';
import type {L10n} from '@/lib/types';

const intlLocale: Record<Locale, string> = {fi: 'fi-FI', ru: 'ru-RU', en: 'en-GB'};

/** 15000 → "150 €" (fi/ru) or "€150" (en); cents are shown only when they are not zero. */
export function formatEur(cents: number, locale: Locale) {
  const whole = cents % 100 === 0;
  return new Intl.NumberFormat(intlLocale[locale], {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2
  }).format(cents / 100);
}

const units: Record<Locale, {h: string; min: string}> = {
  fi: {h: 'h', min: 'min'},
  ru: {h: 'ч', min: 'мин'},
  en: {h: 'h', min: 'min'}
};

/** 100 → "1 h 40 min" */
export function formatDuration(minutes: number, locale: Locale) {
  const u = units[locale];
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} ${u.min}`;
  return m === 0 ? `${h} ${u.h}` : `${h} ${u.h} ${m} ${u.min}`;
}

export function l10n(value: L10n, locale: Locale) {
  return value[locale] || value.fi;
}

/** "06:00" → "6", "21:00" → "21", "06:30" → "6.30" — the way opening hours are written in Finnish */
export function shortHour(time: string) {
  const [h, m] = time.split(':');
  return m === '00' ? String(Number(h)) : `${Number(h)}.${m}`;
}

/** Fills {placeholders} in raw message strings (arrays read with t.raw are not ICU-formatted). */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}

export function formatDate(iso: string, locale: Locale, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    timeZone: 'Europe/Helsinki',
    ...(options ?? {day: 'numeric', month: 'long', year: 'numeric'})
  }).format(new Date(iso));
}
