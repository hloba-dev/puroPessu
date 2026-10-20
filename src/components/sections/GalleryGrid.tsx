import {getTranslations} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {l10n} from '@/lib/format';
import type {GalleryItem} from '@/lib/types';
import {BeforeAfter} from '@/components/BeforeAfter';
import {SnapCarousel} from '@/components/ui/SnapCarousel';

/** Grid of before/after sliders; on phones it becomes a horizontal snap carousel with position dots. */
export async function GalleryGrid({items, locale, columns = 4}: {items: GalleryItem[]; locale: Locale; columns?: 2 | 3 | 4}) {
  if (items.length === 0) return null;
  const t = await getTranslations('common');
  const cols = columns === 4 ? 'lg:grid-cols-4' : columns === 3 ? 'lg:grid-cols-3' : '';

  return (
    <SnapCarousel
      name="gallery"
      count={items.length}
      align="center"
      label={t('carousel.gallery')}
      dotLabels={items.map((_, i) => t('carousel.slide', {n: i + 1, total: items.length}))}
      prevLabel={t('carousel.prev')}
      nextLabel={t('carousel.next')}
      navClassName="min-[701px]:hidden"
      trackClassName={`-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-1 min-[701px]:mx-0 min-[701px]:grid min-[701px]:grid-cols-2 min-[701px]:gap-6 min-[701px]:overflow-visible min-[701px]:px-0 min-[701px]:py-0 ${cols}`}
    >
      {items.map((item) => (
        <li key={item.id} className="w-[84%] shrink-0 snap-center min-[701px]:w-auto">
          <BeforeAfter
            before={item.beforeUrl}
            after={item.afterUrl}
            caption={l10n(item.caption, locale)}
            sizes={
              columns === 4
                ? '(max-width: 700px) 84vw, (max-width: 1023px) 46vw, 280px'
                : '(max-width: 700px) 84vw, (max-width: 1023px) 46vw, 380px'
            }
          />
        </li>
      ))}
    </SnapCarousel>
  );
}
