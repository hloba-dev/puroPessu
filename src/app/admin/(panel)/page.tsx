import Link from 'next/link';
import {requireAdmin} from '@/lib/admin/auth';
import {addDays, utcToZoned, zonedToUtc} from '@/lib/booking/tz';
import {getSettings} from '@/lib/data/public';
import {AdminPage, Card, StatusBadge, adminBtnPrimary, eur, fmtDateTime} from '@/components/admin/ui';

export const metadata = {title: 'Обзор'};

export default async function AdminDashboard() {
  const {supabase} = await requireAdmin();
  const settings = await getSettings();
  const today = utcToZoned(new Date(), settings.timezone).date;
  const dayStart = zonedToUtc(today, 0, settings.timezone).toISOString();
  const dayEnd = zonedToUtc(addDays(today, 1), 0, settings.timezone).toISOString();
  const weekEnd = zonedToUtc(addDays(today, 7), 0, settings.timezone).toISOString();

  const count = (table: 'quote_requests' | 'contact_messages' | 'data_deletion_requests') =>
    supabase.from(table).select('id', {count: 'exact', head: true}).eq('status', 'new');

  const [week, pending, quotes, messages, deletions, giftCards] = await Promise.all([
    supabase
      .from('bookings')
      .select('id, ref_code, name, phone, city, starts_at, status, total_cents')
      .in('status', ['pending', 'confirmed'])
      .gte('starts_at', dayStart)
      .lt('starts_at', weekEnd)
      .order('starts_at'),
    supabase.from('bookings').select('id', {count: 'exact', head: true}).eq('status', 'pending'),
    count('quote_requests'),
    count('contact_messages'),
    count('data_deletion_requests'),
    supabase.from('gift_cards').select('id', {count: 'exact', head: true}).eq('status', 'requested')
  ]);

  const upcoming = week.data ?? [];
  const todays = upcoming.filter((b) => b.starts_at < dayEnd);
  const tiles = [
    {label: 'Брони сегодня', value: todays.length, href: '/admin/bookings'},
    {label: 'Брони на 7 дней', value: upcoming.length, href: '/admin/bookings'},
    {label: 'Ждут подтверждения', value: pending.count ?? 0, href: '/admin/bookings?status=pending'},
    {label: 'Новые B2B-запросы', value: quotes.count ?? 0, href: '/admin/quotes'},
    {label: 'Новые сообщения', value: messages.count ?? 0, href: '/admin/messages'},
    {label: 'Заявки на сертификаты', value: giftCards.count ?? 0, href: '/admin/gift-cards'},
    {label: 'Запросы на удаление данных', value: deletions.count ?? 0, href: '/admin/deletion'}
  ];

  return (
    <AdminPage
      title="Обзор"
      actions={
        <Link href="/admin/bookings/new" className={adminBtnPrimary}>
          + Новая бронь
        </Link>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => (
          <li key={tile.label}>
            <Link href={tile.href} className="glass block p-5 hover:border-teal-2">
              <p className="text-3xl font-bold">{tile.value}</p>
              <p className="mt-1 text-sm text-muted">{tile.label}</p>
            </Link>
          </li>
        ))}
      </ul>

      <Card title="Ближайшие 7 дней" className="mt-6">
        {upcoming.length === 0 ? (
          <p className="text-muted">Броней нет.</p>
        ) : (
          <ul className="divide-y divide-hairline">
            {upcoming.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold">{fmtDateTime(b.starts_at)}</p>
                  <p className="text-sm text-muted">
                    {b.ref_code} · {b.name} · {b.city}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{eur(b.total_cents)}</span>
                  <StatusBadge status={b.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AdminPage>
  );
}
