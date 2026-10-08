/** Regression tests for the findings of the final review. */
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {priceCart, type CartLine} from '@/lib/booking/cart';
import {seedCategories, seedServices, seedSettings} from '@/lib/data/seed-data';
import {memoryStore} from '@/lib/data/store.memory';
import type {BookingInput} from '@/lib/data/store';
import {parseEuro} from '@/lib/money';
import {pickClientIp} from '@/lib/server/client-ip';
import type {Catalog} from '@/lib/types';

const catalog: Catalog = {categories: seedCategories, services: seedServices};
const line = (slug: string, qty = 1): CartLine => ({slug, qty, options: [], veryDirty: false});
const sofa3 = seedServices.find((s) => s.slug === 'sofa-3')!;

describe('gift cards follow the published terms', () => {
  const price = (cart: CartLine[], giftCard: {amountCents?: number; serviceId?: number}, travelCents = 0) =>
    priceCart(cart, catalog, {minOrderCents: seedSettings.minOrderCents, travelCents, giftCard});

  it('a value card pays up to its balance and may also cover the travel fee', () => {
    expect(price([line('sofa-2')], {amountCents: 15000})).toMatchObject({discountCents: 10900, totalCents: 0, giftCardApplicable: true});
    expect(price([line('sofa-3')], {amountCents: 5000}, 2500)).toMatchObject({discountCents: 5000, totalCents: 12400});
  });

  it('a service card covers one unit of its own service only, never the travel fee', () => {
    const q = price([line('sofa-3', 2), line('armchair')], {serviceId: sofa3.id}, 2500);
    expect(q).toMatchObject({discountCents: 14900, giftCardApplicable: true, totalCents: 14900 + 5000 + 2500});
  });

  it('a service card is not applied when its service is not in the cart', () => {
    const q = price([line('sofa-2')], {serviceId: sofa3.id});
    expect(q).toMatchObject({discountCents: 0, giftCardApplicable: false, totalCents: 10900});
  });
});

describe('parseEuro (admin price fields)', () => {
  it('accepts plain numbers with a dot or a comma', () => {
    expect(parseEuro('150')).toBe(15000);
    expect(parseEuro(' 12,5 ')).toBe(1250);
    expect(parseEuro('0')).toBe(0);
    expect(parseEuro('99.99')).toBe(9999);
  });

  it('rejects everything that is not a clean non-negative amount instead of saving 0', () => {
    for (const bad of ['', '   ', '150 €', '1 500', 'abc', '-5', '1e3', '12,345', 'NaN']) {
      expect(parseEuro(bad), bad).toBeNull();
    }
  });
});

describe('client IP for rate limiting', () => {
  const ip = (headers: Record<string, string>) => pickClientIp(new Headers(headers));

  it('prefers x-real-ip (set by the platform or the reverse proxy)', () => {
    expect(ip({'x-real-ip': '203.0.113.7', 'x-forwarded-for': '6.6.6.6, 203.0.113.7'})).toBe('203.0.113.7');
  });

  it('otherwise uses the last x-forwarded-for hop, which a client cannot forge', () => {
    expect(ip({'x-forwarded-for': '6.6.6.6, 198.51.100.4'})).toBe('198.51.100.4');
    expect(ip({'x-forwarded-for': '198.51.100.4'})).toBe('198.51.100.4');
  });

  it('falls back to a constant when no proxy header exists', () => {
    expect(ip({})).toBe('unknown');
  });
});

