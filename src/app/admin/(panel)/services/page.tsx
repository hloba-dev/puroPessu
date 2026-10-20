import {createService, updateCategory, updateOption, updateService} from '@/app/admin/actions';
import {requireAdmin} from '@/lib/admin/auth';
import type {Json} from '@/lib/supabase/database.types';
import {AdminPage, adminBtn, adminBtnPrimary, adminInput} from '@/components/admin/ui';

export const metadata = {title: 'Услуги и цены'};

const name = (value: Json, locale: 'fi' | 'ru' | 'en') => ((value ?? {}) as Record<string, string>)[locale] ?? '';
const eurValue = (cents: number) => (cents / 100).toString();
const label = 'mb-1 block text-xs text-muted';

export default async function AdminServicesPage({searchParams}: PageProps<'/admin/services'>) {
  const {supabase} = await requireAdmin();
  const [{error, added}, categories, services, options] = await Promise.all([
    searchParams,
    supabase.from('service_categories').select('*').order('sort'),
    supabase.from('services').select('*').order('sort'),
    supabase.from('service_options').select('*').order('id')
  ]);

  const addedService = (services.data ?? []).find((service) => String(service.id) === added);

  return (
    <AdminPage
      title="Услуги и цены"
      error={typeof error === 'string' ? error : undefined}
      notice={
        addedService &&
        `Услуга «${name(addedService.name, 'ru') || name(addedService.name, 'fi')}» добавлена${
          addedService.is_active ? ' и уже видна в прайсе и в записи' : ' (пока выключена)'
        }.`
      }
    >
      <p className="mb-6 max-w-3xl text-muted">
        Это единственный источник цен: прайс, лендинги, форма записи, JSON-LD и письма берут значения отсюда. Изменения появляются на
        сайте сразу после сохранения. Новую услугу можно добавить в конце каждой категории; ненужную — выключить галочкой «Активна».
      </p>

      <div className="space-y-8">
        {(categories.data ?? []).map((category) => (
          <section key={category.id} className="glass p-5">
            <form action={updateCategory} className="grid items-end gap-3 border-b border-hairline pb-5 md:grid-cols-[1fr_1fr_1fr_90px_auto_auto]">
              <input type="hidden" name="id" value={category.id} />
              {(['fi', 'ru', 'en'] as const).map((locale) => (
                <label key={locale}>
                  <span className={label}>Категория ({locale})</span>
                  <input name={`name_${locale}`} defaultValue={name(category.name, locale)} className={`${adminInput} font-semibold`} />
                </label>
              ))}
              <label>
                <span className={label}>Порядок</span>
                <input name="sort" type="number" defaultValue={category.sort} className={adminInput} />
              </label>
              <label className="flex min-h-10 items-center gap-2 text-sm">
                <input type="checkbox" name="is_active" defaultChecked={category.is_active} className="size-4 accent-teal-3" />
                Активна
              </label>
              <button type="submit" className={adminBtnPrimary}>
                Сохранить
              </button>
            </form>

            <div className="mt-2 divide-y divide-hairline">
              {(services.data ?? [])
                .filter((service) => service.category_id === category.id)
                .map((service) => (
                  <div
                    key={service.id}
                    id={`service-${service.id}`}
                    className={`scroll-mt-6 py-4 ${service === addedService ? '-mx-3 rounded-xl bg-teal-soft px-3' : ''}`}
                  >
                    <form action={updateService} className="grid items-end gap-3 md:grid-cols-6">
                      <input type="hidden" name="id" value={service.id} />
                      {(['fi', 'ru', 'en'] as const).map((locale) => (
                        <label key={locale} className="md:col-span-2">
                          <span className={label}>
                            Название ({locale}) · <code>{service.slug}</code>
                          </span>
                          <input name={`name_${locale}`} defaultValue={name(service.name, locale)} className={adminInput} />
                        </label>
                      ))}
                      {(['fi', 'ru', 'en'] as const).map((locale) => (
                        <label key={locale} className="md:col-span-2">
                          <span className={label}>Описание ({locale})</span>
                          <input name={`description_${locale}`} defaultValue={name(service.description, locale)} className={adminInput} />
                        </label>
                      ))}
                      <label>
                        <span className={label}>Цена, €</span>
                        <input name="price" inputMode="decimal" defaultValue={eurValue(service.price_cents)} className={adminInput} />
                      </label>
                      <label>
                        <span className={label}>Длительность, мин</span>
                        <input name="duration_min" type="number" min={0} defaultValue={service.duration_min} className={adminInput} />
                      </label>
                      <label>
                        <span className={label}>Порядок</span>
                        <input name="sort" type="number" defaultValue={service.sort} className={adminInput} />
                      </label>
                      <label className="flex min-h-10 items-center gap-2 text-sm">
                        <input type="checkbox" name="price_from" defaultChecked={service.price_from} className="size-4 accent-teal-3" />
                        Цена «от»
                      </label>
                      <label className="flex min-h-10 items-center gap-2 text-sm">
                        <input type="checkbox" name="is_active" defaultChecked={service.is_active} className="size-4 accent-teal-3" />
                        Активна
                      </label>
                      <button type="submit" className={adminBtn}>
                        Сохранить
                      </button>
                    </form>

                    {(options.data ?? [])
                      .filter((option) => option.service_id === service.id)
                      .map((option) => (
                        <form key={option.id} action={updateOption} className="mt-3 flex flex-wrap items-end gap-3 pl-4 text-sm">
                          <input type="hidden" name="id" value={option.id} />
                          <span className="min-h-10 content-center text-muted">Опция: {name(option.name, 'ru') || name(option.name, 'fi')}</span>
                          <label>
                            <span className={label}>Цена, €</span>
                            <input name="price" inputMode="decimal" defaultValue={eurValue(option.price_cents)} className={`${adminInput} w-24`} />
                          </label>
                          <label>
                            <span className={label}>+ мин</span>
                            <input name="duration_min" type="number" min={0} defaultValue={option.duration_min} className={`${adminInput} w-24`} />
                          </label>
                          <button type="submit" className={adminBtn}>
                            Сохранить
                          </button>
                        </form>
                      ))}
                  </div>
                ))}
            </div>

            <details className="mt-2 border-t border-hairline pt-4">
              <summary className={`${adminBtn} cursor-pointer`}>+ Добавить услугу</summary>
              <form action={createService} className="mt-4 grid items-end gap-3 md:grid-cols-6">
                <input type="hidden" name="category_id" value={category.id} />
                {(['fi', 'ru', 'en'] as const).map((locale) => (
                  <label key={locale} className="md:col-span-2">
                    <span className={label}>
                      Название ({locale}){locale === 'fi' ? ' *' : ' — если пусто, показывается финское'}
                    </span>
                    <input name={`name_${locale}`} required={locale === 'fi'} className={adminInput} />
                  </label>
                ))}
                {(['fi', 'ru', 'en'] as const).map((locale) => (
                  <label key={locale} className="md:col-span-2">
                    <span className={label}>Описание ({locale})</span>
                    <input name={`description_${locale}`} className={adminInput} />
                  </label>
                ))}
                <label>
                  <span className={label}>Цена, € *</span>
                  <input name="price" inputMode="decimal" required placeholder="например 120" className={adminInput} />
                </label>
                <label>
                  <span className={label}>Длительность, мин *</span>
                  <input name="duration_min" type="number" min={5} step={5} required defaultValue={30} className={adminInput} />
                </label>
                <label>
                  <span className={label}>Цена указана</span>
                  <select name="unit" defaultValue="item" className={adminInput}>
                    <option value="item">за предмет</option>
                    <option value="piece">за штуку</option>
                    <option value="m2">за м²</option>
                  </select>
                </label>
                <label className="flex min-h-10 items-center gap-2 text-sm">
                  <input type="checkbox" name="price_from" className="size-4 accent-teal-3" />
                  Цена «от»
                </label>
                <label className="flex min-h-10 items-center gap-2 text-sm">
                  <input type="checkbox" name="is_active" defaultChecked className="size-4 accent-teal-3" />
                  Активна
                </label>
                <button type="submit" className={adminBtnPrimary}>
                  Добавить услугу
                </button>
              </form>
            </details>
          </section>
        ))}
      </div>
    </AdminPage>
  );
}
