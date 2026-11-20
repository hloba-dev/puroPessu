import type {PricingPage} from '../types';

export const pricing: PricingPage = {
  metaTitle: 'Prices — sofa cleaning from {price}, minimum order {min}',
  metaDescription:
    'Puro price list for on-site sofa, armchair and mattress cleaning in Helsinki. Bundle prices and discounts, 30 min of drying included, no prepayment — pay after the work.',
  h1: 'Prices',
  intro:
    'Everything we do is on one price list. The price you see in the booking form is the price on your invoice — no hidden extras and no surprises on the day. The first-order discount, the returning-customer discount and our bundle offers are shown in the price list and in the booking. Prices for private customers include VAT (25.5 %); companies get a quote on request.',
  rules: {
    title: 'How our pricing works',
    items: [
      {
        title: 'The price is final',
        text: 'The amount in your booking is what you pay. Nothing goes on the invoice that we have not agreed on beforehand.',
      },
      {
        title: 'No prepayment',
        text: 'You pay only once the work is done and you have seen the result for yourself.',
      },
      {
        title: 'Minimum order {min}',
        text: 'If your order comes to less, the difference is added to the invoice as a separate line. You will see it while booking.',
      },
      {
        title: 'Heavily soiled items are agreed in advance',
        text: 'You can attach photos when booking. If they show heavy soiling, we contact you and agree on the price before the visit. You decide whether we go ahead.',
      },
      {
        title: '“From” prices are confirmed before cleaning',
        text: 'When a price says “from”, the final amount depends on size or material. We confirm it with you before cleaning.',
      },
      {
        title: 'Odour removal and 30 minutes of drying always included',
        text: 'Every cleaning includes odour removal, and 30 minutes of drying with blower fans is always included in the price — never an extra. The surface will feel dry to the touch; a sofa dries completely in 2–3 hours.',
      },
    ],
  },
  deduction: {
    title: 'Household deduction (kotitalousvähennys)',
    lead: 'As a private customer you can claim 40 % of the labour cost of cleaning done in your home as the Finnish household deduction. The rate has been raised for 2026–2027 and applies retroactively from 1 January 2026.',
    registered: '{company} (business ID {yTunnus}) is in the prepayment register (ennakkoperintärekisteri), which is a condition for the deduction.',
    items: [
      {
        title: '40 % of the labour cost',
        text: 'The deduction is calculated on the labour cost including VAT. Materials and travel fees do not count.',
      },
      {
        title: 'Up to €2,100 per person per year',
        text: 'A personal threshold of €150 per person is taken off the deduction for the year.',
      },
      {
        title: 'Counted over the whole year',
        text: 'It covers all household work bought during the year, not a single cleaning. The final amount is settled in your tax assessment, so we cannot promise a specific refund for one cleaning.',
      },
      {
        title: 'Both spouses can claim',
        text: 'The deduction is personal: each spouse has their own maximum and claims their own share.',
      },
      {
        title: 'Labour cost shown on the invoice',
        text: 'We itemise the labour cost on your invoice — the part the deduction is calculated on.',
      },
      {
        title: 'Private customers and work at home only',
        text: 'The deduction applies to cleaning done in your home or holiday home. Companies cannot claim it, and it does not cover car upholstery cleaning.',
      },
    ],
    note: 'You claim the deduction yourself in your tax return. The current rules are on the Finnish Tax Administration’s site:',
    linkLabel: 'vero.fi — household deduction',
  },
  travel: {
    title: 'Travel fee',
    lead: 'The travel fee is calculated automatically from your postal code when you book. In the nearby area there is no travel fee at all.',
  },
  photoHint:
    'Not sure about the size or the material? Send us a photo on WhatsApp and we will tell you which line on the price list fits.',
  faqTitle: 'Questions about prices',
  faq: [
    {
      q: 'What is included in the price?',
      a: 'Stain pre-treatment, deep extraction cleaning, odour removal, and all the professional cleaning products and equipment. We clean in your home, so nothing has to be transported. 30 minutes of drying with blower fans is always included too.',
    },
    {
      q: 'Why is there a minimum order?',
      a: 'Every visit takes time for travel, carrying equipment and setting up, however small the order. The minimum order covers that. Many customers combine, say, a sofa and a mattress in one visit.',
    },
    {
      q: 'Do the prices include VAT?',
      a: 'Yes. All prices for private customers on the price list include VAT at 25.5 %. Companies get a quote on request.',
    },
    {
      q: 'Can the price change on site?',
      a: 'Not without your approval. The price only changes if the item differs in size or material from your booking, or if it is very heavily soiled. Heavy soiling is best caught from the photos you attach to your booking, so we can agree on the price before the visit. In any case you get the new price before we start, and you decide.',
    },
    {
      q: 'Can I claim the Finnish household deduction (kotitalousvähennys)?',
      a: 'Upholstery cleaning done in your home may qualify for the household deduction on the labour part of the cost. Please check the current rules on the Finnish Tax Administration’s site, vero.fi, before you apply.',
    },
    {
      q: 'When do I pay?',
      a: 'After the cleaning, once you have checked the result. We do not take prepayments, and nothing is charged when you book.',
    },
  ],
  cta: {
    title: 'See available times',
    text: 'Choose your furniture and enter your postal code to see the final price and free slots straight away.',
  },
};
