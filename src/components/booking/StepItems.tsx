'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import type {Locale} from '@/i18n/routing';
import {MAX_QTY, MAX_QTY_M2, type CartLine} from '@/lib/booking/cart';
import {BOOKING_PHOTO_TYPES, MAX_BOOKING_PHOTOS, MAX_BOOKING_PHOTO_BYTES} from '@/lib/booking/schema';
import {formatDuration, formatEur, l10n} from '@/lib/format';
import type {Catalog, Service} from '@/lib/types';
import {IconChevron} from '@/components/ui/icons';

interface Props {
  catalog: Catalog;
  cart: CartLine[];
  onChange: (cart: CartLine[]) => void;
  /** photos of the furniture, uploaded once the booking is confirmed */
  photos: File[];
  onPhotos: (photos: File[]) => void;
  locale: Locale;
  whatsappUrl: string;
}

export function StepItems({catalog, cart, onChange, photos, onPhotos, locale, whatsappUrl}: Props) {
  const t = useTranslations('booking.items');
  const tf = useTranslations('booking.photos');
  const tp = useTranslations('prices');
  const [photoError, setPhotoError] = useState<string | null>(null);

  const addPhotos = (list: FileList | null) => {
    const picked = [...photos, ...Array.from(list ?? [])];
    if (picked.some((file) => !BOOKING_PHOTO_TYPES.includes(file.type))) return setPhotoError(tf('type'));
    if (picked.some((file) => file.size > MAX_BOOKING_PHOTO_BYTES)) return setPhotoError(tf('tooBig'));
    if (picked.length > MAX_BOOKING_PHOTOS) return setPhotoError(tf('tooMany', {max: MAX_BOOKING_PHOTOS}));
    setPhotoError(null);
    onPhotos(picked);
  };

  const lineOf = (slug: string) => cart.find((l) => l.slug === slug);
  const setQty = (service: Service, qty: number) => {
    const max = service.unit === 'm2' ? MAX_QTY_M2 : MAX_QTY;
    const next = Math.max(0, Math.min(max, Math.floor(qty) || 0));
    const existing = lineOf(service.slug);
    if (next === 0) onChange(cart.filter((l) => l.slug !== service.slug));
    else if (existing) onChange(cart.map((l) => (l.slug === service.slug ? {...l, qty: next} : l)));
    else onChange([...cart, {slug: service.slug, qty: next, options: [], veryDirty: false}]);
  };
  const patch = (slug: string, change: (line: CartLine) => CartLine) =>
    onChange(cart.map((l) => (l.slug === slug ? change(l) : l)));

  const groups = catalog.categories
    .map((category) => ({
      category,
      services: catalog.services.filter((s) => s.categoryId === category.id && !s.isAddon)
    }))
    .filter((g) => g.services.length > 0);

  return (
    <div className="space-y-4">
      {groups.map(({category, services}, index) => {
        const selected = services.reduce((sum, s) => sum + (lineOf(s.slug)?.qty ?? 0), 0);
        return (
          <details key={category.slug} className="glass group" open={index === 0 || selected > 0}>
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              <span>
                {l10n(category.name, locale)}
                {selected > 0 && (
                  <span className="ml-3 rounded-full bg-cyan-4 px-2.5 py-0.5 text-xs font-semibold">{t('selected', {count: selected})}</span>
                )}
              </span>
              <IconChevron className="shrink-0 text-cyan-2 transition-transform group-open:rotate-180" />
            </summary>

            <ul className="divide-y divide-hairline border-t border-hairline">
              {services.map((service) => {
                const name = l10n(service.name, locale);
                const line = lineOf(service.slug);
                const qty = line?.qty ?? 0;
                const unit = service.unit === 'piece' ? ` ${tp('perPiece')}` : service.unit === 'm2' ? ` ${tp('perM2')}` : '';
                return (
                  <li key={service.slug} className="px-5 py-4" data-service={service.slug}>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                      <div className="min-w-0 flex-1 basis-52">
                        <p className="font-medium">{name}</p>
                        <p className="mt-0.5 text-sm text-muted">
                          {l10n(service.description, locale)}
                          {service.durationMin > 0 && ` · ${t('duration', {duration: formatDuration(service.durationMin, locale)})}`}
                        </p>
                      </div>
                      <p className="font-semibold whitespace-nowrap text-cyan-1">
                        {service.priceFrom ? `${tp('from')} ` : ''}
                        {formatEur(service.priceCents, locale)}
                        {unit}
                      </p>
                      <div className="flex items-center gap-1" role="group" aria-label={t('qty', {item: name})}>
                        <button
                          type="button"
                          className="flex size-11 items-center justify-center rounded-xl border border-white/20 text-xl disabled:opacity-30"
                          onClick={() => setQty(service, qty - 1)}
                          disabled={qty === 0}
                          aria-label={t('decrease', {item: name})}
                        >
                          −
                        </button>
                        <output className="w-9 text-center text-lg font-semibold" aria-live="polite">
                          {qty}
                        </output>
                        <button
                          type="button"
                          className="flex size-11 items-center justify-center rounded-xl border border-cyan-3 bg-cyan-4 text-xl text-white"
                          onClick={() => setQty(service, qty + 1)}
                          aria-label={t('increase', {item: name})}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {line && (
                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
                        {service.options.map((option) => (
                          <label key={option.slug} className="flex min-h-9 cursor-pointer items-center gap-2.5">
                            <input
                              type="checkbox"
                              className="size-[18px] accent-cyan-600"
                              checked={line.options.includes(option.slug)}
                              onChange={(e) =>
                                patch(service.slug, (l) => ({
                                  ...l,
                                  options: e.target.checked ? [...l.options, option.slug] : l.options.filter((o) => o !== option.slug)
                                }))
                              }
                            />
                            <span>
                              {l10n(option.name, locale)}
                              {option.priceCents > 0 && <span className="text-cyan-1"> +{formatEur(option.priceCents, locale)}</span>}
                            </span>
                          </label>
                        ))}
                        <label className="flex min-h-9 cursor-pointer items-center gap-2.5">
                          <input
                            type="checkbox"
                            className="size-[18px] accent-cyan-600"
                            checked={line.veryDirty}
                            onChange={(e) => patch(service.slug, (l) => ({...l, veryDirty: e.target.checked}))}
                          />
                          <span>{t('veryDirty')}</span>
                        </label>
                        {(line.veryDirty || service.priceFrom) && (
                          <p className="basis-full text-sm text-muted">{line.veryDirty ? t('veryDirtyNote') : t('fromNote')}</p>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </details>
        );
      })}

      {/* photos: the owner checks material and soiling before the visit */}
      <div className="glass p-5">
        <label htmlFor="booking-photos" className="text-lg font-semibold">
          {tf('title')}
        </label>
        <p id="booking-photos-hint" className="mt-1 text-[15px] text-muted">
          {tf('hint', {max: MAX_BOOKING_PHOTOS})}
        </p>
        <input
          id="booking-photos"
          type="file"
          multiple
          accept={BOOKING_PHOTO_TYPES.join(',')}
          aria-describedby="booking-photos-hint"
          className="field mt-4 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white"
          onChange={(e) => {
            addPhotos(e.target.files);
            e.target.value = '';
          }}
        />
        {photoError && (
          <p className="field-error" role="alert">
            {photoError}
          </p>
        )}
        {photos.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {photos.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-lg border border-hairline px-3 py-1.5">
                <span className="max-w-40 truncate">{file.name}</span>
                <button
                  type="button"
                  className="text-muted hover:text-white"
                  aria-label={tf('remove', {name: file.name})}
                  onClick={() => onPhotos(photos.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-[15px] text-muted">
        <a href={whatsappUrl} className="link" rel="noopener" target="_blank">
          {t('photoHint')}
        </a>
      </p>
    </div>
  );
}
