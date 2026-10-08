import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getSettings} from '@/lib/data/public';
import {telLink, waLink} from '@/lib/site';
import {IconCalendar, IconPhone, IconWhatsApp} from '@/components/ui/icons';
import styles from './StickyBar.module.css';

/** Mobile bottom bar (WhatsApp · call · book) and the floating WhatsApp button on larger screens. */
export async function StickyBar() {
  const [t, settings] = await Promise.all([getTranslations('sticky'), getSettings()]);
  const wa = waLink(settings.whatsapp, t('waText'));

  return (
    <>
      <nav aria-label={t('label')} className={styles.bar} data-sticky-bar>
        <a href={wa} className={styles.item} rel="noopener" target="_blank">
          <IconWhatsApp width={22} height={22} className="text-[#3fe07a]" />
          WhatsApp
        </a>
        <a href={telLink(settings.phone)} className={styles.item}>
          <IconPhone width={22} height={22} className="text-cyan-2" />
          {t('call')}
        </a>
        <Link href="/varaa-aika" className={`${styles.item} ${styles.primary}`}>
          <IconCalendar width={22} height={22} />
          <span>
            {t('book')}
            <small>{t('online')}</small>
          </span>
        </Link>
      </nav>

      <a href={wa} className={styles.fab} rel="noopener" target="_blank" aria-label={t('waLabel')} data-wa-fab>
        <IconWhatsApp width={28} height={28} />
      </a>
    </>
  );
}
