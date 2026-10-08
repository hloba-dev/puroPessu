import {describe, expect, it} from 'vitest';
import {slugify, uniqueSlug} from '@/lib/admin/slug';
import {coverage, dayRangeInterval, daySlots, planClose, planOpen, type Block} from '@/lib/booking/blocks';
import {buildSlots} from '@/lib/booking/slots';
import {seedSettings} from '@/lib/data/seed-data';

const TZ = 'Europe/Helsinki';
const at = (iso: string) => Date.parse(iso);
// 2026-07-01 in Helsinki is UTC+3: local midnight = 21:00Z of the previous day
const DAY = '2026-07-01';
const block = (id: string, start: string, end: string, extra: Partial<Block> = {}): Block => ({
  id,
  staffId: null,
  start: at(start),
  end: at(end),
  reason: null,
  ...extra
});

// the opening hours of the seed settings (06:00–21:00) in two-hour slots
const SLOTS = daySlots('06:00', '21:00');
const [SLOT_6, SLOT_8, SLOT_10] = SLOTS;
const slot = (index: number) => dayRangeInterval(DAY, SLOTS[index], TZ);
const closed = (id: string, index: number): Block => ({id, staffId: null, reason: null, ...slot(index)});

describe('daySlots', () => {
  it('cuts the opening hours into two-hour slots; the last one ends at closing time', () => {
    expect(SLOTS.map((s) => `${s.from / 60}-${s.to / 60}`)).toEqual(['6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-21']);
  });

  it('starts from the opening time, whatever it is', () => {
    expect(daySlots('07:30', '12:00')).toEqual([
      {from: 450, to: 570},
      {from: 570, to: 690},
      {from: 690, to: 720}
    ]);
  });
});

describe('dayRangeInterval', () => {
  it('turns a slot and a whole day into UTC intervals of the local day', () => {
    const all = dayRangeInterval(DAY, 'all', TZ);
    expect(new Date(all.start).toISOString()).toBe('2026-06-30T21:00:00.000Z');
    expect(new Date(all.end).toISOString()).toBe('2026-07-01T21:00:00.000Z');
    const eight = dayRangeInterval(DAY, SLOT_8, TZ);
    expect(new Date(eight.start).toISOString()).toBe('2026-07-01T05:00:00.000Z'); // 08:00 local
    expect(new Date(eight.end).toISOString()).toBe('2026-07-01T07:00:00.000Z'); // 10:00 local
    expect(dayRangeInterval(DAY, SLOT_6, TZ).end).toBe(eight.start);
  });

  it('follows the clock change: the day the clocks go back is 25 hours long', () => {
    const all = dayRangeInterval('2026-10-25', 'all', TZ);
    expect((all.end - all.start) / 3600_000).toBe(25);
  });
});

describe('coverage', () => {
  it('is free without blocks and blocked when one block covers the slot', () => {
    expect(coverage([], slot(1), [1])).toBe('free');
    expect(coverage([block('a', '2026-06-30T21:00:00Z', '2026-07-01T21:00:00Z')], slot(1), [1])).toBe('blocked');
    expect(coverage([closed('a', 1)], slot(1), [1])).toBe('blocked');
    expect(coverage([closed('a', 1)], slot(2), [1])).toBe('free');
  });

  it('adds up adjacent blocks: every slot closed one by one closes the working day', () => {
    const working = {start: slot(0).start, end: slot(SLOTS.length - 1).end};
    const all = SLOTS.map((_, i) => closed(String(i), i));
    expect(coverage(all, working, [1])).toBe('blocked');
    expect(coverage(all.slice(0, 3), working, [1])).toBe('partial');
  });

  it('is partial when only a part of the slot is blocked', () => {
    expect(coverage([block('a', '2026-07-01T05:30:00Z', '2026-07-01T06:00:00Z')], slot(1), [1])).toBe('partial');
  });

  it('counts a block of one staff member as closed only when nobody else is free', () => {
    const own = [block('a', '2026-06-30T21:00:00Z', '2026-07-01T21:00:00Z', {staffId: 1})];
    expect(coverage(own, slot(1), [1])).toBe('blocked');
    expect(coverage(own, slot(1), [1, 2])).toBe('partial');
  });
});

