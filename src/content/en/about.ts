import type {AboutPage} from '../types';

export const about: AboutPage = {
  metaTitle: 'About us — Puro, on-site upholstery cleaning',
  metaDescription:
    'Puro cleans sofas, mattresses and car seats in your home across the Helsinki region. Final prices, an honest take on stains, and service in three languages.',
  h1: 'About Puro',
  intro:
    'Puro cleans upholstered furniture and mattresses at customers’ homes and premises in Helsinki, Espoo, Vantaa, Kauniainen and the surrounding area. Here is how we work and what you can count on.',
  story: {
    title: 'Why Puro exists',
    paragraphs: [
      'Booking furniture cleaning should be as easy as booking any other everyday service. That is why our online booking shows real free slots and the final price right away — no waiting for a quote.',
      'Just as important is being honest about results. We tell you up front which stains are likely to come out and which may not, and we do not promise miracles. We come to you every day, including evenings and weekends, and we speak Finnish, Russian and English.',
      'The name comes from the Finnish word puro, a brook: clear, running water. It sums up our work well — clean water carries the dirt away and leaves nothing but clean fabric behind.',
    ],
  },
  values: {
    title: 'What we stand for',
    items: [
      {
        title: 'Honesty about stains',
        text: 'We check stains before cleaning and tell you plainly what to expect. An old or deeply set stain does not always come out completely, and we will say so.',
      },
      {
        title: 'A final price',
        text: 'The price in your booking is the price you pay. If the photos you attach show heavy soiling, we contact you and agree on the price before the visit, and you decide.',
      },
      {
        title: 'Punctuality and clear communication',
        text: 'We arrive at the agreed time and let you know early if anything changes. You get clear instructions before and after the cleaning.',
      },
      {
        title: 'Clean, with no residue',
        text: 'The detergent is rinsed and extracted from the fabric. No sticky film is left on the surface to attract new dirt.',
      },
    ],
  },
  method: {
    title: 'How we clean',
    paragraphs: [
      'Stains are pre-treated first, then the fabric is cleaned with hot steam and the dirt is extracted together with the detergent. We use allergy-friendly, biodegradable detergents. Odour removal is part of every cleaning.',
      'Leather furniture is cleaned by hand. Left alone, upholstery typically takes 4–8 hours to dry; we speed this up with blower fans, and drying is always included in the price. If you are not happy with the result, we clean again free of charge — that is our satisfaction guarantee.',
    ],
  },
  facts: [
    {title: 'Every day {from}–{to}', text: 'Including evenings and weekends.'},
    {title: 'Minimum order {min}', text: 'Travel fee by postal code, free in the nearby area.'},
    {title: 'Drying included', text: 'Blower fans after every cleaning, never an extra.'},
    {title: 'Pay after the cleaning', text: 'No prepayment, and the price is final.'},
  ],
  cta: {
    title: 'Book a cleaning',
    text: 'Pick a time online and see the final price straight away.',
  },
};
