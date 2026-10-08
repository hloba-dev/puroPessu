import {setRequestStatus} from '@/app/admin/actions';
import {requireAdmin} from '@/lib/admin/auth';
import {AdminPage, StatusBadge, StatusForm, adminBtn, fmtDateTime} from '@/components/admin/ui';

export const metadata = {title: 'Удаление данных'};

export default async function AdminDeletionPage() {
  const {supabase} = await requireAdmin();
  const {data, error} = await supabase.from('data_deletion_requests').select('*').order('created_at', {ascending: false}).limit(200);

  return (
    <AdminPage title="Запросы на удаление данных (GDPR)" error={error?.message}>
      <p className="mb-6 max-w-3xl text-muted">
        Ответить нужно в течение месяца. Перед удалением убедитесь, что запрос отправил сам владелец данных (например, ответом на его
        e-mail). Бухгалтерские документы хранятся по закону и не удаляются.
      </p>
      {(data ?? []).length === 0 && <p className="text-muted">Запросов нет.</p>}
      <ul className="space-y-4">
        {(data ?? []).map((r) => (
          <li key={r.id} className="glass p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-sm text-muted">
                {fmtDateTime(r.created_at)} · язык: {r.locale}
              </p>
              <StatusBadge status={r.status} />
            </div>
            {r.details && <p className="mt-3 whitespace-pre-line">{r.details}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a href={`mailto:${r.email}`} className={adminBtn}>
                {r.email}
              </a>
              {r.phone && <span className="text-muted">{r.phone}</span>}
              <StatusForm action={setRequestStatus} id={r.id} status={r.status} options={['new', 'in_progress', 'done']} hidden={{table: 'data_deletion_requests'}} />
            </div>
          </li>
        ))}
      </ul>
    </AdminPage>
  );
}
