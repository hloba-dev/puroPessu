import type {ReactNode} from 'react';
import {addDays, toHm, utcToZoned} from '@/lib/booking/tz';

export const adminBtn =
  'inline-flex min-h-10 items-center justify-center rounded-lg border border-text/20 px-3.5 text-sm font-semibold hover:border-teal-2 hover:text-teal-1 disabled:opacity-50';
export const adminBtnPrimary =
  'inline-flex min-h-10 items-center justify-center rounded-lg bg-teal-3 px-4 text-sm font-semibold text-white hover:bg-teal-2 disabled:opacity-50';
export const adminBtnDanger =
  'inline-flex min-h-10 items-center justify-center rounded-lg border border-danger-border px-3.5 text-sm font-semibold text-danger hover:bg-danger-soft';
export const adminInput = 'field min-h-10 rounded-lg px-3 py-2 text-sm';

export function AdminPage({
  title,
  actions,
  error,
  notice,
  children
}: {
  title: string;
  actions?: ReactNode;
  error?: string;
  notice?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-danger-border bg-danger-soft px-4 py-3 text-danger">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="mt-4 rounded-xl border border-teal-3 bg-teal-soft px-4 py-3 text-teal-1">
          {notice}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function Card({title, children, className = ''}: {title?: string; children: ReactNode; className?: string}) {
  return (
    <section className={`glass p-5 ${className}`}>
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
      {children}
    </section>
  );
}

const tones: Record<string, string> = {
  pending: 'bg-warn-soft text-warn',
  new: 'bg-warn-soft text-warn',
  requested: 'bg-warn-soft text-warn',
  confirmed: 'bg-teal-soft text-teal-1',
  in_progress: 'bg-teal-soft text-teal-1',
  paid: 'bg-teal-soft text-teal-1',
  done: 'bg-text/8 text-white',
  redeemed: 'bg-text/8 text-white',
  cancelled: 'bg-danger-soft text-danger',
  expired: 'bg-danger-soft text-danger'
};

export const STATUS_RU: Record<string, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждена',
  done: 'Выполнена',
  cancelled: 'Отменена',
  new: 'Новая',
  in_progress: 'В работе',
  requested: 'Заявка',
  paid: 'Оплачен',
  redeemed: 'Использован',
  expired: 'Истёк'
};

export function StatusBadge({status}: {status: string}) {
  return (
    <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${tones[status] ?? 'bg-text/8'}`}>
      {STATUS_RU[status] ?? status}
    </span>
  );
}

const dateTime = new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'Europe/Helsinki',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit'
});
const dateOnly = new Intl.DateTimeFormat('ru-RU', {timeZone: 'Europe/Helsinki', day: 'numeric', month: 'short', year: 'numeric'});

export const fmtDateTime = (iso: string) => dateTime.format(new Date(iso));
export const fmtDate = (iso: string) => dateOnly.format(new Date(iso));

const dayShort = new Intl.DateTimeFormat('ru-RU', {timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short'});
const fmtDay = (date: string) => dayShort.format(new Date(`${date}T12:00:00Z`));

/** A blocked interval in words: whole days read as days, not as "00:00 — 00:00". */
export function fmtBlockRange(startIso: string, endIso: string) {
  const start = utcToZoned(new Date(startIso), 'Europe/Helsinki');
  const end = utcToZoned(new Date(endIso), 'Europe/Helsinki');
  // an interval that ends at midnight belongs to the day before
  const lastDay = end.minutes === 0 ? addDays(end.date, -1) : end.date;
  const until = end.minutes === 0 ? 'до конца дня' : `до ${toHm(end.minutes)}`;
  if (start.minutes === 0 && end.minutes === 0) {
    return lastDay <= start.date ? `${fmtDay(start.date)} — весь день` : `${fmtDay(start.date)} — ${fmtDay(lastDay)}, дни целиком`;
  }
  if (lastDay === start.date) return `${fmtDay(start.date)}, ${start.minutes === 0 ? '' : `с ${toHm(start.minutes)} `}${until}`;
  return `${fmtDay(start.date)}, с ${toHm(start.minutes)} — ${fmtDay(lastDay)}, ${until}`;
}
export const eur = (cents: number) => `${(cents / 100).toLocaleString('ru-RU', {maximumFractionDigits: 2})} €`;

/** Status <select> + save button posting to a Server Action. */
export function StatusForm({
  action,
  id,
  status,
  options,
  hidden
}: {
  action: (form: FormData) => Promise<void>;
  id: string;
  status: string;
  options: string[];
  hidden?: Record<string, string>;
}) {
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      {Object.entries(hidden ?? {}).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <select name="status" defaultValue={status} className={`${adminInput} w-auto`} aria-label="Статус">
        {options.map((option) => (
          <option key={option} value={option}>
            {STATUS_RU[option] ?? option}
          </option>
        ))}
      </select>
      <button type="submit" className={adminBtn}>
        OK
      </button>
    </form>
  );
}
