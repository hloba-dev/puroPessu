'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import type {Locale} from '@/i18n/routing';
import {parseHm, zonedToUtc} from '@/lib/booking/tz';
import {formatDuration} from '@/lib/format';
import {IconChevron} from '@/components/ui/icons';

export interface SlotValue {
  date: string;
  time: string;
  /** UTC instant of the start */
  iso: string;
}

interface Props {
  durationMin: number;
  timezone: string;
  value: SlotValue | null;
  onChange: (slot: SlotValue | null) => void;
  /** manage token of a booking whose own time should count as free (rescheduling) */
  excludeToken?: string;
  /** bump to force a reload, e.g. after "slot taken" */
  reloadKey?: number;
}

type State = {status: 'loading'} | {status: 'error'} | {status: 'ready'; days: Record<string, string[]>};

const intl: Record<Locale, string> = {fi: 'fi-FI', ru: 'ru-RU', en: 'en-GB'};
const monthOf = (date: string) => date.slice(0, 7);
// calendar days are formatted at UTC noon so the visitor's own time zone can never shift the date
const asDate = (date: string) => new Date(`${date}T12:00:00Z`);

export function TimePicker({durationMin, timezone, value, onChange, excludeToken, reloadKey = 0}: Props) {
  const t = useTranslations('booking.time');
  const locale = useLocale() as Locale;
  const [state, setState] = useState<State>({status: 'loading'});
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(value?.date ?? null);
  const [attempt, setAttempt] = useState(0);
  const slotsRef = useRef<HTMLDivElement>(null);
  // set by a tap on a day: the free times of that day are then brought into view (not on the initial pick)
  const revealSlots = useRef(false);

  const load = useCallback(
    async (signal: AbortSignal) => {
      const params = new URLSearchParams({duration: String(durationMin)});
      if (excludeToken) params.set('exclude', excludeToken);
      const res = await fetch(`/api/availability?${params}`, {signal, cache: 'no-store'});
      if (!res.ok) throw new Error(String(res.status));
      return ((await res.json()) as {days: Record<string, string[]>}).days;
    },
    [durationMin, excludeToken]
  );

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset to the loading state when inputs change
    setState({status: 'loading'});
    load(controller.signal)
      .then((days) => {
        setState({status: 'ready', days});
        const firstFree = Object.keys(days).find((d) => days[d].length > 0);
        setDay((current) => (current && days[current]?.length ? current : (firstFree ?? null)));
        setMonth((current) => current ?? monthOf(firstFree ?? Object.keys(days)[0]));
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState({status: 'error'});
      });
    return () => controller.abort();
  }, [load, attempt, reloadKey]);

  const days = state.status === 'ready' ? state.days : null;

  // on phones the list of free times sits under the calendar, often below the fold
  useEffect(() => {
    if (!revealSlots.current) return;
    revealSlots.current = false;
    const panel = slotsRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const top = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    // the wizard's fixed bottom bar (total + next button) covers the last ~90px on small screens
    const bottom = window.innerHeight - 96;
    // no explicit `behavior`: the html scroll-behavior applies (smooth, or auto under reduced motion)
    if (rect.top < top || rect.bottom > bottom) panel.scrollIntoView({block: 'start'});
  }, [day]);

  // a previously chosen slot may have been taken in the meantime
  useEffect(() => {
    if (days && value && !days[value.date]?.includes(value.time)) onChange(null);
  }, [days, value, onChange]);

  const months = useMemo(() => (days ? [...new Set(Object.keys(days).map(monthOf))] : []), [days]);
  const fmt = useMemo(
    () => ({
      month: new Intl.DateTimeFormat(intl[locale], {month: 'long', year: 'numeric', timeZone: 'UTC'}),
      weekday: new Intl.DateTimeFormat(intl[locale], {weekday: 'short', timeZone: 'UTC'}),
      full: new Intl.DateTimeFormat(intl[locale], {weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'})
    }),
    [locale]
  );

  if (state.status === 'loading') {
    return (
      <p role="status" className="glass p-6 text-muted">
        {t('loading')}
      </p>
    );
  }
  if (state.status === 'error' || !days || !month) {
    return (
      <div role="alert" className="glass p-6">
        <p>{t('error')}</p>
        <button type="button" className="link mt-2" onClick={() => setAttempt((n) => n + 1)}>
          {t('retry')}
        </button>
      </div>
    );
  }
  if (!Object.values(days).some((slots) => slots.length > 0)) {
    return (
      <p role="status" className="glass p-6">
        {t('noneAtAll')}
      </p>
    );
  }

  // Monday-first grid for the visible month
  const [year, monthNumber] = month.split('-').map(Number);
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const leading = (new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay() + 6) % 7;
  const cells: (string | null)[] = [
    ...Array<null>(leading).fill(null),
    ...Array.from({length: daysInMonth}, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`)
  ];
  const monthIndex = months.indexOf(month);
  const slots = day ? (days[day] ?? []) : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
      <div className="glass p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-xl border border-hairline disabled:opacity-30"
            onClick={() => setMonth(months[monthIndex - 1])}
            disabled={monthIndex <= 0}
            aria-label={t('prevMonth')}
          >
            <IconChevron className="rotate-90" />
          </button>
          <p className="font-semibold capitalize" aria-live="polite" data-month={month}>
            {fmt.month.format(asDate(`${month}-01`))}
          </p>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-xl border border-hairline disabled:opacity-30"
            onClick={() => setMonth(months[monthIndex + 1])}
            disabled={monthIndex >= months.length - 1}
            aria-label={t('nextMonth')}
          >
            <IconChevron className="-rotate-90" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-muted" aria-hidden="true">
          {Array.from({length: 7}, (_, i) => (
            // 2024-01-01 is a Monday
            <span key={i}>{fmt.weekday.format(new Date(Date.UTC(2024, 0, 1 + i)))}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((date, index) => {
            if (!date) return <span key={`blank-${index}`} />;
            const count = days[date]?.length ?? 0;
            const selected = date === day;
            return (
              <button
                key={date}
                type="button"
                data-date={date}
                disabled={count === 0}
                aria-pressed={selected}
                aria-label={
                  count > 0
                    ? t('dayFree', {date: fmt.full.format(asDate(date)), count})
                    : t('dayFull', {date: fmt.full.format(asDate(date))})
                }
                onClick={() => {
                  if (date === day) return;
                  revealSlots.current = true;
                  setDay(date);
                  if (value?.date !== date) onChange(null);
                }}
                className={`flex aspect-square min-h-10 items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                  selected
                    ? 'bg-teal-3 text-white ring-2 ring-teal-2'
                    : count > 0
                      ? 'bg-text/6 hover:bg-text/12'
                      : 'text-text/30'
                }`}
              >
                {Number(date.slice(8))}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={slotsRef}>
        {day ? (
          <>
            <h3 className="font-semibold first-letter:uppercase">{t('slotsFor', {date: fmt.full.format(asDate(day))})}</h3>
            <p className="mt-1 text-sm text-muted">{formatDuration(durationMin, locale)}</p>
            {slots.length === 0 ? (
              <p className="mt-4 text-muted">{t('noSlots')}</p>
            ) : (
              <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
                {slots.map((time) => {
                  const selected = value?.date === day && value.time === time;
                  return (
                    <li key={time}>
                      <button
                        type="button"
                        data-time={time}
                        aria-pressed={selected}
                        onClick={() =>
                          onChange({date: day, time, iso: zonedToUtc(day, parseHm(time), timezone).toISOString()})
                        }
                        className={`min-h-12 w-full rounded-xl border text-base font-semibold transition-colors ${
                          selected
                            ? 'border-teal-2 bg-teal-3 text-white'
                            : 'border-hairline bg-text/4 hover:border-teal-2'
                        }`}
                      >
                        {time}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <p className="text-muted">{t('pickDay')}</p>
        )}
      </div>
    </div>
  );
}
