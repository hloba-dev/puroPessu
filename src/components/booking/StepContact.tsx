'use client';

import {useState} from 'react';
import {useForm, useWatch} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {checkGiftCardAction} from '@/app/actions/booking';
import {CUSTOMER_TYPES, contactSchema, type ContactInput, type ContactValues} from '@/lib/booking/schema';
import {formatEur} from '@/lib/format';
import {Field} from '@/components/forms/Field';

/** A gift card accepted by the server: a value card (remaining balance) or a card for one service. */
export interface GiftCard {
  code: string;
  amountCents?: number | null;
  serviceId?: number | null;
}

interface Props {
  formId: string;
  defaultValues: ContactInput | null;
  gift: GiftCard | null;
  onGift: (gift: GiftCard | null) => void;
  /** what the accepted card takes off this booking, from the live quote */
  giftDiscountCents: number;
  /** set when the card is for a service that is not in the cart: that service's name */
  giftMissingService: string | null;
  onValid: (values: ContactInput) => void | Promise<void>;
  locale: Locale;
  honeypot: string;
  onHoneypot: (value: string) => void;
}

export function StepContact({
  formId,
  defaultValues,
  gift,
  onGift,
  giftDiscountCents,
  giftMissingService,
  onValid,
  locale,
  honeypot,
  onHoneypot
}: Props) {
  const t = useTranslations('booking.contact');
  const te = useTranslations('forms.errors');
  const tf = useTranslations('forms');
  const [giftError, setGiftError] = useState<'invalid' | 'rate_limited' | null>(null);
  const [checking, setChecking] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: {errors}
  } = useForm<ContactInput, unknown, ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaultValues ?? {
      name: '',
      phone: '',
      email: '',
      customerType: 'private',
      company: '',
      yTunnus: '',
      giftCardCode: '',
      privacy: false,
      marketing: false
    },
    mode: 'onTouched'
  });
  const customerType = useWatch({control, name: 'customerType'});
  const message = (key?: string) => (key ? te(te.has(key) ? key : 'required') : undefined);

  const checkGift = async (): Promise<boolean> => {
    const code = getValues('giftCardCode').trim().toUpperCase();
    if (!code) {
      onGift(null);
      setGiftError(null);
      return true;
    }
    if (gift?.code === code) return true;
    setChecking(true);
    const result = await checkGiftCardAction(code).catch(() => ({valid: false as const, reason: 'invalid' as const}));
    setChecking(false);
    if (result.valid) {
      onGift({code, ...result.card});
      setGiftError(null);
      return true;
    }
    onGift(null);
    setGiftError(result.reason);
    return false;
  };

  const submit = handleSubmit(async () => {
    // an entered gift card must be valid — and usable for this cart — before moving on
    if ((await checkGift()) && !giftMissingService) await onValid(getValues());
  });

  return (
    <form id={formId} onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label={t('name')} error={message(errors.name?.message)} className="sm:col-span-2">
        <input className="field" autoComplete="name" {...register('name')} />
      </Field>
      <Field label={t('phone')} error={message(errors.phone?.message)}>
        <input className="field" type="tel" autoComplete="tel" placeholder={t('phonePlaceholder')} {...register('phone')} />
      </Field>
      <Field label={t('email')} error={message(errors.email?.message)}>
        <input className="field" type="email" autoComplete="email" {...register('email')} />
      </Field>

      <fieldset className="sm:col-span-2">
        <legend className="label">{t('customerType')}</legend>
        <div className="flex flex-wrap gap-3">
          {CUSTOMER_TYPES.map((type) => (
            <label
              key={type}
              className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl border border-white/15 px-4 has-checked:border-cyan-2 has-checked:bg-cyan-4/25"
            >
              <input type="radio" value={type} className="size-[18px] accent-cyan-600" {...register('customerType')} />
              {t(type)}
            </label>
          ))}
        </div>
      </fieldset>

      {customerType === 'business' && (
        <>
          <Field label={t('company')} error={message(errors.company?.message)}>
            <input className="field" autoComplete="organization" {...register('company')} />
          </Field>
          <Field label={t('yTunnus')} error={message(errors.yTunnus?.message)}>
            <input className="field" placeholder={t('yTunnusPlaceholder')} {...register('yTunnus')} />
          </Field>
        </>
      )}

      <div className="sm:col-span-2">
        <div className="flex items-end gap-3">
          <Field label={t('giftCard')} optional={tf('optional')} className="flex-1">
            <input
              className="field uppercase"
              autoComplete="off"
              {...register('giftCardCode', {
                onChange: () => {
                  onGift(null);
                  setGiftError(null);
                }
              })}
            />
          </Field>
          <button
            type="button"
            onClick={checkGift}
            disabled={checking}
            className="min-h-12 rounded-xl border border-white/20 px-5 font-semibold hover:border-cyan-2 disabled:opacity-50"
          >
            {t('giftCheck')}
          </button>
        </div>
        <p aria-live="polite" className="mt-1.5 text-sm">
          {gift && !giftMissingService && (
            <span className="text-cyan-1">{t('giftValid', {amount: formatEur(giftDiscountCents, locale)})}</span>
          )}
          {gift && giftMissingService && <span className="text-[#ffd9ad]">{t('giftService', {service: giftMissingService})}</span>}
          {giftError && <span className="text-[#ffa3a3]">{t(giftError === 'rate_limited' ? 'giftRateLimited' : 'giftInvalid')}</span>}
        </p>
      </div>

      <div className="space-y-3 sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 size-[18px] shrink-0 accent-cyan-600"
            aria-invalid={errors.privacy ? true : undefined}
            aria-describedby={errors.privacy ? `${formId}-privacy-error` : undefined}
            {...register('privacy')}
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
        {errors.privacy && (
          <p id={`${formId}-privacy-error`} className="field-error" role="alert">
            {message(errors.privacy.message)}
          </p>
        )}
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" className="mt-1 size-[18px] shrink-0 accent-cyan-600" {...register('marketing')} />
          <span>
            {t('marketing')} <span className="text-muted">({tf('optional')})</span>
          </span>
        </label>
      </div>

      {/* honeypot: hidden from people, tempting for bots */}
      <div className="hp" aria-hidden="true">
        <label>
          {tf('website')}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => onHoneypot(e.target.value)} />
        </label>
      </div>
    </form>
  );
}
