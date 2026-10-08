'use client';

import {useState} from 'react';
import {IconPin} from '@/components/ui/icons';

interface Props {
  lat: number;
  lng: number;
  title: string;
  showLabel: string;
  openLabel: string;
  note: string;
}

/**
 * OpenStreetMap embed that is only requested after a click:
 * no third-party request, cookie or tracking until the visitor asks for the map.
 */
export function OsmMap({lat, lng, title, showLabel, openLabel, note}: Props) {
  const [loaded, setLoaded] = useState(false);
  const bbox = [lng - 0.42, lat - 0.2, lng + 0.42, lat + 0.2].map((n) => n.toFixed(4)).join('%2C');
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  const link = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=10/${lat}/${lng}`;

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] border border-hairline bg-surface">
        {loaded ? (
          <iframe src={src} title={title} loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 size-full border-0" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(70%_70%_at_50%_50%,rgba(5,150,179,.22),transparent)] p-6 text-center">
            <IconPin width={36} height={36} className="text-cyan-2" />
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="min-h-12 rounded-xl border border-white/25 bg-white/[0.06] px-5 font-semibold hover:border-cyan-2"
            >
              {showLabel}
            </button>
            <p className="max-w-sm text-sm text-muted">{note}</p>
          </div>
        )}
      </div>
      <p className="mt-3 text-sm">
        <a href={link} className="link" rel="noopener" target="_blank">
          {openLabel}
        </a>
      </p>
    </div>
  );
}
