import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {formatDuration, formatEur, l10n} from '@/lib/format';
import type {Service} from '@/lib/types';

export function priceLabel(service: Service, locale: Locale, t: (key: 'from' | 'included' | 'perPiece' | 'perM2') => string) {
  if (service.priceCents === 0) return t('included');
  const base = formatEur(service.priceCents, locale);
  const unit = service.unit === 'piece' ? ` ${t('perPiece')}` : service.unit === 'm2' ? ` ${t('perM2')}` : '';
  return `${service.priceFrom ? `${t('from')} ` : ''}${base}${unit}`;
}

interface Props {
  services: Service[];
  locale: Locale;
  /** show the description and duration under the name */
  detailed?: boolean;
  /** render a "book this item" link per row */
  bookable?: boolean;
}

/** Price rows read from the catalog — the same data the booking form and JSON-LD use. */
export async function PriceRows({services, locale, detailed = false, bookable = true}: Props) {
  const t = await getTranslations('prices');

  return (
    <ul className="divide-y divide-hairline">
      {services.map((service) => {
        const name = l10n(service.name, locale);
        const price = priceLabel(service, locale, t);
        return (
          <li key={service.slug} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
            <div className="min-w-0 flex-1 basis-56">
              <p className="font-medium">{name}</p>
              {detailed && (
                <p className="mt-0.5 text-base text-muted">
                  {l10n(service.description, locale)}
                  {service.durationMin > 0 && ` · ${t('duration', {duration: formatDuration(service.durationMin, locale)})}`}
                </p>
              )}
            </div>
            <p className="text-lg font-semibold whitespace-nowrap text-teal-1">{price}</p>
            {bookable && !service.isAddon && (
              <Link
                href={{pathname: '/varaa-aika', query: {item: service.slug}}}
                aria-label={t('bookItem', {item: name, price})}
                className="flex min-h-11 items-center rounded-xl border border-text/20 px-4 text-sm font-semibold transition-colors hover:border-teal-2 hover:text-teal-1"
              >
                {t('book')}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
