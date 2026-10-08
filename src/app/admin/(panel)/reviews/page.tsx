import {deleteReview, saveReview} from '@/app/admin/actions';
import {requireAdmin} from '@/lib/admin/auth';
import type {Tables} from '@/lib/supabase/database.types';
import {AdminPage, Card, adminBtn, adminBtnDanger, adminBtnPrimary, adminInput} from '@/components/admin/ui';

export const metadata = {title: 'Отзывы'};

const label = 'mb-1 block text-xs text-muted';

function ReviewForm({review}: {review?: Tables<'reviews'>}) {
  return (
    <form action={saveReview} className="grid items-end gap-3 md:grid-cols-6">
      {review && <input type="hidden" name="id" value={review.id} />}
      <label className="md:col-span-2">
        <span className={label}>Автор</span>
        <input name="author" required defaultValue={review?.author} className={adminInput} />
      </label>
      <label>
        <span className={label}>Оценка</span>
        <input name="rating" type="number" min={1} max={5} defaultValue={review?.rating ?? 5} className={adminInput} />
      </label>
      <label>
        <span className={label}>Язык</span>
        <select name="locale" defaultValue={review?.locale ?? 'fi'} className={adminInput}>
          <option value="fi">fi</option>
          <option value="ru">ru</option>
          <option value="en">en</option>
        </select>
      </label>
      <label>
        <span className={label}>Источник</span>
        <select name="source" defaultValue={review?.source ?? 'google'} className={adminInput}>
          <option value="google">Google</option>
          <option value="site">Сайт</option>
        </select>
      </label>
      <label>
        <span className={label}>Дата</span>
        <input name="date" type="date" defaultValue={review?.date} className={adminInput} />
      </label>
      <label className="md:col-span-6">
        <span className={label}>Текст отзыва (дословно, как написал клиент)</span>
        <textarea name="text" required defaultValue={review?.text} className={`${adminInput} min-h-20`} />
      </label>
      <label className="flex min-h-10 items-center gap-2 text-sm md:col-span-2">
        <input type="checkbox" name="is_published" defaultChecked={review?.is_published ?? false} className="size-4 accent-cyan-600" />
        Опубликован на сайте
      </label>
      <button type="submit" className={review ? adminBtn : adminBtnPrimary}>
        {review ? 'Сохранить' : 'Добавить отзыв'}
      </button>
    </form>
  );
}

export default async function AdminReviewsPage({searchParams}: PageProps<'/admin/reviews'>) {
  const {supabase} = await requireAdmin();
  const [{error}, reviews] = await Promise.all([
    searchParams,
    supabase.from('reviews').select('*').order('date', {ascending: false}).limit(200)
  ]);

  return (
    <AdminPage title="Отзывы" error={typeof error === 'string' ? error : reviews.error?.message}>
      <p className="mb-6 max-w-3xl text-muted">
        На сайте и в разметке для Google (рейтинг в JSON-LD) показываются только опубликованные отзывы. Публикуйте только настоящие
        отзывы клиентов — демо-записи остаются черновиками.
      </p>
      <Card title="Новый отзыв">
        <ReviewForm />
      </Card>
      <ul className="mt-6 space-y-4">
        {(reviews.data ?? []).map((review) => (
          <li key={review.id} className="glass p-5">
            <ReviewForm review={review} />
            <form action={deleteReview} className="mt-3">
              <input type="hidden" name="id" value={review.id} />
              <button type="submit" className={adminBtnDanger}>
                Удалить
              </button>
            </form>
          </li>
        ))}
      </ul>
    </AdminPage>
  );
}
