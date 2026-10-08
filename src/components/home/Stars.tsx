'use client';

import {useEffect, useState} from 'react';
import styles from './Hero.module.css';

function field(count: number) {
  return Array.from({length: count}, () => {
    const x = (Math.random() * 100).toFixed(2);
    const y = (Math.random() * 100).toFixed(2);
    const alpha = (0.3 + Math.random() * 0.65).toFixed(2);
    return `${x}vw ${y}svh 0 0 rgba(255,255,255,${alpha})`;
  }).join(',');
}

/** Star field: two 1px/2px dots multiplied with box-shadow. Generated on the client so the HTML stays cacheable. */
export function Stars() {
  const [shadows, setShadows] = useState<{small: string; large: string} | null>(null);

  useEffect(() => {
    // Random positions must not be rendered on the server (hydration mismatch), hence the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShadows({small: field(150), large: field(18)});
  }, []);

  return (
    <div className={styles.stars} aria-hidden="true">
      <div className={styles.starSmall} style={{boxShadow: shadows?.small}} />
      <div className={styles.starLarge} style={{boxShadow: shadows?.large}} />
    </div>
  );
}
