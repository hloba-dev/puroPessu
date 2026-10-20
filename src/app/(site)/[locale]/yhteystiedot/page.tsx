import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getContent} from '@/content';
import {getMunicipalityFees} from '@/lib/data/areas';
import {getActiveCatalog, getSettings} from '@/lib/data/public';
import {fill, shortHour} from '@/lib/format';
import {localBusinessLd} from '@/lib/jsonld';
import {localizedUrl, pageMetadata} from '@/lib/seo';
import {telLink, waLink} from '@/lib/site';
import {ContactForm} from '@/components/forms/ContactForm';
import {Faq} from '@/components/sections/Faq';
import {OsmMap} from '@/components/sections/OsmMap';
import {PageHero} from '@/components/sections/PageHero';
import {SectionHeader} from '@/components/sections/SectionHeader';
import {JsonLd} from '@/components/seo/JsonLd';
import {GlowButton} from '@/components/ui/GlowButton';
import {IconClock, IconMail, IconPhone, IconWhatsApp} from '@/components/ui/icons';

export const revalidate = 300;

export async function generateMetadata({params}: PageProps<'/[locale]/yhteystiedot'>): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const {contact} = await getContent(locale);
  return pageMetadata({locale, href: '/yhteystiedot', title: contact.metaTitle, description: contact.metaDescription});
}

export default async function ContactPageRoute({params}: PageProps<'/[locale]/yhteystiedot'>) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const [{contact: content}, settings, catalog, t, tp, tm] = await Promise.all([
    getContent(locale),
    getSettings(),
    getActiveCatalog(),
    getTranslations('common'),
    getTranslations('pages'),
    getTranslations('meta')
  ]);
  const hours = {from: shortHour(settings.openFrom), to: shortHour(settings.openTo)};
  const bookable = catalog.services.filter((s) => !s.isAddon && s.priceCents > 0).map((s) => s.priceCents);

  // the same name / address / phone as the footer and JSON-LD: all three read `settings`
  const channels = [
    {icon: IconPhone, label: tp('phone'), value: settings.phone, href: telLink(settings.phone)},
    {icon: IconWhatsApp, label: tp('whatsapp'), value: settings.phone, href: waLink(settings.whatsapp), external: true},
    {icon: IconMail, label: tp('email'), value: settings.email, href: `mailto:${settings.email}`}
  ];

  return (
    <>
      <PageHero crumbs={[{label: content.h1}]} title={content.h1} intro={content.intro}>
        <GlowButton href="/varaa-aika">{t('book')}</GlowButton>
      </PageHero>

      <section className="pb-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <ul className="space-y-3">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    className="glass flex items-center gap-4 p-5 transition-colors hover:border-teal-2"
                    {...(channel.external ? {rel: 'noopener', target: '_blank'} : {})}
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-soft text-teal-1">
                      <channel.icon width={22} height={22} />
                    </span>
                    <span>
                      <span className="block text-sm text-muted">{channel.label}</span>
                      <span className="text-lg font-semibold">{channel.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="glass flex items-start gap-4 p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-soft text-teal-1">
                <IconClock width={22} height={22} />
              </span>
              <div>
                <h2 className="font-semibold">{content.hoursTitle}</h2>
                <p className="mt-1 text-[15px] text-text">{fill(content.hoursText, hours)}</p>
              </div>
            </div>

            <div className="glass p-5">
              <h2 className="font-semibold">{content.billing.title}</h2>
              <address className="mt-2 text-[15px] not-italic text-text">
                {settings.legalName}
                <br />
                {settings.address.street}, {settings.address.postalCode} {settings.address.city}
                <br />
                {tp('businessId')}: {settings.yTunnus}
              </address>
              <p className="mt-3 text-[15px] text-muted">{content.billing.text}</p>
            </div>
          </div>

          <div>
            <SectionHeader title={content.form.title} lead={content.form.lead} />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface-2" aria-labelledby="contact-map">
        <div className="container-x max-w-4xl">
          <SectionHeader id="contact-map" title={content.mapTitle} />
          <div className="mt-8">
            <OsmMap
              lat={settings.baseLat}
              lng={settings.baseLng}
              title={tp('mapTitle')}
              showLabel={tp('showMap')}
              openLabel={tp('openMap')}
              note={content.mapNote}
            />
          </div>
        </div>
      </section>

      <section id="faq" className="section scroll-mt-24" aria-labelledby="contact-faq">
        <div className="container-x max-w-4xl">
          <SectionHeader id="contact-faq" title={content.faqTitle} />
          <div className="mt-8">
            <Faq items={content.faq} />
          </div>
        </div>
      </section>

      <JsonLd
        data={localBusinessLd({
          settings,
          locale,
          url: localizedUrl('/', locale),
          description: tm('defaultDescription'),
          areaServed: getMunicipalityFees(settings).map((m) => m.municipality),
          // reviews are displayed on the home page only, so the rating markup lives there
          reviews: [],
          priceFromCents: Math.min(...bookable),
          priceToCents: Math.max(...bookable)
        })}
      />
    </>
  );
}
