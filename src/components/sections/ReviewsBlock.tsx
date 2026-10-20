import {getTranslations} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {formatDate} from '@/lib/format';
import type {Review, Settings} from '@/lib/types';
import {IconStar} from '@/components/ui/icons';
import {SectionHeader} from './SectionHeader';

/** Only real, published reviews are rendered; with none (and no Google link) the whole section is omitted. */
export async function ReviewsBlock({reviews, settings, locale}: {reviews: Review[]; settings: Settings; locale: Locale}) {
  const googleUrl = settings.social.googleReviews;
  if (reviews.length === 0 && !googleUrl) return null;
  const t = await getTranslations('reviews');
  // reviews in the visitor's language first
  const sorted = [...reviews].sort((a, b) => Number(b.locale === locale) - Number(a.locale === locale)).slice(0, 4);

  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader eyebrow={t('eyebrow')} title={t('title')} />
        {sorted.length > 0 && (
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {sorted.map((review) => (
              <li key={review.id} className="glass p-6">
                <p className="flex gap-0.5 text-star" role="img" aria-label={t('rating', {rating: review.rating})}>
                  {Array.from({length: review.rating}, (_, i) => (
                    <IconStar key={i} width={18} height={18} />
                  ))}
                </p>
                <blockquote className="mt-3 text-text" lang={review.locale}>
                  {review.text}
                </blockquote>
                <p className="mt-4 text-sm text-muted">
                  {review.author} · {formatDate(review.date, locale, {month: 'long', year: 'numeric'})}
                </p>
              </li>
            ))}
          </ul>
        )}
        {googleUrl && (
          <p className="mt-8">
            <a href={googleUrl} className="link" rel="noopener" target="_blank">
              {t('google')}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
