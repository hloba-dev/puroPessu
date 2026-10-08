'use client';

import {useId, useState, type ReactNode} from 'react';
import type {UseFormRegisterReturn} from 'react-hook-form';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import type {FormError, FormResult} from '@/lib/forms/schema';
import {GlowButton} from '@/components/ui/GlowButton';
import {IconCheck} from '@/components/ui/icons';

interface Meta {
  locale: Locale;
  website: string;
}

/** Submission state shared by the public forms: pending / success / error and the honeypot value. */
export function useFormSubmit() {
  const locale = useLocale() as Locale;
  const [status, setStatus] = useState<'idle' | 'pending' | 'done'>('idle');
  const [error, setError] = useState<FormError | null>(null);
  const [website, setWebsite] = useState('');

  const submit = async (send: (meta: Meta) => Promise<FormResult>) => {
    setStatus('pending');
    setError(null);
    const result = await send({locale, website}).catch(
      (): FormResult => ({ok: false, error: 'failed'})
    );
    if (result.ok) {
      setStatus('done');
    } else {
      setStatus('idle');
      setError(result.error);
    }
  };

  return {status, error, submit, website, setWebsite};
}

/** Translates a validation key from the zod schemas. */
export function useFieldMessage() {
  const te = useTranslations('forms.errors');
  return (key?: string) => (key ? te(te.has(key) ? key : 'required') : undefined);
}

interface FooterProps {
  form: ReturnType<typeof useFormSubmit>;
  privacy: UseFormRegisterReturn;
  privacyError?: string;
  submitLabel: string;
  /** shown instead of the label while pending (e.g. upload progress) */
  pendingLabel?: string;
  disabled?: boolean;
}

/** Consent checkbox, honeypot, error message and the submit button. */
export function FormFooter({form, privacy, privacyError, submitLabel, pendingLabel, disabled}: FooterProps) {
  const t = useTranslations('forms');
  const id = useId();
  const errorKey = form.error === 'rate_limited' ? 'rateLimited' : 'failed';

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 size-[18px] shrink-0 accent-cyan-600"
          aria-invalid={privacyError ? true : undefined}
          aria-describedby={privacyError ? `${id}-privacy` : undefined}
          {...privacy}
        />
        <span>
          {t.rich('privacy', {
            link: (chunks) => (
              <Link href="/tietosuoja" className="link" target="_blank">
                {chunks}
              </Link>
            )
          })}
        </span>
      </label>
      {privacyError && (
        <p id={`${id}-privacy`} className="field-error" role="alert">
          {privacyError}
        </p>
      )}

      {/* honeypot: hidden from people, tempting for bots */}
      <div className="hp" aria-hidden="true">
        <label>
          {t('website')}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => form.setWebsite(e.target.value)}
          />
        </label>
      </div>

      {form.error && (
        <p role="alert" className="rounded-xl border border-[#ff8a8a]/40 bg-[#ff8a8a]/10 px-4 py-3 text-[#ffc2c2]">
          {t(errorKey)}
        </p>
      )}

      <GlowButton type="submit" disabled={form.status === 'pending' || disabled}>
        {form.status === 'pending' ? (pendingLabel ?? t('sending')) : submitLabel}
      </GlowButton>
    </div>
  );
}

export function FormSuccess({children}: {children: ReactNode}) {
  return (
    <div role="status" className="glass flex items-start gap-4 p-6">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cyan-4 text-white">
        <IconCheck />
      </span>
      <p className="pt-1.5 text-lg font-medium">{children}</p>
    </div>
  );
}
