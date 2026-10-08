import {describe, expect, it} from 'vitest';
import {priceCart, type CartLine} from '@/lib/booking/cart';
import {buildAvailability, buildSlots, validateStart, type Busy} from '@/lib/booking/slots';
import {quoteTravel, zoneFee} from '@/lib/booking/travel';
import {addDays, utcToZoned, zonedToUtc} from '@/lib/booking/tz';
import {seedCategories, seedServices, seedSettings} from '@/lib/data/seed-data';
import type {Catalog} from '@/lib/types';

const catalog: Catalog = {categories: seedCategories, services: seedServices};
const line = (slug: string, qty = 1, options: string[] = [], veryDirty = false): CartLine => ({slug, qty, options, veryDirty});
const price = (cart: CartLine[], extra: {travelCents?: number; giftCard?: {amountCents: number}} = {}) =>
  priceCart(cart, catalog, {minOrderCents: seedSettings.minOrderCents, ...extra});

describe('priceCart', () => {
  it('prices a 3-seater at 149 € with no minimum-order top-up', () => {
    const q = price([line('sofa-3')]);
    expect(q).toMatchObject({subtotalCents: 14900, minFillCents: 0, totalCents: 14900, durationMin: 60, invalid: []});
  });

  it('tops a 50 € armchair up to the 100 € minimum order as a separate amount', () => {
    const q = price([line('armchair')]);
    expect(q).toMatchObject({subtotalCents: 5000, minFillCents: 5000, totalCents: 10000});
  });

  it('adds per-item options to the unit price and duration, multiplied by quantity', () => {
    // a catalog where the dining chair has a paid option (the seed has only the free odor option)
    const withOption: Catalog = {
      categories: seedCategories,
      services: seedServices.map((s) =>
        s.slug === 'chair-full'
          ? {...s, options: [{id: 999, serviceId: s.id, slug: 'extra', name: s.name, priceCents: 500, durationMin: 10}]}
          : s
      )
    };
    const q = priceCart([line('chair-full', 6, ['extra'])], withOption, {minOrderCents: seedSettings.minOrderCents});
    // 6 × (20 + 5) €, 6 × (15 + 10) min
    expect(q.lines[0]).toMatchObject({unitCents: 2500, lineCents: 15000, durationMin: 150});
    expect(q.subtotalCents).toBe(15000);
  });

  it('ignores options that do not belong to the service', () => {
    const q = price([line('sofa-3', 1, ['extra', 'nope'])]);
    expect(q.lines[0].optionSlugs).toEqual([]);
    expect(q.subtotalCents).toBe(14900);
  });

  it('adds travel after the minimum-order top-up', () => {
    const q = price([line('armchair')], {travelCents: 2500});
    expect(q).toMatchObject({subtotalCents: 5000, minFillCents: 5000, travelCents: 2500, totalCents: 12500});
  });

  it('applies a gift card and never goes below zero', () => {
    expect(price([line('sofa-3')], {giftCard: {amountCents: 5000}})).toMatchObject({discountCents: 5000, totalCents: 9900});
    expect(price([line('sofa-2')], {giftCard: {amountCents: 50000}})).toMatchObject({discountCents: 10900, totalCents: 0});
  });

  it('reports unknown and price-list-only services as invalid instead of pricing them', () => {
    const q = price([line('sofa-3'), line('b2b-office-chair'), line('odor-removal'), line('does-not-exist')]);
    expect(q.invalid).toEqual(['b2b-office-chair', 'odor-removal', 'does-not-exist']);
    expect(q.subtotalCents).toBe(14900);
  });

  it('refuses services of a category that is switched off', () => {
    const carsOff: Catalog = {
      categories: seedCategories.map((c) => (c.slug === 'vehicles' ? {...c, isActive: false} : c)),
      services: seedServices
    };
    const q = priceCart([line('car-5')], carsOff, {minOrderCents: seedSettings.minOrderCents});
    expect(q.invalid).toEqual(['car-5']);
  });

  it('keeps separately configured lines apart and flags items that need a price check', () => {
    const q = price([line('sofa-2'), line('sofa-2', 1, [], true)]);
    expect(q.lines).toHaveLength(2);
    expect(q.needsEstimate).toBe(true);
    expect(q.subtotalCents).toBe(21800);
  });

  it('returns an empty quote for an empty cart (no minimum top-up on nothing)', () => {
    expect(price([])).toMatchObject({subtotalCents: 0, minFillCents: 0, totalCents: 0, durationMin: 0});
  });
});

describe('travel fee', () => {
  const zones = seedSettings.travelZones;

  it('uses the zone table: <35 km free, 35–50 km 25 €, 50–100 km 50 €, 100–150 km 100 €, beyond: none', () => {
    expect(zoneFee(34.9, zones)).toBe(0);
    expect(zoneFee(35, zones)).toBe(2500);
    expect(zoneFee(49.9, zones)).toBe(2500);
    expect(zoneFee(50, zones)).toBe(5000);
    expect(zoneFee(100, zones)).toBe(10000);
    expect(zoneFee(150, zones)).toBeNull();
  });

  it('quotes by postal code: road distance = straight line × road factor', () => {
    const helsinki = quoteTravel({code: '00100', municipality: 'Helsinki', lat: 60.1719, lng: 24.92688}, seedSettings);
    expect(helsinki).toMatchObject({status: 'ok', feeCents: 0, municipality: 'Helsinki'});

    const lahti = quoteTravel({code: '15100', municipality: 'Lahti', lat: 60.97396, lng: 25.65752}, seedSettings);
    // ≈ 98 km straight × 1.3 ≈ 127 km → 100 € zone
    expect(lahti).toMatchObject({status: 'ok', feeCents: 10000});

    const tampere = quoteTravel({code: '33100', municipality: 'Tampere', lat: 61.49006, lng: 23.78729}, seedSettings);
    expect(tampere.status).toBe('out_of_range');

    expect(quoteTravel(null, seedSettings)).toEqual({status: 'unknown'});
  });
});

