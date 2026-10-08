import type {BusinessPage} from '../types';

export const business: BusinessPage = {
  metaTitle: 'Upholstery cleaning for businesses in Helsinki — invoicing',
  metaDescription:
    'On-site cleaning of office chairs, lobby sofas, restaurant seating and clinic furniture in the Helsinki region. Pay by invoice, contract cleaning, out-of-hours work.',
  badge: 'For businesses · invoicing',
  h1: 'Upholstery cleaning for businesses in Helsinki',
  intro:
    'We clean upholstered furniture and mattresses on site at offices, hotels, restaurants and clinics. The work is scheduled around your hours, and you pay by invoice. One-off cleaning or a regular contract — both work.',
  method: {
    title: 'A method suited to business premises',
    paragraphs: [
      'We use steam cleaning with powerful extraction. Hot water loosens the dirt, which is then pulled out of the fabric together with the detergent. No residue is left behind to attract new dirt. Left alone, upholstery typically takes 4–8 hours to dry; we speed this up with blower fans, and drying is always included in the price.',
      'Our detergents are allergy-friendly and biodegradable and leave no strong scent in the room. We are happy to work early in the morning before opening hours, in the evening or at the weekend, so your customers and staff are not disturbed.',
    ],
  },
  segments: [
    {
      id: 'toimistot',
      title: 'Offices',
      text: 'Office chairs get dirty without anyone noticing: seats darken and armrests turn greasy. We clean chairs, lobby sofas and meeting-room seating after the working day, so everything is ready again the next morning.',
      bullets: [
        'Office chairs',
        'Sofas in lobbies and break rooms',
        'Meeting-room chairs',
        'Spot cleaning of fabric on phone booths and acoustic panels',
      ],
    },
    {
      id: 'hotellit-ravintolat',
      title: 'Hotels and restaurants',
      text: 'Restaurant benches and chairs take a beating every day. In a hotel, clean mattresses and headboards are part of the guest experience. We clean after closing time or between guests.',
      bullets: [
        'Restaurant benches, sofas and chairs',
        'Hotel lobby furniture',
        'Mattresses and headboards between guests',
        'Odour removal as part of the cleaning',
      ],
    },
    {
      id: 'terveydenhuolto',
      title: 'Clinics and practices',
      text: 'Waiting rooms at medical, dental and physiotherapy practices see a lot of people every day. We use unscented, allergy-friendly products and clean outside your reception hours.',
      bullets: [
        'Waiting-room chairs and sofas',
        'Furniture in staff break rooms',
        'Unscented, allergy-friendly detergents',
        'Work outside reception hours',
      ],
    },
  ],
  prices: {
    title: 'Prices',
    lead: 'Business prices follow our public price list. For larger quantities and regular contract cleaning, a business discount is agreed individually based on volume.',
    note: 'Prices on this page include VAT. Invoices show VAT as a separate line.',
  },
  example: {
    title: 'Example: contract cleaning for an office',
    lead: 'An office has {chairs} desk chairs and a 3-seat sofa in the lobby. The furniture is cleaned {times} times a year.',
    lines: ['{chairs} office chairs × {chairPrice}', '3-seat lobby sofa: {sofaPrice}'],
    total: 'Total {total} per visit',
    note: 'Calculated from the public price list. The price of a regular contract is agreed by quote and can be lower.',
  },
  terms: {
    title: 'How working with us works',
    items: [
      {
        title: 'Pay by invoice',
        text: 'Businesses pay by invoice. The payment term is agreed together with the quote.',
      },
      {
        title: 'On your schedule',
        text: 'We work every day, including evenings and weekends. Cleaning can be done early in the morning before you open, after you close or at the weekend.',
      },
      {
        title: 'Contract cleaning 2–12 times a year',
        text: 'We set the visit frequency to match how hard the space is used, and we keep track of the schedule for you.',
      },
      {
        title: 'One contact person, a written quote',
        text: 'You get a single contact person and a written quote stating what is cleaned and at what price.',
      },
    ],
  },
  form: {
    title: 'Request a quote',
    lead: 'Tell us briefly about the premises and attach up to 30 photos if you like — we will send you a written quote.',
  },
  faqTitle: 'Questions from businesses',
  faq: [
    {
      q: 'Can we pay by invoice?',
      a: 'Yes. Business customers pay by invoice, and the payment term is agreed with the quote. VAT is shown separately on the invoice.',
    },
    {
      q: 'Can you work outside our opening hours?',
      a: 'Yes. We work every day, including evenings and weekends, so the cleaning can be timed not to disturb your customers or staff.',
    },
    {
      q: 'How soon can the premises be used again?',
      a: 'Left alone, upholstery typically takes 4–8 hours to dry, depending on the material and ventilation. We speed this up with blower fans, and drying is always included in the price. Anything cleaned in the evening is usually ready to use the next morning.',
    },
    {
      q: 'How is the quote prepared?',
      a: 'Photos are usually enough. Send pictures of the furniture through the form and tell us the quantities, and we will prepare a written quote. If needed, we can come and look on site.',
    },
    {
      q: 'Is there a minimum order for businesses?',
      a: 'Businesses have the same minimum order as all other customers. You will find it on the price list.',
    },
    {
      q: 'How often should contract cleaning be done?',
      a: 'It depends on wear. A busy restaurant or waiting room may need cleaning as often as monthly, while for an office a couple of times a year is often enough. Contracts cover 2–12 visits a year.',
    },
    {
      q: 'What products do you use? What about allergies?',
      a: 'We use allergy-friendly, biodegradable detergents that leave no strong scent. The detergent is rinsed and extracted from the fabric, so no residue remains.',
    },
  ],
};
