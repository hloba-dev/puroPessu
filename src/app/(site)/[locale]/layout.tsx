import type {Metadata, Viewport} from 'next';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {getSettings} from '@/lib/data/public';
import {shortHour} from '@/lib/format';
import {SITE_URL} from '@/lib/site';
import {consentDefaultScript} from '@/lib/consent';
import {fontFamilies, fontVariables} from '@/app/fonts';
import {Header} from '@/components/layout/Header';
import {Footer} from '@/components/layout/Footer';
import {StickyBar} from '@/components/layout/StickyBar';
import {CookieBanner} from '@/components/layout/CookieBanner';
import {Analytics} from '@/components/layout/Analytics';
import {GoogleTagManager, GoogleTagManagerNoScript} from '@/components/layout/GoogleTagManager';
import '@/app/globals.css';

// UI strings needed by client components on every page
const CLIENT_NAMESPACES = ['nav', 'cookie', 'common', 'beforeAfter', 'forms'] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const viewport: Viewport = {
  themeColor: '#faf7f2',
  colorScheme: 'light'
};

export async function generateMetadata({params}: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const [t, settings] = await Promise.all([getTranslations({locale, namespace: 'meta'}), getSettings()]);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('defaultTitle', {from: shortHour(settings.openFrom), to: shortHour(settings.openTo)}),
      template: '%s | Puro'
    },
    description: t('defaultDescription'),
    applicationName: 'Puro',
    formatDetection: {telephone: false}
  };
}

export default async function LocaleLayout({children, params}: LayoutProps<'/[locale]'>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [messages, t] = await Promise.all([getMessages(), getTranslations('common')]);
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]])
  );

  return (
    // the inline consent script adds data-consent to <html> before hydration (returning visitors)
    // and sets the Consent Mode defaults, so it has to stay above the Tag Manager loader
    // data-scroll-behavior: Next 16 only neutralises the smooth scrolling of globals.css during route
    // transitions when the page opts in; without it a navigation from far down a page can stay scrolled
    <html lang={locale} className={fontVariables} style={fontFamilies} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: consentDefaultScript}} />
        <GoogleTagManager />
      </head>
      <body>
        <GoogleTagManagerNoScript />
        <NextIntlClientProvider messages={clientMessages}>
          <a href="#content" className="skip-link">
            {t('skip')}
          </a>
          <Header />
          <main id="content" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <StickyBar />
          <CookieBanner />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
