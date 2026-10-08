import type {Locale} from '@/i18n/routing';

export type ArticleCategory = 'tahrat' | 'hajut' | 'materiaalit' | 'patjat' | 'yrityksille';

export interface ArticleEntry {
  /** File name in content/{locale}/{id}.mdx */
  id: string;
  slugs: Record<Locale, string>;
  category: ArticleCategory;
  /** ISO date */
  published: string;
  updated?: string;
}

/** Registry of blog articles: the single place that maps an article to its per-locale URL slug. */
export const articles: ArticleEntry[] = [
  {
    id: 'punaviinitahra',
    category: 'tahrat',
    published: '2026-09-02',
    slugs: {fi: 'punaviinitahra-sohvassa', ru: 'pyatno-ot-krasnogo-vina-na-divane', en: 'red-wine-stain-on-sofa'}
  },
  {
    id: 'kahvitahra',
    category: 'tahrat',
    published: '2026-09-04',
    slugs: {fi: 'kahvitahra-sohvassa', ru: 'pyatno-ot-kofe-na-divane', en: 'coffee-stain-on-sofa'}
  },
  {
    id: 'koiran-haju',
    category: 'hajut',
    published: '2026-09-08',
    slugs: {fi: 'koiran-haju-sohvassa', ru: 'zapah-sobaki-na-divane', en: 'dog-smell-in-sofa'}
  },
  {
    id: 'polypunkit',
    category: 'patjat',
    published: '2026-09-10',
    slugs: {fi: 'polypunkit-patjassa', ru: 'pylevye-kleshchi-v-matrase', en: 'dust-mites-in-mattress'}
  },
  {
    id: 'kuinka-usein',
    category: 'materiaalit',
    published: '2026-09-14',
    slugs: {fi: 'kuinka-usein-sohva-pestaan', ru: 'kak-chasto-chistit-divan', en: 'how-often-to-clean-a-sofa'}
  },
  {
    id: 'nahkasohvan-hoito',
    category: 'materiaalit',
    published: '2026-09-16',
    slugs: {fi: 'nahkasohvan-hoito', ru: 'uhod-za-kozhanym-divanom', en: 'leather-sofa-care'}
  },
  {
    id: 'pesuohjelappu',
    category: 'materiaalit',
    published: '2026-09-18',
    slugs: {fi: 'pesuohjelappu-w-s-ws-x', ru: 'markirovka-obivki-w-s-ws-x', en: 'upholstery-cleaning-codes-w-s-ws-x'}
  },
  {
    id: 'suojakasittely',
    category: 'materiaalit',
    published: '2026-09-22',
    slugs: {fi: 'suojakasittely-kannattaako', ru: 'zashchitnaya-propitka-stoit-li', en: 'is-fabric-protection-worth-it'}
  },
  {
    id: 'vuokrapesuri',
    category: 'yrityksille',
    published: '2026-09-25',
    slugs: {
      fi: 'tekstiilipesurin-vuokraus-mita-kannattaa-tietaa',
      ru: 'arenda-moyushchego-pylesosa-chto-nuzhno-znat',
      en: 'renting-an-upholstery-cleaner-what-to-know'
    }
  },
  {
    id: 'vaalea-sohva',
    category: 'tahrat',
    published: '2026-09-29',
    slugs: {fi: 'vaalean-sohvan-puhdistus', ru: 'chistka-svetlogo-divana', en: 'cleaning-a-light-coloured-sofa'}
  }
];

export function findArticleBySlug(locale: Locale, slug: string) {
  return articles.find((a) => a.slugs[locale] === slug);
}
