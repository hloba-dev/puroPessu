import Link from 'next/link';
import {createManualBooking} from '@/app/admin/actions';
import {requireAdmin} from '@/lib/admin/auth';
import {getCatalog, getSettings} from '@/lib/data/public';
import {ManualBookingItems} from '@/components/admin/ManualBookingItems';
import {AdminPage, Card, adminBtn, adminBtnPrimary, adminInput} from '@/components/admin/ui';

export const metadata = {title: 'Новая бронь'};

export default async function AdminNewBookingPage({searchParams}: PageProps<'/admin/bookings/new'>) {
  await requireAdmin();
  const [{error}, catalog, settings] = await Promise.all([searchParams, getCatalog(), getSettings()]);
  const label = 'mb-1 block text-sm text-muted';

  return (
    <AdminPage title="Новая бронь (вручную)" error={typeof error === 'string' ? error : undefined}>
      <form action={createManualBooking} className="grid gap-6 xl:grid-cols-2">
        <Card title="Клиент">
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={label}>Имя *</span>
              <input name="name" required className={adminInput} />
            </label>
            <label>
              <span className={label}>Телефон *</span>
              <input name="phone" required className={adminInput} placeholder="+358 40 123 4567" />
            </label>
            <label>
              <span className={label}>E-mail</span>
              <input name="email" type="email" className={adminInput} />
            </label>
            <label>
              <span className={label}>Язык клиента</span>
              <select name="locale" className={adminInput} defaultValue="fi">
                <option value="fi">fi</option>
                <option value="ru">ru</option>
                <option value="en">en</option>
              </select>
            </label>
            <label>
              <span className={label}>Компания</span>
              <input name="company" className={adminInput} />
            </label>
            <label>
              <span className={label}>Y-tunnus</span>
              <input name="y_tunnus" className={adminInput} />
            </label>
          </div>
        </Card>

        <Card title="Адрес и время">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className={label}>Адрес *</span>
              <input name="address" required className={adminInput} />
            </label>
            <label>
              <span className={label}>Индекс * (по нему считается транспорт)</span>
              <input name="postal_code" required pattern="\d{5}" className={adminInput} />
            </label>
            <label>
              <span className={label}>Город *</span>
              <input name="city" required className={adminInput} />
            </label>
            <label>
              <span className={label}>Дата *</span>
              <input name="date" type="date" required className={adminInput} />
            </label>
            <label>
              <span className={label}>Время начала *</span>
              <input name="time" type="time" step={900} required className={adminInput} />
            </label>
            <label>
              <span className={label}>Транспорт, € (если индекс вне таблицы)</span>
              <input name="travel_eur" inputMode="decimal" className={adminInput} defaultValue="0" />
            </label>
            <label className="sm:col-span-2">
              <span className={label}>Комментарий</span>
              <textarea name="notes" className={`${adminInput} min-h-20`} />
            </label>
          </div>
        </Card>

        <Card title="Позиции" className="xl:col-span-2">
          <ManualBookingItems catalog={catalog} minOrderCents={settings.minOrderCents} promotions={settings.promotions} />
          <p className="mt-4 text-sm text-muted">
            Цена, длительность и доплата до минимального заказа считаются по каталогу и пересчитываются при сохранении. Занятость
            времени проверяется так же, как при онлайн-записи.
          </p>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" name="send_email" className="size-4 accent-teal-3" /> Отправить клиенту письмо с подтверждением
          </label>
          <div className="mt-5 flex gap-3">
            <button type="submit" className={adminBtnPrimary}>
              Создать бронь
            </button>
            <Link href="/admin/bookings" className={adminBtn}>
              Отмена
            </Link>
          </div>
        </Card>
      </form>
    </AdminPage>
  );
}
