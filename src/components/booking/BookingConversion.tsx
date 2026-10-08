'use client';

import {useEffect} from 'react';
import {readConsent, trackEvent} from '@/lib/consent';

const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;
const GADS_LABEL = process.env.NEXT_PUBLIC_GADS_BOOKING_LABEL;

/** Fires the GA4 `booking_submitted` event and the Google Ads conversion once per booking — only with consent. */
export function BookingConversion({bookingRef, valueEur}: {bookingRef: string; valueEur: number}) {
  useEffect(() => {
    const key = `puro-conv-${bookingRef}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // storage blocked: the event may repeat on reload, which is acceptable
    }
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
