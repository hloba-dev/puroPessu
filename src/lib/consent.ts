export interface Consent {
  analytics: boolean;
  marketing: boolean;
  ts: number;
}

export const CONSENT_KEY = 'puro-consent';
export const CONSENT_EVENT = 'puro:consent';
export const CONSENT_OPEN_EVENT = 'puro:open-consent';
/** A stored choice is valid for a year; after that the banner asks again. */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export function readConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    const value = raw ? (JSON.parse(raw) as Partial<Consent> | null) : null;
    if (!value || typeof value.ts !== 'number' || Date.now() - value.ts > CONSENT_MAX_AGE_MS) return null;
    return {analytics: value.analytics === true, marketing: value.marketing === true, ts: value.ts};
  } catch {
    return null;
  }
}

type Gtag = (...args: unknown[]) => void;
type TagWindow = {gtag?: Gtag; dataLayer?: unknown[]};

/** Google Consent Mode v2 update; gtag is defined by the inline default-consent script. */
export function applyConsent(consent: Pick<Consent, 'analytics' | 'marketing'>) {
  const gtag = (window as unknown as TagWindow).gtag;
  gtag?.('consent', 'update', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied'
  });
}

/** A plain dataLayer event: what a Tag Manager "Custom Event" trigger listens to. */
export function pushDataLayer(event: string, params: Record<string, unknown> = {}) {
  const w = window as unknown as TagWindow;
  (w.dataLayer ??= []).push({event, ...params});
}

// first-party cookies the Google tags write once storage is granted
const AD_COOKIES = /^(_gcl_|_gac_)/;
const ANALYTICS_COOKIES = /^(_ga$|_ga_|_gid$|_gat)/;

/** Removes cookies by name pattern; they may sit on the host or on any parent domain. */
function dropCookies(pattern: RegExp) {
  const labels = window.location.hostname.split('.');
  const domains = labels.map((_, i) => labels.slice(i).join('.'));
  for (const pair of document.cookie.split('; ')) {
    const name = pair.split('=')[0];
    if (!name || !pattern.test(name)) continue;
    const expired = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = expired;
    for (const domain of domains) document.cookie = `${expired}; domain=.${domain}`;
  }
}

export function saveConsent(consent: Pick<Consent, 'analytics' | 'marketing'>) {
  const value: Consent = {...consent, ts: Date.now()};
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode): consent lives for this page view only
  }
  document.documentElement.dataset.consent = 'set';
  applyConsent(value);
  // a refused or withdrawn category also loses what the tags stored for it earlier
  try {
    if (!value.marketing) dropCookies(AD_COOKIES);
    if (!value.analytics) dropCookies(ANALYTICS_COOKIES);
  } catch {
    // cookies are not accessible here: nothing to clean up
  }
  // after the consent update, so that tags triggered by this event already see the new state
  pushDataLayer('cookie_consent_update', {consent_analytics: value.analytics, consent_marketing: value.marketing});
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, {detail: value}));
}

/**
 * Inline, render-blocking: sets Consent Mode defaults before any Google tag can load and marks
 * returning visitors (<html data-consent="set">) so the cookie banner is hidden before the first paint.
 * A stored choice older than CONSENT_MAX_AGE_MS counts as no choice, exactly as in readConsent().
 *
 * Booking pages carry a private token in the URL (it opens the booking for changes). The tags must never
 * report it: on such pages the address and the referrer handed to Tag Manager (`gtm.url`, which its Page URL
 * variable and URL triggers read) and to the Google tag (`page_location`, `page_referrer`) have the token cut out.
 */
export const consentDefaultScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;(function(){var t=/\\/[0-9a-f]{40,}/g,l=location.href,r=document.referrer,L=l.replace(t,''),R=r.replace(t,'');if(L!==l||R!==r){dataLayer.push({'gtm.url':L,'gtm.referrer':R});gtag('set',{page_location:L,page_referrer:R});}})();gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});try{var c=JSON.parse(localStorage.getItem('${CONSENT_KEY}')||'null');if(c&&typeof c.ts==='number'&&Date.now()-c.ts<=${CONSENT_MAX_AGE_MS}){document.documentElement.dataset.consent='set';gtag('consent','update',{analytics_storage:c.analytics===true?'granted':'denied',ad_storage:c.marketing===true?'granted':'denied',ad_user_data:c.marketing===true?'granted':'denied',ad_personalization:c.marketing===true?'granted':'denied'});}}catch(e){}`;

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  const gtag = (window as unknown as TagWindow).gtag;
  gtag?.('event', name, params);
}
