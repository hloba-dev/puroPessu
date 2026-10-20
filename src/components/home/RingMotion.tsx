'use client';

import {useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode} from 'react';
import {IconChevron} from '@/components/ui/icons';

interface Props {
  className?: string;
  /** the masked 3D viewport around the ring (aria-hidden: the ring is decorative) */
  clipClassName?: string;
  arrowClassName?: string;
  prevLabel: string;
  nextLabel: string;
  children: ReactNode;
}

/**
 * The 3D ring of before/after cards (wide screens).
 * - Pauses the CSS spin while the hero is off screen or the tab is hidden, so it resumes where it stopped.
 * - The arrows and ← → turn the ring by one card: `--turn` is read by the CSS transform.
 * prefers-reduced-motion is handled in CSS (the spin is removed entirely).
 */
export function RingMotion({className, clipClassName, arrowClassName, prevLabel, nextLabel, children}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let inView = true;
    const apply = () => {
      el.dataset.paused = String(!inView || document.hidden);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        apply();
      },
      {threshold: 0.05}
    );
    observer.observe(el);
    apply();
    document.addEventListener('visibilitychange', apply);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', apply);
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    setTurn((t) => t + (e.key === 'ArrowRight' ? 1 : -1));
  };

  return (
    <div
      ref={ref}
      className={className}
      data-paused="false"
      data-turn={turn}
      style={{'--turn': turn} as CSSProperties}
      onKeyDown={onKeyDown}
    >
      <div className={clipClassName} aria-hidden="true">
        {children}
      </div>
      <button type="button" className={arrowClassName} data-dir="prev" aria-label={prevLabel} onClick={() => setTurn((t) => t - 1)}>
        <IconChevron style={{rotate: '90deg'}} />
      </button>
      <button type="button" className={arrowClassName} data-dir="next" aria-label={nextLabel} onClick={() => setTurn((t) => t + 1)}>
        <IconChevron style={{rotate: '-90deg'}} />
      </button>
    </div>
  );
}
