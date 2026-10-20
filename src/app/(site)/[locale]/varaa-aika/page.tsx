import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {cartFromQuery} from '@/lib/booking/cart';
import {getActiveCatalog, getSettings} from '@/lib/data/public';
import {isDemoMode} from '@/lib/data/store';
import {shortHour} from '@/lib/format';
import {pageMetadata} from '@/lib/seo';
import {waLink} from '@/lib/site';
import {BookingWizard} from '@/components/booking/BookingWizard';
import {Breadcrumbs} from '@/components/sections/Breadcrumbs';
import {Faq, type FaqItem} from '@/components/sections/Faq';

export async function generateMetadata({params}: PageProps<'/[locale]/varaa-aika'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const [t, settings] = await Promise.all([getTranslations({locale, namespace: 'booking'}), getSettings()]);
  return pageMetadata({
    locale,
    href: '/varaa-aika',
    title: t('metaTitle'),
    description: t('metaDescription', {from: shortHour(settings.openFrom), to: shortHour(settings.openTo)}),
    ownOgImage: true
  });
}

export default async function BookingPage({params, searchParams}: PageProps<'/[locale]/varaa-aika'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const {item, items} = await searchParams;
  const initialCart = cartFromQuery(item, items);

  const [t, messages, catalog, settings] = await Promise.all([
    getTranslations('booking'),
    getMessages(),
    getActiveCatalog(),
    getSettings()
  ]);
  const clientMessages = {
    booking: messages.booking,
    prices: messages.prices,
    forms: messages.forms,
    common: messages.common
  };

  return (
    <>
      <section className="page-top pb-16">
        <div className="container-x">
          <Breadcrumbs items={[{label: t('title')}]} />
          <h1 className="h2 mt-5">{t('title')}</h1>
          <p className="lead mt-3">{t('lead')}</p>
          {isDemoMode && (
            <p className="mt-4 rounded-xl border border-warn-border bg-warn-soft px-4 py-3 text-sm text-warn">{t('demo')}</p>
          )}
          <div className="mt-10">
            <NextIntlClientProvider messages={clientMessages}>
              <BookingWizard
                locale={locale}
                catalog={catalog}
                minOrderCents={settings.minOrderCents}
                promotions={settings.promotions}
                timezone={settings.timezone}
                whatsappUrl={waLink(settings.whatsapp)}
                initialCart={initialCart}
              />
            </NextIntlClientProvider>
          </div>
        </div>
      </section>

      <section className="section bg-surface-2" aria-labelledby="booking-faq">
        <div className="container-x max-w-4xl">
          <h2 id="booking-faq" className="h2">
            {t('faq.title')}
          </h2>
          <div className="mt-8">
            <Faq items={t.raw('faq.items') as FaqItem[]} />
          </div>
        </div>
      </section>
    </>
  );
}
