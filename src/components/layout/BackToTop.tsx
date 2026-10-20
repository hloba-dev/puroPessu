'use client';

import {useEffect, useState} from 'react';
import {IconChevron} from '@/components/ui/icons';
import styles from './BackToTop.module.css';

/** Appears after two screens of scrolling; sits above the phone bottom bar / next to the WhatsApp button. */
export function BackToTop({label}: {label: string}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setShown(window.scrollY > window.innerHeight * 2));
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      className={styles.btn}
      data-shown={shown}
      data-back-to-top
      aria-label={label}
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      onClick={() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({top: 0, behavior: reduce ? 'auto' : 'smooth'});
      }}
    >
      <IconChevron style={{rotate: '180deg'}} />
    </button>
  );
}
