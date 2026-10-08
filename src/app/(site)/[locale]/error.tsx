'use client';

import {useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {GlowButton} from '@/components/ui/GlowButton';

export default function ErrorPage({error, reset}: {error: Error & {digest?: string}; reset: () => void}) {
  const t = useTranslations('common.error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-x page-top section text-center">
      <p className="eyebrow">500</p>
      <h1 className="h2 mt-3">{t('title')}</h1>
      <p className="lead mx-auto mt-4">{t('text')}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <GlowButton onClick={reset}>{t('retry')}</GlowButton>
        <GlowButton href="/" variant="ghost">
          {t('home')}
        </GlowButton>
      </div>
    </section>
  );
}
