/**
 * Runs the real migrations and seed against an embedded Postgres (PGlite) with a minimal
 * stand-in for the objects Supabase provides (roles, auth.users, auth.uid(), storage tables).
 */
import {readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {PGlite} from '@electric-sql/pglite';
import {btree_gist} from '@electric-sql/pglite/contrib/btree_gist';
import {beforeAll, describe, expect, it} from 'vitest';

const root = path.resolve(__dirname, '../..');

const SUPABASE_STUB = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;

  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text);
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to anon, authenticated, service_role;

  create schema storage;
  create table storage.buckets (
    id text primary key, name text, public boolean,
    file_size_limit bigint, allowed_mime_types text[]
  );
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
`;

let db: PGlite;

const booking = (startsAt: string, endsAt: string, extra: Record<string, unknown> = {}) => ({
  locale: 'fi',
  customer_type: 'private',
  name: 'Testi Asiakas',
  phone: '+358401234567',
  email: 'testi@example.com',
  address: 'Testikatu 1 A 2',
  postal_code: '00100',
  city: 'Helsinki',
  starts_at: startsAt,
  ends_at: endsAt,
  duration_min: 60,
  subtotal_cents: 15000,
  total_cents: 15000,
  ...extra
});
const items = [{service_id: 3, service_slug: 'sofa-3', name: '3-istuttava sohva', qty: 1, unit_price_cents: 15000, duration_min: 60, option_ids: [], option_slugs: []}];

async function book(startsAt: string, endsAt: string, extra: Record<string, unknown> = {}) {
  const res = await db.query<{book_slot: {id: string; ref_code: string; manage_token: string; staff_id: number}}>(
    'select public.book_slot($1::jsonb, $2::jsonb)',
    [JSON.stringify(booking(startsAt, endsAt, extra)), JSON.stringify(items)]
  );
  return res.rows[0].book_slot;
}

beforeAll(async () => {
  db = new PGlite({extensions: {btree_gist}});
  await db.exec(SUPABASE_STUB);
  const dir = path.join(root, 'supabase/migrations');
  for (const file of readdirSync(dir).sort()) {
    await db.exec(readFileSync(path.join(dir, file), 'utf8'));
  }
  await db.exec(readFileSync(path.join(root, 'supabase/seed.sql'), 'utf8'));
  await db.exec('set search_path = public, extensions');
});

describe('seed', () => {
  it('loads the catalog with the prices of the price sheet', async () => {
    const {rows} = await db.query<{slug: string; price_cents: number; duration_min: number; is_active: boolean}>(
      "select slug, price_cents, duration_min, is_active from services where slug in ('armchair','sofa-3','bed-double','car-5') order by slug"
    );
    expect(rows).toEqual([
      {slug: 'armchair', price_cents: 5000, duration_min: 40, is_active: true},
      {slug: 'bed-double', price_cents: 16000, duration_min: 90, is_active: true},
      {slug: 'car-5', price_cents: 17900, duration_min: 150, is_active: true},
      {slug: 'sofa-3', price_cents: 14900, duration_min: 60, is_active: true}
    ]);
    const protection = await db.query("select 1 from service_options where slug = 'protect'");
    expect(protection.rows).toHaveLength(0);
  });

  it('sets the minimum order to 100 €, opening hours to 06–21 and the discounts of the price policy', async () => {
    const {rows} = await db.query<{key: string; value: unknown}>(
      "select key, value from settings where key in ('min_order_cents','open_from','open_to') order by key"
    );
    expect(rows).toEqual([
      {key: 'min_order_cents', value: 10000},
      {key: 'open_from', value: '06:00'},
      {key: 'open_to', value: '21:00'}
    ]);
    const promo = await db.query<{value: Record<string, unknown>}>("select value from settings where key = 'promotions'");
    expect(promo.rows[0].value).toMatchObject({firstOrderPct: 10, repeatOrderPct: 5, multiItemPct: 5, multiItemMin: 3});
  });

  it('is idempotent and keeps demo reviews unpublished', async () => {
    await db.exec(readFileSync(path.join(root, 'supabase/seed.sql'), 'utf8'));
    const staff = await db.query<{n: number}>('select count(*)::int as n from staff');
    const published = await db.query<{n: number}>('select count(*)::int as n from reviews where is_published');
    expect(staff.rows[0].n).toBe(1);
    expect(published.rows[0].n).toBe(0);
  });
});

describe('book_slot', () => {
  it('creates a booking with items, a reference code and a manage token', async () => {
    const res = await book('2030-01-10T08:00:00Z', '2030-01-10T09:30:00Z');
    expect(res.ref_code).toMatch(/^PU-[0-9A-F]{6}$/);
    expect(res.manage_token).toHaveLength(64);
    const {rows} = await db.query<{n: number}>('select count(*)::int as n from booking_items where booking_id = $1', [res.id]);
    expect(rows[0].n).toBe(1);
  });

  it('rejects an overlapping booking: double booking is impossible', async () => {
    await expect(book('2030-01-10T09:00:00Z', '2030-01-10T10:30:00Z')).rejects.toThrow(/slot_taken/);
  });

  it('accepts a booking that starts exactly when the previous one ends', async () => {
    const res = await book('2030-01-10T09:30:00Z', '2030-01-10T11:00:00Z');
    expect(res.staff_id).toBe(1);
  });

  it('enforces the constraint even for direct inserts that bypass the function', async () => {
    await expect(
      db.query(
        `insert into bookings (ref_code, name, phone, email, address, postal_code, city, starts_at, ends_at, duration_min, staff_id, subtotal_cents, total_cents, manage_token)
         values ('PU-DIRECT', 'x', 'x', 'x', 'x', '00100', 'x', '2030-01-10T08:30:00Z', '2030-01-10T09:00:00Z', 30, 1, 0, 0, 'direct-token')`
      )
    ).rejects.toThrow(/bookings_no_overlap/);
  });

  it('frees the slot when a booking is cancelled', async () => {
    const first = await book('2030-01-11T08:00:00Z', '2030-01-11T09:30:00Z');
    await db.query("update bookings set status = 'cancelled' where id = $1", [first.id]);
    const second = await book('2030-01-11T08:00:00Z', '2030-01-11T09:30:00Z');
    expect(second.id).not.toBe(first.id);
  });

  it('respects blocked times', async () => {
    await db.exec("insert into blocked_times (staff_id, starts_at, ends_at, reason) values (null, '2030-01-12T00:00:00Z', '2030-01-13T00:00:00Z', 'holiday')");
    await expect(book('2030-01-12T08:00:00Z', '2030-01-12T09:30:00Z')).rejects.toThrow(/slot_taken/);
  });

  it('uses a second staff member for a parallel slot and fails when everyone is busy', async () => {
    await db.exec("insert into staff (name) values ('Second')");
    const a = await book('2030-01-14T08:00:00Z', '2030-01-14T09:30:00Z');
    const b = await book('2030-01-14T08:00:00Z', '2030-01-14T09:30:00Z');
    expect(new Set([a.staff_id, b.staff_id]).size).toBe(2);
    await expect(book('2030-01-14T08:30:00Z', '2030-01-14T09:00:00Z')).rejects.toThrow(/slot_taken/);
    await db.exec("update staff set is_active = false where name = 'Second'");
  });
});

describe('reschedule_booking', () => {
  it('moves a booking and refuses a taken slot', async () => {
    const a = await book('2030-02-01T08:00:00Z', '2030-02-01T09:30:00Z');
    const b = await book('2030-02-01T10:00:00Z', '2030-02-01T11:30:00Z');
    await expect(
      db.query('select public.reschedule_booking($1, $2, $3)', [b.manage_token, '2030-02-01T09:00:00Z', '2030-02-01T10:30:00Z'])
    ).rejects.toThrow(/slot_taken/);
    await db.query('select public.reschedule_booking($1, $2, $3)', [b.manage_token, '2030-02-01T12:00:00Z', '2030-02-01T13:30:00Z']);
    const {rows} = await db.query<{starts_at: Date}>('select starts_at from bookings where id = $1', [b.id]);
    expect(new Date(rows[0].starts_at).toISOString()).toBe('2030-02-01T12:00:00.000Z');
    expect(a.id).toBeTruthy();
  });
});

describe('gift cards', () => {
  it('redeems a paid card and gives it back when the booking is cancelled', async () => {
    await db.exec("insert into gift_cards (code, amount_cents, buyer_name, buyer_email, status) values ('PURO-TEST-1', 5000, 'A', 'a@example.com', 'paid')");
    const res = await book('2030-03-01T08:00:00Z', '2030-03-01T09:30:00Z', {gift_card_code: 'PURO-TEST-1', discount_cents: 5000, total_cents: 10000});
    let card = await db.query<{status: string}>("select status from gift_cards where code = 'PURO-TEST-1'");
    expect(card.rows[0].status).toBe('redeemed');

    await expect(book('2030-03-02T08:00:00Z', '2030-03-02T09:30:00Z', {gift_card_code: 'PURO-TEST-1'})).rejects.toThrow(/gift_card_invalid/);

    await db.query("update bookings set status = 'cancelled' where id = $1", [res.id]);
    card = await db.query<{status: string}>("select status from gift_cards where code = 'PURO-TEST-1'");
    expect(card.rows[0].status).toBe('paid');
  });

  it('rejects unknown and unpaid codes', async () => {
    await db.exec("insert into gift_cards (code, amount_cents, buyer_name, buyer_email, status) values ('PURO-UNPAID', 5000, 'A', 'a@example.com', 'requested')");
    await expect(book('2030-03-03T08:00:00Z', '2030-03-03T09:30:00Z', {gift_card_code: 'PURO-UNPAID'})).rejects.toThrow(/gift_card_invalid/);
    await expect(book('2030-03-03T08:00:00Z', '2030-03-03T09:30:00Z', {gift_card_code: 'NOPE'})).rejects.toThrow(/gift_card_invalid/);
  });
});

describe('review fixes', () => {
  const card = async (code: string) =>
    (await db.query<{status: string; balance_cents: number | null}>('select status, balance_cents from gift_cards where code = $1', [code])).rows[0];

  it('a value card keeps its remaining balance for the next booking', async () => {
    await db.exec("insert into gift_cards (code, amount_cents, balance_cents, buyer_name, buyer_email, status) values ('PURO-VALUE', 15000, 15000, 'A', 'a@example.com', 'paid')");
    await book('2030-04-01T08:00:00Z', '2030-04-01T09:30:00Z', {gift_card_code: 'PURO-VALUE', discount_cents: 10400, subtotal_cents: 10400, total_cents: 0});
    expect(await card('PURO-VALUE')).toEqual({status: 'paid', balance_cents: 4600});

    // more than what is left is refused, exactly what is left empties the card
    await expect(book('2030-04-02T08:00:00Z', '2030-04-02T09:30:00Z', {gift_card_code: 'PURO-VALUE', discount_cents: 5000})).rejects.toThrow(/gift_card_invalid/);
    await book('2030-04-02T08:00:00Z', '2030-04-02T09:30:00Z', {gift_card_code: 'PURO-VALUE', discount_cents: 4600, total_cents: 10400});
    expect(await card('PURO-VALUE')).toEqual({status: 'redeemed', balance_cents: 0});
  });

  it('cancelling gives the used amount back; un-cancelling takes it again or is refused', async () => {
    await db.exec("insert into gift_cards (code, amount_cents, balance_cents, buyer_name, buyer_email, status) values ('PURO-BACK', 10000, 10000, 'A', 'a@example.com', 'paid')");
    const first = await book('2030-04-03T08:00:00Z', '2030-04-03T09:30:00Z', {gift_card_code: 'PURO-BACK', discount_cents: 10000, total_cents: 5000});
    expect(await card('PURO-BACK')).toEqual({status: 'redeemed', balance_cents: 0});

    await db.query("update bookings set status = 'cancelled' where id = $1", [first.id]);
    expect(await card('PURO-BACK')).toEqual({status: 'paid', balance_cents: 10000});

    await db.query("update bookings set status = 'confirmed' where id = $1", [first.id]);
    expect(await card('PURO-BACK')).toEqual({status: 'redeemed', balance_cents: 0});

    // cancelled again, then the card is spent elsewhere: the old booking cannot silently come back with its discount
    await db.query("update bookings set status = 'cancelled' where id = $1", [first.id]);
    await book('2030-04-04T08:00:00Z', '2030-04-04T09:30:00Z', {gift_card_code: 'PURO-BACK', discount_cents: 10000, total_cents: 5000});
    await expect(db.query("update bookings set status = 'confirmed' where id = $1", [first.id])).rejects.toThrow(/gift_card_unavailable/);
  });

  it('reschedule_booking refuses a visit that has already started', async () => {
    await db.exec(
      `insert into bookings (ref_code, name, phone, email, address, postal_code, city, starts_at, ends_at, duration_min, staff_id, subtotal_cents, total_cents, manage_token, status)
       values ('PU-PAST01', 'x', 'x', 'x', 'x', '00100', 'x', now() - interval '2 hours', now() - interval '30 minutes', 60, 1, 15000, 15000, 'past-token', 'confirmed')`
    );
    await expect(
      db.query('select public.reschedule_booking($1, $2, $3)', ['past-token', '2030-05-01T08:00:00Z', '2030-05-01T09:30:00Z'])
    ).rejects.toThrow(/booking_not_found/);
  });
});

describe('price policy v3', () => {
  const has = async (email: string, phone: string) =>
    (await db.query<{r: boolean}>('select public.customer_has_bookings($1, $2) as r', [email, phone])).rows[0].r;

  it('does not match on an empty e-mail or phone (manual bookings taken by phone have no e-mail)', async () => {
    await book('2030-06-03T08:00:00Z', '2030-06-03T09:30:00Z', {email: '', phone: '+358500000077'});
    expect(await has('', '+358500000078')).toBe(false);
    expect(await has('  ', '+358500000078')).toBe(false);
    expect(await has('nobody@example.com', '')).toBe(false);
    expect(await has('', '+358500000077')).toBe(true);
  });

  it('knows a returning customer by e-mail or phone, ignoring cancelled bookings', async () => {
    expect(await has('new@example.com', '+358500000001')).toBe(false);

    const first = await book('2030-06-01T08:00:00Z', '2030-06-01T09:30:00Z', {email: 'Returning@Example.com', phone: '+358500000001'});
    expect(await has('returning@example.com', '+358999')).toBe(true);
    expect(await has('other@example.com', '+358500000001')).toBe(true);

    await db.query("update bookings set status = 'cancelled' where id = $1", [first.id]);
    expect(await has('returning@example.com', '+358500000001')).toBe(false);
  });

  it('stores the promotion with the booking and keeps the photo list empty until photos are attached', async () => {
    const res = await book('2030-06-02T08:00:00Z', '2030-06-02T09:30:00Z', {
      subtotal_cents: 18900,
      promo_cents: 2835,
      promo_details: {kind: 'percent', percent: 15, customer: 'first'},
      total_cents: 16065
    });
    const {rows} = await db.query<{promo_cents: number; promo_details: {percent: number}; photos: string[]}>(
      'select promo_cents, promo_details, photos from bookings where id = $1',
      [res.id]
    );
    expect(rows[0]).toMatchObject({promo_cents: 2835, promo_details: {percent: 15}, photos: []});
  });

  it('does not let visitors call the customer lookup', async () => {
    await db.exec('set role anon');
    await expect(db.query("select public.customer_has_bookings('a@b.c', '1')")).rejects.toThrow(/permission denied/);
    await db.exec('reset role');
  });
});

describe('hit_rate_limit', () => {
  it('allows up to the limit inside one window', async () => {
    const hit = async () =>
      (await db.query<{ok: boolean}>("select public.hit_rate_limit('test:1.2.3.4', 3600, 3) as ok")).rows[0].ok;
    expect([await hit(), await hit(), await hit(), await hit()]).toEqual([true, true, true, false]);
  });
});

describe('row level security', () => {
  const asRole = async <T,>(role: string, fn: () => Promise<T>): Promise<T> => {
    await db.exec(`set role ${role}`);
    try {
      return await fn();
    } finally {
      await db.exec('reset role');
    }
  };

  it('lets anonymous visitors read only active services and categories', async () => {
    // the owner switches the vehicle category and one service off in the admin panel
    await db.exec("update service_categories set is_active = false where slug = 'vehicles'");
    await db.exec("update services set is_active = false where slug = 'car-5'");
    const {services, categories} = await asRole('anon', async () => ({
      services: (await db.query<{slug: string}>('select slug from services')).rows.map((r) => r.slug),
      categories: (await db.query<{slug: string}>('select slug from service_categories')).rows.map((r) => r.slug)
    }));
    expect(services).toContain('sofa-3');
    expect(services).not.toContain('car-5');
    expect(categories).not.toContain('vehicles');
  });

  it('hides unpublished reviews from anonymous visitors', async () => {
    const rows = await asRole('anon', async () => (await db.query('select id from reviews')).rows);
    expect(rows).toHaveLength(0);
  });

  it('denies anonymous access to bookings, messages and gift cards', async () => {
    for (const table of ['bookings', 'booking_items', 'contact_messages', 'quote_requests', 'gift_cards', 'admins', 'staff']) {
      await expect(asRole('anon', () => db.query(`select * from ${table}`))).rejects.toThrow(/permission denied/);
    }
  });

  it('does not let anonymous or signed-in users write the catalog or call book_slot', async () => {
    await expect(asRole('anon', () => db.query("update services set price_cents = 1 where slug = 'sofa-3'"))).rejects.toThrow(/permission denied/);
    const updated = await asRole('authenticated', async () => (await db.query("update services set price_cents = 1 where slug = 'sofa-3' returning id")).rows);
    expect(updated).toHaveLength(0);
    await expect(asRole('anon', () => db.query("select public.book_slot('{}'::jsonb, '[]'::jsonb)"))).rejects.toThrow(/permission denied/);
    await expect(asRole('authenticated', () => db.query("select public.book_slot('{}'::jsonb, '[]'::jsonb)"))).rejects.toThrow(/permission denied/);
  });

  it('gives a user listed in admins full access', async () => {
    const {rows} = await db.query<{id: string}>("insert into auth.users (email) values ('owner@example.com') returning id");
    await db.query('insert into admins (user_id, email) values ($1, $2)', [rows[0].id, 'owner@example.com']);
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [rows[0].id]);
    const result = await asRole('authenticated', async () => ({
      bookings: (await db.query<{n: number}>('select count(*)::int as n from bookings')).rows[0].n,
      updated: (await db.query("update services set price_cents = 15000 where slug = 'sofa-3' returning id")).rows.length,
      inactive: (await db.query("select id from services where slug = 'car-5'")).rows.length
    }));
    await db.query("select set_config('request.jwt.claim.sub', '', false)");
    expect(result.bookings).toBeGreaterThan(0);
    expect(result.updated).toBe(1);
    expect(result.inactive).toBe(1);
  });
});
