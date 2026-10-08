import type {ServicesPage} from '../types';

export const services: ServicesPage = {
  metaTitle: "Services — upholstery cleaning and odor removal at home",
  metaDescription:
    "Upholstery cleaning at home in the Helsinki region: sofas, leather, chairs, mattresses, car interiors and boat textiles. Odor removal and drying are included.",
  h1: "Services",
  intro:
    "We clean upholstered furniture, mattresses and other textiles where they are: in your home, in your driveway or at the marina. The method is the same throughout: stain pre-treatment, hot steam and strong extraction that takes the dirt and detergent away.",
  sections: {
    sofas: {
      title: "Sofas and armchairs",
      text: "A fabric sofa greys so slowly you barely notice. Steam cleaning brings back the colour and freshness, and stains are pre-treated first. We clean sofas of every size, corner sofas and armchairs.",
      bullets: [
        "Fabric, microfibre and velvet",
        "Corner sofas, chaises and footstools",
        "Loose cushions done at the same time",
        "Blower drying always included",
      ],
    },
    leather: {
      title: "Leather furniture",
      text: "Leather is cleaned by hand, not with steam. We lift grease and dirt off the surface with a mild cleaner so the leather stays supple.",
      bullets: ["Leather sofas and armchairs", "Hand cleaning without excess moisture", "We tell you if the finish is already worn"],
    },
    chairs: {
      title: "Dining chairs and office chairs",
      text: "Dining chair seats collect food, and office chairs collect sweat and dust. We clean them quickly and they are back in use the same day.",
      bullets: ["Upholstered dining chairs", "Office and desk chairs", "Seat and backrest in one go"],
    },
    beds: {
      title: "Mattresses and beds",
      text: "Mattresses collect sweat, skin flakes and dust mites. Steam and extraction clean the surface and freshen the mattress from within. Left alone, a mattress takes longer to dry than a sofa, so we speed it up with blower fans at no extra cost.",
      bullets: [
        "Spring, foam and box-spring mattresses",
        "Guest and children's mattresses",
        "Upholstered headboards",
        "Stains and yellow patches pre-treated",
      ],
    },
    odor: {
      title: "Odor removal",
      text: "Pet, urine, smoke and damp smells live in the padding. We locate the source and rinse it out. Odor removal is included in the cleaning price.",
      bullets: ["Pet, urine and tobacco smells", "Musty and damp smells", "Statement for your insurer on request"],
    },
    vehicles: {
      title: "Cars and motorhomes",
      text: "We clean car seats and mats in your driveway or parking garage. All we need is a power outlet, and we bring the water.",
      bullets: ["Car seats and single seats", "Motorhomes and caravans", "Leather and Alcantara"],
    },
    boats: {
      title: "Boats",
      text: "We clean boat mattresses, cushions and upholstered panels at the marina, or removable cushions at your home. The best time is spring before launch or autumn before lay-up.",
      bullets: ["Cabin mattresses and seat cushions", "Vinyl and faux leather by hand", "Musty smells removed"],
    },
    other: {
      title: "Other textiles",
      text: "We also clean things that will not fit in a washing machine. Just ask if something else needs a clean.",
      bullets: ["Strollers and child car seats", "Large soft toys"],
    },
  },
  moreLabel: "Read more",
  process: {
    title: "How it works",
    steps: [
      {title: "Book online", text: "Choose what to clean and a free slot. You see the price straight away."},
      {title: "We come to you", text: "We bring the equipment and detergents. All we need is a power outlet."},
      {title: "We clean and dry", text: "Pre-treatment, hot steam and extraction, then blower fans to speed up drying. Drying is always included in the price."},
      {title: "You pay afterwards", text: "Payment only once the work is done. No prepayment."},
    ],
  },
  faqTitle: "Frequently asked questions",
  faq: [
    {
      q: "Do I need to be home during the cleaning?",
      a: "Someone needs to let us in and show us what to clean. After that, you can get on with your day.",
    },
    {
      q: "How long does furniture take to dry?",
      a: "Left alone, upholstery typically takes 4–8 hours to dry, and mattresses longer. We speed this up with blower fans after every cleaning, and drying is always included in the price.",
    },
    {
      q: "Do all stains come out?",
      a: "Most do. Old, set-in or bleached stains may stay visible though lighter, and we tell you that before we start.",
    },
    {
      q: "Are the detergents safe for children and pets?",
      a: "Yes. We use allergy-friendly, biodegradable detergents and rinse them out of the fabric.",
    },
    {
      q: "Can the price change on site?",
      a: "The price in your booking is final. You can attach photos when booking: if they show heavy soiling, we contact you and agree on the price before the visit.",
    },
    {
      q: "What if I am not happy with the result?",
      a: "We come back and clean again for free. Just tell us what was not right.",
    },
  ],
  cta: {
    title: "Book a clean",
    text: "Pick a free slot online, evenings and weekends included.",
  },
};
