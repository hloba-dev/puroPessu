import {parseHm, zonedToUtc} from './tz';

/** Blocked time as the admin calendar edits it. `staffId: null` closes the time for every staff member. */
export interface Block {
  id: string;
  staffId: number | null;
  /** epoch ms */
  start: number;
  end: number;
  reason: string | null;
}

export interface Interval {
  start: number;
  end: number;
}

/** Length of one calendar slot that is closed with a click. */
export const SLOT_MIN = 120;

/** A stretch of a local day, in minutes after midnight. */
export interface DaySlot {
  from: number;
  to: number;
}

/** The opening hours cut into two-hour slots: 06:00–21:00 → 6–8, 8–10, …, 18–20, 20–21. */
export function daySlots(openFrom: string, openTo: string): DaySlot[] {
  const close = parseHm(openTo);
  const slots: DaySlot[] = [];
  for (let from = parseHm(openFrom); from < close; from += SLOT_MIN) slots.push({from, to: Math.min(from + SLOT_MIN, close)});
  return slots;
}

export type DayRange = 'all' | DaySlot;

/** The UTC interval of a whole local calendar day or of a slot inside it. */
export function dayRangeInterval(date: string, range: DayRange, tz: string): Interval {
  const {from, to} = range === 'all' ? {from: 0, to: 24 * 60} : range;
  return {start: zonedToUtc(date, from, tz).getTime(), end: zonedToUtc(date, to, tz).getTime()};
}

export function blockFromRow(row: {
  id: string;
  staff_id: number | null;
  starts_at: string;
  ends_at: string;
  reason: string | null;
}): Block {
  return {id: row.id, staffId: row.staff_id, start: Date.parse(row.starts_at), end: Date.parse(row.ends_at), reason: row.reason};
}

const overlaps = (a: Interval, b: Interval) => a.start < b.end && b.start < a.end;

function covers(blocks: Interval[], interval: Interval) {
  let reached = interval.start;
  for (const b of [...blocks].sort((a, z) => a.start - z.start)) {
    if (b.start > reached) break;
    reached = Math.max(reached, b.end);
  }
  return reached >= interval.end;
}

export type Coverage = 'free' | 'partial' | 'blocked';

/**
 * 'blocked' — nobody can be booked anywhere in the interval (every active staff member is covered),
 * 'partial' — some of it is blocked, 'free' — nothing is.
 */
export function coverage(blocks: Block[], interval: Interval, staffIds: number[]): Coverage {
  const inside = blocks.filter((b) => overlaps(b, interval));
  if (inside.length === 0) return 'free';
  const everyone: (number | null)[] = staffIds.length > 0 ? staffIds : [null];
  const closed = everyone.every((staffId) =>
    covers(
      inside.filter((b) => b.staffId === null || b.staffId === staffId),
      interval
    )
  );
  return closed ? 'blocked' : 'partial';
}

/** Rows to add and rows to remove; adding comes first, so a failure in between never opens time by accident. */
export interface BlockPlan {
  insert: Omit<Block, 'id'>[];
  deleteIds: string[];
}

/** Opens the interval: every block reaching into it is cut down to what lies outside. */
export function planOpen(blocks: Block[], interval: Interval): BlockPlan {
  const plan: BlockPlan = {insert: [], deleteIds: []};
  for (const b of blocks.filter((b) => overlaps(b, interval))) {
    plan.deleteIds.push(b.id);
    if (b.start < interval.start) plan.insert.push({staffId: b.staffId, reason: b.reason, start: b.start, end: interval.start});
    if (b.end > interval.end) plan.insert.push({staffId: b.staffId, reason: b.reason, start: interval.end, end: b.end});
  }
  return plan;
}

/**
 * Closes the interval for everyone with one block. Blocks for everyone without a reason that it
 * overlaps or touches are merged into it: slots closed one after another become one block.
 */
export function planClose(blocks: Block[], interval: Interval): BlockPlan {
  const merged = blocks.filter(
    (b) => b.staffId === null && b.reason === null && b.start <= interval.end && interval.start <= b.end
  );
  return {
    insert: [
      {
        staffId: null,
        reason: null,
        start: Math.min(interval.start, ...merged.map((b) => b.start)),
        end: Math.max(interval.end, ...merged.map((b) => b.end))
      }
    ],
    deleteIds: merged.map((b) => b.id)
  };
}