describe('time zone helpers (Europe/Helsinki)', () => {
  const tz = 'Europe/Helsinki';

  it('converts local wall time to UTC in summer (UTC+3) and winter (UTC+2)', () => {
    expect(zonedToUtc('2026-07-01', 6 * 60, tz).toISOString()).toBe('2026-07-01T03:00:00.000Z');
    expect(zonedToUtc('2026-12-01', 6 * 60, tz).toISOString()).toBe('2026-12-01T04:00:00.000Z');
  });

  it('round-trips through utcToZoned, also on DST change days', () => {
    for (const date of ['2026-03-29', '2026-10-25', '2026-07-15']) {
      const utc = zonedToUtc(date, 20 * 60 + 30, tz);
      expect(utcToZoned(utc, tz)).toEqual({date, minutes: 20 * 60 + 30});
    }
  });

  it('adds days across month ends', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-12-31', 60)).toBe('2027-03-01');
  });
});

describe('slots', () => {
  const settings = {...seedSettings, leadTimeHours: 3, bufferMin: 30};
  const farPast = new Date('2026-01-01T00:00:00Z');
  const base = {date: '2026-07-01', durationMin: 60, settings, staffIds: [1], busy: [] as Busy[], now: farPast};
  const busy = (staffId: number | null, from: string, to: string): Busy => ({
    staffId,
    start: Date.parse(from),
    end: Date.parse(to)
  });

  it('offers every 30 minutes from 06:00 and the work must end by 21:00', () => {
    const slots = buildSlots(base);
    expect(slots[0]).toBe('06:00');
    expect(slots[slots.length - 1]).toBe('20:00');
    expect(slots).toHaveLength(29);
    expect(buildSlots({...base, durationMin: 150}).at(-1)).toBe('18:30');
  });

  it('returns nothing when the visit does not fit into the day', () => {
    expect(buildSlots({...base, durationMin: 16 * 60})).toEqual([]);
  });

  it('respects the lead time before the first bookable slot', () => {
    // 10:10 Helsinki time + 3 h → first slot 13:30
    const now = new Date('2026-07-01T07:10:00Z');
    expect(buildSlots({...base, now})[0]).toBe('13:30');
    // yesterday is gone entirely
    expect(buildSlots({...base, date: '2026-06-30', now})).toEqual([]);
  });

  it('removes slots that would overlap a booking, including the travel buffer on both sides', () => {
    // existing booking 10:00–11:00 work + 30 min buffer → busy until 11:30 local (UTC+3)
    const slots = buildSlots({...base, busy: [busy(1, '2026-07-01T07:00:00Z', '2026-07-01T08:30:00Z')]});
    // a 60 min visit + 30 min buffer must end by 10:00 → latest start 08:30
    expect(slots).toContain('08:30');
    expect(slots).not.toContain('09:00');
    expect(slots).not.toContain('11:00');
    expect(slots).toContain('11:30');
  });

  it('keeps a slot open while at least one staff member is free', () => {
    const taken = busy(1, '2026-07-01T07:00:00Z', '2026-07-01T08:30:00Z');
    expect(buildSlots({...base, staffIds: [1, 2], busy: [taken]})).toContain('10:00');
    const both = [taken, busy(2, '2026-07-01T07:00:00Z', '2026-07-01T08:30:00Z')];
    expect(buildSlots({...base, staffIds: [1, 2], busy: both})).not.toContain('10:00');
  });

  it('treats blocked time without a staff id as blocking everyone', () => {
    const holiday = busy(null, '2026-06-30T21:00:00Z', '2026-07-01T21:00:00Z');
    expect(buildSlots({...base, staffIds: [1, 2], busy: [holiday]})).toEqual([]);
  });

  it('builds availability for the whole horizon', () => {
    const now = new Date('2026-07-01T07:10:00Z');
    const days = buildAvailability({durationMin: 60, settings: {...settings, bookingHorizonDays: 60}, staffIds: [1], busy: [], now});
    const dates = Object.keys(days);
    expect(dates[0]).toBe('2026-07-01');
    expect(dates).toHaveLength(61);
    expect(days['2026-07-02']).toHaveLength(29);
  });

  it('validates a requested start on the server', () => {
    const now = new Date('2026-07-01T07:10:00Z');
    const check = (iso: string, durationMin = 60) => validateStart({startsAt: iso, durationMin, settings, now});
    expect(check('2026-07-02T03:00:00.000Z')).toBe('ok'); // 06:00 local
    expect(check('2026-07-02T02:30:00.000Z')).toBe('outside_hours'); // 05:30
    expect(check('2026-07-02T17:30:00.000Z')).toBe('outside_hours'); // 20:30 + 60 min > 21:00
    expect(check('2026-07-02T03:10:00.000Z')).toBe('misaligned');
    expect(check('2026-07-01T09:00:00.000Z')).toBe('too_soon'); // 12:00 local, lead time until 13:10
    expect(check('2026-12-01T10:00:00.000Z')).toBe('too_far');
    expect(check('not a date')).toBe('invalid');
  });
});
