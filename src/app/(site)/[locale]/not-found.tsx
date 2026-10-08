import {getTranslations} from 'next-intl/server';
import {GlowButton} from '@/components/ui/GlowButton';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <section className="container-x page-top section text-center">
      <p className="eyebrow">404</p>
      <h1 className="h2 mt-3">{t('title')}</h1>
      <p className="lead mx-auto mt-4">{t('text')}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <GlowButton href="/">{t('home')}</GlowButton>
        <GlowButton href="/varaa-aika" variant="ghost">
          {t('book')}
        </GlowButton>
      </div>
    </section>
  );
}
