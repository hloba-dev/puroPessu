'use client';

import {useRef, useState} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {IconDrag} from '@/components/ui/icons';
import styles from './BeforeAfter.module.css';

interface Props {
  before: string;
  after: string;
  /** Furniture type shown under the slider and used in the accessible name */
  caption: string;
  /** Only for the slider above the fold (hero): preloads the images instead of lazy-loading them */
  priority?: boolean;
  sizes?: string;
  /** Show the "drag the bar" hint until the first interaction */
  hint?: boolean;
  className?: string;
}

const STEP = 5;
const clamp = (value: number) => Math.min(100, Math.max(0, value));

export function BeforeAfter({before, after, caption, priority = false, sizes, hint = false, className}: Props) {
  const t = useTranslations('beforeAfter');
  // position of the divider in % from the left: "before" is to the left of it, "after" to the right
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  // px from the pointer to the divider when a drag starts on the handle: the handle then follows the
  // finger instead of jumping under it
  const grabOffset = useRef(0);

  const moveTo = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPos(clamp(((clientX + grabOffset.current - rect.left) / rect.width) * 100));
    setTouched(true);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const onHandle = handleRef.current?.contains(e.target as Node) ?? false;
    // a finger (or pen) only drags the handle: a touch anywhere else on the photo scrolls the page
    // like the rest of it, so flicking through the page never moves the divider
    if (!onHandle && e.pointerType !== 'mouse') return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    grabOffset.current = onHandle ? rect.left + (rect.width * pos) / 100 - e.clientX : 0;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const next =
      e.key === 'ArrowLeft' || e.key === 'ArrowDown'
        ? pos - STEP
        : e.key === 'ArrowRight' || e.key === 'ArrowUp'
          ? pos + STEP
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? 100
              : null;
    if (next === null) return;
    e.preventDefault();
    setPos(clamp(next));
    setTouched(true);
  };

  const imageSizes = sizes ?? '(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 560px';

  return (
    <figure className={className}>
      <div
        ref={frameRef}
        className={styles.frame}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <Image
          src={before}
          alt={`${caption} — ${t('before')}`}
          fill
          sizes={imageSizes}
          priority={priority}
          draggable={false}
          className={styles.img}
        />
        <div className={styles.after} style={{clipPath: `inset(0 0 0 ${pos}%)`}}>
          <Image
            src={after}
            alt={`${caption} — ${t('after')}`}
            fill
            sizes={imageSizes}
            priority={priority}
            draggable={false}
            className={styles.img}
          />
        </div>

        <span className={`${styles.tag} ${styles.tagBefore}`} aria-hidden="true">
          {t('before')}
        </span>
        <span className={`${styles.tag} ${styles.tagAfter}`} aria-hidden="true">
          {t('after')}
        </span>

        <div className={styles.divider} style={{left: `${pos}%`}}>
          <div
            ref={handleRef}
            role="slider"
            tabIndex={0}
            aria-label={t('label', {item: caption})}
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(100 - pos)}
            aria-valuetext={t('valueText', {percent: Math.round(100 - pos)})}
            className={styles.handle}
            onKeyDown={onKeyDown}
          >
            <IconDrag width={22} height={22} />
          </div>
        </div>

        {hint && !touched && <p className={styles.hint}>{t('hint')}</p>}
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
