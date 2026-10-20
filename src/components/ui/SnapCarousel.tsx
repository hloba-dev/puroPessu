'use client';

import {useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode} from 'react';
import {IconChevron} from '@/components/ui/icons';
import styles from './SnapCarousel.module.css';

interface Props {
  /** the slides: <li> elements */
  children: ReactNode;
  count: number;
  /** scroll-snap-align of the slides — decides which slide counts as the current one */
  align?: 'start' | 'center';
  /** accessible name of the carousel */
  label: string;
  /** accessible names of the position dots, one per slide */
  dotLabels: string[];
  prevLabel: string;
  nextLabel: string;
  /** data-carousel value (tests, styling hooks) */
  name?: string;
  className?: string;
  /** classes of the scrolling <ul>: the consumer decides the slide widths, gaps and breakpoints */
  trackClassName?: string;
  /** classes of the dots/arrows row, e.g. to hide it where the track is a grid */
  navClassName?: string;
}

/**
 * Native horizontal scroll-snap carousel: the browser does the swiping (so a finger never fights
 * the page scroll), JS only keeps the position dots in sync and drives the arrows and ← → keys.
 */
export function SnapCarousel({
  children,
  count,
  align = 'start',
  label,
  dotLabels,
  prevLabel,
  nextLabel,
  name,
  className,
  trackClassName,
  navClassName
}: Props) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  // assume it scrolls until measured: the dots are in the server HTML, no pop-in after hydration
  const [scrollable, setScrollable] = useState(count > 1);

  const padding = (track: HTMLUListElement) => parseFloat(getComputedStyle(track).scrollPaddingLeft) || parseFloat(getComputedStyle(track).paddingLeft) || 0;

  /** scrollLeft at which slide n sits on its snap position */
  const snapLeft = useCallback(
    (track: HTMLUListElement, n: number) => {
      const slide = track.children[n] as HTMLElement | undefined;
      if (!slide) return 0;
      return align === 'center'
        ? slide.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2
        : slide.offsetLeft - padding(track);
    },
    [align]
  );

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const target = align === 'center' ? track.scrollLeft + track.clientWidth / 2 : track.scrollLeft + padding(track);
    let best = 0;
    let distance = Infinity;
    slides.forEach((slide, i) => {
      const at = align === 'center' ? slide.offsetLeft + slide.offsetWidth / 2 : slide.offsetLeft;
      const d = Math.abs(at - target);
      if (d < distance) {
        distance = d;
        best = i;
      }
    });
    setIndex(best);
    setScrollable(track.scrollWidth > track.clientWidth + 1);
  }, [align]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    track.addEventListener('scroll', schedule, {passive: true});
    const observer = new ResizeObserver(schedule);
    observer.observe(track);
    schedule();
    return () => {
      track.removeEventListener('scroll', schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [measure]);

  const go = (n: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(count - 1, n));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({left: snapLeft(track, next), behavior: reduce ? 'auto' : 'smooth'});
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    // only when the track itself is focused: a before/after handle inside uses the arrows for its divider
    if (e.target !== e.currentTarget) return;
    const next =
      e.key === 'ArrowRight' ? index + 1 : e.key === 'ArrowLeft' ? index - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? count - 1 : null;
    if (next === null) return;
    e.preventDefault();
    go(next);
  };

  return (
    <div
      className={`${styles.wrap} ${className ?? ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      data-carousel={name}
      data-scrollable={scrollable}
    >
      <ul ref={trackRef} className={`${styles.track} ${trackClassName ?? ''}`} tabIndex={scrollable ? 0 : -1} onKeyDown={onKeyDown}>
        {children}
      </ul>
      {count > 1 && (
        <div className={`${styles.nav} ${navClassName ?? ''}`}>
          <button type="button" className={styles.arrow} onClick={() => go(index - 1)} aria-label={prevLabel} disabled={index === 0}>
            <IconChevron className={styles.chevronPrev} />
          </button>
          <div className={styles.dots}>
            {dotLabels.map((dotLabel, i) => (
              <button
                key={i}
                type="button"
                className={styles.dot}
                aria-label={dotLabel}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button type="button" className={styles.arrow} onClick={() => go(index + 1)} aria-label={nextLabel} disabled={index === count - 1}>
            <IconChevron className={styles.chevronNext} />
          </button>
        </div>
      )}
    </div>
  );
}