describe('a visit that has already started cannot be cancelled or moved by the customer', () => {
  const booking = (startsAt: string): BookingInput => ({
    locale: 'fi',
    customerType: 'private',
    name: 'Testi',
    phone: '+358401234567',
    email: 'testi@example.com',
    address: 'Testikatu 1',
    postalCode: '00100',
    city: 'Helsinki',
    startsAt,
    endsAt: new Date(Date.parse(startsAt) + 90 * 60_000).toISOString(),
    durationMin: 60,
    subtotalCents: 15000,
    travelCents: 0,
    minFillCents: 0,
    promoCents: 0,
    promoDetails: {},
    discountCents: 0,
    totalCents: 15000,
    marketingConsent: false,
    items: []
  });

  it('an empty e-mail or phone never makes someone a returning customer', async () => {
    // a manual booking taken by phone has no e-mail
    const manual = {...booking(new Date(Date.now() + 400 * 3600_000).toISOString()), email: '', phone: '+358500000091'};
    await memoryStore.createBooking(manual);
    expect(await memoryStore.isReturningCustomer('', '+358500000092')).toBe(false);
    expect(await memoryStore.isReturningCustomer('new@example.com', '')).toBe(false);
    expect(await memoryStore.isReturningCustomer('', '+358500000091')).toBe(true);
  });

  it('refuses both for a past booking and allows both for an upcoming one', async () => {
    const past = await memoryStore.createBooking(booking(new Date(Date.now() - 2 * 3600_000).toISOString()));
    const future = await memoryStore.createBooking(booking(new Date(Date.now() + 48 * 3600_000).toISOString()));
    if (!past.ok || !future.ok) throw new Error('setup failed');
    const later = new Date(Date.now() + 72 * 3600_000).toISOString();
    const laterEnd = new Date(Date.now() + 73.5 * 3600_000).toISOString();

    expect(await memoryStore.rescheduleBooking(past.booking.manageToken, later, laterEnd)).toBe('not_found');
    expect(await memoryStore.cancelBooking(past.booking.manageToken)).toBe(false);

    expect(await memoryStore.rescheduleBooking(future.booking.manageToken, later, laterEnd)).toBe('ok');
    expect(await memoryStore.cancelBooking(future.booking.manageToken)).toBe(true);
  });
});

describe('public data: a failed database read is never cached', () => {
  beforeEach(() => vi.resetModules());

  it('serves seed data while the database is down and real data as soon as it is back', async () => {
    let down = true;
    const rows = [{key: 'phone', value: '+358 50 111 2222'}];
    vi.doMock('@/lib/supabase/env', () => ({isSupabaseConfigured: true, supabaseUrl: 'x', supabaseAnonKey: 'y'}));
    vi.doMock('@/lib/supabase/service', () => ({
      createPublicClient: () => ({
        from: () => ({select: async () => (down ? {data: null, error: new Error('down')} : {data: rows, error: null})})
      })
    }));
    // a minimal stand-in for Next's data cache: remembers the first successful (resolved) result
    vi.doMock('next/cache', () => ({
      unstable_cache: (fn: () => Promise<unknown>) => {
        let cached: {value: unknown} | undefined;
        return async () => {
          if (!cached) cached = {value: await fn()};
          return cached.value;
        };
      }
    }));
    const silence = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const {getSettings, getSettingsStrict} = await import('@/lib/data/public');

    expect((await getSettings()).phone).toBe(seedSettings.phone);
    await expect(getSettingsStrict()).rejects.toThrow();

    down = false;
    expect((await getSettings()).phone).toBe('+358 50 111 2222');
    expect((await getSettingsStrict()).phone).toBe('+358 50 111 2222');
    silence.mockRestore();
  });
});

describe('photo upload targets keep the position of their file', () => {
  it('skips a file whose upload URL could not be issued without shifting the others', async () => {
    vi.resetModules();
    vi.doMock('@/lib/supabase/service', () => ({
      createServiceClient: () => ({
        storage: {
          from: () => ({
            createSignedUploadUrl: async (path: string) =>
              path.endsWith('02.png') ? {data: null, error: new Error('boom')} : {data: {path, token: `t-${path}`}, error: null}
          })
        },
        from: () => ({update: () => ({eq: async () => ({error: null})})})
      })
    }));
    const {supabaseStore} = await import('@/lib/data/store.supabase');
    const files = ['a.jpg', 'b.png', 'c.webp'].map((name) => ({name, type: 'image/jpeg', size: 10}));
    const uploads = await supabaseStore.createBookingUploads('booking-id', files);
    expect(uploads.map((u) => [u.index, u.path])).toEqual([
      [0, 'booking-id/01.jpg'],
      [2, 'booking-id/03.webp']
    ]);
    vi.doUnmock('@/lib/supabase/service');
  });
});
