import {z} from 'zod';
import {locales} from '@/i18n/routing';

/** Validation shared by the booking form (react-hook-form) and the Server Action. Messages are i18n keys. */

export const PARKING = ['street', 'yard', 'garage', 'unknown'] as const;
export const MAX_BOOKING_PHOTOS = 6;
export const MAX_BOOKING_PHOTO_BYTES = 10 * 1024 * 1024;
export const BOOKING_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
export const CUSTOMER_TYPES = ['private', 'business'] as const;

/**
 * "040 123 4567" → "+358401234567"; other international numbers are kept as typed.
 * One spelling per number matters: returning customers are recognised by it.
 */
export function normalizePhone(raw: string) {
  let phone = raw.replace(/[\s\-().]/g, '');
  if (phone.startsWith('00')) phone = `+${phone.slice(2)}`;
  if (phone.startsWith('0')) phone = `+358${phone.slice(1)}`;
  // "+358 (0)40…" — the trunk zero is not dialled after the country code
  return phone.replace(/^\+3580/, '+358');
}

export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'required')
  .transform(normalizePhone)
  .refine((phone) => /^\+\d{7,15}$/.test(phone), 'phone');

export const emailSchema = z.string().trim().min(1, 'required').max(160).pipe(z.email('email'));

export const cartLineSchema = z.object({
  slug: z.string().min(1).max(40),
  qty: z.number().int().min(1).max(200),
  options: z.array(z.string().max(40)).max(6),
  veryDirty: z.boolean()
});

export const addressSchema = z.object({
  street: z.string().trim().min(3, 'required').max(120),
  postalCode: z.string().trim().regex(/^\d{5}$/, 'postalCode'),
  city: z.string().trim().min(2, 'required').max(60),
  floor: z.string().trim().max(60),
  parking: z.enum(PARKING),
  notes: z.string().trim().max(1000)
});

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, 'required').max(80),
    phone: phoneSchema,
    email: emailSchema,
    customerType: z.enum(CUSTOMER_TYPES),
    company: z.string().trim().max(120),
    yTunnus: z.string().trim().max(12),
    giftCardCode: z.string().trim().max(40),
    privacy: z.boolean().refine((accepted) => accepted, 'privacy'),
    marketing: z.boolean()
  })
  .superRefine((value, ctx) => {
    if (value.customerType !== 'business') return;
    if (value.company.length < 2) ctx.addIssue({code: 'custom', path: ['company'], message: 'required'});
    if (!/^\d{7}-\d$/.test(value.yTunnus)) ctx.addIssue({code: 'custom', path: ['yTunnus'], message: 'yTunnus'});
  });

export const bookingRequestSchema = z.object({
  locale: z.enum(locales),
  cart: z.array(cartLineSchema).min(1).max(30),
  address: addressSchema,
  startsAt: z.iso.datetime(),
  contact: contactSchema,
  /** honeypot — real visitors leave it empty */
  website: z.string().max(0),
  /** the total the customer saw when confirming; the server refuses to book at a different one */
  shownTotalCents: z.number().int().min(0),
  /** photos of the furniture; the server answers with signed upload URLs */
  files: z
    .array(
      z.object({
        name: z.string().max(200),
        type: z.string().refine((type) => BOOKING_PHOTO_TYPES.includes(type)),
        size: z.number().int().positive().max(MAX_BOOKING_PHOTO_BYTES)
      })
    )
    .max(MAX_BOOKING_PHOTOS)
});

export type AddressValues = z.infer<typeof addressSchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type ContactValues = z.output<typeof contactSchema>;
export type BookingRequest = z.input<typeof bookingRequestSchema>;

export type BookingError =
  | 'invalid'
  | 'rate_limited'
  | 'invalid_cart'
  | 'out_of_area'
  | 'gift_card_invalid'
  | 'gift_card_not_applicable'
  | 'slot_unavailable'
  | 'slot_taken'
  | 'price_changed'
  | 'failed';
