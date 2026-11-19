'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {checkManualCustomer} from '@/app/admin/actions';
import {priceCart, type CartLine} from '@/lib/booking/cart';
import {manualDiscountCents, type DiscountUnit, type PromoMode} from '@/lib/booking/manual-discount';
import {describePromo, promoLabel} from '@/lib/booking/promo-details';
import {formatDuration} from '@/lib/format';
import {parseEuro} from '@/lib/money';
import type {Catalog, Promotions} from '@/lib/types';
import {ManualTimePicker} from './ManualTimePicker';

interface Props {
  /** the whole catalog: the same pricing function as on the server runs here */
  catalog: Catalog;
  minOrderCents: number;
  promotions: Promotions;
}

interface Row {
  id: number;
  slug: string;
  qty: number;
}

type Travel = {state: 'idle' | 'loading' | 'manual'} | {state: 'ok'; feeCents: number; municipality: string};

const input = 'field min-h-10 rounded-lg px-3 py-2 text-sm';
const btn =
  'inline-flex min-h-10 items-center justify-center rounded-lg border border-text/20 px-3.5 text-sm font-semibold hover:border-teal-2 hover:text-teal-1 disabled:opacity-50';
const eur = (cents: number) => `${(cents / 100).toLocaleString('ru-RU', {maximumFractionDigits: 2})} €`;

/**
 * Items of a booking entered by hand: rows with their sums, the discount (automatic, the operator's own or none)
 * and the running total. The form fields keep their names, so the Server Action prices the booking again itself.
 */
