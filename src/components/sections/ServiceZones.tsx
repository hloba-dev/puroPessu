import {getTranslations} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getServiceZones} from '@/lib/data/areas';
import {formatEur} from '@/lib/format';
import type {Settings} from '@/lib/types';

/** Municipalities we drive to, grouped by typical travel fee (computed from postal codes + settings). */
export async function ServiceZones({settings, locale}: {settings: Settings; locale: Locale}) {
  const t = await getTranslations('prices');
  const zones = getServiceZones(settings);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {zones.map((zone) => (
        <div key={zone.feeCents} className="glass p-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan-2">
            {zone.feeCents === 0 ? t('zoneFree') : t('zoneFee', {fee: formatEur(zone.feeCents, locale)})}
          </h3>
          <p className="mt-3 text-[15px] leading-7 text-[#d3d7dd]">{zone.municipalities.join(' · ')}</p>
        </div>
      ))}
    </div>
  );
}
