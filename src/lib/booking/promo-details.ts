import type {PromoDetails} from '@/lib/data/store';
import type {Promotions} from '@/lib/types';
import type {Quote} from './cart';

/** What the promotion consisted of — stored with the booking so the owner and the e-mails can explain it. */
export function describePromo(quote: Quote, customer: 'first' | 'repeat', promotions: Promotions): PromoDetails {
  if (quote.promoKind === 'none') return {kind: 'none'};
  const percentApplied = quote.promoKind !== 'bundle';
  return {
    kind: quote.promoKind,
    ...(percentApplied
      ? {
          percent: quote.percent,
          customer,
          multiItem: promotions.multiItemPct > 0 && quote.itemCount >= promotions.multiItemMin
        }
      : {}),
    ...(quote.bundles.length ? {bundles: quote.bundles.map((b) => b.kind)} : {})
  };
}

const BUNDLE_NAMES: Record<string, string> = {
  chairs: 'диван + стулья',
  'mattress-single': 'диван + односпальный матрас',
  'mattress-double': 'диван + двуспальный матрас'
};

/** The same, in words, for the owner (the admin panel and the owner's e-mail are in Russian). */
export function promoLabel(details: PromoDetails) {
  const bundles = [...new Set(details.bundles ?? [])].map((kind) => BUNDLE_NAMES[kind] ?? kind);
  const reasons = [
    details.customer === 'repeat' ? 'повторный заказ' : details.customer === 'first' ? 'первый заказ' : '',
    details.multiItem ? 'от 3 предметов' : ''
  ].filter(Boolean);
  const parts = [
    bundles.length ? `комплект: ${bundles.join(', ')}` : '',
    details.percent ? `${details.percent} %${reasons.length ? ` (${reasons.join(' + ')})` : ''}` : ''
  ].filter(Boolean);
  return parts.join(' + ') || 'акция';
}
