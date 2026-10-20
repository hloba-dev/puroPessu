import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getSettings} from '@/lib/data/public';
import {getStore} from '@/lib/data/store';
import {localizedPath} from '@/lib/seo';
import {BookingConversion} from '@/components/booking/BookingConversion';
import {BookingDetails} from '@/components/booking/BookingDetails';
import {GlowButton} from '@/components/ui/GlowButton';
import {IconCalendar, IconCheck} from '@/components/ui/icons';

export const dynamic = 'force-dynamic';

export async function generateMetadata({params}: PageProps<'/[locale]/varaa-aika/kiitos/[token]'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const t = await getTranslations({locale, namespace: 'booking.success'});
  return {title: t('metaTitle'), robots: {index: false, follow: false}};
}

export default async function BookingSuccessPage({params}: PageProps<'/[locale]/varaa-aika/kiitos/[token]'>) {
  const {locale, token} = (await params) as {locale: Locale; token: string};
  setRequestLocale(locale);

  const [booking, settings, t] = await Promise.all([
    getStore().getBookingByToken(token),
    getSettings(),
    getTranslations('booking.success')
  ]);
  if (!booking) notFound();

  return (
    <section className="page-top section">
      <div className="container-x max-w-3xl">
        <span className="flex size-14 items-center justify-center rounded-full bg-teal-3 text-white">
          <IconCheck width={30} height={30} />
        </span>
        <h1 className="h2 mt-6">{t('title')}</h1>
        <p className="lead mt-3">{t('lead', {ref: booking.refCode, email: booking.email})}</p>

        <div className="mt-8">
          <BookingDetails booking={booking} locale={locale} timezone={settings.timezone} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <GlowButton externalHref={`/api/booking/${booking.manageToken}/ics`} download>
            <IconCalendar /> {t('addToCalendar')}
          </GlowButton>
          {/* plain link (full page load) so analytics never sees a client-side route change to a token URL */}
          <GlowButton
            externalHref={localizedPath({pathname: '/varaa-aika/hallinnoi/[token]', params: {token: booking.manageToken}}, locale)}
            variant="ghost"
          >
            {t('manage')}
          </GlowButton>
        </div>

        <h2 className="h3 mt-12">{t('nextTitle')}</h2>
        <ol className="mt-4 space-y-3">
          {(t.raw('next') as string[]).map((item, index) => (
            <li key={item} className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-text/8 text-sm font-semibold">
                {index + 1}
              </span>
              <span className="text-text">{item}</span>
            </li>
          ))}
        </ol>
      </div>
      <BookingConversion bookingRef={booking.refCode} valueEur={booking.totalCents / 100} />
    </section>
  );
}
