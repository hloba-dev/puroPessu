import {markGiftCardPaid, setGiftCardStatus} from '@/app/admin/actions';
import {requireAdmin} from '@/lib/admin/auth';
import {getCatalog} from '@/lib/data/public';
import {AdminPage, StatusBadge, StatusForm, adminBtn, adminBtnPrimary, eur, fmtDate, fmtDateTime} from '@/components/admin/ui';

export const metadata = {title: 'Сертификаты'};

export default async function AdminGiftCardsPage({searchParams}: PageProps<'/admin/gift-cards'>) {
  const {supabase} = await requireAdmin();
  const [{error}, cards, catalog] = await Promise.all([
    searchParams,
    supabase.from('gift_cards').select('*').order('created_at', {ascending: false}).limit(200),
    getCatalog()
  ]);
  const serviceName = new Map(catalog.services.map((s) => [s.id, s.name.ru || s.name.fi]));

  return (
    <AdminPage title="Подарочные сертификаты" error={typeof error === 'string' ? error : cards.error?.message}>
      <p className="mb-6 max-w-3xl text-muted">
        Порядок: клиент оставляет заявку → вы выставляете счёт → после оплаты нажмите «Оплачен»: сертификату присваивается код, срок
        действия 12 месяцев, а PDF уходит покупателю на почту. Код вводится при онлайн-записи.
      </p>
      {(cards.data ?? []).length === 0 && <p className="text-muted">Заявок пока нет.</p>}
      <ul className="space-y-4">
        {(cards.data ?? []).map((card) => (
          <li key={card.id} className="glass p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">
                  {card.amount_cents ? eur(card.amount_cents) : (serviceName.get(card.service_id ?? 0) ?? 'Услуга')}
                  {card.code && <code className="ml-3 rounded bg-text/8 px-2 py-0.5 text-base">{card.code}</code>}
                </p>
                <p className="text-sm text-muted">
                  {fmtDateTime(card.created_at)} · язык: {card.locale}
                  {card.valid_until && ` · действует до ${fmtDate(card.valid_until)}`}
                  {card.amount_cents !== null && card.balance_cents !== null && ` · остаток ${eur(card.balance_cents)}`}
                </p>
              </div>
              <StatusBadge status={card.status} />
            </div>
            <p className="mt-3">
              Покупатель: <span className="font-medium">{card.buyer_name}</span> · {card.buyer_email}
              {card.buyer_phone && ` · ${card.buyer_phone}`}
            </p>
            {(card.recipient_name || card.message) && (
              <p className="mt-1 text-muted">
                {card.recipient_name && `Получатель: ${card.recipient_name}. `}
                {card.message && `«${card.message}»`}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {card.status === 'requested' && (
                <form action={markGiftCardPaid}>
                  <input type="hidden" name="id" value={card.id} />
                  <button type="submit" className={adminBtnPrimary}>
                    Оплачен → отправить PDF
                  </button>
                </form>
              )}
              {card.code && (
                <a href={`/admin/gift-cards/${card.id}/pdf`} className={adminBtn}>
                  Скачать PDF
                </a>
              )}
              <a href={`mailto:${card.buyer_email}`} className={adminBtn}>
                Написать
              </a>
              <StatusForm action={setGiftCardStatus} id={card.id} status={card.status} options={['requested', 'paid', 'redeemed', 'expired']} />
            </div>
          </li>
        ))}
      </ul>
    </AdminPage>
  );
}
