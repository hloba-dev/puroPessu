'use client';

import {useEffect} from 'react';
import {useForm, useWatch} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import type {Locale} from '@/i18n/routing';
import {PARKING, addressSchema, type AddressValues} from '@/lib/booking/schema';
import type {TravelQuote} from '@/lib/booking/travel';
import {formatEur} from '@/lib/format';
import {Field} from '@/components/forms/Field';

interface Props {
  formId: string;
  defaultValues: AddressValues | null;
  travel: TravelQuote | null;
  onTravel: (quote: TravelQuote | null) => void;
  onValid: (values: AddressValues) => void;
  locale: Locale;
  whatsappUrl: string;
}

export function StepAddress({formId, defaultValues, travel, onTravel, onValid, locale, whatsappUrl}: Props) {
  const t = useTranslations('booking.address');
  const te = useTranslations('forms.errors');
  const tf = useTranslations('forms');
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: {errors}
  } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues ?? {street: '', postalCode: '', city: '', floor: '', parking: 'unknown', notes: ''},
    mode: 'onTouched'
  });
  const postalCode = useWatch({control, name: 'postalCode'});
  const message = (key?: string) => (key ? te(te.has(key) ? key : 'required') : undefined);

  // the travel fee is shown as soon as the postal code is complete
  useEffect(() => {
    if (!/^\d{5}$/.test(postalCode ?? '')) {
      onTravel(null);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/travel?postal=${postalCode}`, {signal: controller.signal})
      .then((res) => res.json() as Promise<TravelQuote>)
      .then((quote) => {
        onTravel(quote);
        if (quote.status === 'ok' && !getValues('city')) setValue('city', quote.municipality, {shouldValidate: true});
      })
      .catch((error) => {
        if (error.name !== 'AbortError') onTravel({status: 'unknown'});
      });
    return () => controller.abort();
  }, [postalCode, onTravel, getValues, setValue]);

  const complete = /^\d{5}$/.test(postalCode ?? '');

  return (
    <form id={formId} onSubmit={handleSubmit(onValid)} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label={t('street')} error={message(errors.street?.message)} className="sm:col-span-2">
        <input className="field" autoComplete="street-address" placeholder={t('streetPlaceholder')} {...register('street')} />
      </Field>

      <Field label={t('postalCode')} error={message(errors.postalCode?.message)}>
        <input className="field" inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="00100" {...register('postalCode')} />
      </Field>
      <Field label={t('city')} error={message(errors.city?.message)}>
        <input className="field" autoComplete="address-level2" {...register('city')} />
      </Field>

      <div className="sm:col-span-2" aria-live="polite" data-testid="travel-result">
        {complete && !travel && <p className="text-muted">{t('travelChecking')}</p>}
        {travel?.status === 'ok' && (
          <p className="rounded-xl border border-teal-3 bg-teal-soft px-4 py-3 font-medium text-teal-1">
            {travel.feeCents === 0
              ? t('travelFree', {municipality: travel.municipality})
              : t('travelOk', {fee: formatEur(travel.feeCents, locale), municipality: travel.municipality, km: Math.round(travel.km)})}
          </p>
        )}
        {(travel?.status === 'unknown' || travel?.status === 'out_of_range') && (
          <div className="rounded-xl border border-warn-border bg-warn-soft px-4 py-3 text-warn">
            <p>
              {travel.status === 'unknown'
                ? t('travelUnknown')
                : t('travelOut', {municipality: travel.municipality, km: Math.round(travel.km)})}
            </p>
            <a href={whatsappUrl} className="link mt-1 inline-block" rel="noopener" target="_blank">
              WhatsApp
            </a>
          </div>
        )}
      </div>

      <Field label={t('floor')} optional={tf('optional')} error={message(errors.floor?.message)}>
        <input className="field" placeholder={t('floorPlaceholder')} {...register('floor')} />
      </Field>
      <Field label={t('parking')}>
        <select className="field" {...register('parking')}>
          {PARKING.map((value) => (
            <option key={value} value={value}>
              {t(`parkingOptions.${value}`)}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t('notes')} optional={tf('optional')} error={message(errors.notes?.message)} className="sm:col-span-2">
        <textarea className="field min-h-28" placeholder={t('notesPlaceholder')} {...register('notes')} />
      </Field>
    </form>
  );
}
