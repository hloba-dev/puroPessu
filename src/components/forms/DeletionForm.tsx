'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {sendDeletionAction} from '@/app/actions/forms';
import {deletionFields, type DeletionFields} from '@/lib/forms/schema';
import {Field} from './Field';
import {FormFooter, FormSuccess, useFieldMessage, useFormSubmit} from './shared';

export function DeletionForm() {
  const t = useTranslations('forms.deletion');
  const tf = useTranslations('forms');
  const message = useFieldMessage();
  const form = useFormSubmit();
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<DeletionFields>({
    resolver: zodResolver(deletionFields),
    defaultValues: {email: '', phone: '', details: '', privacy: false},
    mode: 'onTouched'
  });

  if (form.status === 'done') return <FormSuccess>{t('success')}</FormSuccess>;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => form.submit((meta) => sendDeletionAction({...values, ...meta})))}
      className="grid gap-5 sm:grid-cols-2"
    >
      <Field label={t('email')} hint={t('emailHint')} error={message(errors.email?.message)}>
        <input className="field" type="email" autoComplete="email" {...register('email')} />
      </Field>
      <Field label={t('phone')} optional={tf('optional')} error={message(errors.phone?.message)}>
        <input className="field" type="tel" autoComplete="tel" {...register('phone')} />
      </Field>
      <Field label={t('details')} optional={tf('optional')} error={message(errors.details?.message)} className="sm:col-span-2">
        <textarea className="field min-h-28" {...register('details')} />
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
