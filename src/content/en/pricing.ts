import type {PricingPage} from '../types';

export const pricing: PricingPage = {
  metaTitle: 'Prices — sofa cleaning from {price}, minimum order {min}',
  metaDescription:
    'Puro price list for on-site sofa, armchair and mattress cleaning in Helsinki. Bundle prices and discounts, free drying, no prepayment — pay after the work.',
  h1: 'Prices',
  intro:
    'Everything we do is on one price list. The price you see in the booking form is the price on your invoice — no hidden extras and no surprises on the day. The first-order discount, the returning-customer discount and our bundle offers are shown in the price list and in the booking.',
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
        title: 'Odour removal and drying always included',
        text: 'Every cleaning includes odour removal, and drying with blower fans is always included in the price — never an extra.',
      },
    ],
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
      a: 'Stain pre-treatment, steam cleaning with extraction, odour removal, and all detergents and equipment. We clean in your home, so nothing has to be transported. Drying with blower fans is always included too.',
    },
    {
      q: 'Why is there a minimum order?',
      a: 'Every visit takes time for travel, carrying equipment and setting up, however small the order. The minimum order covers that. Many customers combine, say, a sofa and a mattress in one visit.',
    },
    {
      q: 'Do the prices include VAT?',
      a: 'Yes. All prices on the price list include VAT.',
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
