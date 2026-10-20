'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import dynamic from 'next/dynamic';
import {useTranslations} from 'next-intl';
import {getPathname} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {checkCustomerAction, createBookingAction} from '@/app/actions/booking';
import {priceCart, type CartLine, type CustomerKind} from '@/lib/booking/cart';
import type {AddressValues, BookingError, ContactInput} from '@/lib/booking/schema';
import type {TravelQuote} from '@/lib/booking/travel';
import {formatDuration, formatEur, l10n} from '@/lib/format';
import {createBrowserSupabase} from '@/lib/supabase/browser';
import type {Catalog, Promotions} from '@/lib/types';
import {GlowButton} from '@/components/ui/GlowButton';
import {IconCheck} from '@/components/ui/icons';
import type {GiftCard} from './StepContact';
import {StepItems} from './StepItems';
import {Summary} from './Summary';
import type {SlotValue} from './TimePicker';

// Steps 2–4 pull in react-hook-form, zod and the calendar: they are fetched when the visitor gets there.
const StepAddress = dynamic(() => import('./StepAddress').then((m) => m.StepAddress));
const StepContact = dynamic(() => import('./StepContact').then((m) => m.StepContact));
const TimePicker = dynamic(() => import('./TimePicker').then((m) => m.TimePicker));

interface Props {
  locale: Locale;
  /** active categories and services only */
  catalog: Catalog;
  minOrderCents: number;
  /** discounts and bundle offers from settings */
  promotions: Promotions;
  timezone: string;
  whatsappUrl: string;
  /** cart preset from deep links: ?item=sofa-3 or ?items=sofa-3:1,chair-full:4 (bundle offers) */
  initialCart?: {slug: string; qty: number}[];
}

const STEPS = ['items', 'address', 'time', 'contact', 'confirm'] as const;
const ADDRESS_FORM = 'booking-address';
const CONTACT_FORM = 'booking-contact';

