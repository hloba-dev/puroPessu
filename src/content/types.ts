/**
 * Shapes of the long-form page copy in src/content/{fi,ru,en}/.
 * UI strings (buttons, form labels, errors) live in messages/*.json instead.
 *
 * Placeholders such as {price} are filled by the page from the database / settings —
 * copy must never hard-code a Puro price, phone number, e-mail or opening hours.
 */

export interface Faq {
  q: string;
  a: string;
}

export interface TitleText {
  title: string;
  text: string;
}

export interface Cta {
  title: string;
  text: string;
}

/**
 * Service landing page (sofa, leather, mattress, car, boat).
 * Placeholders: {price} = cheapest price of the page's category ("50 €"), {min} = minimum order ("90 €"),
 * {from}/{to} = opening hours ("6" / "21").
 */
export interface ServiceLanding {
  /** ≤ 60 characters before " | Puro"; pattern "Service City — alk. {price}, paikan päällä" */
  metaTitle: string;
  /** 140–160 characters */
  metaDescription: string;
  breadcrumb: string;
  badge: string;
  /** contains the main keyword and the city */
  h1: string;
  intro: string;
  prices: {title: string; lead: string; note: string};
  gallery: {title: string; lead: string};
  /** honest promise about stains */
  promise: {title: string; paragraphs: string[]};
  why: {title: string; items: TitleText[]};
  process: {title: string; steps: TitleText[]};
  /** odor section; `insurance` = written statement for an insurance company on request */
  odor: {title: string; lead: string; cases: TitleText[]; insurance: string; linkLabel: string};
  materials: {
    title: string;
    lead: string;
    suitable: TitleText[];
    exceptionsTitle: string;
    exceptions: TitleText[];
  };
  /** rental machine vs professional, short table; the full page is /vuokrapesuri-vai-ammattilainen */
  compare: {
    title: string;
    lead: string;
    headers: {aspect: string; rental: string; pro: string};
    rows: {aspect: string; rental: string; pro: string}[];
    linkLabel: string;
  };
  areaTitle: string;
  areaLead: string;
  faqTitle: string;
  /** 9 questions */
  faq: Faq[];
  cta: Cta;
}

/** /palvelut — overview with one anchored section per service category. */
export interface ServicesPage {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** keyed by category slug */
  sections: Record<
    'sofas' | 'leather' | 'chairs' | 'beds' | 'odor' | 'vehicles' | 'boats' | 'other',
    {title: string; text: string; bullets: string[]}
  >;
  moreLabel: string;
  process: {title: string; steps: TitleText[]};
  faqTitle: string;
  faq: Faq[];
  cta: Cta;
}

/** /hajunpoisto */
export interface OdorPage {
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  badge: string;
  h1: string;
  intro: string;
  /** where smells come from: pet, urine, vomit, tobacco, damp, milk/food … */
  sources: {title: string; lead: string; items: TitleText[]};
  method: {title: string; lead: string; steps: TitleText[]};
  /** what odor removal cannot do (e.g. urine soaked through the foam, mould inside the frame) */
  honest: {title: string; paragraphs: string[]};
  insurance: {title: string; text: string};
  included: {title: string; text: string};
  faqTitle: string;
  faq: Faq[];
  cta: Cta;
}

/** /hinnasto — the price rows themselves come from the database. Placeholders: {min}, {price}. */
export interface PricingPage {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  rules: {title: string; items: TitleText[]};
  travel: {title: string; lead: string};
  photoHint: string;
  faqTitle: string;
  faq: Faq[];
  cta: Cta;
}

/** /yrityksille */
export interface BusinessPage {
  metaTitle: string;
  metaDescription: string;
  badge: string;
  h1: string;
  intro: string;
  method: {title: string; paragraphs: string[]};
  /** ids are URL anchors and must stay exactly as typed */
  segments: {id: 'toimistot' | 'hotellit-ravintolat' | 'terveydenhuolto'; title: string; text: string; bullets: string[]}[];
  prices: {title: string; lead: string; note: string};
  /** worked contract example; placeholders {chairs} {chairPrice} {sofaPrice} {total} {times} are computed from the database */
  example: {title: string; lead: string; lines: string[]; total: string; note: string};
  terms: {title: string; items: TitleText[]};
  form: {title: string; lead: string};
  faqTitle: string;
  /** 7 questions */
  faq: Faq[];
}

/** /lahjakortti. Placeholder {months} = validity in months. */
export interface GiftCardPage {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  how: {title: string; steps: TitleText[]};
  options: {title: string; lead: string; custom: string};
  terms: {title: string; items: string[]};
  form: {title: string; lead: string};
  faqTitle: string;
  faq: Faq[];
}

