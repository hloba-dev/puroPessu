import {locales, type Locale} from '@/i18n/routing';
import {getAdmin} from '@/lib/admin/auth';
import {getCatalog} from '@/lib/data/public';
import {formatEur, l10n} from '@/lib/format';
import {buildGiftCardPdf} from '@/lib/giftcard-pdf';
import {localizedUrl} from '@/lib/seo';

/** Admin-only download of a gift card PDF (the same file that is e-mailed to the buyer). */
export async function GET(_request: Request, ctx: RouteContext<'/admin/gift-cards/[id]/pdf'>) {
  const admin = await getAdmin();
  if (!admin) return new Response('Unauthorized', {status: 401});
  const {id} = await ctx.params;
  const {data: card} = await admin.supabase.from('gift_cards').select('*').eq('id', id).maybeSingle();
  if (!card?.code) return new Response('Not found', {status: 404});

  const locale = (locales as readonly string[]).includes(card.locale) ? (card.locale as Locale) : 'fi';
  const service = (await getCatalog()).services.find((s) => s.id === card.service_id);
  const pdf = await buildGiftCardPdf({
    code: card.code,
    value: card.amount_cents ? formatEur(card.amount_cents, locale) : service ? l10n(service.name, locale) : '',
    validUntil: card.valid_until
      ? new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : `${locale}-FI`, {dateStyle: 'long'}).format(new Date(card.valid_until))
      : '',
    recipientName: card.recipient_name,
    message: card.message,
    locale,
    siteUrl: localizedUrl('/varaa-aika', locale)
  });

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="puro-lahjakortti-${card.code}.pdf"`,
      'Cache-Control': 'no-store'
    }
  });
}