export function BookingWizard({locale, catalog, minOrderCents, promotions, timezone, whatsappUrl, initialCart = []}: Props) {
  const t = useTranslations('booking');

  const [step, setStep] = useState(0);
  const [cart, setCart] = useState<CartLine[]>(() =>
    initialCart
      .filter((line) => catalog.services.some((s) => s.slug === line.slug && !s.isAddon))
      .map((line) => ({slug: line.slug, qty: line.qty, options: [], veryDirty: false}))
  );
  // photos of the furniture: uploaded after the booking is created, to URLs issued for it
  const [photos, setPhotos] = useState<File[]>([]);
  // first order or returning customer — known once the contact details are in
  const [customer, setCustomer] = useState<CustomerKind>('unknown');
  const [address, setAddress] = useState<AddressValues | null>(null);
  const [travel, setTravel] = useState<TravelQuote | null>(null);
  const [slot, setSlot] = useState<SlotValue | null>(null);
  const [contact, setContact] = useState<ContactInput | null>(null);
  const [gift, setGift] = useState<GiftCard | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<BookingError | null>(null);
  // the server priced the booking differently from what was shown: `server` is the total to confirm
  const [priceNotice, setPriceNotice] = useState<{shown: number; server: number} | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  const quote = useMemo(
    () =>
      priceCart(cart, catalog, {
        minOrderCents,
        travelCents: travel?.status === 'ok' ? travel.feeCents : 0,
        giftCard: gift,
        promotions,
        customer
      }),
    [cart, catalog, minOrderCents, travel, gift, promotions, customer]
  );

  // move focus to the step heading so keyboard and screen-reader users land on the new step
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    // focus() would scroll instantly; the scroll below follows the html scroll-behavior (smooth)
    headingRef.current?.focus({preventScroll: true});
    headingRef.current?.scrollIntoView({block: 'start'});
  }, [step]);

  const goTo = (next: number) => {
    setError(null);
    setStep(next);
  };

  // a chosen time moves straight on to the contact step; `null` (another day tapped, a slot that went) does not
  const chooseSlot = useCallback((next: SlotValue | null) => {
    setSlot(next);
    if (next) {
      setError(null);
      setStep(3);
    }
  }, []);

  const submit = async () => {
    if (!address || !slot || !contact) return;
    setSubmitting(true);
    setError(null);
    const result = await createBookingAction({
      locale,
      cart,
      address,
      startsAt: slot.iso,
      contact,
      website: honeypot,
      // normally the total on screen; after a price notice whose cause the summary cannot show
      // (a price edited since the page loaded) — the total from that notice
      shownTotalCents: priceNotice?.shown === quote.totalCents ? priceNotice.server : quote.totalCents,
      files: photos.map((f) => ({name: f.name, type: f.type, size: f.size}))
    }).catch(() => ({ok: false as const, error: 'failed' as const}));

    if (result.ok) {
      // the booking exists; a photo that fails to upload must not lose it
      if (result.uploads.length > 0) {
        const storage = createBrowserSupabase().storage.from('booking-photos');
        await Promise.allSettled(
          result.uploads.map((target) =>
            storage.uploadToSignedUrl(target.path, target.token, photos[target.index], {contentType: photos[target.index].type})
          )
        );
      }
      // A full page load (not a client-side transition): analytics on the confirmation page is then
      // configured with the token stripped from the URL before anything is sent.
      window.location.assign(getPathname({href: {pathname: '/varaa-aika/kiitos/[token]', params: {token: result.token}}, locale}));
      return;
    }
    setSubmitting(false);
    setError(result.error);
    if (result.error === 'price_changed') {
      // show the right discount in the summary and let the customer confirm the new total
      setPriceNotice({shown: quote.totalCents, server: result.totalCents});
      setCustomer(result.customer);
    } else if (result.error === 'slot_taken' || result.error === 'slot_unavailable') {
      // the slot is gone: back to the calendar with fresh availability
      setSlot(null);
      setReloadKey((n) => n + 1);
      setStep(2);
    } else if (result.error === 'gift_card_invalid' || result.error === 'gift_card_not_applicable') {
      if (result.error === 'gift_card_invalid') setGift(null);
      setStep(3);
    }
  };

  const stepName = t(`steps.${STEPS[step]}`);
  const canContinue = [quote.lines.length > 0, travel?.status === 'ok', Boolean(slot), true, !submitting][step];
  // a service gift card whose service is missing from the cart: tell the customer which one
  const giftMissingService =
    gift && !quote.giftCardApplicable
      ? l10n(catalog.services.find((s) => s.id === gift.serviceId)?.name ?? {fi: '', ru: '', en: ''}, locale)
      : null;
  const nextProps =
    step === 1
      ? {type: 'submit' as const, form: ADDRESS_FORM}
      : step === 3
        ? {type: 'submit' as const, form: CONTACT_FORM}
        : step === 4
          ? {type: 'button' as const, onClick: submit}
          : {type: 'button' as const, onClick: () => goTo(step + 1)};
  const nextLabel = step === 4 ? (submitting ? t('confirm.submitting') : t('confirm.submit')) : t('next');

  const slotLabel = slot
    ? new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale === 'ru' ? 'ru-RU' : 'fi-FI', {
        timeZone: timezone,
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(slot.iso))
    : null;

  return (
    <div data-booking-wizard>
      {/* stepper */}
      <nav aria-label={t('stepsLabel')}>
        <ol className="flex gap-1.5 sm:gap-3">
          {STEPS.map((key, index) => {
            const done = index < step;
            const current = index === step;
            return (
              <li key={key} className="min-w-0 flex-1">
                <button
                  type="button"
                  disabled={!done}
                  aria-current={current ? 'step' : undefined}
                  onClick={() => goTo(index)}
                  className={`flex min-h-11 w-full flex-col items-start gap-2 rounded-xl border-t-2 pt-3 text-left text-[13px] font-medium sm:text-sm ${
                    current ? 'border-accent text-text' : done ? 'border-teal-3 text-teal-1 hover:text-text' : 'border-hairline text-muted'
                  }`}
                >
                  <span
                    className={`flex size-7 items-center justify-center rounded-full text-[13px] font-semibold ${
                      current ? 'bg-accent text-white' : done ? 'bg-teal-3 text-white' : 'bg-text/8'
                    }`}
                  >
                    {done ? <IconCheck width={15} height={15} /> : index + 1}
                  </span>
                  <span className="hidden truncate min-[520px]:block">{t(`steps.${key}`)}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div>
          <p className="text-sm text-muted">{t('stepOf', {current: step + 1, total: STEPS.length, name: stepName})}</p>
          <h2 ref={headingRef} tabIndex={-1} className="h3 mt-1 scroll-mt-28 outline-none">
            {t(`${STEPS[step]}.title`)}
          </h2>

          {error && (
            <p role="alert" className="mt-4 rounded-xl border border-danger-border bg-danger-soft p-4 text-danger">
              {error === 'price_changed'
                ? t('errors.price_changed', {total: formatEur(priceNotice?.server ?? quote.totalCents, locale)})
                : t(`errors.${error}`)}
            </p>
          )}

          <div className="mt-6">
            {step === 0 && (
              <StepItems
                catalog={catalog}
                cart={cart}
                onChange={setCart}
                photos={photos}
                onPhotos={setPhotos}
                locale={locale}
                whatsappUrl={whatsappUrl}
              />
            )}

            {step === 1 && (
              <StepAddress
                formId={ADDRESS_FORM}
                defaultValues={address}
                travel={travel}
                onTravel={setTravel}
                locale={locale}
                whatsappUrl={whatsappUrl}
                onValid={(values) => {
                  setAddress(values);
                  goTo(2);
                }}
              />
            )}

            {step === 2 && (
              <>
                <p className="mb-5 text-muted">{t('time.lead', {duration: formatDuration(quote.durationMin, locale)})}</p>
                <TimePicker
                  durationMin={quote.durationMin}
                  timezone={timezone}
                  value={slot}
                  onChange={chooseSlot}
                  reloadKey={reloadKey}
                />
                {slotLabel && (
                  <p className="mt-5 font-medium text-teal-1" role="status">
                    {t('time.selected', {when: slotLabel})}
                  </p>
                )}
              </>
            )}

            {step === 3 && (
              <StepContact
                formId={CONTACT_FORM}
                defaultValues={contact}
                gift={gift}
                onGift={setGift}
                giftDiscountCents={quote.discountCents}
                giftMissingService={giftMissingService}
                locale={locale}
                honeypot={honeypot}
                onHoneypot={setHoneypot}
                onValid={async (values) => {
                  setContact(values);
                  // decides between the first-order and the returning-customer discount shown on the next step
                  setCustomer(await checkCustomerAction(values.email, values.phone).catch(() => 'first' as const));
                  goTo(4);
                }}
              />
            )}

            {step === 4 && address && contact && slotLabel && (
              <dl className="glass divide-y divide-hairline">
                {[
                  {
                    step: 0,
                    label: t('steps.items'),
                    value: quote.lines
                      .map((line) =>
                        [
                          `${l10n(line.service.name, locale)} × ${line.qty}`,
                          ...line.service.options.filter((o) => line.optionSlugs.includes(o.slug)).map((o) => l10n(o.name, locale)),
                          ...(line.veryDirty ? [t('items.veryDirty').toLowerCase()] : [])
                        ].join(', ')
                      )
                      .join('\n')
                  },
                  {
                    step: 1,
                    label: t('steps.address'),
                    value: [`${address.street}, ${address.postalCode} ${address.city}`, address.floor, address.notes].filter(Boolean).join('\n')
                  },
                  {step: 2, label: t('steps.time'), value: `${slotLabel}\n${formatDuration(quote.durationMin, locale)}`},
                  {
                    step: 3,
                    label: t('steps.contact'),
                    value: [contact.name, contact.phone, contact.email, contact.customerType === 'business' ? `${contact.company}, ${contact.yTunnus}` : '']
                      .filter(Boolean)
                      .join('\n')
                  }
                ].map((row) => (
                  <div key={row.step} className="flex items-start justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <dt className="text-sm text-muted">{row.label}</dt>
                      <dd className="mt-1 whitespace-pre-line break-words font-medium first-letter:uppercase">{row.value}</dd>
                    </div>
                    <button type="button" className="link shrink-0 text-sm" onClick={() => goTo(row.step)}>
                      {t('confirm.edit')}
                    </button>
                  </div>
                ))}
                <div className="p-5">
                  <p className="font-semibold">
                    {t('summary.total')}: {quote.hasFromPrice ? `${t('summary.from')} ` : ''}
                    {formatEur(quote.totalCents, locale)}
                  </p>
                  <p className="mt-1 text-base text-muted">{t('confirm.payment')}</p>
                  {quote.needsEstimate && <p className="mt-1 text-base text-muted">{t('confirm.estimateNote')}</p>}
                  {photos.length > 0 && <p className="mt-1 text-base text-muted">{t('confirm.photos', {count: photos.length})}</p>}
                </div>
              </dl>
            )}
          </div>

          {/* desktop navigation */}
          <div className="mt-8 hidden items-center gap-3 lg:flex">
            {step > 0 && (
              <GlowButton variant="ghost" onClick={() => goTo(step - 1)} disabled={submitting}>
                {t('back')}
              </GlowButton>
            )}
            <GlowButton {...nextProps} disabled={!canContinue} data-testid="booking-next">
              {nextLabel}
            </GlowButton>
          </div>
        </div>

        <Summary
          quote={quote}
          locale={locale}
          minOrderCents={minOrderCents}
          promotions={promotions}
          customer={customer}
          travelKnown={travel?.status === 'ok'}
          slotLabel={slotLabel}
        />
      </div>

      {/* mobile / tablet navigation: fixed to the bottom edge together with the running total */}
      <div className="fixed inset-x-0 bottom-0 z-[95] border-t border-hairline bg-surface/95 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <p className="min-w-0 flex-1 leading-tight">
            <span className="block text-xs text-muted">{t('summary.total')}</span>
            <span className="text-lg font-bold">
              {quote.hasFromPrice ? `${t('summary.from')} ` : ''}
              {formatEur(quote.totalCents, locale)}
            </span>
          </p>
          {step > 0 && (
            <GlowButton variant="ghost" size="sm" onClick={() => goTo(step - 1)} disabled={submitting}>
              {t('back')}
            </GlowButton>
          )}
          <GlowButton size="sm" {...nextProps} disabled={!canContinue} data-testid="booking-next-mobile">
            {nextLabel}
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
