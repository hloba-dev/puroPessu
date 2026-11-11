import type {CSSProperties, ReactNode} from 'react';
import Link from 'next/link';
import {setBookingStatus} from '@/app/admin/actions';
import {bookingsWord, layoutDay, weekStart, type Span} from '@/lib/admin/board';
import {promoLabel} from '@/lib/booking/promo-details';
import {toHm, utcToZoned} from '@/lib/booking/tz';
import type {PromoDetails} from '@/lib/data/store';
import {localizedPath} from '@/lib/seo';
import type {Tables} from '@/lib/supabase/database.types';
import {SubmitButton} from './SubmitButton';
import {STATUS_RU, StatusBadge, StatusForm, adminBtn, adminBtnDanger, adminBtnPrimary, eur} from './ui';

/** Everything the booking board shows: no data access here, the page passes plain rows in. */

export type BoardBooking = Tables<'bookings'> & {
  booking_items: Pick<Tables<'booking_items'>, 'name' | 'qty' | 'very_dirty'>[];
  photoUrls?: string[];
};

export const BOOKING_STATUSES = ['pending', 'confirmed', 'done', 'cancelled'];

// the look of `.glass`, spelled out in utilities: `.glass` is unlayered CSS and would override the
// status-coloured borders and backgrounds that these cards add
const card = 'rounded-[20px] border border-hairline bg-surface';

/** Local wall-clock times of a booking: the work itself and the busy time with the travel buffer. */
export function bookingTimes(b: Pick<BoardBooking, 'starts_at' | 'ends_at' | 'duration_min'>, tz: string) {
  const local = utcToZoned(new Date(b.starts_at), tz);
  const busyMin = Math.round((Date.parse(b.ends_at) - Date.parse(b.starts_at)) / 60_000);
  return {
    date: local.date,
    start: local.minutes,
    end: local.minutes + b.duration_min,
    busyEnd: local.minutes + Math.max(busyMin, b.duration_min)
  };
}

const hm = (minutes: number) => toHm(((minutes % 1440) + 1440) % 1440);
const timeRange = (start: number, end: number) => `${hm(start)}–${hm(end)}`;

export function workTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h ? `${h} ч` : '', m ? `${m} мин` : ''].filter(Boolean).join(' ') || '0 мин';
}

