import {getTranslations} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {formatEur} from '@/lib/format';
import type {Settings} from '@/lib/types';

/** Travel fee table rendered from the zones in settings. */
export async function TravelZones({settings, locale}: {settings: Settings; locale: Locale}) {
  const t = await getTranslations('prices');
  const zones = [...settings.travelZones].sort((a, b) => a.maxKm - b.maxKm);
  const last = zones[zones.length - 1];

  return (
    <ul className="space-y-2 text-[15px]">
      {zones.map((zone, index) => (
        <li key={zone.maxKm} className="flex justify-between gap-4">
          <span className="text-muted">
            {index === 0 ? t('zoneUnder', {km: zone.maxKm}) : t('zoneBetween', {from: zones[index - 1].maxKm, to: zone.maxKm})}
          </span>
          <span className="font-semibold">{formatEur(zone.feeCents, locale)}</span>
        </li>
      ))}
      {last && (
        <li className="flex justify-between gap-4">
          <span className="text-muted">{t('zoneOver', {km: last.maxKm})}</span>
          <span className="font-semibold">{t('zoneAsk')}</span>
        </li>
      )}
    </ul>
  );
}
