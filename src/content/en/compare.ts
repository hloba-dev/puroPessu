import type {ComparePage} from '../types';

export const compare: ComparePage = {
  metaTitle: 'Rental carpet cleaner or a professional? An honest comparison',
  metaDescription:
    'Should you clean your sofa with a rented machine or book a professional? We compare results, drying time, risks and the real cost.',
  h1: 'Rental machine or professional cleaning?',
  intro:
    'A rented upholstery cleaner can give perfectly decent results, and sometimes it really is the sensible choice. So here is a straight answer on where a rental is enough and where the difference to a professional starts to show.',
  table: {
    title: 'Side by side',
    headers: {aspect: 'Aspect', rental: 'Rental machine', pro: 'Puro'},
    rows: [
      {
        aspect: 'Water temperature and steam',
        rental: 'Warm tap water — the machine usually doesn’t heat it.',
        pro: 'Hot steam loosens grease and dirt deep in the fibres.',
      },
      {
        aspect: 'Suction power',
        rental: 'Built for home use, so some water stays in the fabric.',
        pro: 'Powerful extraction pulls water and dirt out of the fabric and padding.',
      },
      {
        aspect: 'Drying time',
        rental: 'Often a day or more if a lot of water is left behind.',
        pro: 'Faster, with blower fans always included in the price.',
      },
      {
        aspect: 'Detergent residue',
        rental: 'Easily left in the fabric, so it gets dirty again quickly.',
        pro: 'Detergent is rinsed and vacuumed out — no residue.',
      },
      {
        aspect: 'Water rings and over-wetting',
        rental: 'A real risk, especially on light fabrics.',
        pro: 'Moisture is kept under control and the whole surface is treated evenly.',
      },
      {
        aspect: 'Stain pre-treatment',
        rental: 'One general detergent for everything; hard to tell what the stain is.',
        pro: 'Each stain is pre-treated according to its type before cleaning.',
      },
      {
        aspect: 'Odours',
        rental: 'Surface cleaning usually doesn’t reach the source of the smell.',
        pro: 'Odour removal is included in the price.',
      },
      {
        aspect: 'Time and effort',
        rental: 'Picking up, cleaning, tidying and returning the machine easily takes half a day.',
        pro: 'We arrive with everything we need while you get on with your day.',
      },
      {
        aspect: 'If something goes wrong',
        rental: 'The risk is all yours.',
        pro: 'Not happy with the result? We clean it again for free.',
      },
      {
        aspect: 'Cost',
        rental: 'Cheaper — if your own time costs nothing.',
        pro: 'A fixed price that doesn’t change during the visit.',
      },
    ],
  },
  cost: {
    title: 'What does renting really cost?',
    paragraphs: [
      'Renting a cleaning machine typically costs around 20–40 euros a day. On top of that comes the detergent, which is usually sold separately at roughly 10–20 euros a bottle.',
      'You also have to collect and return the machine, often by car. Add up the trips, the cleaning, the drying and the return, and half a day is easily gone — and with the rental clock ticking, the job often ends up rushed.',
      'Cleaning a 3-seater sofa with us costs {price}. That includes stain pre-treatment, cleaning, rinsing and odour removal, and the price doesn’t change during the visit. If your sofa has a hard-wearing fabric and is only lightly soiled, a rental may still work out cheaper — just remember to count your own time too.',
    ],
  },
  mistakes: {
    title: 'The most common mistakes with a rental machine',
    items: [
      {
        title: 'Too much water',
        text: 'Water soaks right into the padding and a home machine can’t get it back out. The result is slow drying, a musty smell and, at worst, yellowish marks.',
      },
      {
        title: 'Too much detergent',
        text: 'More is not better. Excess detergent stays in the fibres as a sticky film that attracts new dirt fast.',
      },
      {
        title: 'Skipping the rinse',
        text: 'A single pass with cleaning solution leaves detergent in the fabric. Rinsing with clean water matters just as much as the cleaning itself.',
      },
      {
        title: 'Cleaning only the stain',
        text: 'Clean just one spot and you’ll often get a visible border around it. It’s better to treat the whole surface from seam to seam.',
      },
      {
        title: 'Impatient drying',
        text: 'Sitting on the sofa before it’s dry, or drying it with a hair dryer, can both leave marks. Air the room and give it time.',
      },
    ],
  },
  whenRental: {
    title: 'When a rental machine is enough',
    items: [
      'The fabric is a durable synthetic that handles water well.',
      'The soiling is light and even, with no difficult stains.',
      'You have time to do the job carefully and let it dry properly.',
      'You have a large wall-to-wall carpet that needs regular cleaning.',
    ],
  },
  whenPro: {
    title: 'When a professional is worth it',
    items: [
      'There are old or unknown stains on the fabric.',
      'The furniture smells, for example of pets or tobacco.',
      'The fabric is light-coloured, delicate or you don’t know what it is.',
      'It’s a leather sofa or a mattress.',
      'You’d rather not spend your day off hauling a machine around and cleaning.',
    ],
  },
  faqTitle: 'Frequently asked questions',
  faq: [
    {
      q: 'Can a rental machine ruin my sofa?',
      a: 'Rarely completely, but too much water can leave water rings, shrink some fabrics or make the padding smell. The risk is highest on light-coloured and natural-fibre fabrics.',
    },
    {
      q: 'How long does a sofa take to dry after a rental machine?',
      a: 'It depends on how much water was left in the fabric — often a day or longer. Left alone after professional extraction, upholstery typically takes 4–8 hours to dry; we speed this up with blower fans, and drying is always included in our price.',
    },
    {
      q: 'Can I clean a leather sofa with a rental machine?',
      a: 'We wouldn’t recommend it. Leather doesn’t cope well with getting wet and can dry out, stiffen or lose colour. We clean leather by hand.',
    },
    {
      q: 'Will a rental machine remove odours?',
      a: 'Surface smells, maybe. But if the odour has soaked into the padding, cleaning alone usually isn’t enough. With us, odour removal is included in the price.',
    },
    {
      q: 'I already tried it myself and got marks. Can you fix it?',
      a: 'Often, yes. Water rings and detergent residue usually come out when the whole surface is cleaned and rinsed evenly. Tell us about it beforehand and we’ll assess it before we start.',
    },
    {
      q: 'Should I try it myself first and call a professional later?',
      a: 'For light soiling on a durable fabric, that can work. For stains, odours or delicate fabrics it’s better to go straight to a professional — a failed DIY attempt often makes the job harder.',
    },
  ],
  cta: {
    title: 'Let us do the cleaning',
    text: 'Book online at a time that suits you. We come to your home, and you pay only once the job is done.',
  },
};
