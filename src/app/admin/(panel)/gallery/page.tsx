import Image from 'next/image';
import {deleteGalleryItem, updateGalleryItem} from '@/app/admin/actions';
import {requireAdmin} from '@/lib/admin/auth';
import type {Json} from '@/lib/supabase/database.types';
import {AdminPage, Card, adminBtn, adminBtnDanger, adminInput} from '@/components/admin/ui';
import {GalleryUploader} from './GalleryUploader';
import {ReplacePhoto} from './ReplacePhoto';

export const metadata = {title: 'Галерея'};

const caption = (value: Json, locale: string) => ((value ?? {}) as Record<string, string>)[locale] ?? '';

export default async function AdminGalleryPage({searchParams}: PageProps<'/admin/gallery'>) {
  const {supabase} = await requireAdmin();
  const [{error}, items, categories] = await Promise.all([
    searchParams,
    supabase.from('gallery_items').select('*').order('sort'),
    supabase.from('service_categories').select('slug, name').order('sort')
  ]);
  const categoryOptions = (categories.data ?? []).map((c) => ({slug: c.slug, name: caption(c.name, 'ru') || caption(c.name, 'fi')}));
  const label = 'mb-1 block text-xs text-muted';

  return (
    <AdminPage title="Галерея «до / после»" error={typeof error === 'string' ? error : undefined}>
      <Card title="Добавить пару">
        <GalleryUploader categories={categoryOptions} />
      </Card>

      <ul className="mt-6 grid gap-5 xl:grid-cols-2">
        {(items.data ?? []).map((item) => (
          <li key={item.id} className="glass p-5">
            <div className="grid grid-cols-2 gap-3">
              {[item.before_url, item.after_url].map((url, index) => (
                <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface">
                  <Image src={url} alt={index === 0 ? 'До' : 'После'} fill sizes="300px" className="object-cover" />
                  <span className="absolute top-2 left-2 rounded bg-black/70 px-2 py-0.5 text-xs">{index === 0 ? 'До' : 'После'}</span>
                  <ReplacePhoto id={item.id} kind={index === 0 ? 'before' : 'after'} />
                </div>
              ))}
            </div>
            <form action={updateGalleryItem} className="mt-4 grid items-end gap-3 sm:grid-cols-3">
              <input type="hidden" name="id" value={item.id} />
              {(['fi', 'ru', 'en'] as const).map((locale) => (
                <label key={locale}>
                  <span className={label}>Подпись ({locale})</span>
                  <input name={`caption_${locale}`} defaultValue={caption(item.caption, locale)} className={adminInput} />
                </label>
              ))}
              <label>
                <span className={label}>Раздел</span>
                <select name="service_slug" defaultValue={item.service_slug} className={adminInput}>
                  {categoryOptions.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className={label}>Порядок</span>
                <input name="sort" type="number" defaultValue={item.sort} className={adminInput} />
              </label>
              <label className="flex min-h-10 items-center gap-2 text-sm">
                <input type="checkbox" name="is_featured" defaultChecked={item.is_featured} className="size-4 accent-teal-3" />
                На главной
              </label>
              <button type="submit" className={adminBtn}>
                Сохранить
              </button>
            </form>
            <form action={deleteGalleryItem} className="mt-3">
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className={adminBtnDanger}>
                Удалить пару
              </button>
            </form>
          </li>
        ))}
      </ul>
    </AdminPage>
  );
}
