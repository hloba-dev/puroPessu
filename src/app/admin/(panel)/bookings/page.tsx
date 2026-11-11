import Link from 'next/link';
import {bookingPhotoUrls} from '@/app/admin/actions';
import {requireAdmin} from '@/lib/admin/auth';
import {bookingsWord, daySpan, gridHours, searchTerm, weekDays, weekStart} from '@/lib/admin/board';
import {addDays, hoursAgo, utcToZoned, zonedToUtc} from '@/lib/booking/tz';
import {getSettings} from '@/lib/data/public';
import type {Enums} from '@/lib/supabase/database.types';
import {
  BOOKING_STATUSES,
  BookingCard,
  DayList,
  DayStrip,
  PendingQueue,
  StatusLegend,
  SummaryTiles,
  WeekGrid,
  bookingTimes,
  fmtWeek,
  type BoardBooking,
  type BoardDay,
  type Tile
} from '@/components/admin/bookings';
import {AdminPage, Card, STATUS_RU, adminBtn, adminBtnPrimary, adminInput, eur} from '@/components/admin/ui';

export const metadata = {title: 'Брони'};

const WITH_ITEMS = '*, booking_items(name, qty, very_dirty)';
const LIVE: Enums<'booking_status'>[] = ['pending', 'confirmed', 'done'];
const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export default async function AdminBookingsPage({searchParams}: PageProps<'/admin/bookings'>) {
  const {supabase} = await requireAdmin();
  const [params, settings] = await Promise.all([searchParams, getSettings()]);
  const one = (key: string) => {
    const value = params[key];
    return typeof value === 'string' ? value.trim() : '';
  };

  const tz = settings.timezone;
  const nowDate = new Date();
  const now = nowDate.getTime();
  const nowLocal = utcToZoned(nowDate, tz);
  const today = nowLocal.date;
  const tomorrow = addDays(today, 1);
  const dayStart = (date: string) => zonedToUtc(date, 0, tz).toISOString();

  // list filters
  const status = BOOKING_STATUSES.includes(one('status')) ? (one('status') as Enums<'booking_status'>) : '';
  const fromDate = isDate(one('from')) ? one('from') : '';
  const q = searchTerm(one('q'));
  const view = one('view') === 'list' || status || fromDate || q ? 'list' : 'week';

  // week on the board
  const monday = weekStart(isDate(one('week')) ? one('week') : today);
  const thisMonday = weekStart(today);
  const dates = weekDays(monday);
  const showCancelled = one('cancelled') === '1';

  const weekHref = (week: string, extra: Record<string, string> = {}) => {
    const query = new URLSearchParams({...(week === thisMonday ? {} : {week}), ...extra}).toString();
    return `/admin/bookings${query ? `?${query}` : ''}`;
  };
  const listHref = (filters: Record<string, string>) =>
    `/admin/bookings?${new URLSearchParams({view: 'list', ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value))})}`;
  // the view to come back to when a status button fails
  const self = view === 'week' ? weekHref(monday, showCancelled ? {cancelled: '1'} : {}) : listHref({status, from: fromDate, q});

  // what both views show on top: bookings waiting for the owner and the days right ahead
  const pendingQuery = supabase.from('bookings').select(WITH_ITEMS).eq('status', 'pending').order('starts_at').limit(50);
  const aheadQuery = supabase
    .from('bookings')
    .select('starts_at, total_cents')
    .in('status', LIVE)
    .gte('starts_at', dayStart(today))
    .lt('starts_at', dayStart(addDays(today, 7)));

  let mainQuery = supabase.from('bookings').select(WITH_ITEMS);
  if (view === 'week') {
    mainQuery = mainQuery.gte('starts_at', dayStart(monday)).lt('starts_at', dayStart(addDays(monday, 7))).order('starts_at');
  } else {
    if (status) mainQuery = mainQuery.eq('status', status);
    if (q) {
      const like = `*${q}*`;
      mainQuery = mainQuery.or(
        ['name', 'phone', 'email', 'ref_code', 'address', 'city', 'company'].map((column) => `${column}.ilike."${like}"`).join(',')
      );
    }
    // a search looks through everything; otherwise the list starts from today, or from the chosen date
    if (fromDate) mainQuery = mainQuery.gte('starts_at', dayStart(fromDate));
    else if (!q) mainQuery = mainQuery.gte('starts_at', hoursAgo(12));
    mainQuery = mainQuery.order('starts_at', {ascending: !q && !status}).limit(200);
  }

  const [main, pending, ahead, blocked, staff] = await Promise.all([
    mainQuery,
    pendingQuery,
    aheadQuery,
    view === 'week'
      ? supabase.from('blocked_times').select('*').lt('starts_at', dayStart(addDays(monday, 7))).gt('ends_at', dayStart(monday))
      : null,
    view === 'week' ? supabase.from('staff').select('id').eq('is_active', true) : null
  ]);

  // photos attached by customers live in a private bucket: short-lived signed URLs for the admin
  const withPhotos = (rows: unknown) =>
    Promise.all(
      ((rows ?? []) as BoardBooking[]).map(async (b) => ({...b, photoUrls: b.photos?.length ? await bookingPhotoUrls(b.photos) : []}))
    );
  const [bookings, pendingRows] = await Promise.all([withPhotos(main.data), withPhotos(pending.data)]);

  // ---------- tiles ----------
  const aheadRows = ahead.data ?? [];
  const onDay = (date: string) => aheadRows.filter((b) => utcToZoned(new Date(b.starts_at), tz).date === date);
  const dayTile = (label: string, date: string): Tile => {
    const rows = onDay(date);
    return {
      label,
      value: `${rows.length} ${bookingsWord(rows.length)}`,
      note: rows.length ? eur(sum(rows.map((b) => b.total_cents))) : undefined,
      href: `${weekHref(weekStart(date))}#day-${date}`
    };
  };
  const tiles: Tile[] = [
    {
      label: 'Ждут подтверждения',
      value: String(pendingRows.length),
      href: listHref({status: 'pending'}),
      attention: pendingRows.length > 0
    },
    dayTile('Сегодня', today),
    dayTile('Завтра', tomorrow),
    {
      label: 'Ближайшие 7 дней',
      value: `${aheadRows.length} ${bookingsWord(aheadRows.length)}`,
      note: aheadRows.length ? eur(sum(aheadRows.map((b) => b.total_cents))) : undefined,
      href: listHref({})
    }
  ];

  // ---------- week board ----------
  const blockRows = blocked?.data ?? [];
  const severalCleaners = (staff?.data?.length ?? 1) > 1;
  const days: BoardDay[] = dates.map((date) => {
    const all = bookings.filter((b) => bookingTimes(b, tz).date === date);
    const live = all.filter((b) => b.status !== 'cancelled');
    return {
      date,
      isToday: date === today,
      past: date < today,
      bookings: showCancelled ? all : live,
      blocks: blockRows.flatMap((row) => {
        const span = daySpan(row.starts_at, row.ends_at, date, tz);
        // a block for one cleaner leaves the others bookable
        return span ? [{...span, reason: row.reason, partial: row.staff_id !== null && severalCleaners}] : [];
      }),
      count: live.length,
      sumCents: sum(live.map((b) => b.total_cents)),
      workMin: sum(live.map((b) => b.duration_min))
    };
  });
  const hours = gridHours(
    settings.openFrom,
    settings.openTo,
    days.flatMap((day) =>
      day.bookings.map((b) => {
        const t = bookingTimes(b, tz);
        return {start: t.start, end: Math.min(t.busyEnd, 24 * 60)};
      })
    )
  );
  const cancelledCount = view === 'week' ? bookings.filter((b) => b.status === 'cancelled').length : 0;
  const weekTotal = {count: sum(days.map((d) => d.count)), cents: sum(days.map((d) => d.sumCents))};

  const tab = (label: string, href: string, active: boolean) => (
    <Link href={href} className={active ? adminBtnPrimary : adminBtn} aria-current={active ? 'page' : undefined}>
      {label}
    </Link>
  );
  const error = one('error') || (main.error ?? pending.error ?? ahead.error ?? blocked?.error)?.message;

  return (
    <AdminPage
      title="Брони"
      error={error}
      actions={
        <Link href="/admin/bookings/new" className={adminBtnPrimary}>
          + Новая бронь
        </Link>
      }
    >
      <SummaryTiles tiles={tiles} />

      {view === 'week' && pendingRows.length > 0 && (
        <div className="mt-6">
          <PendingQueue bookings={pendingRows} tz={tz} back={self} now={now} />
        </div>
      )}

      <Card className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="flex flex-wrap gap-2">
            {tab('Неделя', weekHref(monday), view === 'week')}
            {tab('Список и поиск', listHref({}), view === 'list')}
          </div>
          {view === 'week' && (
            <div className="flex flex-wrap items-center gap-2">
              <Link href={weekHref(addDays(monday, -7))} scroll={false} className={adminBtn} aria-label="Предыдущая неделя">
                ←
              </Link>
              <p className="min-w-40 text-center font-semibold">
                {fmtWeek(monday, dates[6])}
                <span className="block text-xs font-normal text-muted tabular-nums">
                  {weekTotal.count ? `${weekTotal.count} ${bookingsWord(weekTotal.count)} · ${eur(weekTotal.cents)}` : 'броней нет'}
                </span>
              </p>
              <Link href={weekHref(addDays(monday, 7))} scroll={false} className={adminBtn} aria-label="Следующая неделя">
                →
              </Link>
              {monday !== thisMonday && (
                <Link href={weekHref(thisMonday)} scroll={false} className={adminBtn}>
                  Сегодня
                </Link>
              )}
            </div>
          )}
        </div>

        {view === 'week' ? (
          <>
            {/* the time grid needs width: phones get the week as seven tappable days instead */}
            <div className="mt-5 hidden md:block">
              <WeekGrid days={days} hours={hours} tz={tz} nowMin={nowLocal.minutes} />
            </div>
            <div className="mt-4 md:hidden">
              <DayStrip days={days} />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <StatusLegend />
              {(cancelledCount > 0 || showCancelled) && (
                <Link href={weekHref(monday, showCancelled ? {} : {cancelled: '1'})} scroll={false} className="link text-sm">
                  {showCancelled ? 'Скрыть отменённые' : `Показать отменённые (${cancelledCount})`}
                </Link>
              )}
            </div>
          </>
        ) : (
          <form className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
            <input type="hidden" name="view" value="list" />
            <label className="text-sm">
              <span className="mb-1 block text-muted">Поиск: имя, телефон, e-mail, адрес или номер брони</span>
              <input type="search" name="q" defaultValue={q} placeholder="например, Virtanen или PU-1A2B3C" className={adminInput} />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted">Статус</span>
              <select name="status" defaultValue={status} className={adminInput}>
                <option value="">Все</option>
                {BOOKING_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_RU[s] ?? s}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted">С даты (пусто — с сегодня)</span>
              <input type="date" name="from" defaultValue={fromDate} className={adminInput} />
            </label>
            <div className="flex gap-2">
              <button type="submit" className={adminBtnPrimary}>
                Показать
              </button>
              {(q || status || fromDate) && (
                <Link href={listHref({})} className={adminBtn}>
                  Сбросить
                </Link>
              )}
            </div>
          </form>
        )}
      </Card>

      {view === 'week' ? (
        <div className="mt-6">
          <DayList days={days} tz={tz} back={self} now={now} />
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted">
            {bookings.length === 0
              ? 'Броней не найдено.'
              : `Найдено: ${bookings.length} ${bookingsWord(bookings.length)}${bookings.length === 200 ? ' (показаны первые 200 — уточните поиск или дату)' : ''}`}
          </p>
          <ul className="mt-3 space-y-3">
            {bookings.map((b) => (
              <BookingCard key={b.id} b={b} tz={tz} back={self} now={now} showDate />
            ))}
          </ul>
        </>
      )}
    </AdminPage>
  );
}
