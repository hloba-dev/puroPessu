'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {sendContactAction} from '@/app/actions/forms';
import {contactFields, type ContactFields} from '@/lib/forms/schema';
import {Field} from './Field';
import {FormFooter, FormSuccess, useFieldMessage, useFormSubmit} from './shared';

export function ContactForm() {
  const t = useTranslations('forms.contact');
  const tf = useTranslations('forms');
  const message = useFieldMessage();
  const form = useFormSubmit();
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<ContactFields>({
    resolver: zodResolver(contactFields),
    defaultValues: {name: '', email: '', phone: '', message: '', privacy: false},
    mode: 'onTouched'
  });

  if (form.status === 'done') return <FormSuccess>{t('success')}</FormSuccess>;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => form.submit((meta) => sendContactAction({...values, ...meta})))}
      className="grid gap-5 sm:grid-cols-2"
    >
      <Field label={t('name')} error={message(errors.name?.message)} className="sm:col-span-2">
        <input className="field" autoComplete="name" {...register('name')} />
      </Field>
      <Field label={t('email')} error={message(errors.email?.message)}>
        <input className="field" type="email" autoComplete="email" {...register('email')} />
      </Field>
      <Field label={t('phone')} optional={tf('optional')} error={message(errors.phone?.message)}>
        <input className="field" type="tel" autoComplete="tel" {...register('phone')} />
      </Field>
      <Field label={t('message')} error={message(errors.message?.message)} className="sm:col-span-2">
        <textarea className="field min-h-36" {...register('message')} />
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
