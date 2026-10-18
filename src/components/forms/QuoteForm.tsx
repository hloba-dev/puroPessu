'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {sendQuoteAction} from '@/app/actions/forms';
import {
  MAX_PHOTOS,
  MAX_PHOTO_BYTES,
  PHOTO_TYPES,
  PREFERRED_TIMES,
  SECTORS,
  quoteFields,
  type FormResult,
  type QuoteFields
} from '@/lib/forms/schema';
import {createBrowserSupabase} from '@/lib/supabase/browser';
import {Field} from './Field';
import {PhotoPicker} from './PhotoPicker';
import {FormFooter, FormSuccess, useFieldMessage, useFormSubmit} from './shared';

const BUCKET = 'quote-photos';

/** B2B quote request. Photos (max 30 × 10 MB) go straight from the browser to the private bucket via signed upload URLs. */
export function QuoteForm() {
  const t = useTranslations('forms.quote');
  const tf = useTranslations('forms');
  const message = useFieldMessage();
  const form = useFormSubmit();
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{done: number; total: number} | null>(null);
  const [failedUploads, setFailedUploads] = useState(0);
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<QuoteFields>({
    resolver: zodResolver(quoteFields),
    defaultValues: {
      contactName: '',
      company: '',
      email: '',
      phone: '',
      yTunnus: '',
      sector: 'office',
      items: '',
      preferredTime: 'flexible',
      billingAddress: '',
      notes: '',
      privacy: false
    },
    mode: 'onTouched'
  });

  const pickFiles = (list: FileList | null) => {
    const picked = [...files, ...Array.from(list ?? [])];
    if (picked.some((file) => !PHOTO_TYPES.includes(file.type))) return setFileError(t('photosType'));
    if (picked.some((file) => file.size > MAX_PHOTO_BYTES)) return setFileError(t('photosTooBig'));
    if (picked.length > MAX_PHOTOS) return setFileError(t('photosTooMany', {max: MAX_PHOTOS}));
    setFileError(null);
    setFiles(picked);
  };

  /** Uploads the photos to the signed URLs issued for this request; returns how many failed. */
  const upload = async (uploads: {index: number; path: string; token: string}[]) => {
    if (uploads.length === 0) return 0;
    const storage = createBrowserSupabase().storage.from(BUCKET);
    let failed = 0;
    setProgress({done: 0, total: uploads.length});
    for (const [done, target] of uploads.entries()) {
      const file = files[target.index];
      const {error} = await storage.uploadToSignedUrl(target.path, target.token, file, {contentType: file.type});
      if (error) failed++;
      setProgress({done: done + 1, total: uploads.length});
    }
    setProgress(null);
    return failed;
  };

  if (form.status === 'done') {
    return <FormSuccess>{failedUploads > 0 ? t('photosFailed', {count: failedUploads}) : t('success')}</FormSuccess>;
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) =>
        form.submit(async (meta): Promise<FormResult> => {
          // the request is sent first; photos follow to the upload URLs it returns
          const result = await sendQuoteAction({
            ...values,
            ...meta,
            files: files.map((f) => ({name: f.name, type: f.type, size: f.size}))
          });
          if (!result.ok) return result;
          setFailedUploads(await upload(result.uploads));
          return {ok: true};
        })
      )}
      className="grid gap-5 sm:grid-cols-2"
    >
      <Field label={t('contactName')} error={message(errors.contactName?.message)}>
        <input className="field" autoComplete="name" {...register('contactName')} />
      </Field>
      <Field label={t('company')} error={message(errors.company?.message)}>
        <input className="field" autoComplete="organization" {...register('company')} />
      </Field>
      <Field label={t('email')} error={message(errors.email?.message)}>
        <input className="field" type="email" autoComplete="email" {...register('email')} />
      </Field>
      <Field label={t('phone')} optional={tf('optional')} error={message(errors.phone?.message)}>
        <input className="field" type="tel" autoComplete="tel" {...register('phone')} />
      </Field>
      <Field label={t('yTunnus')} optional={tf('optional')} error={message(errors.yTunnus?.message)}>
        <input className="field" placeholder="1234567-8" {...register('yTunnus')} />
      </Field>
      <Field label={t('sector')}>
        <select className="field" {...register('sector')}>
          {SECTORS.map((sector) => (
            <option key={sector} value={sector}>
              {t(`sectors.${sector}`)}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t('items')} error={message(errors.items?.message)} className="sm:col-span-2">
        <textarea className="field min-h-28" placeholder={t('itemsPlaceholder')} {...register('items')} />
      </Field>
      <Field label={t('preferredTime')}>
        <select className="field" {...register('preferredTime')}>
          {PREFERRED_TIMES.map((time) => (
            <option key={time} value={time}>
              {t(`times.${time}`)}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t('billingAddress')} optional={tf('optional')} error={message(errors.billingAddress?.message)}>
        <input className="field" {...register('billingAddress')} />
      </Field>
      <Field label={t('notes')} optional={tf('optional')} error={message(errors.notes?.message)} className="sm:col-span-2">
        <textarea className="field min-h-24" {...register('notes')} />
      </Field>

      <div className="sm:col-span-2">
        <Field label={t('photos')} optional={tf('optional')} hint={t('photosHint', {max: MAX_PHOTOS})} error={fileError ?? undefined}>
          <PhotoPicker
            accept={PHOTO_TYPES.join(',')}
            label={t('choosePhotos')}
            empty={t('noPhotos')}
            count={files.length}
            onPick={pickFiles}
          />
        </Field>
        {files.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-lg border border-hairline px-3 py-1.5">
                <span className="max-w-40 truncate">{file.name}</span>
                <button
                  type="button"
                  className="text-muted hover:text-white"
                  aria-label={t('removePhoto', {name: file.name})}
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sm:col-span-2">
        <FormFooter
          form={form}
          privacy={register('privacy')}
          privacyError={message(errors.privacy?.message)}
          submitLabel={t('submit')}
          pendingLabel={progress ? t('uploading', {done: progress.done, total: progress.total}) : undefined}
        />
      </div>
    </form>
  );
}
