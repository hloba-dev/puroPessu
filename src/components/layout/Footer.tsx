import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {StaticPathname} from '@/i18n/routing';
import {getActiveCatalog, getSettings} from '@/lib/data/public';
import {shortHour} from '@/lib/format';
import {telLink, waLink} from '@/lib/site';
import {IconClock, IconMail, IconPhone, IconWhatsApp} from '@/components/ui/icons';
import {CookieSettingsButton} from './CookieBanner';

export async function Footer() {
  const [t, nav, settings, catalog] = await Promise.all([
    getTranslations('footer'),
    getTranslations('nav'),
    getSettings(),
    getActiveCatalog()
  ]);
  const has = (slug: string) => catalog.categories.some((c) => c.slug === slug);

  const services: {href: StaticPathname; label: string}[] = [
    {href: '/sohvan-pesu', label: t('links.sofa')},
    {href: '/nahkasohvan-puhdistus', label: t('links.leather')},
    {href: '/patjan-pesu', label: t('links.mattress')},
    {href: '/hajunpoisto', label: t('links.odor')},
    ...(has('vehicles') ? [{href: '/auton-verhoilupesu' as const, label: t('links.car')}] : []),
    ...(has('boats') ? [{href: '/veneen-tekstiilit' as const, label: t('links.boat')}] : []),
    {href: '/yrityksille', label: nav('business')},
    {href: '/lahjakortti', label: t('links.giftCard')}
  ];
  const info: {href: StaticPathname; label: string}[] = [
    {href: '/hinnasto', label: nav('prices')},
    {href: '/varaa-aika', label: nav('book')},
    {href: '/tietoa-meista', label: nav('about')},
    {href: '/vinkit', label: nav('tips')},
    {href: '/vuokrapesuri-vai-ammattilainen', label: t('links.compare')},
    {href: '/hoitotuotteet', label: t('links.careProducts')},
    {href: '/yhteystiedot', label: nav('contact')}
  ];
  const social = [
    {href: settings.social.facebook, label: 'Facebook'},
    {href: settings.social.instagram, label: 'Instagram'},
    {href: settings.social.googleReviews, label: t('googleReviews')}
  ].filter((s) => s.href);

  const linkCls = 'text-[15px] text-muted transition-colors hover:text-text';

  return (
    <footer className="on-dark border-t border-hairline bg-bg">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center gap-3 text-xl font-bold">
            <Image src="/brand/logo-96.png" alt="" width={48} height={48} />
            {settings.companyName}
          </Link>
          <p className="mt-4 max-w-xs text-[15px] text-muted">{t('tagline')}</p>
          {social.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-4">
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className={linkCls} rel="noopener" target="_blank">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label={t('servicesTitle')}>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white">{t('servicesTitle')}</h2>
          <ul className="mt-4 space-y-2.5">
            {services.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t('infoTitle')}>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white">{t('infoTitle')}</h2>
          <ul className="mt-4 space-y-2.5">
            {info.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white">{t('contactTitle')}</h2>
          <ul className="mt-4 space-y-3 text-[15px]">
            <li>
              <a href={telLink(settings.phone)} className="flex items-center gap-2.5 hover:text-teal-1">
                <IconPhone className="text-teal-2" /> {settings.phone}
              </a>
            </li>
            <li>
              <a href={waLink(settings.whatsapp)} className="flex items-center gap-2.5 hover:text-teal-1" rel="noopener" target="_blank">
                <IconWhatsApp className="text-teal-2" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 hover:text-teal-1">
                <IconMail className="text-teal-2" /> {settings.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-muted">
              <IconClock className="text-teal-2" /> {t('hours', {from: shortHour(settings.openFrom), to: shortHour(settings.openTo)})}
            </li>
          </ul>
          <address className="mt-4 text-[15px] not-italic text-muted">
            {settings.legalName}
            <br />
            {settings.address.street}, {settings.address.postalCode} {settings.address.city}
            <br />
            {t('businessId')}: {settings.yTunnus}
          </address>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="container-x flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5 text-sm text-muted">
          <p>
            © {new Date().getFullYear()} {settings.legalName}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/tietosuoja" className="hover:text-text">
                {t('links.privacy')}
              </Link>
            </li>
            <li>
              <Link href="/tietojen-poisto" className="hover:text-text">
                {t('links.dataDeletion')}
              </Link>
            </li>
            <li>
              <CookieSettingsButton className="hover:text-text">{t('cookieSettings')}</CookieSettingsButton>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
