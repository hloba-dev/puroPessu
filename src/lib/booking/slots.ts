import type {Settings} from '@/lib/types';
import {addDays, parseHm, toHm, utcToZoned, zonedToUtc} from './tz';

/** A busy interval in epoch ms. `staffId: null` blocks every staff member (holidays). */
export interface Busy {
  staffId: number | null;
  start: number;
  end: number;
}

type SlotSettings = Pick<
  Settings,
  'openFrom' | 'openTo' | 'slotStep' | 'leadTimeHours' | 'bufferMin' | 'timezone' | 'bookingHorizonDays'
>;

interface SlotInput {
  /** local calendar day, YYYY-MM-DD */
  date: string;
  /** estimated work duration of the visit */
  durationMin: number;
  settings: SlotSettings;
  /** active staff members */
  staffIds: number[];
  busy: Busy[];
  now: Date;
}

const MIN = 60_000;

export interface SlotState {
  /** local start time, "HH:mm" */
  time: string;
  free: boolean;
}

/**
 * Every start time of one day within opening hours, each marked free or not.
 * A visit occupies [start, start + duration + travel buffer); the work itself must end by closing time.
 * A slot is free when it is not too soon and at least one staff member has no overlapping booking or blocked time.
 */
export function buildSlotStates({date, durationMin, settings, staffIds, busy, now}: SlotInput): SlotState[] {
  const open = parseHm(settings.openFrom);
  const close = parseHm(settings.openTo);
  const earliest = now.getTime() + settings.leadTimeHours * 60 * MIN;
  const span = (durationMin + settings.bufferMin) * MIN;
  const slots: SlotState[] = [];

  for (let minutes = open; minutes + durationMin <= close; minutes += settings.slotStep) {
    const start = zonedToUtc(date, minutes, settings.timezone).getTime();
    const end = start + span;
    const free =
      start >= earliest &&
      staffIds.some(
        (staffId) =>
          !busy.some((b) => (b.staffId === null || b.staffId === staffId) && b.start < end && start < b.end)
      );
    slots.push({time: toHm(minutes), free});
  }
  return slots;
}

/** Free start times ("HH:mm", local) for one day. */
export function buildSlots(input: SlotInput): string[] {
  return buildSlotStates(input)
    .filter((slot) => slot.free)
    .map((slot) => slot.time);
}

/**
 * The busy stretches of one local day as merged [from, to) minutes after midnight — what the owner sees as "taken".
 * Intervals of every staff member are merged together.
 */
export function dayBusyRanges(date: string, busy: Busy[], timezone: string): {from: number; to: number}[] {
  const dayStart = zonedToUtc(date, 0, timezone).getTime();
  const dayEnd = zonedToUtc(addDays(date, 1), 0, timezone).getTime();
  const ranges = busy
    .filter((b) => b.start < dayEnd && dayStart < b.end)
    .map((b) => ({
      from: b.start <= dayStart ? 0 : utcToZoned(new Date(b.start), timezone).minutes,
      to: b.end >= dayEnd ? 24 * 60 : utcToZoned(new Date(b.end), timezone).minutes
    }))
    .sort((a, b) => a.from - b.from);

  const merged: {from: number; to: number}[] = [];
  for (const range of ranges) {
    const last = merged.at(-1);
    if (last && range.from <= last.to) last.to = Math.max(last.to, range.to);
    else merged.push({...range});
  }
  return merged;
}

/** Free slots for every day from today to the booking horizon: {"2026-07-01": ["13:30", …], …}. */
export function buildAvailability(input: Omit<SlotInput, 'date'>): Record<string, string[]> {
  const today = utcToZoned(input.now, input.settings.timezone).date;
  const days: Record<string, string[]> = {};
  for (let i = 0; i <= input.settings.bookingHorizonDays; i++) {
    const date = addDays(today, i);
    days[date] = buildSlots({...input, date});
  }
  return days;
}

export type StartCheck = 'ok' | 'invalid' | 'misaligned' | 'outside_hours' | 'too_soon' | 'too_far';

/** Server-side sanity check of a requested start time (overlaps are enforced by the database). */
export function validateStart(opts: {
  startsAt: string;
  durationMin: number;
  settings: SlotSettings;
  now: Date;
}): StartCheck {
  const {settings, now, durationMin} = opts;
  const start = new Date(opts.startsAt);
  if (Number.isNaN(start.getTime())) return 'invalid';

  const local = utcToZoned(start, settings.timezone);
  const open = parseHm(settings.openFrom);
  if (start.getTime() % MIN !== 0 || (local.minutes - open) % settings.slotStep !== 0) return 'misaligned';
  if (local.minutes < open || local.minutes + durationMin > parseHm(settings.openTo)) return 'outside_hours';
  if (start.getTime() < now.getTime() + settings.leadTimeHours * 60 * MIN) return 'too_soon';

  const lastDay = addDays(utcToZoned(now, settings.timezone).date, settings.bookingHorizonDays);
  if (local.date > lastDay) return 'too_far';
  return 'ok';
}

/** End of the busy interval stored in the database: work + travel buffer. */
export function busyEnd(startsAt: string, durationMin: number, bufferMin: number) {
  return new Date(new Date(startsAt).getTime() + (durationMin + bufferMin) * MIN).toISOString();
}
