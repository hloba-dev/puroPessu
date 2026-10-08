import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getSettings} from '@/lib/data/public';
import {getStore} from '@/lib/data/store';
import {isUpcoming} from '@/lib/booking/tz';
import {telLink} from '@/lib/site';
import {BookingDetails} from '@/components/booking/BookingDetails';
import {ManageBooking} from '@/components/booking/ManageBooking';
import {GlowButton} from '@/components/ui/GlowButton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({params}: PageProps<'/[locale]/varaa-aika/hallinnoi/[token]'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const t = await getTranslations({locale, namespace: 'booking.manage'});
  return {title: t('metaTitle'), robots: {index: false, follow: false}};
}

export default async function ManageBookingPage({params}: PageProps<'/[locale]/varaa-aika/hallinnoi/[token]'>) {
  const {locale, token} = (await params) as {locale: Locale; token: string};
  setRequestLocale(locale);

  const [booking, settings, t, messages] = await Promise.all([
    getStore().getBookingByToken(token),
    getSettings(),
    getTranslations('booking.manage'),
    getMessages()
  ]);

  if (!booking) {
    return (
      <section className="page-top section">
        <div className="container-x max-w-3xl">
          <h1 className="h2">{t('metaTitle')}</h1>
          <p className="lead mt-4">{t('notFound')}</p>
          <div className="mt-8">
            <GlowButton externalHref={telLink(settings.phone)} variant="ghost">
              {settings.phone}
            </GlowButton>
          </div>
        </div>
      </section>
    );
  }

  const active = booking.status === 'pending' || booking.status === 'confirmed';
  const upcoming = isUpcoming(booking.startsAt);

  return (
    <section className="page-top section">
      <div className="container-x max-w-3xl">
        <h1 className="h2">{t('title', {ref: booking.refCode})}</h1>
        <div className="mt-8">
          <BookingDetails booking={booking} locale={locale} timezone={settings.timezone} />
        </div>

        {active && upcoming ? (
          <NextIntlClientProvider messages={{booking: messages.booking, forms: messages.forms}}>
            <ManageBooking token={booking.manageToken} durationMin={booking.durationMin} timezone={settings.timezone} />
          </NextIntlClientProvider>
        ) : (
          booking.status !== 'cancelled' && <p className="mt-6 text-muted">{t('locked')}</p>
        )}
      </div>
    </section>
  );
}
