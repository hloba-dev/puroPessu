'use client';

import {useState} from 'react';
import {replaceGalleryPhoto} from '@/app/admin/actions';
import {MAX_BYTES, PHOTO_ACCEPT, discardGalleryPhoto, uploadGalleryPhoto} from './upload';

/** "Заменить" on a before/after photo: uploads the chosen file and puts it in place of the old one. */
export function ReplacePhoto({id, kind}: {id: string; kind: 'before' | 'after'}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const name = kind === 'before' ? 'до' : 'после';

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > MAX_BYTES) {
      input.value = '';
      return setError('Файл больше 10 МБ.');
    }

    setBusy(true);
    setError(null);
    try {
      const uploaded = await uploadGalleryPhoto(file, `${Date.now()}-${kind}`);
      const result = await replaceGalleryPhoto({id, kind, url: uploaded.url});
      if (!result.ok) {
        await discardGalleryPhoto(uploaded.path);
        throw new Error(result.error);
      }
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Не удалось загрузить.');
    } finally {
      // the same file can be picked again after an error
      input.value = '';
      setBusy(false);
    }
  };

  return (
    <>
      <label
        className={`absolute right-2 bottom-2 inline-flex min-h-9 cursor-pointer items-center rounded-lg border border-text/30 bg-black/75 px-3 text-sm font-semibold hover:border-teal-2 hover:text-teal-1 focus-within:outline-2 focus-within:outline-teal-2 ${busy ? 'pointer-events-none opacity-70' : ''}`}
      >
        {busy ? 'Загрузка…' : 'Заменить'}
        <input
          type="file"
          accept={PHOTO_ACCEPT}
          disabled={busy}
          onChange={onChange}
          aria-label={`Заменить фото «${name}»`}
          className="sr-only"
        />
      </label>
      {error && (
        <p role="alert" className="absolute inset-x-2 top-10 rounded-lg bg-black/85 px-2 py-1 text-xs text-danger">
          {error}
        </p>
      )}
    </>
  );
}
