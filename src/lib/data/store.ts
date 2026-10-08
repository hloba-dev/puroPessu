import 'server-only';
import type {Locale} from '@/i18n/routing';
import {hasServiceRole} from '@/lib/supabase/service';
import type {Enums} from '@/lib/supabase/database.types';
import type {PostalCode} from '@/lib/types';
import {memoryStore} from './store.memory';
import {supabaseStore} from './store.supabase';

export interface BookingItemInput {
  serviceId: number;
  serviceSlug: string;
  name: string;
  optionIds: number[];
  optionSlugs: string[];
  qty: number;
  unitPriceCents: number;
  durationMin: number;
  veryDirty: boolean;
}

export interface BookingInput {
  locale: Locale;
  customerType: Enums<'customer_type'>;
  name: string;
  phone: string;
  email: string;
  company?: string;
  yTunnus?: string;
  address: string;
  postalCode: string;
  city: string;
  floor?: string;
  parking?: string;
  notes?: string;
  startsAt: string;
  /** end of the busy interval: work + travel buffer */
  endsAt: string;
  durationMin: number;
  subtotalCents: number;
  travelCents: number;
  minFillCents: number;
  /** promotion taken off the price (bundle and/or percentage) and how it was made up */
  promoCents: number;
  promoDetails: PromoDetails;
  /** gift card amount used */
  discountCents: number;
  totalCents: number;
  giftCardCode?: string;
  marketingConsent: boolean;
  items: BookingItemInput[];
}

/** A signed upload URL for the file at position `index` of the list the browser sent. */
export interface UploadTarget {
  index: number;
  path: string;
  token: string;
}

export interface PromoDetails {
  kind?: 'none' | 'bundle' | 'percent' | 'both';
  /** total percentage applied (first / returning customer + item count) */
  percent?: number;
  customer?: 'first' | 'repeat';
  /** the item-count discount is part of `percent` */
  multiItem?: boolean;
  bundles?: string[];
}

export interface BookingRecord extends BookingInput {
  /** object paths of the photos the customer attached */
  photos: string[];
  id: string;
  refCode: string;
  manageToken: string;
  status: Enums<'booking_status'>;
  staffId: number;
  createdAt: string;
}

export type CreateBookingResult =
  | {ok: true; booking: BookingRecord}
  | {ok: false; error: 'slot_taken' | 'gift_card_invalid' | 'failed'};

export interface Schedule {
  staffIds: number[];
  busy: {staffId: number | null; start: string; end: string}[];
}

export interface QuoteRequestInput {
  contactName: string;
  company: string;
  email: string;
  phone?: string;
  yTunnus?: string;
  sector: Enums<'quote_sector'>;
  items: string;
  preferredTime: Enums<'preferred_time'>;
  billingAddress?: string;
  notes?: string;
  photos: string[];
  locale: Locale;
}

export interface GiftCardRequestInput {
  amountCents?: number;
  serviceId?: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  recipientName?: string;
  message?: string;
  locale: Locale;
}

/**
 * Everything the public site writes or reads privately. Two implementations:
 * Supabase (service role, production) and an in-memory demo store used when Supabase is not configured.
 */
export interface Store {
  getSchedule(fromIso: string, toIso: string): Promise<Schedule>;
  createBooking(input: BookingInput): Promise<CreateBookingResult>;
  getBookingByToken(token: string): Promise<BookingRecord | null>;
  /** Has a customer with this e-mail or phone booked before (cancelled bookings do not count)? */
  isReturningCustomer(email: string, phone: string): Promise<boolean>;
  /** Signed upload URLs for the photos a customer attaches to a booking; the paths are saved on the booking. */
  createBookingUploads(bookingId: string, files: {name: string; type: string}[]): Promise<UploadTarget[]>;
  /** Customer-side cancel / reschedule: only for active bookings that have not started yet. */
  cancelBooking(token: string): Promise<boolean>;
  rescheduleBooking(token: string, startsAt: string, endsAt: string): Promise<'ok' | 'slot_taken' | 'not_found'>;
  /** A paid, unexpired gift card — or null. `amountCents` is the balance left on a value card. */
  findGiftCard(code: string): Promise<{amountCents: number | null; serviceId: number | null} | null>;
  findPostalCode(code: string): Promise<PostalCode | null>;
  /** true while the caller is within the limit */
  hitRateLimit(key: string, windowSeconds: number, max: number): Promise<boolean>;
  insertContactMessage(input: {name: string; email: string; phone?: string; message: string; locale: Locale}): Promise<boolean>;
  insertQuoteRequest(input: QuoteRequestInput): Promise<boolean>;
  insertGiftCardRequest(input: GiftCardRequestInput): Promise<boolean>;
  insertDeletionRequest(input: {email: string; phone?: string; details?: string; locale: Locale}): Promise<boolean>;
  /** Signed upload URLs for B2B request photos (private bucket); empty in demo mode. */
  createQuoteUploads(uploadId: string, files: {name: string; type: string}[]): Promise<UploadTarget[]>;
}

export const isDemoMode = !hasServiceRole;

export function getStore(): Store {
  return hasServiceRole ? supabaseStore : memoryStore;
}
