'use client';

import {useEffect} from 'react';
import {pushDataLayer, readConsent, trackEvent} from '@/lib/consent';

const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;
const GADS_LABEL = process.env.NEXT_PUBLIC_GADS_BOOKING_LABEL;

/**
 * Reports a finished booking once per booking.
 *
 * Tag Manager: a `booking_complete` dataLayer event with the value, currency and booking reference. It is the
 * trigger (and the conversion value / transaction id) for a Google Ads conversion tag in the container; the
 * tags there follow the Consent Mode state by themselves, so the event is pushed in every case.
 *
 * Direct gtag.js setups (NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_GADS_ID): the GA4 event and the Ads conversion are
 * sent only with the visitor's consent.
 */
export function BookingConversion({bookingRef, valueEur}: {bookingRef: string; valueEur: number}) {
  useEffect(() => {
    const key = `puro-conv-${bookingRef}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // storage blocked: the event may repeat on reload, which is acceptable
    }
    pushDataLayer('booking_complete', {value: valueEur, currency: 'EUR', transaction_id: bookingRef});

    const consent = readConsent();
    if (consent?.analytics) {
      trackEvent('booking_submitted', {value: valueEur, currency: 'EUR', transaction_id: bookingRef});
    }
    if (consent?.marketing && GADS_ID && GADS_LABEL) {
      trackEvent('conversion', {
        send_to: `${GADS_ID}/${GADS_LABEL}`,
        value: valueEur,
        currency: 'EUR',
        transaction_id: bookingRef
      });
    }
  }, [bookingRef, valueEur]);

  return null;
}
