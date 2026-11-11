import {describe, expect, it} from 'vitest';
import {bookingsWord, daySpan, gridHours, layoutDay, searchTerm, weekDays, weekStart} from '@/lib/admin/board';

const TZ = 'Europe/Helsinki';

describe('weekStart / weekDays', () => {
  it('returns the Monday of the week for any day of it', () => {
    // 2026-11-11 is a Wednesday
    expect(weekStart('2026-11-11')).toBe('2026-11-09');
    expect(weekStart('2026-11-09')).toBe('2026-11-09');
    expect(weekStart('2026-11-15')).toBe('2026-11-09');
    expect(weekStart('2026-11-16')).toBe('2026-11-16');
  });

  it('crosses month and year borders', () => {
    expect(weekStart('2026-11-01')).toBe('2026-10-26');
    expect(weekStart('2027-01-01')).toBe('2026-12-28');
  });

  it('lists the seven days from Monday to Sunday', () => {
    expect(weekDays('2026-12-28')).toEqual(['2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02', '2027-01-03']);
  });
});

describe('daySpan', () => {
  // November: Helsinki is UTC+2, so 10:00 local = 08:00Z
  it('gives the local minutes of an interval inside the day', () => {
    expect(daySpan('2026-11-11T08:00:00Z', '2026-11-11T09:40:00Z', '2026-11-11', TZ)).toEqual({start: 600, end: 700});
  });

  it('is null for an interval on another day', () => {
    expect(daySpan('2026-11-11T08:00:00Z', '2026-11-11T09:40:00Z', '2026-11-12', TZ)).toBeNull();
  });

  it('cuts an interval that runs over midnight at 00:00 on both days', () => {
    // 22:00 local on the 11th → 02:00 local on the 12th
    const start = '2026-11-11T20:00:00Z';
    const end = '2026-11-12T00:00:00Z';
    expect(daySpan(start, end, '2026-11-11', TZ)).toEqual({start: 22 * 60, end: 24 * 60});
    expect(daySpan(start, end, '2026-11-12', TZ)).toEqual({start: 0, end: 120});
  });

  it('covers the whole day for a block that spans several days', () => {
    expect(daySpan('2026-11-09T22:00:00Z', '2026-11-13T22:00:00Z', '2026-11-11', TZ)).toEqual({start: 0, end: 24 * 60});
  });

  it('uses summer time in July (UTC+3)', () => {
    expect(daySpan('2026-07-01T07:00:00Z', '2026-07-01T08:00:00Z', '2026-07-01', TZ)).toEqual({start: 600, end: 660});
  });
});

describe('gridHours', () => {
  it('shows the opening hours when everything fits', () => {
    expect(gridHours('06:00', '21:00', [{start: 600, end: 700}])).toEqual({from: 6, to: 21});
  });

  it('rounds half hours outwards', () => {
    expect(gridHours('07:30', '20:30', [])).toEqual({from: 7, to: 21});
  });

  it('widens for a booking outside the opening hours', () => {
    expect(gridHours('08:00', '18:00', [{start: 5 * 60 + 30, end: 7 * 60}])).toEqual({from: 5, to: 18});
    expect(gridHours('08:00', '18:00', [{start: 17 * 60, end: 19 * 60 + 10}])).toEqual({from: 8, to: 20});
  });

  it('never leaves the day', () => {
    expect(gridHours('00:00', '24:00', [{start: 0, end: 24 * 60}])).toEqual({from: 0, to: 24});
  });
});

describe('layoutDay', () => {
  const span = (id: string, start: number, end: number) => ({id, start, end});
  const shape = (items: ReturnType<typeof span>[]) =>
    Object.fromEntries(layoutDay(items).map((p) => [p.item.id, `${p.col}/${p.cols}`]));

  it('gives the full width to bookings that do not overlap', () => {
    expect(shape([span('a', 480, 580), span('b', 600, 700), span('c', 700, 760)])).toEqual({a: '0/1', b: '0/1', c: '0/1'});
  });

  it('puts two overlapping bookings side by side', () => {
    expect(shape([span('a', 600, 700), span('b', 630, 720)])).toEqual({a: '0/2', b: '1/2'});
  });

  it('reuses a column once it is free again inside the same group', () => {
    // a and b overlap; c starts after a ended but while b is still running
    expect(shape([span('a', 600, 660), span('b', 600, 780), span('c', 670, 760)])).toEqual({a: '0/2', b: '1/2', c: '0/2'});
  });

  it('keeps separate groups independent', () => {
    expect(shape([span('a', 480, 600), span('b', 500, 560), span('c', 700, 800)])).toEqual({a: '0/2', b: '1/2', c: '0/1'});
  });

  it('needs three columns for three bookings at once', () => {
    expect(shape([span('a', 600, 700), span('b', 600, 700), span('c', 610, 690)])).toEqual({a: '0/3', b: '1/3', c: '2/3'});
  });

  it('does not depend on the input order', () => {
    expect(shape([span('b', 630, 720), span('a', 600, 700)])).toEqual({a: '0/2', b: '1/2'});
  });
});

describe('bookingsWord', () => {
  it('declines the noun in Russian', () => {
    expect([1, 2, 4, 5, 11, 12, 21, 22, 25, 101, 111].map(bookingsWord)).toEqual([
      'бронь',
      'брони',
      'брони',
      'броней',
      'броней',
      'броней',
      'бронь',
      'брони',
      'броней',
      'бронь',
      'броней'
    ]);
  });
});

describe('searchTerm', () => {
  it('keeps ordinary text, phone numbers and reference codes', () => {
    expect(searchTerm('  Matti   Meikäläinen ')).toBe('Matti Meikäläinen');
    expect(searchTerm('+358 40 123 4567')).toBe('+358 40 123 4567');
    expect(searchTerm('PU-1A2B3C')).toBe('PU-1A2B3C');
  });

  it('drops the characters that have a meaning in a PostgREST filter or in LIKE', () => {
    expect(searchTerm('a,b(c)d"e%f*g:h')).toBe('a b c d e f g h');
    expect(searchTerm('%')).toBe('');
  });

  it('cuts very long input', () => {
    expect(searchTerm('x'.repeat(200))).toHaveLength(60);
  });
});
