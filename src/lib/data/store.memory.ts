import 'server-only';
import {randomBytes, randomUUID} from 'node:crypto';
import {bundledPostalCode} from './areas';
import type {BookingRecord, Store} from './store';

/**
 * Demo store: lives in the memory of one server process and is lost on restart.
 * It lets the whole booking flow run (and be tested end to end) without a database.
 * Never used when SUPABASE_SERVICE_ROLE_KEY is set.
 */
interface DemoState {
  bookings: BookingRecord[];
  hits: Map<string, number>;
  warned: boolean;
}

const globalStore = globalThis as unknown as {__puroDemoStore?: DemoState};
const state: DemoState = (globalStore.__puroDemoStore ??= {bookings: [], hits: new Map(), warned: false});

const STAFF_ID = 1;
const active = (b: BookingRecord) => b.status === 'pending' || b.status === 'confirmed';
// what the customer may still change: active and not started yet
const changeable = (b: BookingRecord) => active(b) && Date.parse(b.startsAt) > Date.now();
const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) =>
  Date.parse(aStart) < Date.parse(bEnd) && Date.parse(bStart) < Date.parse(aEnd);

function warn() {
  if (state.warned) return;
  state.warned = true;
  console.warn('[puro] Supabase is not configured: running in DEMO mode with an in-memory store.');
}

const logOnly = (kind: string) => async (input: unknown) => {
  warn();
  console.info(`[demo] ${kind}:`, JSON.stringify(input));
  return true;
};

export const memoryStore: Store = {
  async getSchedule(fromIso, toIso) {
    warn();
    return {
      staffIds: [STAFF_ID],
      busy: state.bookings
        .filter((b) => active(b) && overlaps(b.startsAt, b.endsAt, fromIso, toIso))
        .map((b) => ({staffId: b.staffId, start: b.startsAt, end: b.endsAt}))
    };
  },

  async createBooking(input) {
    warn();
    // same rule as the database exclusion constraint: active bookings of one staff member never overlap
    if (state.bookings.some((b) => active(b) && overlaps(b.startsAt, b.endsAt, input.startsAt, input.endsAt))) {
      return {ok: false, error: 'slot_taken'};
    }
    if (input.giftCardCode) return {ok: false, error: 'gift_card_invalid'};
    const booking: BookingRecord = {
      ...input,
      photos: [],
      id: randomUUID(),
      refCode: `PU-${randomBytes(3).toString('hex').toUpperCase()}`,
      manageToken: randomBytes(32).toString('hex'),
      status: 'pending',
      staffId: STAFF_ID,
      createdAt: new Date().toISOString()
    };
    state.bookings.push(booking);
    return {ok: true, booking};
  },

  async getBookingByToken(token) {
    return state.bookings.find((b) => b.manageToken === token) ?? null;
  },

  async isReturningCustomer(email, phone) {
    const mail = email.trim().toLowerCase();
    const tel = phone.trim();
    // an empty value never matches: manual bookings taken by phone have no e-mail
    return state.bookings.some(
      (b) => b.status !== 'cancelled' && ((mail !== '' && b.email.toLowerCase() === mail) || (tel !== '' && b.phone === tel))
    );
  },

  // no file storage in demo mode: photos are simply not kept
  async createBookingUploads() {
    return [];
  },

  async cancelBooking(token) {
    const booking = state.bookings.find((b) => b.manageToken === token && changeable(b));
    if (!booking) return false;
    booking.status = 'cancelled';
    return true;
  },

  async rescheduleBooking(token, startsAt, endsAt) {
    const booking = state.bookings.find((b) => b.manageToken === token && changeable(b));
    if (!booking) return 'not_found';
    const clash = state.bookings.some(
      (b) => b !== booking && active(b) && overlaps(b.startsAt, b.endsAt, startsAt, endsAt)
    );
    if (clash) return 'slot_taken';
    booking.startsAt = startsAt;
    booking.endsAt = endsAt;
    return 'ok';
  },

  async findGiftCard() {
    return null;
  },

  async findPostalCode(code) {
    return bundledPostalCode(code);
  },

  async hitRateLimit(key, windowSeconds, max) {
    const bucket = `${key}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;
    const count = (state.hits.get(bucket) ?? 0) + 1;
    state.hits.set(bucket, count);
    if (state.hits.size > 5000) state.hits.clear();
    return count <= max;
  },

  insertContactMessage: logOnly('contact message'),
  insertQuoteRequest: logOnly('quote request'),
  insertGiftCardRequest: logOnly('gift card request'),
  insertDeletionRequest: logOnly('data deletion request'),

  async createQuoteUploads() {
    return [];
  }
};
