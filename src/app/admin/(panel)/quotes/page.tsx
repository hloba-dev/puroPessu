import {quotePhotoUrls, setRequestStatus} from '@/app/admin/actions';
import {requireAdmin} from '@/lib/admin/auth';
import {AdminPage, StatusBadge, StatusForm, adminBtn, fmtDateTime} from '@/components/admin/ui';

export const metadata = {title: 'B2B-запросы'};

const SECTOR: Record<string, string> = {
  office: 'Офис',
  hotel_restaurant: 'Отель / ресторан',
  healthcare: 'Медицина',
  carpet: 'Ковролин',
  other: 'Другое'
};
const TIME: Record<string, string> = {workhours: 'Рабочее время', evening: 'Вечер', weekend: 'Выходные', flexible: 'Гибко'};

export default async function AdminQuotesPage() {
  const {supabase} = await requireAdmin();
  const {data, error} = await supabase.from('quote_requests').select('*').order('created_at', {ascending: false}).limit(100);
  // private bucket: photos are shown through short-lived signed URLs
  const requests = await Promise.all((data ?? []).map(async (q) => ({...q, photoUrls: await quotePhotoUrls(q.photos)})));

  return (
    <AdminPage title="B2B-запросы" error={error?.message}>
      {requests.length === 0 && <p className="text-muted">Запросов пока нет.</p>}
      <ul className="space-y-4">
        {requests.map((q) => (
          <li key={q.id} className="glass p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">
                  {q.company} {q.y_tunnus && <span className="text-sm font-normal text-muted">({q.y_tunnus})</span>}
                </p>
                <p className="text-sm text-muted">
                  {fmtDateTime(q.created_at)} · {SECTOR[q.sector]} · {TIME[q.preferred_time]} · язык: {q.locale}
                </p>
              </div>
              <StatusBadge status={q.status} />
            </div>
            <p className="mt-3 whitespace-pre-line">{q.items}</p>
            {q.notes && <p className="mt-2 whitespace-pre-line text-muted">{q.notes}</p>}
            {q.billing_address && <p className="mt-2 text-sm text-muted">Адрес для счёта: {q.billing_address}</p>}
            {q.photoUrls.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {q.photoUrls.map((url, index) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noopener" className="block">
                      {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL, not worth optimizing */}
                      <img src={url} alt={`Фото ${index + 1}`} className="size-24 rounded-lg object-cover" loading="lazy" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-2 font-medium">{q.contact_name}</span>
              <a href={`mailto:${q.email}`} className={adminBtn}>
                {q.email}
              </a>
              {q.phone && (
                <a href={`tel:${q.phone}`} className={adminBtn}>
                  {q.phone}
                </a>
              )}
              <StatusForm action={setRequestStatus} id={q.id} status={q.status} options={['new', 'in_progress', 'done']} hidden={{table: 'quote_requests'}} />
            </div>
          </li>
        ))}
      </ul>
    </AdminPage>
  );
}
