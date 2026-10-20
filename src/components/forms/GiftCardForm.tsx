'use client';

import {useForm, useWatch} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {sendGiftCardAction} from '@/app/actions/forms';
import {GIFT_CUSTOM, GIFT_MAX_EUR, GIFT_MIN_EUR, giftCardFields, type GiftCardFields} from '@/lib/forms/schema';
import {Field} from './Field';
import {FormFooter, FormSuccess, useFieldMessage, useFormSubmit} from './shared';

interface Props {
  /** service gift cards offered, with labels already priced from the catalog */
  options: {value: string; label: string}[];
  customLabel: string;
}

export function GiftCardForm({options, customLabel}: Props) {
  const t = useTranslations('forms.giftCard');
  const tf = useTranslations('forms');
  const message = useFieldMessage();
  const form = useFormSubmit();
  const {
    register,
    handleSubmit,
    control,
    formState: {errors}
  } = useForm<GiftCardFields>({
    resolver: zodResolver(giftCardFields),
    defaultValues: {
      option: options[0]?.value ?? GIFT_CUSTOM,
      amount: '',
      buyerName: '',
      buyerEmail: '',
      buyerPhone: '',
      recipientName: '',
      message: '',
      privacy: false
    },
    mode: 'onTouched'
  });
  const option = useWatch({control, name: 'option'});

  if (form.status === 'done') return <FormSuccess>{t('success')}</FormSuccess>;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => form.submit((meta) => sendGiftCardAction({...values, ...meta})))}
      className="grid gap-5 sm:grid-cols-2"
    >
      <Field label={t('option')} className={option === GIFT_CUSTOM ? '' : 'sm:col-span-2'}>
        <select className="field" {...register('option')}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
          <option value={GIFT_CUSTOM}>{customLabel}</option>
        </select>
      </Field>
      {option === GIFT_CUSTOM && (
        <Field
          label={t('amount')}
          hint={t('amountHint', {min: GIFT_MIN_EUR, max: GIFT_MAX_EUR})}
          error={errors.amount ? t('amountHint', {min: GIFT_MIN_EUR, max: GIFT_MAX_EUR}) : undefined}
        >
          <input className="field" inputMode="decimal" {...register('amount')} />
        </Field>
      )}

      <Field label={t('buyerName')} error={message(errors.buyerName?.message)}>
        <input className="field" autoComplete="name" autoCapitalize="words" {...register('buyerName')} />
      </Field>
      <Field label={t('buyerEmail')} error={message(errors.buyerEmail?.message)}>
        <input className="field" type="email" autoComplete="email" {...register('buyerEmail')} />
      </Field>
      <Field label={t('buyerPhone')} optional={tf('optional')} error={message(errors.buyerPhone?.message)}>
        <input className="field" type="tel" autoComplete="tel" {...register('buyerPhone')} />
      </Field>
      <Field label={t('recipientName')} optional={tf('optional')} error={message(errors.recipientName?.message)}>
        <input className="field" {...register('recipientName')} />
      </Field>
      <Field label={t('message')} optional={tf('optional')} error={message(errors.message?.message)} className="sm:col-span-2">
        <textarea className="field min-h-24" maxLength={300} {...register('message')} />
      </Field>
      <div className="sm:col-span-2">
        <FormFooter
          form={form}
          privacy={register('privacy')}
          privacyError={message(errors.privacy?.message)}
          submitLabel={t('submit')}
        />
      </div>
    </form>
  );
}
