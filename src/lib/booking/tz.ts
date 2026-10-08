/** Small wall-clock ⇄ UTC helpers built on Intl, so opening hours follow Helsinki time through DST changes. */

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(tz: string) {
  let f = formatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    formatters.set(tz, f);
  }
  return f;
}

function wallClock(utcMs: number, tz: string) {
  const parts: Record<string, number> = {};
  for (const part of formatter(tz).formatToParts(new Date(utcMs))) {
    if (part.type !== 'literal') parts[part.type] = Number(part.value);
  }
  return parts as {year: number; month: number; day: number; hour: number; minute: number; second: number};
}

/** Offset of the zone at the given instant, in ms (local − UTC). */
function offsetMs(utcMs: number, tz: string) {
  const p = wallClock(utcMs, tz);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(utcMs / 1000) * 1000;
}

/** "2026-07-01" + 360 minutes after local midnight → the UTC instant of 06:00 in that zone. */
export function zonedToUtc(date: string, minutes: number, tz: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  const asIfUtc = Date.UTC(y, m - 1, d, 0, minutes);
  // two passes settle the offset around DST changes
  const first = asIfUtc - offsetMs(asIfUtc, tz);
  return new Date(asIfUtc - offsetMs(first, tz));
}

export function utcToZoned(instant: Date, tz: string): {date: string; minutes: number} {
  const p = wallClock(instant.getTime(), tz);
  const pad = (n: number) => String(n).padStart(2, '0');
  return {date: `${p.year}-${pad(p.month)}-${pad(p.day)}`, minutes: p.hour * 60 + p.minute};
}

/** Calendar-day arithmetic on YYYY-MM-DD strings (no time zone involved). */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export const parseHm = (hm: string) => {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + (m || 0);
};

export const toHm = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export const isUpcoming = (iso: string) => new Date(iso).getTime() > Date.now();

export const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();
