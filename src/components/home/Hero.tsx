import type {CSSProperties} from 'react';
import {getImageProps} from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {formatEur, l10n, shortHour} from '@/lib/format';
import type {Catalog, GalleryItem, Settings} from '@/lib/types';
import {BeforeAfter} from '@/components/BeforeAfter';
import {GlowButton} from '@/components/ui/GlowButton';
import {IconClock} from '@/components/ui/icons';
import {SnapCarousel} from '@/components/ui/SnapCarousel';
import {RingMotion} from './RingMotion';
import styles from './Hero.module.css';

const RING_CARDS = 37;
const RING_CREATIVES = 10;
// what the booking mock pretends the visitor has picked: [service slug, quantity]
const MOCK_PICKS: [string, number][] = [
  ['sofa-3', 1],
  ['armchair', 1],
  ['bed-double', 0]
];

interface Props {
  locale: Locale;
  catalog: Catalog;
  settings: Settings;
  gallery: GalleryItem[];
  fromPriceCents: number;
}

const delay = (seconds: number) => ({'--d': `${seconds}s`}) as CSSProperties;

/** Optimized (AVIF/WebP, 1x/2x) URL set for a ring / strip tile, as a CSS image-set(). */
function tileImage(src: string) {
  const {srcSet, src: fallback} = getImageProps({src, alt: '', width: 160, height: 184}).props;
  const candidates = (srcSet ?? `${fallback} 1x`).split(', ').map((entry) => {
    const [url, density] = entry.split(' ');
    return `url("${url}") ${density}`;
  });
  return `image-set(${candidates.join(', ')})`;
}

