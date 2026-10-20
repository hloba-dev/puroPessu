import Link from 'next/link';
import {bookingPhotoUrls, setBookingStatus} from '@/app/admin/actions';
import {requireAdmin} from '@/lib/admin/auth';
import {promoLabel} from '@/lib/booking/promo-details';
import {hoursAgo, utcToZoned} from '@/lib/booking/tz';
import type {PromoDetails} from '@/lib/data/store';
import type {Enums, Tables} from '@/lib/supabase/database.types';
import {AdminPage, Card, StatusBadge, StatusForm, adminBtn, adminBtnPrimary, adminInput, eur, fmtDateTime} from '@/components/admin/ui';

export const metadata = {title: 'Брони'};

const STATUSES = ['pending', 'confirmed', 'done', 'cancelled'];
const TZ = 'Europe/Helsinki';

type Booking = Tables<'bookings'> & {
  booking_items: Pick<Tables<'booking_items'>, 'name' | 'qty' | 'very_dirty'>[];
  photoUrls?: string[];
};

function BookingCard({b}: {b: Booking}) {
  const digits = b.phone.replace(/\D/g, '');
  return (
    <li className="glass p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">{fmtDateTime(b.starts_at)}</p>
          <p className="text-sm text-muted">
            {b.ref_code} · {b.duration_min} мин · язык: {b.locale}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">{eur(b.total_cents)}</span>
          <StatusBadge status={b.status} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 text-[15px] md:grid-cols-2">
        <div>
          <p className="font-medium">
            {b.name}
            {b.company && ` · ${b.company} (${b.y_tunnus ?? '—'})`}
          </p>
          <p className="text-muted">
            {b.address}, {b.postal_code} {b.city}
            {b.floor && ` · ${b.floor}`}
            {b.parking && ` · парковка: ${b.parking}`}
          </p>
          {b.notes && <p className="mt-1 text-muted">«{b.notes}»</p>}
          <p className="mt-2 flex flex-wrap gap-2">
            <a href={`tel:+${digits}`} className={adminBtn}>
              Позвонить {b.phone}
            </a>
            <a href={`https://wa.me/${digits}`} className={adminBtn} target="_blank" rel="noopener">
              WhatsApp
            </a>
            <a href={`mailto:${b.email}`} className={adminBtn}>
              {b.email}
            </a>
          </p>
        </div>
        <div>
          <ul className="space-y-1">
            {b.booking_items.map((item) => (
              <li key={item.name}>
                {item.name} × {item.qty}
                {item.very_dirty && <span className="text-warn"> · очень грязное</span>}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-muted">
            Работы {eur(b.subtotal_cents)}
            {b.min_fill_cents > 0 && ` + до минимума ${eur(b.min_fill_cents)}`}
            {b.promo_cents > 0 && ` − скидка ${eur(b.promo_cents)} (${promoLabel((b.promo_details ?? {}) as PromoDetails)})`} + транспорт{' '}
            {eur(b.travel_cents)}
            {b.discount_cents > 0 && ` − сертификат ${eur(b.discount_cents)} (${b.gift_card_code})`}
          </p>
          {(b.photoUrls?.length ?? 0) > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {b.photoUrls!.map((url, index) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener">
                    {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL, not worth optimizing */}
                    <img src={url} alt={`Фото клиента ${index + 1}`} className="size-20 rounded-lg object-cover" loading="lazy" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3">
            <StatusForm action={setBookingStatus} id={b.id} status={b.status} options={STATUSES} />
          </div>
        </div>
      </div>
    </li>
  );
}

export default async function AdminBookingsPage({searchParams}: PageProps<'/admin/bookings'>) {
  const {supabase} = await requireAdmin();
  const params = await searchParams;
  const status = typeof params.status === 'string' && STATUSES.includes(params.status) ? params.status : '';
  const view = params.view === 'calendar' ? 'calendar' : 'list';
  const from = typeof params.from === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(params.from) ? params.from : '';

  let query = supabase.from('bookings').select('*, booking_items(name, qty, very_dirty)').order('starts_at', {ascending: view === 'calendar' || !status});
  if (status) query = query.eq('status', status as Enums<'booking_status'>);
  if (view === 'calendar') query = query.in('status', ['pending', 'confirmed']);
  // by default the list starts from today; a date filter moves the start
  query = query.gte('starts_at', from ? `${from}T00:00:00+02:00` : hoursAgo(12));
  const {data, error} = await query.limit(200);
  // photos attached by customers live in a private bucket: short-lived signed URLs for the admin
  const bookings = await Promise.all(
    ((data ?? []) as unknown as Booking[]).map(async (b) => ({...b, photoUrls: await bookingPhotoUrls(b.photos ?? [])}))
  );

  // calendar view: bookings grouped by local day
  const byDay = new Map<string, Booking[]>();
  for (const b of bookings) {
    const day = utcToZoned(new Date(b.starts_at), TZ).date;
    byDay.set(day, [...(byDay.get(day) ?? []), b]);
  }

  const tab = (label: string, href: string, active: boolean) => (
    <Link href={href} className={active ? adminBtnPrimary : adminBtn}>
      {label}
    </Link>
  );

  return (
    <AdminPage
      title="Брони"
      error={typeof params.error === 'string' ? params.error : error?.message}
      actions={
        <Link href="/admin/bookings/new" className={adminBtnPrimary}>
          + Новая бронь
        </Link>
      }
    >
      <Card>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tab('Список', '/admin/bookings', view === 'list')}
            {tab('Календарь', '/admin/bookings?view=calendar', view === 'calendar')}
          </div>
          <form className="flex flex-wrap items-end gap-3">
            {view === 'calendar' && <input type="hidden" name="view" value="calendar" />}
            <label className="text-sm">
              <span className="mb-1 block text-muted">Статус</span>
              <select name="status" defaultValue={status} className={adminInput}>
                <option value="">Все</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted">С даты</span>
              <input type="date" name="from" defaultValue={from} className={adminInput} />
            </label>
            <button type="submit" className={adminBtn}>
              Показать
            </button>
          </form>
        </div>
      </Card>

      {bookings.length === 0 && <p className="mt-6 text-muted">Броней не найдено.</p>}

      {view === 'list' ? (
        <ul className="mt-6 space-y-4">
          {bookings.map((b) => (
            <BookingCard key={b.id} b={b} />
          ))}
        </ul>
      ) : (
        <div className="mt-6 space-y-6">
          {[...byDay.entries()].map(([day, items]) => (
            <section key={day}>
              <h2 className="sticky top-0 z-10 bg-bg py-2 text-lg font-semibold">
                {new Intl.DateTimeFormat('ru-RU', {weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'}).format(
                  new Date(`${day}T12:00:00Z`)
                )}
              </h2>
              <ul className="mt-2 space-y-2 border-l-2 border-teal-3 pl-4">
                {items.map((b) => {
                  const start = utcToZoned(new Date(b.starts_at), TZ).minutes;
                  const end = start + b.duration_min;
                  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
                  return (
                    <li key={b.id} className="glass flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                      <p>
                        <span className="font-semibold">
                          {hm(start)}–{hm(end)}
                        </span>{' '}
                        · {b.name} · {b.address}, {b.city}
                        <span className="block text-sm text-muted">{b.booking_items.map((i) => `${i.name} × ${i.qty}`).join(', ')}</span>
                      </p>
                      <span className="flex items-center gap-3">
                        {eur(b.total_cents)} <StatusBadge status={b.status} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
