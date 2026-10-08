'use client';

import {useEffect, useRef, type ReactNode} from 'react';

/**
 * Pauses the CSS ring animation while the hero is off screen or the tab is hidden.
 * Pausing (instead of letting the timeline run) means the ring resumes exactly where it stopped — no jump.
 * prefers-reduced-motion is handled in CSS (the animation is removed entirely).
 */
export function RingMotion({className, children}: {className?: string; children: ReactNode}) {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className={className} data-paused="false" aria-hidden="true">
      {children}
    </div>
  );
}