describe('planClose', () => {
  it('closes a free slot with one block for everyone', () => {
    expect(planClose([], slot(1))).toEqual({insert: [{staffId: null, reason: null, ...slot(1)}], deleteIds: []});
  });

  it('merges with neighbouring slots, so the list shows one stretch of time instead of three', () => {
    const plan = planClose([closed('a', 0), closed('c', 2)], slot(1));
    expect(plan.deleteIds.sort()).toEqual(['a', 'c']);
    expect(plan.insert).toEqual([{staffId: null, reason: null, start: slot(0).start, end: slot(2).end}]);
  });

  it('closing the whole day swallows the slots that were closed before', () => {
    const plan = planClose([closed('a', 0), closed('e', 5)], dayRangeInterval(DAY, 'all', TZ));
    expect(plan.deleteIds.sort()).toEqual(['a', 'e']);
    expect(plan.insert).toEqual([{staffId: null, reason: null, ...dayRangeInterval(DAY, 'all', TZ)}]);
  });

  it('leaves blocks with a reason and blocks of one staff member as they are', () => {
    const existing = [
      block('vacation', '2026-06-20T21:00:00Z', '2026-07-01T05:00:00Z', {reason: 'Отпуск'}),
      block('own', '2026-07-01T05:30:00Z', '2026-07-01T06:00:00Z', {staffId: 2})
    ];
    expect(planClose(existing, slot(1))).toEqual({insert: [{staffId: null, reason: null, ...slot(1)}], deleteIds: []});
  });
});

describe('planOpen', () => {
  it('removes a block that lies inside the interval', () => {
    expect(planOpen([closed('e', 5)], dayRangeInterval(DAY, 'all', TZ))).toEqual({insert: [], deleteIds: ['e']});
  });

  it('opens one slot in the middle of a closed day', () => {
    const day = {id: 'd', staffId: null, reason: null, ...dayRangeInterval(DAY, 'all', TZ)};
    expect(planOpen([day], slot(3))).toEqual({
      deleteIds: ['d'],
      insert: [
        {staffId: null, reason: null, start: day.start, end: slot(3).start},
        {staffId: null, reason: null, start: slot(3).end, end: day.end}
      ]
    });
  });

  it('cuts one day out of a longer block and keeps its reason on both sides', () => {
    const vacation = block('v', '2026-06-27T21:00:00Z', '2026-07-04T21:00:00Z', {reason: 'Отпуск'});
    const all = dayRangeInterval(DAY, 'all', TZ);
    expect(planOpen([vacation], all)).toEqual({
      deleteIds: ['v'],
      insert: [
        {staffId: null, reason: 'Отпуск', start: vacation.start, end: all.start},
        {staffId: null, reason: 'Отпуск', start: all.end, end: vacation.end}
      ]
    });
  });

  it('does not touch blocks outside the interval, even when they end exactly where it starts', () => {
    expect(planOpen([closed('a', 0)], slot(1))).toEqual({insert: [], deleteIds: []});
  });
});

describe('closed slots in the booking calendar', () => {
  const settings = {...seedSettings, leadTimeHours: 0};
  const slots = (busy: {start: number; end: number}[]) =>
    buildSlots({
      date: DAY,
      durationMin: 60,
      settings,
      staffIds: [1],
      busy: busy.map((b) => ({staffId: null, ...b})),
      now: new Date('2026-06-01T00:00:00Z')
    });

  it('a closed 10–12 slot leaves no start that would run into it', () => {
    const free = slots([dayRangeInterval(DAY, SLOT_10, TZ)]);
    // 60 min of work + the travel buffer must end by 10:00; the next start is 12:00
    const lastBefore = 10 * 60 - 60 - settings.bufferMin;
    const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    expect(free).toContain(hm(lastBefore));
    expect(free).not.toContain(hm(lastBefore + settings.slotStep));
    expect(free).not.toContain('11:30');
    expect(free).toContain('12:00');
  });

  it('a closed day has no free time at all', () => {
    expect(slots([dayRangeInterval(DAY, 'all', TZ)])).toEqual([]);
  });
});

describe('service slugs', () => {
  it('turns a Finnish name into a Latin slug', () => {
    expect(slugify('Nojatuoli, iso (2 kpl)')).toBe('nojatuoli-iso-2-kpl');
    expect(slugify('Sängyn pääty & äänieriste')).toBe('sangyn-paaty-aanieriste');
  });

  it('gives an empty slug for a name without Latin letters', () => {
    expect(slugify('Кресло')).toBe('');
  });

  it('adds a number when the slug is taken', () => {
    expect(uniqueSlug('tuoli', [])).toBe('tuoli');
    expect(uniqueSlug('tuoli', ['tuoli', 'tuoli-2'])).toBe('tuoli-3');
  });
});
