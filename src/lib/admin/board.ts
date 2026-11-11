import {addDays, parseHm, utcToZoned, zonedToUtc} from '@/lib/booking/tz';

/** Calendar maths and layout for the admin booking board (week grid). Pure: no database, no clock. */

/** Monday of the week that contains the date (YYYY-MM-DD in, YYYY-MM-DD out). */
export function weekStart(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const fromMonday = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
  return addDays(date, -fromMonday);
}

export const weekDays = (monday: string) => Array.from({length: 7}, (_, i) => addDays(monday, i));

/** A stretch of one local day, in minutes after midnight. */
export interface Span {
  start: number;
  end: number;
}

/**
 * The part of a UTC interval that falls on one local calendar day, or null when it misses the day.
 * A booking or a blocked time that runs over midnight shows up on both days, cut at 00:00.
 */
export function daySpan(startIso: string, endIso: string, date: string, tz: string): Span | null {
  const dayStart = zonedToUtc(date, 0, tz).getTime();
  const dayEnd = zonedToUtc(addDays(date, 1), 0, tz).getTime();
  const from = Math.max(Date.parse(startIso), dayStart);
  const to = Math.min(Date.parse(endIso), dayEnd);
  if (to <= from) return null;
  const start = utcToZoned(new Date(from), tz).minutes;
  // wall-clock length: a DST night is an hour shorter or longer than its UTC span
  const end = to === dayEnd ? 24 * 60 : utcToZoned(new Date(to), tz).minutes;
  return end > start ? {start, end} : null;
}

/**
 * First and last hour of the grid: the opening hours, widened when something (a booking entered by hand,
 * a late finish) lies outside them, so nothing is ever cut off.
 */
export function gridHours(openFrom: string, openTo: string, spans: Span[]): {from: number; to: number} {
  let from = Math.floor(parseHm(openFrom) / 60);
  let to = Math.ceil(parseHm(openTo) / 60);
  for (const span of spans) {
    from = Math.min(from, Math.floor(span.start / 60));
    to = Math.max(to, Math.ceil(span.end / 60));
  }
  return {from: Math.max(0, from), to: Math.min(24, Math.max(to, from + 1))};
}

export interface Placed<T> {
  item: T;
  /** 0-based column inside its group of overlapping items */
  col: number;
  /** how many columns the group needs: the item is 1/cols wide */
  cols: number;
}

/**
 * Side-by-side columns for items that overlap in time (two cleaners working at once).
 * Items that do not overlap anything keep the full width.
 */
export function layoutDay<T extends Span>(items: T[]): Placed<T>[] {
  const sorted = [...items].sort((a, b) => a.start - b.start || a.end - b.end);
  const placed: Placed<T>[] = [];
  let group: Placed<T>[] = [];
  let groupEnd = -Infinity;
  // end time of the last item in each column of the current group
  let columnEnds: number[] = [];

  const closeGroup = () => {
    for (const entry of group) entry.cols = columnEnds.length;
    placed.push(...group);
    group = [];
    columnEnds = [];
    groupEnd = -Infinity;
  };

  for (const item of sorted) {
    if (group.length > 0 && item.start >= groupEnd) closeGroup();
    let col = columnEnds.findIndex((end) => end <= item.start);
    if (col === -1) {
      col = columnEnds.length;
      columnEnds.push(item.end);
    } else {
      columnEnds[col] = item.end;
    }
    group.push({item, col, cols: 1});
    groupEnd = Math.max(groupEnd, item.end);
  }
  if (group.length > 0) closeGroup();
  return placed;
}

/** "бронь / брони / броней" for a count. */
export function bookingsWord(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'бронь';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'брони';
  return 'броней';
}

/**
 * A search string made safe for a PostgREST `or=(...)` filter: its syntax characters and LIKE wildcards
 * are dropped, so the text can only ever be matched literally.
 */
export function searchTerm(raw: string): string {
  return raw
    .replace(/[,()"'\\%*:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60);
}