export async function Hero({locale, catalog, settings, gallery, fromPriceCents}: Props) {
  const [t, ba, tc] = await Promise.all([getTranslations('home.hero'), getTranslations('beforeAfter'), getTranslations('common')]);

  const featured = gallery.find((g) => g.isFeatured) ?? gallery[0];
  const creatives = gallery.slice(0, RING_CREATIVES);
  // 37 ring cards (and the 10 strip cards on phones) share 10 creatives: the images are declared once as
  // CSS backgrounds instead of <img> tags. They load at low priority and can never become the LCP element.
  const ringCss = creatives
    .map(
      (item, n) =>
        `.rc${n} .rb{background-image:${tileImage(item.beforeUrl)}}.rc${n} .ra{background-image:${tileImage(item.afterUrl)}}`
    )
    .join('');

  const mockRows = MOCK_PICKS.map(([slug, qty]) => ({service: catalog.services.find((s) => s.slug === slug), qty})).filter(
    (row): row is {service: Catalog['services'][number]; qty: number} => Boolean(row.service)
  );
  const mockTotal = mockRows.reduce((sum, r) => sum + r.service.priceCents * r.qty, 0);

  const hours = t('badge', {from: shortHour(settings.openFrom), to: shortHour(settings.openTo)});

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.bg} aria-hidden="true" />

      <div className={`container-x ${styles.top}`}>
        {/* on phones the wrapper dissolves (display: contents), the badge hides and the slider slots in between the headline and the buttons */}
        <div className={styles.copy}>
          <p className={`${styles.badge} ${styles.rise}`}>
            <span className={styles.badgeIcon}>
              <IconClock width={18} height={18} />
            </span>
            <span>{hours}</span>
          </p>
          <h1 id="hero-title" className={styles.h1}>
            <span className={styles.wipe} style={delay(0.05)}>
              {t('h1Line1')}
            </span>
            <span className={styles.wipe} style={delay(0.16)}>
              {t('h1Line2')}
            </span>
          </h1>
          <p className={`${styles.sub} ${styles.rise}`} style={delay(0.3)}>
            {t('sub', {price: formatEur(fromPriceCents, locale)})}
          </p>
          <div className={`${styles.ctas} ${styles.rise}`} style={delay(0.4)}>
            {/* phones only: the opening hours shrink to a small chip above the prices button */}
            <p className={styles.hoursMini}>
              <IconClock width={14} height={14} />
              <span>{hours}</span>
            </p>
            <GlowButton href="/varaa-aika" className={styles.cta}>
              {t('cta')}
            </GlowButton>
            <GlowButton href="/hinnasto" variant="ghost" className={styles.cta}>
              {t('ctaSecondary')}
            </GlowButton>
          </div>
        </div>

        {featured && (
          <div className={`${styles.slider} ${styles.rise}`} style={delay(0.35)}>
            <BeforeAfter
              before={featured.beforeUrl}
              after={featured.afterUrl}
              caption={l10n(featured.caption, locale)}
              sizes="(max-width: 1000px) 92vw, 440px"
              priority
              hint
            />
          </div>
        )}
      </div>

      <div className={styles.stage}>
        {creatives.length > 0 && (
          <>
            <style dangerouslySetInnerHTML={{__html: ringCss}} />

            {/* wide screens: the 3D ring, turned by the arrows or ← → */}
            <RingMotion
              className={`${styles.ringViewport} ${styles.fade}`}
              clipClassName={styles.ringClip}
              arrowClassName={styles.ringArrow}
              prevLabel={tc('carousel.prev')}
              nextLabel={tc('carousel.next')}
            >
              <div className={styles.ringTurn}>
                <div className={styles.ring} data-ring>
                  {Array.from({length: RING_CARDS}, (_, i) => {
                    const n = i % creatives.length;
                    return (
                      <div key={i} className={`${styles.card} rc${n}`} style={{'--i': i} as CSSProperties}>
                        <div className={`${styles.half} rb`}>
                          <span className={styles.mini}>{ba('before')}</span>
                        </div>
                        <div className={`${styles.half} ra`}>
                          <span className={styles.mini}>{ba('after')}</span>
                        </div>
                        <span className={styles.cardCaption}>{l10n(creatives[n].caption, locale)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </RingMotion>

            {/* phones: the same cards as a native swipe strip — a finger cannot turn a CSS-animated ring,
                and the ring looks exactly like a carousel that should swipe */}
            <SnapCarousel
              name="hero"
              count={creatives.length}
              label={t('stripLabel')}
              dotLabels={creatives.map((_, i) => tc('carousel.slide', {n: i + 1, total: creatives.length}))}
              prevLabel={tc('carousel.prev')}
              nextLabel={tc('carousel.next')}
              className={`${styles.strip} ${styles.fade}`}
              trackClassName={styles.stripTrack}
            >
              {creatives.map((item, n) => (
                <li key={item.id} className={`${styles.stripCard} rc${n}`}>
                  <div className={`${styles.half} rb`}>
                    <span className={styles.mini}>{ba('before')}</span>
                  </div>
                  <div className={`${styles.half} ra`}>
                    <span className={styles.mini}>{ba('after')}</span>
                  </div>
                  <span className={styles.cardCaption}>{l10n(item.caption, locale)}</span>
                </li>
              ))}
            </SnapCarousel>
          </>
        )}

        <Link href="/varaa-aika" className={`${styles.mock} ${styles.rise}`} style={delay(0.55)} aria-label={t('mockLabel')}>
          <div aria-hidden="true">
            <div className={styles.mockBar}>
              <i />
              <i />
              <i />
              <span className={styles.mockUrl}>{t('mockUrl')}</span>
            </div>
            <div className={styles.mockBody}>
              <div className={styles.mockHead}>
                <span className={styles.mockTitle}>{t('mockTitle')}</span>
                <span className={styles.mockTotal}>
                  {t('mockTotal')}
                  <strong>{formatEur(mockTotal, locale)}</strong>
                </span>
              </div>
              {mockRows.map(({service, qty}) => (
                <div key={service.slug} className={styles.mockRow}>
                  <span>{l10n(service.name, locale)}</span>
                  <span className={styles.mockPrice}>{formatEur(service.priceCents, locale)}</span>
                  <span className={styles.mockCount}>
                    <i>−</i>
                    {qty}
                    <i data-on={qty > 0}>+</i>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
