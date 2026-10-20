import {getTranslations} from 'next-intl/server';
import {getSettings} from '@/lib/data/public';
import {waLink} from '@/lib/site';
import {GlowButton} from '@/components/ui/GlowButton';
import {IconWhatsApp} from '@/components/ui/icons';

interface Props {
  title: string;
  text?: string;
  /** booking deep link: adds this service to the cart */
  item?: string;
}

export async function CtaBand({title, text, item}: Props) {
  const [t, settings] = await Promise.all([getTranslations('common'), getSettings()]);

  return (
    <section className="section">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[28px] border border-hairline bg-surface px-6 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_120%,rgba(14,124,148,.16),transparent_70%)]"
          />
          <div className="relative">
            <h2 className="h2 mx-auto max-w-3xl">{title}</h2>
            {text && <p className="lead mx-auto mt-4">{text}</p>}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <GlowButton href={item ? {pathname: '/varaa-aika', query: {item}} : '/varaa-aika'}>{t('book')}</GlowButton>
              <GlowButton externalHref={waLink(settings.whatsapp)} variant="ghost" rel="noopener" target="_blank">
                <IconWhatsApp /> {t('askWhatsApp')}
              </GlowButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
