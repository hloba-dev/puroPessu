import {setRequestStatus} from '@/app/admin/actions';
import {requireAdmin} from '@/lib/admin/auth';
import {AdminPage, StatusBadge, StatusForm, adminBtn, fmtDateTime} from '@/components/admin/ui';

export const metadata = {title: 'Сообщения'};

export default async function AdminMessagesPage() {
  const {supabase} = await requireAdmin();
  const {data, error} = await supabase.from('contact_messages').select('*').order('created_at', {ascending: false}).limit(200);

  return (
    <AdminPage title="Сообщения с формы контактов" error={error?.message}>
      {(data ?? []).length === 0 && <p className="text-muted">Сообщений пока нет.</p>}
      <ul className="space-y-4">
        {(data ?? []).map((m) => (
          <li key={m.id} className="glass p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p>
                <span className="font-semibold">{m.name}</span>
                <span className="block text-sm text-muted">
                  {fmtDateTime(m.created_at)} · язык: {m.locale}
                </span>
              </p>
              <StatusBadge status={m.status} />
            </div>
            <p className="mt-3 whitespace-pre-line">{m.message}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a href={`mailto:${m.email}`} className={adminBtn}>
                {m.email}
              </a>
              {m.phone && (
                <a href={`tel:${m.phone}`} className={adminBtn}>
                  {m.phone}
                </a>
              )}
              <StatusForm action={setRequestStatus} id={m.id} status={m.status} options={['new', 'in_progress', 'done']} hidden={{table: 'contact_messages'}} />
            </div>
          </li>
        ))}
      </ul>
    </AdminPage>
  );
}
