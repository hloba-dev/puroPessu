'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {CONSENT_OPEN_EVENT, readConsent, saveConsent} from '@/lib/consent';

export function CookieBanner() {
  const t = useTranslations('cookie');
  // Rendered open on the server so first-time visitors get it in the very first paint (no late pop-in).
  // For returning visitors CSS hides it before paint (html[data-consent="set"]) and the effect unmounts it.
  const [open, setOpen] = useState(true);
  const [forced, setForced] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // localStorage is only readable after hydration, so the banner state is synced here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readConsent()) setOpen(false);
    const reopen = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setDetails(true);
      setForced(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  if (!open) return null;

  const close = (value: {analytics: boolean; marketing: boolean}) => {
    saveConsent(value);
    setForced(false);
    setOpen(false);
  };

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      data-cookie-banner
      data-forced={forced || undefined}
      // phones: a card above the sticky bar; wide screens: a low bar along the bottom that never covers the hero buttons
      className="fixed inset-x-3 bottom-[76px] z-[120] mx-auto max-w-[560px] rounded-2xl border border-hairline bg-surface p-5 shadow-[0_18px_60px_rgba(27,31,38,.18)] min-[701px]:bottom-24 min-[901px]:flex min-[901px]:max-w-[1040px] min-[901px]:items-center min-[901px]:gap-8 min-[1240px]:bottom-5"
    >
      <div className="min-w-0 flex-1">
      <h2 id="cookie-title" className="text-base font-semibold">
        {t('title')}
      </h2>
      <p className="mt-2 text-sm text-muted">
        {t('text')}{' '}
        <Link href="/tietosuoja" className="link">
          {t('more')}
        </Link>
      </p>

      {details && (
        <fieldset className="mt-4 space-y-3 text-sm">
          <legend className="sr-only">{t('title')}</legend>
          <label className="flex items-start gap-3">
            <input type="checkbox" checked disabled className="mt-1 size-4 accent-teal-3" />
            <span>
              <span className="font-medium">{t('necessary')}</span>
              <span className="block text-muted">{t('necessaryText')}</span>
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="mt-1 size-4 accent-teal-3"
            />
            <span>
              <span className="font-medium">{t('analytics')}</span>
              <span className="block text-muted">{t('analyticsText')}</span>
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-1 size-4 accent-teal-3"
            />
            <span>
              <span className="font-medium">{t('marketing')}</span>
              <span className="block text-muted">{t('marketingText')}</span>
            </span>
          </label>
        </fieldset>
      )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 min-[901px]:mt-0 min-[901px]:w-[340px] min-[901px]:shrink-0">
        <button
          type="button"
          onClick={() => close({analytics: true, marketing: true})}
          className="min-h-11 flex-1 rounded-xl bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          {t('acceptAll')}
        </button>
        <button
          type="button"
          onClick={() => close({analytics: false, marketing: false})}
          className="min-h-11 flex-1 rounded-xl border border-text/25 px-4 text-sm font-semibold hover:bg-text/5"
        >
          {t('onlyNecessary')}
        </button>
        <button
          type="button"
          onClick={() => (details ? close({analytics, marketing}) : setDetails(true))}
          className="min-h-11 w-full rounded-xl px-4 text-sm font-medium text-teal-1 underline underline-offset-4 hover:text-text"
        >
          {details ? t('save') : t('settings')}
        </button>
      </div>
    </section>
  );
}

export function CookieSettingsButton({children, className}: {children: React.ReactNode; className?: string}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    >
      {children}
    </button>
  );
}