/** /tietoa-meista — no invented history: no founding years, staff names, customer counts or awards. */
export interface AboutPage {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  story: {title: string; paragraphs: string[]};
  values: {title: string; items: TitleText[]};
  method: {title: string; paragraphs: string[]};
  /** short fact tiles; placeholders {from} {to} {min} */
  facts: TitleText[];
  cta: Cta;
}

/** /yhteystiedot */
export interface ContactPage {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  form: {title: string; lead: string};
  hoursTitle: string;
  /** placeholders {from} {to} */
  hoursText: string;
  mapTitle: string;
  mapNote: string;
  billing: {title: string; text: string};
  faqTitle: string;
  /** 10–12 general questions: drying, stains, preparation, pets and children, payment, materials, guarantee … */
  faq: Faq[];
}

/**
 * /tietosuoja. Placeholders filled from settings:
 * {company} {yTunnus} {address} {email} {phone}
 */
export interface LegalPage {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** ISO date of the last update */
  updated: string;
  updatedLabel: string;
  intro: string;
  sections: {title: string; paragraphs?: string[]; bullets?: string[]}[];
}

/** /tietojen-poisto */
export interface DeletionPage {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  paragraphs: string[];
  steps: {title: string; items: string[]};
  form: {title: string; lead: string};
}

/** /vuokrapesuri-vai-ammattilainen */
export interface ComparePage {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  table: {
    title: string;
    headers: {aspect: string; rental: string; pro: string};
    rows: {aspect: string; rental: string; pro: string}[];
  };
  /** real cost of renting; generic market figures must be clearly approximate. Placeholder {price} = our 3-seater price */
  cost: {title: string; paragraphs: string[]};
  mistakes: {title: string; items: TitleText[]};
  whenRental: {title: string; items: string[]};
  whenPro: {title: string; items: string[]};
  faqTitle: string;
  faq: Faq[];
  cta: Cta;
}

/** /hoitotuotteet — care advice by product type, no shop and no brand claims. */
export interface CareProductsPage {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  products: {title: string; text: string; use: string}[];
  avoid: {title: string; items: string[]};
  note: string;
  cta: Cta;
}

/** Shared wording of the programmatic city pages. Placeholders: {city} {inCity} {price} {fee} {from} {to}. */
export interface CityTemplates {
  sofa: {metaTitle: string; metaDescription: string; h1: string; breadcrumb: string; pricesTitle: string};
  mattress: {metaTitle: string; metaDescription: string; h1: string; breadcrumb: string; pricesTitle: string};
  badge: string;
  travelTitle: string;
  /** when the whole city is inside the free zone */
  travelFree: string;
  /** when a single fee applies to the whole city: {fee} */
  travelFee: string;
  /** when the fee depends on the postal code: {minFee} {maxFee} */
  travelRange: string;
  districtsTitle: string;
  arrivalTitle: string;
  homesTitle: string;
  galleryTitle: string;
  faqTitle: string;
  otherCitiesTitle: string;
  /** link label to the same service in another city: {city} */
  otherCityLink: string;
  cta: Cta;
}

export type CitySlug =
  | 'helsinki'
  | 'espoo'
  | 'vantaa'
  | 'kauniainen'
  | 'kerava'
  | 'jarvenpaa'
  | 'tuusula'
  | 'sipoo'
  | 'kirkkonummi'
  | 'nurmijarvi'
  | 'porvoo'
  | 'hyvinkaa';

/** Unique copy per city — genuinely local, not a template with the name swapped. */
export interface CityContent {
  /** "Espoo" */
  name: string;
  /** locative phrase for running text: fi "Espoossa", ru "в Эспоо", en "in Espoo" */
  inCity: string;
  /** two paragraphs each, specific to the city and the service */
  sofa: {intro: string[]};
  mattress: {intro: string[]};
  /** 8–14 real districts / neighbourhoods we drive to */
  districts: string[];
  /** arrival, parking and access notes typical for the city */
  arrival: string;
  /** housing stock and what it means for cleaning (lifts, terraced houses, summer cottages …) */
  homes: string;
  /** 3 questions specific to this city */
  faq: Faq[];
}

export interface SiteContent {
  sofa: ServiceLanding;
  leather: ServiceLanding;
  mattress: ServiceLanding;
  car: ServiceLanding;
  boat: ServiceLanding;
  services: ServicesPage;
  odor: OdorPage;
  pricing: PricingPage;
  business: BusinessPage;
  giftCard: GiftCardPage;
  about: AboutPage;
  contact: ContactPage;
  privacy: LegalPage;
  deletion: DeletionPage;
  compare: ComparePage;
  careProducts: CareProductsPage;
  cityTemplates: CityTemplates;
  cities: Record<CitySlug, CityContent>;
}
