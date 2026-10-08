import {saveSettings, saveStaff} from '@/app/admin/actions';
import {requireAdmin} from '@/lib/admin/auth';
import {settingsFromRows} from '@/lib/data/mappers';
import {AdminPage, Card, adminBtn, adminBtnPrimary, adminInput} from '@/components/admin/ui';

export const metadata = {title: 'Настройки'};

const label = 'mb-1 block text-sm text-muted';

export default async function AdminSettingsPage({searchParams}: PageProps<'/admin/settings'>) {
  const {supabase} = await requireAdmin();
  const [{error, saved}, rows, staff] = await Promise.all([
    searchParams,
    supabase.from('settings').select('key, value'),
    supabase.from('staff').select('*').order('id')
  ]);
  // fresh from the database (not the cached public copy), so the form always shows what is stored
  const s = settingsFromRows(rows.data ?? []);
  const field = (name: string, title: string, value: string | number, props: Record<string, unknown> = {}) => (
    <label>
      <span className={label}>{title}</span>
      <input name={name} defaultValue={value} className={adminInput} {...props} />
    </label>
  );

  return (
    <AdminPage
      title="Настройки"
      error={typeof error === 'string' ? error : rows.error?.message}
      notice={saved ? 'Настройки сохранены.' : undefined}
    >
      <form action={saveSettings} className="space-y-6">
        <Card title="Контакты и реквизиты (футер, страница контактов, JSON-LD, письма)">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {field('company_name', 'Название бренда', s.companyName)}
            {field('legal_name', 'Юридическое название', s.legalName)}
            {field('y_tunnus', 'Y-tunnus', s.yTunnus)}
            {field('phone', 'Телефон (как показывать)', s.phone)}
            {field('whatsapp', 'WhatsApp (только цифры, с кодом страны)', s.whatsapp)}
            {field('email', 'E-mail', s.email, {type: 'email'})}
            {field('street', 'Адрес: улица', s.address.street)}
            {field('postal_code', 'Адрес: индекс', s.address.postalCode)}
            {field('city', 'Адрес: город', s.address.city)}
            {field('facebook', 'Facebook (URL)', s.social.facebook)}
            {field('instagram', 'Instagram (URL)', s.social.instagram)}
            {field('google_reviews', 'Отзывы в Google (URL)', s.social.googleReviews)}
          </div>
        </Card>

        <Card title="Запись и расписание">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {field('open_from', 'Работаем с', s.openFrom, {type: 'time'})}
            {field('open_to', 'Работаем до', s.openTo, {type: 'time'})}
            {field('slot_step', 'Шаг слотов, мин (5/10/15/20/30/60)', s.slotStep, {type: 'number'})}
            {field('lead_time_hours', 'Минимум часов до записи', s.leadTimeHours, {type: 'number', min: 0})}
            {field('buffer_min', 'Буфер на дорогу, мин', s.bufferMin, {type: 'number', min: 0})}
            {field('booking_horizon_days', 'Запись на сколько дней вперёд', s.bookingHorizonDays, {type: 'number', min: 1})}
            {field('min_order', 'Минимальный заказ, €', s.minOrderCents / 100, {inputMode: 'decimal'})}
          </div>
        </Card>

        <Card title="Скидки и комплекты (ценовая политика)">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {field('promo_first_pct', 'Первый заказ, %', s.promotions.firstOrderPct, {type: 'number', min: 0, max: 50})}
            {field('promo_repeat_pct', 'Повторный заказ, %', s.promotions.repeatOrderPct, {type: 'number', min: 0, max: 50})}
            {field('promo_multi_pct', 'За количество предметов, %', s.promotions.multiItemPct, {type: 'number', min: 0, max: 50})}
            {field('promo_multi_min', '…начиная с N предметов', s.promotions.multiItemMin, {type: 'number', min: 2})}
            {field('bundle_chairs_count', 'Комплект: стульев к дивану, шт.', s.promotions.bundleChairsCount, {type: 'number', min: 1})}
            {field('bundle_chairs_extra', 'Диван + стулья: доплата, €', s.promotions.bundleChairsExtraCents / 100, {inputMode: 'decimal'})}
            {field('bundle_single_extra', 'Диван + односп. матрас: доплата, €', s.promotions.bundleMattressSingleExtraCents / 100, {inputMode: 'decimal'})}
            {field('bundle_double_extra', 'Диван + двусп. матрас: доплата, €', s.promotions.bundleMattressDoubleExtraCents / 100, {inputMode: 'decimal'})}
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" name="promo_stack" defaultChecked={s.promotions.stackBundlesWithPercent} className="size-4 accent-cyan-600" />
            Суммировать комплект со скидкой в процентах (если выключено — клиент получает то, что выгоднее)
          </label>
          <p className="mt-3 text-sm text-muted">
            Первая и повторная скидки между собой не суммируются; скидка «за количество» прибавляется к любой из них. На дорогу скидки
            не действуют. Первый/повторный заказ определяется по e-mail и телефону прошлых броней.
          </p>
        </Card>

        <Card title="Транспортный сбор">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {field('base_lat', 'База: широта', s.baseLat, {inputMode: 'decimal'})}
            {field('base_lng', 'База: долгота', s.baseLng, {inputMode: 'decimal'})}
            {field('road_factor', 'Дорожный коэффициент', s.roadFactor, {inputMode: 'decimal'})}
            <label className="sm:col-span-2 xl:col-span-1">
              <span className={label}>Зоны: «до км=евро», по строке</span>
              <textarea
                name="travel_zones"
                rows={5}
                defaultValue={s.travelZones.map((z) => `${z.maxKm}=${z.feeCents / 100}`).join('\n')}
                className={adminInput}
              />
            </label>
          </div>
          <p className="mt-3 text-sm text-muted">
            Расстояние = прямая от базы до почтового индекса × коэффициент. Дальше последней зоны — «свяжитесь с нами».
          </p>
        </Card>

        <button type="submit" className={adminBtnPrimary}>
          Сохранить настройки
        </button>
      </form>

      <Card title="Мастера (каждый активный мастер — параллельные слоты)" className="mt-8">
        <ul className="space-y-3">
          {(staff.data ?? []).map((member) => (
            <li key={member.id}>
              <form action={saveStaff} className="flex flex-wrap items-center gap-3">
                <input type="hidden" name="id" value={member.id} />
                <input name="name" defaultValue={member.name} className={`${adminInput} w-56`} aria-label="Имя мастера" />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_active" defaultChecked={member.is_active} className="size-4 accent-cyan-600" /> Активен
                </label>
                <button type="submit" className={adminBtn}>
                  Сохранить
                </button>
              </form>
            </li>
          ))}
          <li>
            <form action={saveStaff} className="flex flex-wrap items-center gap-3 border-t border-hairline pt-3">
              <input name="name" placeholder="Новый мастер" className={`${adminInput} w-56`} aria-label="Имя нового мастера" />
              <input type="hidden" name="is_active" value="true" />
              <button type="submit" className={adminBtn}>
                Добавить
              </button>
            </form>
          </li>
        </ul>
      </Card>
    </AdminPage>
  );
}
