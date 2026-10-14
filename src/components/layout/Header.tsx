import {getTranslations} from 'next-intl/server';
import {getSettings} from '@/lib/data/public';
import {NavPill, type NavLink} from './NavPill';

export async function Header() {
  const [t, ts, settings] = await Promise.all([getTranslations('nav'), getTranslations('sticky'), getSettings()]);

  const links: NavLink[] = [
    {href: '/palvelut', label: t('services')},
    {href: '/hinnasto', label: t('prices')},
    {href: '/yrityksille', label: t('business')},
    {href: '/tietoa-meista', label: t('about')},
    {href: '/vinkit', label: t('tips')},
    {href: '/yhteystiedot', label: t('contact')}
  ];

  return (
    <NavPill
      brand={settings.companyName}
      links={links}
      bookLabel={t('book')}
      phone={settings.phone}
      callLabel={ts('call')}
      menuLabel={t('openMenu')}
      closeLabel={t('closeMenu')}
      navLabel={t('main')}
    />
  );
}
