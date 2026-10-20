'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {addGalleryItem} from '@/app/admin/actions';
import {adminBtnPrimary, adminInput} from '@/components/admin/ui';
import {MAX_BYTES, PHOTO_ACCEPT, uploadGalleryPhoto} from './upload';

/** Uploads a before/after pair straight to the public `gallery` bucket (as the signed-in admin), then saves the row. */
export function GalleryUploader({categories}: {categories: {slug: string; name: string}[]}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{kind: 'error' | 'ok'; text: string} | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const before = form.get('before') as File | null;
    const after = form.get('after') as File | null;
    if (!before?.size || !after?.size) return setMessage({kind: 'error', text: 'Выберите оба фото.'});
    if (before.size > MAX_BYTES || after.size > MAX_BYTES) return setMessage({kind: 'error', text: 'Файл больше 10 МБ.'});

    setBusy(true);
    setMessage(null);
    const stamp = Date.now();
    const upload = async (file: File, kind: 'before' | 'after') => (await uploadGalleryPhoto(file, `${stamp}-${kind}`)).url;

    try {
      const [beforeUrl, afterUrl] = await Promise.all([upload(before, 'before'), upload(after, 'after')]);
      const result = await addGalleryItem({
        beforeUrl,
        afterUrl,
        caption: {fi: String(form.get('caption_fi') ?? ''), ru: String(form.get('caption_ru') ?? ''), en: String(form.get('caption_en') ?? '')},
        serviceSlug: String(form.get('service_slug') ?? 'sofas'),
        isFeatured: form.get('is_featured') === 'on'
      });
      if (!result.ok) throw new Error(result.error);
      formElement.reset();
      setMessage({kind: 'ok', text: 'Пара добавлена.'});
      router.refresh();
    } catch (error) {
      setMessage({kind: 'error', text: error instanceof Error ? error.message : 'Не удалось загрузить.'});
    } finally {
      setBusy(false);
    }
  };

  const label = 'mb-1 block text-sm text-muted';

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <label>
        <span className={label}>Фото «до» *</span>
        <input type="file" name="before" accept={PHOTO_ACCEPT} required className={adminInput} />
      </label>
      <label>
        <span className={label}>Фото «после» * (тот же ракурс и размер)</span>
        <input type="file" name="after" accept={PHOTO_ACCEPT} required className={adminInput} />
      </label>
      <label>
        <span className={label}>Раздел</span>
        <select name="service_slug" className={adminInput}>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      {(['fi', 'ru', 'en'] as const).map((locale) => (
        <label key={locale}>
          <span className={label}>
            Подпись ({locale}){locale === 'fi' && ' *'}
          </span>
          <input name={`caption_${locale}`} required={locale === 'fi'} maxLength={80} className={adminInput} />
        </label>
      ))}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_featured" defaultChecked className="size-4 accent-teal-3" /> Показывать на главной
      </label>
      <div className="md:col-span-2 xl:col-span-3">
        <button type="submit" className={adminBtnPrimary} disabled={busy}>
          {busy ? 'Загрузка…' : 'Добавить пару'}
        </button>
        {message && (
          <span role={message.kind === 'error' ? 'alert' : 'status'} className={`ml-4 ${message.kind === 'error' ? 'text-danger' : 'text-teal-1'}`}>
            {message.text}
          </span>
        )}
      </div>
    </form>
  );
}
