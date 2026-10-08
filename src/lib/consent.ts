export interface Consent {
  analytics: boolean;
  marketing: boolean;
  ts: number;
}

export const CONSENT_KEY = 'puro-consent';
export const CONSENT_EVENT = 'puro:consent';
export const CONSENT_OPEN_EVENT = 'puro:open-consent';

export function readConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

type Gtag = (...args: unknown[]) => void;

/** Google Consent Mode v2 update; gtag is defined by the inline default-consent script. */
export function applyConsent(consent: Pick<Consent, 'analytics' | 'marketing'>) {
  const gtag = (window as unknown as {gtag?: Gtag}).gtag;
  gtag?.('consent', 'update', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied'
  });
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
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, {detail: value}));
}

/**
 * Inline, render-blocking: sets Consent Mode defaults before any Google tag can load and marks
 * returning visitors (<html data-consent="set">) so the cookie banner is hidden before the first paint.
 */
export const consentDefaultScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});try{var c=JSON.parse(localStorage.getItem('${CONSENT_KEY}')||'null');if(c){document.documentElement.dataset.consent='set';gtag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:c.marketing?'granted':'denied',ad_user_data:c.marketing?'granted':'denied',ad_personalization:c.marketing?'granted':'denied'});}}catch(e){}`;

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  const gtag = (window as unknown as {gtag?: Gtag}).gtag;
  gtag?.('event', name, params);
}
