import type {Metadata} from 'next';
import {fontFamilies, fontVariables} from './fonts';
import {SITE_URL} from '@/lib/site';
import {consentDefaultScript} from '@/lib/consent';
import {GoogleTagManager, GoogleTagManagerNoScript} from '@/components/layout/GoogleTagManager';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '404 — Sivua ei löytynyt | Puro',
  robots: {index: false, follow: false}
};

// Served for URLs that match no route at all, so it cannot know the locale: all three languages are shown.
const copy = [
  {lang: 'fi', title: 'Sivua ei löytynyt', text: 'Etsimääsi sivua ei ole tai se on siirretty.', home: 'Etusivulle', href: '/'},
  {lang: 'ru', title: 'Страница не найдена', text: 'Такой страницы нет или она была перемещена.', home: 'На главную', href: '/ru'},
  {lang: 'en', title: 'Page not found', text: 'The page you are looking for does not exist or has moved.', home: 'Back to home', href: '/en'}
];

export default function GlobalNotFound() {
  return (
    <html lang="fi" className={fontVariables} style={fontFamilies} suppressHydrationWarning>
      <head>
        {/* same order as the site layout: Consent Mode defaults first, then the Tag Manager loader */}
        <script dangerouslySetInnerHTML={{__html: consentDefaultScript}} />
        <GoogleTagManager />
      </head>
      <body>
        <GoogleTagManagerNoScript />
        <main className="container-x section flex min-h-svh flex-col justify-center">
          <p className="eyebrow">404</p>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {copy.map((c) => (
              <section key={c.lang} lang={c.lang}>
                <h1 className="h3">{c.title}</h1>
                <p className="mt-2 text-muted">{c.text}</p>
                {/* Plain anchors: this page renders outside the app layout and its router context. */}
                <a href={c.href} className="link mt-3 inline-block">
                  {c.home}
                </a>
              </section>
            ))}
          </div>
        </main>
      </body>
    </html>
  );
}
