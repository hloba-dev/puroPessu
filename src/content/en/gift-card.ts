import type {GiftCardPage} from '../types';

export const giftCard: GiftCardPage = {
  metaTitle: 'Gift card for sofa and mattress cleaning',
  metaDescription:
    'Give a clean sofa or a fresh mattress. A Puro gift card for a specific service or any amount, delivered as a PDF by e-mail. Helsinki and the capital region.',
  h1: 'Gift card for furniture cleaning',
  intro:
    'A clean sofa or a fresh mattress is a gift that gets used every single day. Choose a service or an amount and we e-mail you the gift card as a PDF. The recipient books a time whenever it suits them.',
  how: {
    title: 'How to order a gift card',
    steps: [
      {
        title: 'Choose a service or an amount',
        text: 'Pick a service from the price list, such as sofa cleaning, or decide on an amount yourself.',
      },
      {
        title: 'Send the request',
        text: 'Fill in the form below and tell us which gift card you would like.',
      },
      {
        title: 'Receive an invoice',
        text: 'We e-mail you an invoice for the gift card.',
      },
      {
        title: 'Gift card in your inbox',
        text: 'Once the invoice is paid, you receive the gift card as a PDF with a code. The recipient enters the code when booking online.',
      },
    ],
  },
  options: {
    title: 'Choose a gift card',
    lead: 'Pick a service straight from the price list or give any amount you like.',
    custom: 'Custom amount',
  },
  terms: {
    title: 'Gift card terms',
    items: [
      'The gift card is valid for {months} months from the date of purchase.',
      'One gift card can be used per booking.',
      'A value card can be used for any services up to its value. A service card covers the service named on it.',
      'If the booking costs more than the card covers, the difference is paid after the work.',
      'Gift cards cannot be exchanged for cash.',
      'If the card is for a specific service, any travel fee outside the free zone is paid separately.',
    ],
  },
  form: {
    title: 'Order a gift card',
    lead: 'Fill in the form and we will send you an invoice, then e-mail the gift card once it is paid.',
  },
  faqTitle: 'Gift card questions',
  faq: [
    {
      q: 'When will I receive the gift card?',
      a: 'We e-mail it to you once the invoice has been paid. If you need it by a certain date, mention that in the form.',
    },
    {
      q: 'How does the recipient use it?',
      a: 'They book online as usual and enter the gift card code during booking.',
    },
    {
      q: 'Can I print the gift card?',
      a: 'Yes. It comes as a PDF, so you can print it and put it in a card, or simply forward it to the recipient.',
    },
    {
      q: 'Where can the gift card be used?',
      a: 'We work in Helsinki, Espoo, Vantaa, Kauniainen and the surrounding area. The travel fee depends on the recipient’s postal code, and there is none in the nearby area.',
    },
    {
      q: 'What if the booking costs more than the card is worth?',
      a: 'The difference is paid after the cleaning, just like any other booking. No prepayment is needed.',
    },
  ],
};
