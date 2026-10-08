import type {CSSProperties} from 'react';
import {Montserrat, Playfair_Display, Poppins} from 'next/font/google';

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
  variable: '--font-poppins'
});

// Poppins has no Cyrillic: Montserrat fills in for Russian and is only downloaded when Cyrillic text is on the page.
export const montserrat = Montserrat({
  subsets: ['cyrillic'],
  display: 'swap',
  preload: false,
  variable: '--font-cyrillic'
});

export const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['600'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
  variable: '--font-accent'
});

export const fontVariables = `${poppins.variable} ${montserrat.variable} ${playfair.variable}`;

/**
 * next/font appends an automatic "Poppins Fallback" (an Arial alias) to the Poppins stack. Arial has
 * Cyrillic, so in a plain stack it would swallow Russian text before Montserrat is ever reached.
 * The body stack is therefore built from the bare Poppins family + a Latin-only fallback declared in
 * globals.css + Montserrat (see --font-sans there). Set this on <html style>.
 */
export const fontFamilies = {
  '--font-latin': poppins.style.fontFamily.split(',')[0].trim(),
  '--font-cyr': montserrat.style.fontFamily
} as CSSProperties;