export function ManualBookingItems({catalog, minOrderCents, promotions}: Props) {
  const services = useMemo(() => catalog.services.filter((s) => s.isActive && !s.isAddon), [catalog]);
  const nextId = useRef(2);
  const root = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Row[]>([{id: 1, slug: '', qty: 1}]);
  const [mode, setMode] = useState<PromoMode>('auto');
  const [discount, setDiscount] = useState('');
  const [unit, setUnit] = useState<DiscountUnit>('eur');
  const [customer, setCustomer] = useState<'first' | 'repeat'>('first');
  const [travel, setTravel] = useState<Travel>({state: 'idle'});
  const [manualTravel, setManualTravel] = useState('0');

  // the address and contact fields live in the same <form>, outside this component: follow what is typed there
  useEffect(() => {
    const form = root.current?.closest('form');
    if (!form) return;
    const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? '';
    let postal = '';
    // nothing typed yet: no lookup until there is a phone or an e-mail
    let contact = '|';
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const sync = () => {
      setManualTravel(value('travel_eur'));
      const code = value('postal_code').trim();
      if (code !== postal) {
        postal = code;
        if (!/^\d{5}$/.test(code)) setTravel({state: 'idle'});
        else {
          setTravel({state: 'loading'});
          fetch(`/api/travel?postal=${code}`)
            .then((r) => r.json())
            .then((q) => {
              if (cancelled || postal !== code) return;
              setTravel(q.status === 'ok' ? {state: 'ok', feeCents: q.feeCents, municipality: q.municipality} : {state: 'manual'});
            })
            .catch(() => !cancelled && postal === code && setTravel({state: 'manual'}));
        }
      }
      const who = `${value('email').trim()}|${value('phone').trim()}`;
      if (who !== contact) {
        contact = who;
        clearTimeout(timer);
        timer = setTimeout(() => {
          checkManualCustomer(value('email'), value('phone'))
            .then((kind) => !cancelled && contact === who && setCustomer(kind))
            .catch(() => undefined);
        }, 600);
      }
    };
    form.addEventListener('input', sync);
    sync();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      form.removeEventListener('input', sync);
    };
  }, []);

  const cart: CartLine[] = rows.filter((r) => r.slug && r.qty > 0).map((r) => ({slug: r.slug, qty: r.qty, options: [], veryDirty: false}));
  const travelCents = travel.state === 'ok' ? travel.feeCents : (parseEuro(manualTravel) ?? 0);
  const quote = priceCart(cart, catalog, {
    minOrderCents,
    travelCents,
    promotions: mode === 'auto' ? promotions : null,
    customer
  });
  const base = quote.subtotalCents + quote.minFillCents;
  const manualCents = mode === 'manual' ? manualDiscountCents(base, discount, unit) : 0;
  const promoCents = mode === 'manual' ? (manualCents ?? 0) : quote.promoCents;
  const totalCents = quote.totalCents - (promoCents - quote.promoCents);
  const autoLabel = quote.promoCents > 0 ? promoLabel(describePromo(quote, customer, promotions)) : '';

  const update = (id: number, change: Partial<Row>) => setRows((list) => list.map((r) => (r.id === id ? {...r, ...change} : r)));
  const lineOf = (row: Row) => quote.lines.find((l) => l.service.slug === row.slug);
  const summaryRow = 'flex justify-between gap-4';

  return (
    <div ref={root} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div className="min-w-0">
        <div className="hidden gap-3 pb-2 text-xs text-muted sm:grid sm:grid-cols-[minmax(0,1fr)_90px_90px_100px_40px]">
          <span>Позиция</span>
          <span>Кол-во</span>
          <span className="text-right">Цена</span>
          <span className="text-right">Сумма</span>
          <span />
        </div>
        <ul className="space-y-3">
          {rows.map((row, index) => {
            const service = services.find((s) => s.slug === row.slug);
            const line = lineOf(row);
            return (
              <li
                key={row.id}
                className="grid grid-cols-[minmax(0,1fr)_40px] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_90px_90px_100px_40px]"
                data-row={index}
              >
                <select
                  name="item_slug"
                  className={`${input} col-span-2 sm:col-span-1`}
                  aria-label={`Позиция ${index + 1}`}
                  value={row.slug}
                  onChange={(e) => update(row.id, {slug: e.target.value})}
                >
                  <option value="">— не выбрано —</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name.ru || s.name.fi} — {eur(s.priceCents)}
                    </option>
                  ))}
                </select>
                <input
                  name="item_qty"
                  type="number"
                  min={0}
                  max={200}
                  className={input}
                  aria-label={`Количество ${index + 1}`}
                  value={row.qty}
                  onChange={(e) => update(row.id, {qty: Math.max(0, Math.min(200, Math.floor(Number(e.target.value)) || 0))})}
                />
                <button
                  type="button"
                  className={`${btn} px-0 sm:order-last`}
                  aria-label={`Убрать позицию ${index + 1}`}
                  disabled={rows.length === 1}
                  onClick={() => setRows((list) => list.filter((r) => r.id !== row.id))}
                >
                  ×
                </button>
                <span className="text-sm text-muted sm:text-right" data-cell="price">
                  {service ? `${service.priceFrom ? 'от ' : ''}${eur(service.priceCents)}` : '—'}
                </span>
                <span className="justify-self-end font-semibold whitespace-nowrap" data-cell="sum">
                  {line ? eur(line.lineCents) : '—'}
                </span>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className={`${btn} mt-3`}
          onClick={() => setRows((list) => [...list, {id: nextId.current++, slug: '', qty: 1}])}
        >
          + Добавить позицию
        </button>

        <fieldset className="mt-6">
          <legend className="mb-2 text-sm font-semibold">Скидка</legend>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="promo_mode"
                value="auto"
                className="size-4 accent-teal-3"
                checked={mode === 'auto'}
                onChange={() => setMode('auto')}
              />
              Как на сайте: комплекты и скидки считаются автоматически
            </label>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="promo_mode"
                  value="manual"
                  className="size-4 accent-teal-3"
                  checked={mode === 'manual'}
                  onChange={() => setMode('manual')}
                />
                Своя скидка
              </label>
              <input
                name="manual_discount"
                inputMode="decimal"
                className={input}
                // .field is unlayered CSS with width: 100%, so a width utility would lose to it
                style={{width: 96}}
                aria-label="Размер своей скидки"
                placeholder="0"
                value={discount}
                aria-invalid={manualCents === null}
                onFocus={() => setMode('manual')}
                onChange={(e) => setDiscount(e.target.value)}
              />
              <select
                name="manual_discount_unit"
                className={input}
                style={{width: 76}}
                aria-label="Единица скидки"
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value === 'pct' ? 'pct' : 'eur');
                  setMode('manual');
                }}
              >
                <option value="eur">€</option>
                <option value="pct">%</option>
              </select>
              {manualCents === null && <span className="text-danger">Введите число, например 20 или 12,50</span>}
            </div>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="promo_mode"
                value="none"
                className="size-4 accent-teal-3"
                checked={mode === 'none'}
                onChange={() => setMode('none')}
              />
              Без скидки
            </label>
          </div>
          <p className="mt-2 text-sm text-muted">
            Скидка считается от цены чистки (с доплатой до минимального заказа), на транспорт не действует.
          </p>
        </fieldset>
      </div>

      <aside className="rounded-xl border border-hairline p-4 text-sm" aria-label="Итог брони" data-testid="manual-summary">
        <h3 className="text-base font-semibold">Итог</h3>
        {quote.lines.length === 0 ? (
          <p className="mt-2 text-muted">Выберите хотя бы одну позицию.</p>
        ) : (
          <dl className="mt-3 space-y-2">
            <div className={summaryRow}>
              <dt className="text-muted">Чистка</dt>
              <dd data-sum="subtotal">{eur(quote.subtotalCents)}</dd>
            </div>
            {quote.minFillCents > 0 && (
              <div className={summaryRow}>
                <dt className="text-muted">Доплата до минимума ({eur(minOrderCents)})</dt>
                <dd data-sum="minfill">{eur(quote.minFillCents)}</dd>
              </div>
            )}
            {promoCents > 0 && (
              <div className={summaryRow}>
                <dt className="text-teal-1">
                  Скидка
                  <span className="block text-xs text-muted">{mode === 'manual' ? 'вручную' : autoLabel}</span>
                </dt>
                <dd className="whitespace-nowrap text-teal-1" data-sum="promo">
                  −{eur(promoCents)}
                </dd>
              </div>
            )}
            <div className={summaryRow}>
              <dt className="text-muted">
                Транспорт
                <span className="block text-xs">
                  {travel.state === 'ok'
                    ? `по индексу, ${travel.municipality}`
                    : travel.state === 'loading'
                      ? 'считаем по индексу…'
                      : travel.state === 'manual'
                        ? 'индекс вне таблицы — из поля «Транспорт»'
                        : 'укажите индекс'}
                </span>
              </dt>
              <dd data-sum="travel">{eur(travelCents)}</dd>
            </div>
            <div className={`${summaryRow} border-t border-hairline pt-3 text-base font-bold`}>
              <dt>Итого</dt>
              <dd data-sum="total">
                {quote.hasFromPrice ? 'от ' : ''}
                {eur(totalCents)}
              </dd>
            </div>
            <div className={summaryRow}>
              <dt className="text-muted">Длительность</dt>
              <dd>{formatDuration(quote.durationMin, 'ru')}</dd>
            </div>
            <div className={summaryRow}>
              <dt className="text-muted">Клиент</dt>
              <dd>{customer === 'repeat' ? 'повторный' : 'новый'}</dd>
            </div>
          </dl>
        )}
      </aside>

      <section className="border-t border-hairline pt-5 lg:col-span-2" aria-label="Дата и время">
        <h3 className="mb-3 text-base font-semibold">Дата и время *</h3>
        <ManualTimePicker durationMin={quote.durationMin} />
      </section>
    </div>
  );
}
