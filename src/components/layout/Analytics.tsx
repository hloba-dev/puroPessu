'use client';

import {useEffect, useState} from 'react';
import Script from 'next/script';
import {CONSENT_EVENT, readConsent, type Consent} from '@/lib/consent';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

/**
 * Loads gtag.js directly, only after the visitor has granted analytics or marketing consent.
 * Keep NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_GADS_ID empty when GA4 / Ads are configured inside the
 * Tag Manager container (see GoogleTagManager), otherwise every hit is counted twice.
 */
export function Analytics() {
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(readConsent());
    const onChange = (e: Event) => setConsent((e as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  const loadId = (consent?.analytics && GA_ID) || (consent?.marketing && GADS_ID) || null;
  if (!loadId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${loadId}`} strategy="afterInteractive" />
      <Script id="gtag-config" strategy="afterInteractive">
        {/* booking pages carry a private token in the URL: it is stripped before anything is reported */}
        {`gtag('js', new Date());var loc={page_location:location.href.replace(new RegExp('/[0-9a-f]{40,}','g'),'')};${GA_ID ? `gtag('config','${GA_ID}',loc);` : ''}${GADS_ID ? `gtag('config','${GADS_ID}',loc);` : ''}`}
      </Script>
    </>
  );
}
