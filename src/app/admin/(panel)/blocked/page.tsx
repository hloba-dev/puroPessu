import Link from 'next/link';
import {addBlockedTime, deleteBlockedTime} from '@/app/admin/actions';
import {requireAdmin} from '@/lib/admin/auth';
import {blockFromRow, coverage, dayRangeInterval, daySlots} from '@/lib/booking/blocks';
import {addDays, toHm, utcToZoned, zonedToUtc} from '@/lib/booking/tz';
import {getSettings} from '@/lib/data/public';
import {shortHour} from '@/lib/format';
import {AdminPage, Card, adminBtn, adminBtnDanger, adminBtnPrimary, adminInput, fmtBlockRange} from '@/components/admin/ui';
import {BlockCalendar, type CalendarDay, type CalendarSlot} from './BlockCalendar';

export const metadata = {title: 'Занятые дни'};

// calendar dates are formatted as UTC noon, so the labels never depend on the server's time zone
const atNoon = (date: string) => new Date(`${date}T12:00:00Z`);
const monthName = new Intl.DateTimeFormat('ru-RU', {timeZone: 'UTC', month: 'long'});
const dayShort = new Intl.DateTimeFormat('ru-RU', {timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short'});
const dayLong = new Intl.DateTimeFormat('ru-RU', {timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long'});
const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export default async function AdminBlockedPage({searchParams}: PageProps<'/admin/blocked'>) {
  const {supabase} = await requireAdmin();
  const [params, settings] = await Promise.all([searchParams, getSettings()]);
  const tz = settings.timezone;
  const today = utcToZoned(new Date(), tz).date;
  const thisMonth = today.slice(0, 7);
  const month = typeof params.month === 'string' && /^20\d{2}-(0[1-9]|1[0-2])$/.test(params.month) ? params.month : thisMonth;

  // whole weeks from Monday to Sunday that contain the month
  const [year, monthNo] = month.split('-').map(Number);
  const first = `${month}-01`;
  const lead = (atNoon(first).getUTCDay() + 6) % 7;
  const gridStart = addDays(first, -lead);
  const cellCount = Math.ceil((lead + new Date(Date.UTC(year, monthNo, 0)).getUTCDate()) / 7) * 7;
  const from = zonedToUtc(gridStart, 0, tz).toISOString();
  const to = zonedToUtc(addDays(gridStart, cellCount), 0, tz).toISOString();
  const otherMonth = (delta: number) => new Date(Date.UTC(year, monthNo - 1 + delta, 1)).toISOString().slice(0, 7);

  const [upcoming, inGrid, bookings, staff] = await Promise.all([
    supabase.from('blocked_times').select('*').gte('ends_at', new Date().toISOString()).order('starts_at'),
    supabase.from('blocked_times').select('*').lt('starts_at', to).gt('ends_at', from),
    supabase.from('bookings').select('starts_at').in('status', ['pending', 'confirmed']).gte('starts_at', from).lt('starts_at', to).order('starts_at'),
    supabase.from('staff').select('*').order('id')
  ]);
  const staffName = new Map((staff.data ?? []).map((s) => [s.id, s.name]));
  const activeStaff = (staff.data ?? []).filter((s) => s.is_active).map((s) => s.id);
  const blocks = (inGrid.data ?? []).map(blockFromRow);

  const bookingTimes = new Map<string, string[]>();
  for (const booking of bookings.data ?? []) {
    const local = utcToZoned(new Date(booking.starts_at), tz);
    bookingTimes.set(local.date, [...(bookingTimes.get(local.date) ?? []), toHm(local.minutes)]);
  }

  // the opening hours in two-hour slots: "6–8", "8–10", …
  const slots: CalendarSlot[] = daySlots(settings.openFrom, settings.openTo).map((slot) => ({
    ...slot,
    label: `${shortHour(toHm(slot.from))}–${shortHour(toHm(slot.to))}`
  }));

  const days: CalendarDay[] = Array.from({length: cellCount}, (_, i) => {
    const date = addDays(gridStart, i);
    return {
      date,
      day: String(Number(date.slice(8))),
      short: dayShort.format(atNoon(date)),
      label: dayLong.format(atNoon(date)),
      inMonth: date.startsWith(month),
      past: date < today,
      isToday: date === today,
      slots: slots.map((slot) => coverage(blocks, dayRangeInterval(date, slot, tz), activeStaff)),
      bookings: bookingTimes.get(date) ?? []
    };
  });

  const label = 'mb-1 block text-sm text-muted';
  const error = typeof params.error === 'string' ? params.error : (upcoming.error ?? inGrid.error ?? bookings.error)?.message;

  return (
    <AdminPage title="Занятые дни и часы" error={error}>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            {capital(monthName.format(atNoon(first)))} {year}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link href={`/admin/blocked?month=${otherMonth(-1)}`} scroll={false} className={adminBtn}>
              ← {capital(monthName.format(atNoon(`${otherMonth(-1)}-01`)))}
            </Link>
            {month !== thisMonth && (
              <Link href="/admin/blocked" scroll={false} className={adminBtn}>
                Сегодня
              </Link>
            )}
            <Link href={`/admin/blocked?month=${otherMonth(1)}`} scroll={false} className={adminBtn}>
              {capital(monthName.format(atNoon(`${otherMonth(1)}-01`)))} →
            </Link>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          Нажмите на число — весь день занят, на время — заняты только эти два часа. Клиенты не смогут записаться на занятое время.
          Повторное нажатие открывает его обратно. Уже принятые брони при этом не отменяются.
        </p>
        <p className="mt-2 mb-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          <span>
            <span className="rounded border border-[#ff8a8a]/60 bg-[#ff8a8a]/20 px-1 text-[#ffc2c2] line-through">8–10</span> занято
          </span>
          <span>
            <span className="rounded border border-[#ffb86b]/50 bg-[#ffb86b]/15 px-1 text-[#ffd9ad]">8–10</span> занято частично: другие
            часы или один мастер
          </span>
          <span>
            <span className="text-cyan-1">●</span> есть брони клиентов
          </span>
        </p>
        <BlockCalendar days={days} slots={slots} />
      </Card>

      <Card title="Закрыть период или точные часы (отпуск, несколько дней подряд, личные дела)" className="mt-6">
        <form action={addBlockedTime} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <label>
            <span className={label}>С даты *</span>
            <input type="date" name="from_date" required className={adminInput} />
          </label>
          <label>
            <span className={label}>Время</span>
            <input type="time" name="from_time" className={adminInput} />
          </label>
          <label>
            <span className={label}>По дату</span>
            <input type="date" name="to_date" className={adminInput} />
          </label>
          <label>
            <span className={label}>Время (пусто = до конца дня)</span>
            <input type="time" name="to_time" className={adminInput} />
          </label>
          <label>
            <span className={label}>Мастер</span>
            <select name="staff_id" className={adminInput} defaultValue="0">
              <option value="0">Все</option>
              {(staff.data ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={label}>Причина</span>
            <input name="reason" className={adminInput} />
          </label>
          <div className="lg:col-span-6">
            <button type="submit" className={adminBtnPrimary}>
              Заблокировать
            </button>
          </div>
        </form>
      </Card>

      <Card title="Всё занятое время впереди" className="mt-6">
        {(upcoming.data ?? []).length === 0 ? (
          <p className="text-muted">Занятого времени нет.</p>
        ) : (
          <ul className="divide-y divide-hairline">
            {(upcoming.data ?? []).map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <p>
                  <span className="font-semibold">{fmtBlockRange(b.starts_at, b.ends_at)}</span>
                  <span className="block text-sm text-muted">
                    {b.staff_id ? (staffName.get(b.staff_id) ?? `мастер ${b.staff_id}`) : 'все мастера'}
                    {b.reason && ` · ${b.reason}`}
                  </span>
                </p>
                <form action={deleteBlockedTime}>
                  <input type="hidden" name="id" value={b.id} />
                  <button type="submit" className={adminBtnDanger}>
                    Снять
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AdminPage>
  );
}
