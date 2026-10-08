'use client';

import {useEffect, useId, useRef, useState} from 'react';
import Image from 'next/image';
import {Link, usePathname} from '@/i18n/navigation';
import type {StaticPathname} from '@/i18n/routing';
import {GlowButton} from '@/components/ui/GlowButton';
import {IconClose, IconMenu} from '@/components/ui/icons';
import {LocaleSwitcher} from './LocaleSwitcher';
import styles from './NavPill.module.css';

export interface NavLink {
  href: StaticPathname;
  label: string;
}

interface Props {
  brand: string;
  links: NavLink[];
  bookLabel: string;
  menuLabel: string;
  closeLabel: string;
  navLabel: string;
}

export function NavPill({brand, links, bookLabel, menuLabel, closeLabel, navLabel}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const pillRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!pillRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={styles.wrap}>
      <div ref={pillRef} className={styles.pill}>
        <Link href="/" className={styles.logo} onClick={close}>
          <Image src="/brand/logo-96.png" alt="" width={40} height={40} priority />
          <span>{brand}</span>
        </Link>

        <button
          ref={burgerRef}
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? closeLabel : menuLabel}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>

        <div id={panelId} className={styles.panel} data-open={open}>
          <nav aria-label={navLabel}>
            <ul className={styles.links}>
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={styles.link}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    onClick={close}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.actions}>
            <LocaleSwitcher />
            <GlowButton href="/varaa-aika" size="nav" onClick={close}>
              {bookLabel}
            </GlowButton>
          </div>
        </div>
      </div>
    </header>
  );
}
