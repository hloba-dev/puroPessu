'use client';

import {useOptimistic, useState, useTransition} from 'react';
import {setDayBlocked} from '@/app/admin/actions';
import type {Coverage, DaySlot} from '@/lib/booking/blocks';

export interface CalendarDay {
  /** YYYY-MM-DD */
  date: string;
  /** "5" */
  day: string;
  /** "пн, 5 окт." */
  short: string;
  /** "понедельник, 5 октября" */
  label: string;
  inMonth: boolean;
  past: boolean;
  isToday: boolean;
  /** one state per slot, in the order of the `slots` prop */
  slots: Coverage[];
  /** start times of the day's active bookings, "HH:mm" */
  bookings: string[];
}

export interface CalendarSlot extends DaySlot {
  /** "8–10" */
  label: string;
}

const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

const SLOT_STYLE: Record<Coverage, string> = {
  free: 'border-white/15 text-[#d3d7dd] hover:border-cyan-2 hover:text-cyan-1',
  partial: 'border-[#ffb86b]/50 bg-[#ffb86b]/15 text-[#ffd9ad] hover:border-[#ffb86b]',
  blocked: 'border-[#ff8a8a]/60 bg-[#ff8a8a]/20 text-[#ffc2c2] line-through hover:border-[#ff8a8a]'
};
const SLOT_HINT: Record<Coverage, string> = {
  free: 'Отметить занятым',
  partial: 'Занято частично (другие часы или один мастер) — нажмите, чтобы занять целиком',
  blocked: 'Открыть это время'
};

function bookingsLabel(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  const word = mod10 === 1 && mod100 !== 11 ? 'бронь' : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'брони' : 'броней';
  return `${count} ${word}`;
}

/**
 * Month grid where one click closes or opens a whole day or one two-hour slot of it.
 * The click shows at once (optimistic); the server render that follows brings the real state.
 */
export function BlockCalendar({days, slots}: {days: CalendarDay[]; slots: CalendarSlot[]}) {
  const [shown, apply] = useOptimistic(days, (current, change: {date: string; slot: number | 'all'; blocked: boolean}) =>
    current.map((day) => {
      if (day.date !== change.date) return day;
      const state: Coverage = change.blocked ? 'blocked' : 'free';
      return {...day, slots: day.slots.map((old, index) => (change.slot === 'all' || change.slot === index ? state : old))};
    })
  );
  const [saving, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = (date: string, slot: number | 'all', blocked: boolean) =>
    startTransition(async () => {
      apply({date, slot, blocked});
      const range = slot === 'all' ? 'all' : {from: slots[slot].from, to: slots[slot].to};
      const result = await setDayBlocked({date, range, blocked});
      setError(result.error ?? null);
    });

  return (
    <div>
      {error && (
        <p role="alert" className="mb-3 rounded-xl border border-[#ff8a8a]/40 bg-[#ff8a8a]/10 px-4 py-3 text-[#ffc2c2]">
          Не сохранилось: {error}
        </p>
      )}
      <div aria-hidden className="mb-2 hidden grid-cols-7 gap-2 text-center text-xs text-muted uppercase md:grid">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>
      <ul className="grid gap-2 md:grid-cols-7" aria-busy={saving}>
        {shown.map((day) => {
          const closed = day.slots.length > 0 && day.slots.every((state) => state === 'blocked');
          const tone = closed ? 'border-[#ff8a8a]/50 bg-[#ff8a8a]/10' : 'border-hairline bg-white/[0.03]';
          // on a phone the month is a list: days that are over would only push today down
          const dim = day.past ? 'opacity-40 max-md:hidden' : day.inMonth ? '' : 'md:opacity-60';
          return (
            <li key={day.date} className={`rounded-xl border p-2 ${tone} ${dim}`}>
              <button
                type="button"
                disabled={day.past}
                aria-pressed={closed}
                aria-label={`${day.label}: весь день занят`}
                title={closed ? 'Открыть весь день' : 'Отметить весь день занятым'}
                onClick={() => toggle(day.date, 'all', !closed)}
                className="flex min-h-10 w-full items-center justify-between gap-1 rounded-lg px-1.5 text-left hover:bg-white/10 disabled:pointer-events-none"
              >
                <span className={`font-semibold ${day.isToday ? 'text-cyan-2' : ''}`}>
                  <span className="md:hidden">{day.short}</span>
                  <span className="hidden text-lg md:inline">{day.day}</span>
                </span>
                {/* narrow grid cells (tablet) have room for the mark only */}
                <span className={`text-[11px] whitespace-nowrap ${closed ? 'font-semibold text-[#ffc2c2]' : 'text-muted'}`}>
                  {closed && '✕'}
                  <span className="md:max-lg:hidden">{closed ? ' занят' : 'весь день'}</span>
                </span>
              </button>
              <div className="mt-1 grid grid-cols-4 gap-1 md:grid-cols-2">
                {slots.map((slot, index) => {
                  const state = day.slots[index];
                  return (
                    <button
                      key={slot.from}
                      type="button"
                      disabled={day.past}
                      aria-pressed={state === 'blocked'}
                      aria-label={`${day.label}, ${slot.label}: занято`}
                      title={SLOT_HINT[state]}
                      onClick={() => toggle(day.date, index, state !== 'blocked')}
                      className={`min-h-10 rounded-md border px-0.5 text-xs font-semibold tabular-nums disabled:pointer-events-none md:min-h-7 md:text-[11px] xl:text-xs ${SLOT_STYLE[state]}`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
              {day.bookings.length > 0 && (
                <p className="mt-1 truncate px-1.5 text-[11px] text-cyan-1" title={day.bookings.join(', ')}>
                  ● {bookingsLabel(day.bookings.length)}: {day.bookings.join(', ')}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
