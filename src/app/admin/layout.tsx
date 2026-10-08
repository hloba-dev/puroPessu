import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {fontFamilies, fontVariables} from '@/app/fonts';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {default: 'Puro — админка', template: '%s — Puro'},
  robots: {index: false, follow: false}
};

// The admin panel is its own root layout: Russian UI, no public header or footer, never indexed.
export default function AdminRootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="ru" className={fontVariables} style={fontFamilies} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
