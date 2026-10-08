import {z} from 'zod';
import {locales} from '@/i18n/routing';
import {emailSchema, phoneSchema} from '@/lib/booking/schema';

/** Schemas of the public forms, shared by the client (react-hook-form) and the Server Actions. Messages are i18n keys. */

export const SECTORS = ['office', 'hotel_restaurant', 'healthcare', 'other'] as const;
export const PREFERRED_TIMES = ['workhours', 'evening', 'weekend', 'flexible'] as const;
export const MAX_PHOTOS = 30;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
export const GIFT_CUSTOM = 'custom';
export const GIFT_MIN_EUR = 30;
export const GIFT_MAX_EUR = 1000;
export const GIFT_VALID_MONTHS = 12;

const optionalPhone = z
  .string()
  .trim()
  .max(30)
  .refine((value) => value === '' || phoneSchema.safeParse(value).success, 'phone');
const privacy = z.boolean().refine((accepted) => accepted, 'privacy');
const text = (max: number) => z.string().trim().max(max, 'tooLong');
const required = (max: number) => z.string().trim().min(2, 'required').max(max, 'tooLong');

/** honeypot + locale travel with every form */
const meta = {
  locale: z.enum(locales),
  website: z.string().max(0)
};

export const contactFields = z.object({
  name: required(80),
  email: emailSchema,
  phone: optionalPhone,
  message: z.string().trim().min(5, 'required').max(3000, 'tooLong'),
  privacy
});
export const contactRequest = contactFields.extend(meta);

export const quoteFields = z.object({
  contactName: required(80),
  company: required(120),
  email: emailSchema,
  phone: optionalPhone,
  yTunnus: z
    .string()
    .trim()
    .refine((value) => value === '' || /^\d{7}-\d$/.test(value), 'yTunnus'),
  sector: z.enum(SECTORS),
  items: z.string().trim().min(5, 'required').max(2000, 'tooLong'),
  preferredTime: z.enum(PREFERRED_TIMES),
  billingAddress: text(300),
  notes: text(2000),
  privacy
});
export const quoteRequest = quoteFields.extend({
  ...meta,
  /** photos the visitor wants to attach: the server answers with one signed upload URL per file */
  files: z
    .array(
      z.object({
        name: z.string().max(200),
        type: z.string().refine((type) => PHOTO_TYPES.includes(type)),
        size: z.number().int().positive().max(MAX_PHOTO_BYTES)
      })
    )
    .max(MAX_PHOTOS)
});

export const giftCardFields = z
  .object({
    /** a service slug from the catalog, or "custom" for a free amount */
    option: z.string().min(1, 'required').max(40),
    amount: z.string().trim().max(8),
    buyerName: required(80),
    buyerEmail: emailSchema,
    buyerPhone: optionalPhone,
    recipientName: text(80),
    message: text(300),
    privacy
  })
  .superRefine((value, ctx) => {
    if (value.option !== GIFT_CUSTOM) return;
    const amount = Number(value.amount.replace(',', '.'));
    if (!Number.isFinite(amount) || amount < GIFT_MIN_EUR || amount > GIFT_MAX_EUR) {
      ctx.addIssue({code: 'custom', path: ['amount'], message: 'amount'});
    }
  });
export const giftCardRequest = giftCardFields.and(z.object(meta));

export const deletionFields = z.object({
  email: emailSchema,
  phone: optionalPhone,
  details: text(2000),
  privacy
});
export const deletionRequest = deletionFields.extend(meta);

export type ContactFields = z.infer<typeof contactFields>;
export type QuoteFields = z.infer<typeof quoteFields>;
export type GiftCardFields = z.infer<typeof giftCardFields>;
export type DeletionFields = z.infer<typeof deletionFields>;

export type FormError = 'invalid' | 'rate_limited' | 'failed';
export type FormResult = {ok: true} | {ok: false; error: FormError};
export type QuoteResult = {ok: true; uploads: {index: number; path: string; token: string}[]} | {ok: false; error: FormError};
