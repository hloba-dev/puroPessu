'use client';

import {useEffect, useMemo, useState} from 'react';
import {getManualAvailability, type ManualDay} from '@/app/admin/actions';
import {formatDuration} from '@/lib/format';

type State = {status: 'idle' | 'loading' | 'error'} | {status: 'ready'; days: Record<string, ManualDay>};

const monthOf = (date: string) => date.slice(0, 7);
// calendar days are formatted at UTC noon so the browser's own time zone can never shift the date
const asDate = (date: string) => new Date(`${date}T12:00:00Z`);
const fmtMonth = new Intl.DateTimeFormat('ru-RU', {month: 'long', year: 'numeric', timeZone: 'UTC'});
const fmtFull = new Intl.DateTimeFormat('ru-RU', {weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'});
const weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
const navBtn = 'flex size-10 items-center justify-center rounded-lg border border-hairline disabled:opacity-30';
const freeCount = (day: ManualDay | undefined) => day?.slots.filter((s) => s.free).length ?? 0;

/**
 * Date and start time of a booking entered by hand: a month calendar and the start times of the chosen day,
 * free ones clickable and taken ones shown but disabled. Posts the same `date` and `time` fields as plain inputs would.
 */
interface Props {
  /** length of the visit; 0 while no items are chosen */
  durationMin: number;
  /** where the calendar comes from (replaceable so the picker can be rendered without the admin session) */
  load?: typeof getManualAvailability;
}

export function ManualTimePicker({durationMin, load = getManualAvailability}: Props) {
  const [state, setState] = useState<State>({status: 'idle'});
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState('');
  const [attempt, setAttempt] = useState(0);

  // free times depend on the length of the visit: reload shortly after the items change
  useEffect(() => {
    if (durationMin <= 0) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      setState((current) => (current.status === 'ready' ? current : {status: 'loading'}));
      load(durationMin)
        .then((result) => {
          if (cancelled) return;
          if ('error' in result) return setState({status: 'error'});
          const dates = Object.keys(result.days);
          const firstFree = dates.find((d) => freeCount(result.days[d]) > 0) ?? dates[0];
          setState({status: 'ready', days: result.days});
          setDay((current) => (current && result.days[current] ? current : firstFree));
          setMonth((current) => current ?? monthOf(firstFree));
        })
        .catch(() => !cancelled && setState({status: 'error'}));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [durationMin, attempt, load]);

  const days = state.status === 'ready' && durationMin > 0 ? state.days : null;
  const months = useMemo(() => (days ? [...new Set(Object.keys(days).map(monthOf))] : []), [days]);
  // a time that stopped being free (longer visit, another day) is not posted
  const chosen = days && day && days[day]?.slots.some((s) => s.free && s.time === time) ? time : '';

  // the submitted fields: `required` keeps the form from being sent without a free time
  const fields = (
    <div className="relative">
      <input type="hidden" name="date" value={chosen && day ? day : ''} />
      <input
        name="time"
        required
        value={chosen}
        onChange={() => undefined}
        // a browser message in the owner's language instead of the default "fill in this field"
        ref={(el) => el?.setCustomValidity(chosen ? '' : 'Выберите свободное время')}
        tabIndex={-1}
        aria-label="Время начала"
        className="pointer-events-none absolute bottom-0 left-0 h-px w-px opacity-0"
      />
    </div>
  );

  if (durationMin <= 0) {
    return (
      <div data-testid="manual-time">
        <p className="text-sm text-muted">Сначала выберите позиции: от длительности чистки зависит, какое время свободно.</p>
        {fields}
      </div>
    );
  }
  if (state.status === 'error') {
    return (
      <div role="alert" data-testid="manual-time">
        <p className="text-sm text-danger">Не удалось загрузить расписание.</p>
        <button type="button" className="link mt-1 text-sm" onClick={() => setAttempt((n) => n + 1)}>
          Повторить
        </button>
        {fields}
      </div>
    );
  }
  if (!days || !month) {
    return (
      <div data-testid="manual-time">
        <p role="status" className="text-sm text-muted">
          Загружаем расписание…
        </p>
        {fields}
      </div>
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
  const current = day ? days[day] : undefined;

  return (
    <div data-testid="manual-time">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        <div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className={navBtn}
              onClick={() => setMonth(months[monthIndex - 1])}
              disabled={monthIndex <= 0}
              aria-label="Предыдущий месяц"
            >
              ‹
            </button>
            <p className="font-semibold first-letter:uppercase" aria-live="polite">
              {fmtMonth.format(asDate(`${month}-01`))}
            </p>
            <button
              type="button"
              className={navBtn}
              onClick={() => setMonth(months[monthIndex + 1])}
              disabled={monthIndex >= months.length - 1}
              aria-label="Следующий месяц"
            >
              ›
            </button>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-muted" aria-hidden="true">
            {weekdays.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((date, index) => {
              if (!date) return <span key={`blank-${index}`} />;
              const info = days[date];
              const free = freeCount(info);
              const selected = date === day;
              const label = fmtFull.format(asDate(date));
              return (
                <button
                  key={date}
                  type="button"
                  data-date={date}
                  data-free={free}
                  disabled={!info}
                  aria-pressed={selected}
                  aria-label={!info ? `${label}: вне периода записи` : free > 0 ? `${label}: свободно, ${free}` : `${label}: всё занято`}
                  onClick={() => setDay(date)}
                  className={`flex aspect-square min-h-10 flex-col items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    selected
                      ? 'bg-teal-3 text-white ring-2 ring-teal-2'
                      : !info
                        ? 'text-text/25'
                        : free > 0
                          ? 'bg-text/6 hover:bg-text/12'
                          : 'bg-danger-soft text-danger line-through'
                  }`}
                >
                  {Number(date.slice(8))}
                  {info && (
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 size-1.5 rounded-full ${selected ? 'bg-white' : free > 0 ? 'bg-teal-2' : 'bg-danger'}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-teal-2" /> есть свободное время
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-danger" /> всё занято
            </span>
          </p>
        </div>

        <div>
          {day && current ? (
            <>
              <h3 className="font-semibold first-letter:uppercase">{fmtFull.format(asDate(day))}</h3>
              <p className="mt-1 text-sm text-muted">
                Чистка {formatDuration(durationMin, 'ru')}.{' '}
                {current.busy.length > 0 ? `Уже занято: ${current.busy.join(', ')}.` : 'В этот день пока ничего не занято.'}
              </p>
              {current.slots.length === 0 ? (
                <p className="mt-4 text-sm text-danger">Чистка такой длительности не помещается в рабочий день.</p>
              ) : (
                <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-6">
                  {current.slots.map((slot) => {
                    const selected = chosen === slot.time;
                    return (
                      <li key={slot.time}>
                        <button
                          type="button"
                          data-time={slot.time}
                          disabled={!slot.free}
                          aria-pressed={selected}
                          title={slot.free ? 'Свободно' : 'Занято или уже прошло'}
                          onClick={() => setTime(slot.time)}
                          className={`min-h-11 w-full rounded-lg border text-sm font-semibold transition-colors ${
                            selected
                              ? 'border-teal-2 bg-teal-3 text-white'
                              : slot.free
                                ? 'border-hairline bg-text/4 hover:border-teal-2'
                                : 'cursor-not-allowed border-transparent bg-danger-soft text-danger line-through opacity-70'
                          }`}
                        >
                          {slot.time}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              <p className="mt-3 text-sm" aria-live="polite" data-testid="manual-time-chosen">
                {chosen ? (
                  <>
                    Выбрано: <strong>{fmtFull.format(asDate(day))}, {chosen}</strong>
                  </>
                ) : (
                  <span className="text-muted">Выберите свободное время. Зачёркнутое занято или уже прошло.</span>
                )}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">Выберите день в календаре.</p>
          )}
        </div>
      </div>
      {fields}
    </div>
  );
}