const atNoon = (date: string) => new Date(`${date}T12:00:00Z`);
const dayLong = new Intl.DateTimeFormat('ru-RU', {timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long'});
const dayMedium = new Intl.DateTimeFormat('ru-RU', {timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short'});
const weekdayShort = new Intl.DateTimeFormat('ru-RU', {timeZone: 'UTC', weekday: 'short'});
const dayMonth = new Intl.DateTimeFormat('ru-RU', {timeZone: 'UTC', day: 'numeric', month: 'long'});
const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const fmtDayLong = (date: string) => capital(dayLong.format(atNoon(date)));
export const fmtDayMedium = (date: string) => dayMedium.format(atNoon(date));
/** "9–15 ноября" / "30 ноября – 6 декабря" */
export function fmtWeek(monday: string, sunday: string) {
  const sameMonth = monday.slice(0, 7) === sunday.slice(0, 7);
  return sameMonth ? `${Number(monday.slice(8))}–${dayMonth.format(atNoon(sunday))}` : `${dayMonth.format(atNoon(monday))} – ${dayMonth.format(atNoon(sunday))}`;
}

/** Link to a booking on the week board: opens its week and scrolls to its card. */
export const bookingHref = (b: Pick<BoardBooking, 'id' | 'starts_at'>, tz: string) =>
  `/admin/bookings?week=${weekStart(utcToZoned(new Date(b.starts_at), tz).date)}#booking-${b.id}`;

// ---------- summary tiles ----------

export interface Tile {
  label: string;
  value: string;
  note?: string;
  href: string;
  /** amber: something is waiting for the owner */
  attention?: boolean;
}

export function SummaryTiles({tiles}: {tiles: Tile[]}) {
  return (
    <ul className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {tiles.map((tile) => (
        <li key={tile.label}>
          <Link
            href={tile.href}
            className={`${card} block h-full p-4 hover:border-teal-2 ${tile.attention ? 'border-warn-border bg-warn-soft' : ''}`}
          >
            <p className={`text-2xl leading-tight font-bold tabular-nums ${tile.attention ? 'text-warn' : ''}`}>{tile.value}</p>
            <p className="mt-1 text-sm text-muted">{tile.label}</p>
            {tile.note && <p className="text-sm font-semibold tabular-nums">{tile.note}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ---------- status actions ----------

function ActionForm({
  id,
  status,
  back,
  className,
  title,
  children
}: {
  id: string;
  status: string;
  back: string;
  className: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <form action={setBookingStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="back" value={back} />
      <SubmitButton className={className} title={title}>
        {children}
      </SubmitButton>
    </form>
  );
}

const summaryReset = 'cursor-pointer list-none [&::-webkit-details-marker]:hidden';
// phones: opens in the flow under its button, so it can never run past the edge of the screen; wider: floats
const popover =
  'mt-2 max-w-72 rounded-xl border border-hairline bg-surface p-4 shadow-[0_18px_50px_rgba(0,0,0,.5)] sm:absolute sm:left-0 sm:z-30 sm:w-72';

/** The one or two things the owner does next with a booking, as buttons; everything else under «Ещё». */
export function StatusActions({b, back, upcoming}: {b: BoardBooking; back: string; upcoming: boolean}) {
  const active = b.status === 'pending' || b.status === 'confirmed';
  return (
    <div className="flex flex-wrap items-center gap-2">
      {b.status === 'pending' && (
        <ActionForm id={b.id} status="confirmed" back={back} className={adminBtnPrimary} title="Клиент получит письмо с подтверждением">
          ✓ Подтвердить
        </ActionForm>
      )}
      {b.status === 'confirmed' && (
        // the main button only once the visit has begun; before that it is one tap too easy
        <ActionForm id={b.id} status="done" back={back} className={upcoming ? adminBtn : adminBtnPrimary} title="Отметить, что работа выполнена">
          ✓ Выполнена
        </ActionForm>
      )}
      {b.status === 'cancelled' && (
        <ActionForm id={b.id} status="pending" back={back} className={adminBtn} title="Вернуть бронь, если её время ещё свободно">
          Восстановить
        </ActionForm>
      )}
      {active && upcoming && (
        <a
          href={localizedPath({pathname: '/varaa-aika/hallinnoi/[token]', params: {token: b.manage_token}}, 'ru')}
          target="_blank"
          rel="noopener"
          className={adminBtn}
          title="Откроется страница управления записью: там выбирается новое время, клиент получит письмо"
        >
          Перенести
        </a>
      )}
      {active && (
        <details className="relative">
          <summary className={`${adminBtnDanger} ${summaryReset}`}>Отменить…</summary>
          <div className={popover}>
            <p className="text-sm">Отменить эту бронь? Клиент получит письмо об отмене, а время снова станет свободным.</p>
            <div className="mt-3">
              <ActionForm id={b.id} status="cancelled" back={back} className={adminBtnDanger}>
                Да, отменить бронь
              </ActionForm>
            </div>
          </div>
        </details>
      )}
      <details className="relative">
        <summary className={`${adminBtn} ${summaryReset} border-transparent text-muted`}>Ещё</summary>
        <div className={popover}>
          <p className="mb-2 text-sm text-muted">Поставить другой статус</p>
          <StatusForm action={setBookingStatus} id={b.id} status={b.status} options={BOOKING_STATUSES} hidden={{back}} />
        </div>
      </details>
    </div>
  );
}

// ---------- one booking ----------

const CARD_EDGE: Record<string, string> = {
  pending: 'border-l-[var(--warn)]',
  confirmed: 'border-l-teal-2',
  done: 'border-l-text/30',
  cancelled: 'border-l-[var(--danger)]'
};

export function BookingCard({b, tz, back, now, showDate = false}: {b: BoardBooking; tz: string; back: string; now: number; showDate?: boolean}) {
  const t = bookingTimes(b, tz);
  const digits = b.phone.replace(/\D/g, '');
  const place = `${b.address}, ${b.postal_code} ${b.city}`;
  const upcoming = Date.parse(b.starts_at) > now;
  return (
    <li
      id={`booking-${b.id}`}
      className={`${card} scroll-mt-6 border-l-4 p-4 target:outline-2 target:outline-offset-2 target:outline-teal-2 sm:p-5 ${CARD_EDGE[b.status] ?? ''} ${b.status === 'cancelled' ? 'opacity-70' : ''}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <p className="text-lg leading-tight font-semibold tabular-nums">
            {showDate && <span className="font-medium text-muted">{fmtDayMedium(t.date)}, </span>}
            {timeRange(t.start, t.end)}
          </p>
          <p className="text-sm text-muted">
            {workTime(b.duration_min)} работы · {b.ref_code} · язык: {b.locale}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={b.status} />
          <span className="text-lg font-bold tabular-nums">{eur(b.total_cents)}</span>
        </div>
      </div>

      <div className="mt-3 grid gap-x-6 gap-y-3 text-[15px] md:grid-cols-2">
        <div>
          <p className="font-medium">
            {b.name}
            {b.company && ` · ${b.company} (${b.y_tunnus ?? '—'})`}
          </p>
          <p className="text-muted">
            {place}
            {b.floor && ` · ${b.floor}`}
            {b.parking && ` · парковка: ${b.parking}`}
          </p>
          {b.notes && <p className="mt-1 rounded-lg bg-text/6 px-3 py-2">«{b.notes}»</p>}
          <p className="mt-2 flex flex-wrap gap-2">
            <a href={`tel:+${digits}`} className={adminBtn}>
              Позвонить {b.phone}
            </a>
            <a href={`https://wa.me/${digits}`} className={adminBtn} target="_blank" rel="noopener">
              WhatsApp
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`}
              className={adminBtn}
              target="_blank"
              rel="noopener"
            >
              Маршрут
            </a>
            <a href={`mailto:${b.email}`} className={`${adminBtn} max-w-full truncate`} title={b.email}>
              {b.email}
            </a>
          </p>
        </div>
        <div>
          <ul className="space-y-1">
            {b.booking_items.map((item, index) => (
              <li key={`${item.name}-${index}`}>
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
        </div>
      </div>

      <div className="mt-4 border-t border-hairline pt-3">
        <StatusActions b={b} back={back} upcoming={upcoming} />
      </div>
    </li>
  );
}

// ---------- waiting for confirmation ----------

export function PendingQueue({bookings, tz, back, now}: {bookings: BoardBooking[]; tz: string; back: string; now: number}) {
  if (bookings.length === 0) return null;
  return (
    <section className={`${card} border-warn-border p-4 sm:p-5`} aria-labelledby="pending-title">
      <h2 id="pending-title" className="text-lg font-semibold">
        Ждут подтверждения <span className="text-warn tabular-nums">· {bookings.length}</span>
      </h2>
      <p className="mt-1 text-sm text-muted">Клиент записался онлайн. После «Подтвердить» он получит письмо, что время за ним.</p>
      <ul className="mt-3 divide-y divide-hairline">
        {bookings.map((b) => {
          const t = bookingTimes(b, tz);
          const past = Date.parse(b.starts_at) < now;
          return (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
              <p className="min-w-0">
                <span className="font-semibold tabular-nums">
                  {fmtDayMedium(t.date)}, {timeRange(t.start, t.end)}
                </span>
                {past && <span className="ml-2 rounded-md bg-danger-soft px-2 py-0.5 text-xs font-semibold text-danger">время прошло</span>}
                <span className="block text-sm text-muted">
                  {b.name} · {b.city} · {b.booking_items.map((i) => `${i.name} × ${i.qty}`).join(', ')}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold tabular-nums">{eur(b.total_cents)}</span>
                <ActionForm id={b.id} status="confirmed" back={back} className={adminBtnPrimary} title="Клиент получит письмо с подтверждением">
                  ✓ Подтвердить
                </ActionForm>
                <Link href={bookingHref(b, tz)} className={adminBtn}>
                  Открыть
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ---------- week ----------

export interface BoardDay {
  /** YYYY-MM-DD */
  date: string;
  isToday: boolean;
  past: boolean;
  /** shown on the board: without the cancelled ones unless they were asked for */
  bookings: BoardBooking[];
  /** closed time of the day (holiday, private errand) */
  blocks: (Span & {reason: string | null; partial: boolean})[];
  /** not cancelled */
  count: number;
  sumCents: number;
  workMin: number;
}

/** The whole day is closed for every cleaner (a day off). */
const dayClosed = (day: BoardDay) => day.blocks.some((block) => !block.partial && block.start === 0 && block.end === 24 * 60);

const HOUR_PX = 48;

const BLOCK_TONE: Record<string, string> = {
  pending: 'border-l-[var(--warn)] bg-[color-mix(in_oklab,var(--warn)_22%,var(--surface))] text-warn',
  confirmed: 'border-l-teal-2 bg-[color-mix(in_oklab,var(--teal-2)_24%,var(--surface))] text-teal-1',
  done: 'border-l-text/40 bg-[color-mix(in_oklab,var(--text)_12%,var(--surface))] text-muted',
  cancelled: 'border-l-[var(--danger)] bg-[color-mix(in_oklab,var(--danger)_10%,var(--surface))] text-danger line-through opacity-80'
};
const DOT_TONE: Record<string, string> = {
  pending: 'bg-[var(--warn)]',
  confirmed: 'bg-teal-2',
  done: 'bg-text/40',
  cancelled: 'bg-[var(--danger)]'
};

export function StatusLegend() {
  return (
    <p className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
      {['pending', 'confirmed', 'done'].map((status) => (
        <span key={status} className="inline-flex items-center gap-1.5">
          <span className={`size-2.5 rounded-sm ${DOT_TONE[status]}`} /> {STATUS_RU[status]}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2.5 rounded-sm bg-[repeating-linear-gradient(135deg,var(--muted)_0_2px,transparent_2px_5px)]" /> Закрытое время
      </span>
      {/* only the time grid has a "now" line, and phones do not show the grid */}
      <span className="hidden items-center gap-1.5 md:inline-flex">
        <span className="h-0.5 w-3 bg-[var(--danger)]" /> Сейчас
      </span>
    </p>
  );
}

/**
 * The week as a time grid: one column per day, a block per booking placed by its start time and sized by its
 * length, coloured by status. A click on a block jumps to the booking's card below.
 */
export function WeekGrid({days, hours, tz, nowMin}: {days: BoardDay[]; hours: {from: number; to: number}; tz: string; nowMin: number}) {
  const fromMin = hours.from * 60;
  const toMin = hours.to * 60;
  const height = (hours.to - hours.from) * HOUR_PX;
  const y = (minutes: number) => ((Math.min(Math.max(minutes, fromMin), toMin) - fromMin) / 60) * HOUR_PX;
  const lines: CSSProperties = {
    height,
    backgroundImage: `repeating-linear-gradient(to bottom, var(--hairline) 0, var(--hairline) 1px, transparent 1px, transparent ${HOUR_PX}px)`
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[880px] grid-cols-[44px_repeat(7,minmax(0,1fr))] pb-3">
        <div />
        {days.map((day) => (
          <a
            key={day.date}
            href={`#day-${day.date}`}
            className={`border-l border-hairline px-2 pb-2 hover:bg-text/6 ${day.past ? 'opacity-60' : ''}`}
            title="Показать брони этого дня"
          >
            <span className={`block text-sm font-semibold ${day.isToday ? 'text-teal-2' : ''}`}>
              {weekdayShort.format(atNoon(day.date))} {Number(day.date.slice(8))}
              {day.isToday && ' · сегодня'}
            </span>
            <span className="block text-xs text-muted tabular-nums">
              {day.count ? `${day.count} · ${eur(day.sumCents)}` : dayClosed(day) ? 'закрыт' : 'свободно'}
            </span>
          </a>
        ))}

        <div className="relative" style={{height}} aria-hidden="true">
          {Array.from({length: hours.to - hours.from + 1}, (_, i) => (
            <span key={i} className="absolute right-2 -translate-y-1/2 text-[11px] text-muted tabular-nums" style={{top: i * HOUR_PX}}>
              {hours.from + i}
            </span>
          ))}
        </div>
        {days.map((day) => {
          const spans = day.bookings.map((b) => {
            const t = bookingTimes(b, tz);
            // side-by-side columns are decided on the busy time, so two cleaners never hide each other
            return {b, start: t.start, end: t.busyEnd, workEnd: t.end};
          });
          return (
            <div
              key={day.date}
              className={`relative border-l border-hairline ${day.isToday ? 'bg-teal-soft/40' : ''} ${day.past ? 'opacity-70' : ''}`}
              style={lines}
            >
              {day.blocks.map((block, index) => (
                <div
                  key={index}
                  className={`absolute inset-x-0 ${block.partial ? 'opacity-50' : ''} bg-[repeating-linear-gradient(135deg,color-mix(in_oklab,var(--muted)_45%,transparent)_0_2px,transparent_2px_7px)]`}
                  style={{top: y(block.start), height: Math.max(y(block.end) - y(block.start), 2)}}
                  title={`Закрыто ${timeRange(block.start, block.end)}${block.partial ? ' (один мастер)' : ''}${block.reason ? ` · ${block.reason}` : ''}`}
                />
              ))}
              {layoutDay(spans).map(({item, col, cols}) => {
                const {b} = item;
                const top = y(item.start);
                const workHeight = Math.max(y(item.workEnd) - top, 20);
                const tail = Math.max(y(item.end) - top - workHeight, 0);
                const position: CSSProperties = {top, left: `calc(${(col * 100) / cols}% + 2px)`, width: `calc(${100 / cols}% - 4px)`};
                return (
                  <a
                    key={b.id}
                    href={`#booking-${b.id}`}
                    className="group absolute block"
                    style={position}
                    title={`${timeRange(item.start, item.workEnd)} · ${STATUS_RU[b.status] ?? b.status}\n${b.name}, ${b.address}, ${b.city}\n${b.booking_items.map((i) => `${i.name} × ${i.qty}`).join(', ')}\n${eur(b.total_cents)}`}
                  >
                    <span
                      className={`block overflow-hidden rounded-md border-l-[3px] px-1.5 py-0.5 text-[11px] leading-[1.25] group-hover:brightness-125 ${BLOCK_TONE[b.status] ?? ''}`}
                      style={{height: workHeight}}
                    >
                      {/* as many lines as the block has room for: a short visit keeps the time and the name */}
                      {workHeight >= 32 ? (
                        <>
                          <span className="block truncate font-bold tabular-nums">{timeRange(item.start, item.workEnd)}</span>
                          <span className="block truncate font-medium text-text">{b.name}</span>
                          {workHeight >= 46 && (
                            <span className="block truncate">
                              {b.city} · {eur(b.total_cents)}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="block truncate">
                          <span className="font-bold tabular-nums">{hm(item.start)}</span> <span className="font-medium text-text">{b.name}</span>
                        </span>
                      )}
                    </span>
                    {/* the road to the next address: nothing else can be booked here */}
                    {tail > 0 && <span className="block rounded-b-md border-l-[3px] border-dashed border-text/25 bg-text/6" style={{height: tail}} />}
                  </a>
                );
              })}
              {day.isToday && nowMin >= fromMin && nowMin <= toMin && (
                <div className="pointer-events-none absolute inset-x-0 z-10 h-0.5 bg-[var(--danger)]" style={{top: y(nowMin)}}>
                  <span className="absolute -top-[3px] -left-1 size-2 rounded-full bg-[var(--danger)]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Phones: the week as seven tappable days with the number of bookings; the time grid needs a wider screen. */
export function DayStrip({days}: {days: BoardDay[]}) {
  return (
    <ul className="grid grid-cols-7 gap-1">
      {days.map((day) => (
        <li key={day.date}>
          <a
            href={`#day-${day.date}`}
            className={`flex min-h-16 flex-col items-center justify-center rounded-xl border px-1 py-1.5 text-center ${
              day.isToday ? 'border-teal-2 bg-teal-soft' : 'border-hairline bg-text/4'
            } ${day.past ? 'opacity-60' : ''} ${
              dayClosed(day) ? 'bg-[repeating-linear-gradient(135deg,color-mix(in_oklab,var(--muted)_30%,transparent)_0_2px,transparent_2px_7px)]' : ''
            }`}
            title={dayClosed(day) ? 'День закрыт' : undefined}
          >
            <span className="text-[11px] text-muted uppercase">{weekdayShort.format(atNoon(day.date))}</span>
            <span className="text-base leading-tight font-semibold">{Number(day.date.slice(8))}</span>
            <span className="mt-0.5 flex h-2.5 items-center gap-0.5" aria-label={`${day.count} ${bookingsWord(day.count)}`}>
              {day.bookings
                .filter((b) => b.status !== 'cancelled')
                .slice(0, 4)
                .map((b) => (
                  <span key={b.id} className={`size-1.5 rounded-full ${DOT_TONE[b.status] ?? 'bg-text/40'}`} />
                ))}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** The week as a list: every day with its bookings in full, free days in one line. */
export function DayList({days, tz, back, now}: {days: BoardDay[]; tz: string; back: string; now: number}) {
  return (
    <div className="space-y-6">
      {days.map((day) => (
        <section key={day.date} id={`day-${day.date}`} className="scroll-mt-4" aria-labelledby={`day-title-${day.date}`}>
          <h2 id={`day-title-${day.date}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-hairline pb-2">
            <span className={`text-lg font-semibold ${day.isToday ? 'text-teal-2' : ''}`}>
              {fmtDayLong(day.date)}
              {day.isToday && ' · сегодня'}
            </span>
            <span className="text-sm text-muted tabular-nums">
              {day.count > 0
                ? `${day.count} ${bookingsWord(day.count)} · ${eur(day.sumCents)} · ${workTime(day.workMin)} работы`
                : dayClosed(day)
                  ? 'день закрыт'
                  : 'броней нет'}
            </span>
          </h2>
          {day.bookings.length > 0 && (
            <ul className="mt-3 space-y-3">
              {day.bookings.map((b) => (
                <BookingCard key={b.id} b={b} tz={tz} back={back} now={now} />
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
