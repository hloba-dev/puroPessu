import type {ServiceLanding} from '../types';

export const mattress: ServiceLanding = {
  metaTitle: 'Mattress Cleaning Helsinki, Espoo, Vantaa — from {price}',
  metaDescription:
    'Mattress and bed steam cleaning at your home in Helsinki, Espoo and Vantaa from {price}. Tackles sweat, urine stains and dust mites. Pay after the work.',
  breadcrumb: 'Mattress cleaning',
  badge: 'Mattresses and beds',
  h1: 'Mattress Cleaning in the Helsinki Region — Beds Cleaned at Your Home',
  intro:
    'We steam clean spring mattresses, box beds, toppers and children\'s mattresses right in your bedroom. Prices start at {price}, and morning slots begin at {from}, so the mattress has plenty of time to dry before bedtime. We speed up drying with blower fans, and drying is always included in the price.',
  prices: {
    title: 'Mattress cleaning prices',
    lead: 'The price depends on the size and type – single mattress, double bed or topper. The first-order discount and bundle offers, such as a sofa and a mattress together, are shown in the price list and in the booking.',
    note: 'The minimum order is {min}. The price shown in your booking is final. You can attach photos when booking: if they show heavy soiling, we contact you and agree on the price before the visit.',
  },
  gallery: {
    title: 'Before and after',
    lead: 'Mattresses we have cleaned in homes around the capital region.',
  },
  promise: {
    title: 'An honest word about mattress stains',
    paragraphs: [
      'Fresh urine, vomit and drink stains, as well as general greyness, usually come out well. We pre-treat the stains before steam cleaning.',
      'Old yellowed sweat stains have soaked deep into the fabric. They get much lighter but don\'t always vanish completely. We tell you this before we start.',
      'If you\'re not happy with the result, we clean the mattress again free of charge.',
    ],
  },
  why: {
    title: 'Why Puro',
    items: [
      {
        title: 'Cleaned in your bedroom',
        text: 'No need to carry the mattress anywhere. We clean it on the bed or on the floor.',
      },
      {
        title: 'Controlled moisture',
        text: 'Water must not stay in a mattress. We use only as much moisture as the cleaning needs, and strong extraction removes the rest.',
      },
      {
        title: 'Hot steam',
        text: 'Steam loosens sweat, skin flakes and dirt from the fabric – the very things dust mites feed on.',
      },
      {
        title: 'Allergy-friendly products',
        text: 'Biodegradable, allergy-friendly detergents are extracted at the end, so no residue stays in the mattress.',
      },
      {
        title: 'Free drying with blower fans',
        text: 'After cleaning we set up blower fans to speed up drying. It is always included in the price, never an extra.',
      },
    ],
  },
  process: {
    title: 'How mattress cleaning works',
    steps: [
      {
        title: 'Inspection',
        text: 'We check the mattress type, the stains and any signs of damp, and tell you what to expect.',
      },
      {
        title: 'Vacuuming',
        text: 'We vacuum the surface and seams, removing loose dust and skin flakes.',
      },
      {
        title: 'Stain pre-treatment',
        text: 'Urine, sweat and other stains are treated according to their type.',
      },
      {
        title: 'Steam cleaning and extraction',
        text: 'The top and sides are cleaned with hot steam, then dirt and moisture are extracted. Flippable mattresses can be done on both sides.',
      },
      {
        title: 'Drying with blower fans',
        text: 'We finish with blower fans that speed up drying, free of charge. Left alone, a mattress takes longer to dry than upholstered furniture, so air the room and leave the bed unmade until it\'s dry.',
      },
    ],
  },
  odor: {
    title: 'Odour removal is included',
    lead: 'Mattress odours usually come from what has soaked in under the fabric. We deal with the smell during the same visit at no extra cost.',
    cases: [
      {
        title: 'Urine',
        text: 'Accidents by children and pets are the most common mattress problem. The sooner it\'s cleaned, the less urine reaches the filling.',
      },
      {
        title: 'Sweat',
        text: 'Years of sweat build up in a mattress and start to smell. Cleaning removes the dirt behind the odour and freshens the surface.',
      },
      {
        title: 'Vomit',
        text: 'Remove any solids and blot the spot dry, but don\'t rub. We\'ll take care of the stain and the smell.',
      },
      {
        title: 'Damp or musty smell',
        text: 'A musty smell develops when a mattress can\'t breathe. Cleaning and proper drying freshen it up.',
      },
    ],
    insurance:
      'On request we write a short statement about the cleaning for your insurance company, for example after a pet accident or water damage.',
    linkLabel: 'More about odour removal',
  },
  materials: {
    title: 'Mattresses we clean',
    lead: 'Almost any home mattress can be cleaned on site. We adjust moisture and drying to the way the mattress is built.',
    suitable: [
      {
        title: 'Spring mattresses',
        text: 'The most common type. It takes steam well and dries quickly when air can circulate.',
      },
      {
        title: 'Box beds and continental beds',
        text: 'We clean the sleeping surface and sides. An upholstered base and headboard can be done at the same time.',
      },
      {
        title: 'Toppers',
        text: 'The topper is closest to you and gets the dirtiest. It\'s worth cleaning together with the bed.',
      },
      {
        title: 'Foam and memory foam',
        text: 'Foam soaks up water easily, so we use less moisture. Drying takes longer than usual.',
      },
      {
        title: 'Children\'s mattresses',
        text: 'Accidents happen. We use allergy-friendly products, and a morning clean leaves the most time for drying before bedtime.',
      },
    ],
    exceptionsTitle: 'When cleaning isn\'t the answer',
    exceptions: [
      {
        title: 'Mould inside the mattress',
        text: 'A mattress with mould inside should be replaced, not cleaned. Surface cleaning can\'t remove mould from the filling.',
      },
      {
        title: 'Old yellowed sweat stains',
        text: 'They get lighter but may not vanish completely. We give you an estimate before cleaning.',
      },
      {
        title: 'Down and feather toppers',
        text: 'Down needs washing and drying at a laundry, so we don\'t clean these on site.',
      },
    ],
  },
  compare: {
    title: 'Rental machine or professional?',
    lead: 'The biggest risk with mattresses is over-wetting. A soaked filling dries slowly and can start to smell or grow mould.',
    headers: {aspect: 'What matters', rental: 'Rental machine', pro: 'Professional'},
    rows: [
      {
        aspect: 'Amount of moisture',
        rental: 'Easy to use too much water, which runs deep into the filling',
        pro: 'Moisture dosed to suit the mattress',
      },
      {
        aspect: 'Suction',
        rental: 'Weak suction leaves water in the mattress',
        pro: 'Strong extraction removes dirt and water',
      },
      {
        aspect: 'Drying time',
        rental: 'Can drag on, leaving the mattress damp at night',
        pro: 'Strong extraction plus free blower drying',
      },
      {
        aspect: 'Heat',
        rental: 'Warm water doesn\'t shift sweat and oils properly',
        pro: 'Hot steam loosens sweat and grease',
      },
      {
        aspect: 'Detergent residue',
        rental: 'Detergent stays in the filling and attracts dirt',
        pro: 'Detergent extracted, no residue',
      },
      {
        aspect: 'Total cost',
        rental: 'Rental, products, transport and your own time',
        pro: 'Fixed price, shown before you book',
      },
    ],
    linkLabel: 'See the full comparison',
  },
  areaTitle: 'Mattress cleaning across the capital region',
  areaLead:
    'We come to Helsinki, Espoo, Vantaa, Kauniainen and further afield; the travel fee is calculated from your postal code when you book.',
  faqTitle: 'Mattress cleaning FAQ',
  faq: [
    {
      q: 'How long does a mattress take to dry?',
      a: 'Left alone, upholstery typically takes 4–8 hours to dry, and mattresses longer, especially foam. We speed this up with blower fans, and drying is always included in the price. We still recommend a morning appointment so there is plenty of time before bedtime. Keep the room aired while it dries.',
    },
    {
      q: 'Do urine and sweat stains come out?',
      a: 'Fresh urine stains usually come out well, and the smell goes with them. Old yellowed sweat stains get much lighter but may stay slightly visible. We assess the stains before cleaning.',
    },
    {
      q: 'How should I prepare?',
      a: 'Strip the sheets, mattress protector and pillows and leave some space around the bed. If you\'d like the topper or both sides of the mattress cleaned too, mention it in your booking.',
    },
    {
      q: 'Is it suitable for allergy sufferers and children?',
      a: 'We use allergy-friendly, biodegradable detergents that are extracted at the end. Cleaning reduces dust, skin flakes and what dust mites feed on, but it isn\'t a medical treatment.',
    },
    {
      q: 'How long does the cleaning take?',
      a: 'The cleaning itself is fairly quick – most of the time goes into drying. The exact time depends on how many mattresses there are, their size and the stains.',
    },
    {
      q: 'Which mattresses don\'t you clean?',
      a: 'We don\'t clean mattresses with mould inside – those should be replaced. Down and feather toppers belong at a laundry. Other home mattresses can usually be cleaned on site.',
    },
    {
      q: 'When do I pay?',
      a: 'You pay after the cleaning. There\'s no prepayment, and the price shown in your booking is final.',
    },
    {
      q: 'I\'m not sure about the size or type of my mattress.',
      a: 'Measure the width or send a photo of the mattress and its label on WhatsApp. We\'ll tell you which price applies.',
    },
    {
      q: 'How often should a mattress be cleaned?',
      a: 'Once a year is a good rule of thumb, more often for allergy sufferers and families with small children. A mattress protector stretches the interval and can go in the washing machine regularly.',
    },
  ],
  cta: {
    title: 'Book mattress cleaning',
    text: 'Choose a morning slot to give the mattress the most drying time, with blower drying always included. The price is shown before booking, and you pay after the work.',
  },
};
