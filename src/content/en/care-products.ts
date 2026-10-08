import type {CareProductsPage} from '../types';

export const careProducts: CareProductsPage = {
  metaTitle: 'Upholstery care products for home — what to keep on hand',
  metaDescription:
    'What to keep at home for caring for your sofa, leather furniture and mattress between cleanings: product types, safe use and mistakes to avoid.',
  h1: 'Care products for home',
  intro:
    'A well-kept sofa stays clean longer and lasts for years. Between professional cleanings you only need a few basics — as long as you know what each one is for.',
  products: [
    {
      title: 'White microfibre cloths',
      text: 'For first aid on stains and light cleaning. With a white cloth you can see straight away whether the stain is coming off — or the colour.',
      use: 'Dab the stain gently, don’t rub. Turn the cloth to a clean side as dirt transfers onto it.',
    },
    {
      title: 'pH-neutral upholstery cleaner',
      text: 'For small stains on fabrics that tolerate water. Check the furniture’s care label to make sure the fabric code is W or W/S.',
      use: 'Test on a hidden spot first. Dilute as instructed, apply it to the cloth rather than straight onto the fabric, and blot dry with a clean cloth.',
    },
    {
      title: 'Leather cleaner and conditioner',
      text: 'For regular cleaning and nourishing of finished (pigmented) leather, so it doesn’t dry out or crack.',
      use: 'Test on a hidden spot first. Clean the leather, let it dry, then apply a thin layer of conditioner with a soft cloth. A few times a year is usually enough.',
    },
    {
      title: 'Fabric protection spray',
      text: 'Repels liquids and gives you a moment to wipe up a spill before it soaks in. It won’t make fabric stain-proof, it doesn’t replace cleaning, and its effect wears off with use.',
      use: 'Test on a hidden spot first. Spray a thin, even layer on a clean, dry surface in a well-ventilated room and let it dry before use.',
    },
    {
      title: 'Soft upholstery brush and a vacuum with an upholstery nozzle',
      text: 'Regular vacuuming removes dust, grit and hair that would otherwise wear the fabric and work their way deeper.',
      use: 'Vacuum gently, under the cushions too. Brush pile fabrics in the direction of the pile, and use only a soft brush on velvet.',
    },
    {
      title: 'Enzyme-based stain and odour remover',
      text: 'For pet accidents such as urine or vomit. The enzymes break down organic matter that would otherwise keep smelling.',
      use: 'Test on a hidden spot first. Blot up as much liquid as you can, apply the product and leave it to work as instructed. Don’t mix it with other cleaning products.',
    },
  ],
  avoid: {
    title: 'What to avoid',
    items: [
      'Bleach and chlorine-based products — they permanently fade and weaken the fibres.',
      'Coloured cloths and towels — the dye can transfer to damp fabric.',
      'Baby wipes on leather — over time their ingredients dry out and damage the surface.',
      'A steam cleaner on aniline leather or velvet when you’re not sure what the material is — heat and moisture can leave permanent marks.',
      'Vinegar and baking-soda “hacks” on delicate fabrics — they can leave rings, residue or faded colour.',
      'A hair dryer for drying — the heat can shrink the fabric and set whatever is left of the stain.',
    ],
  },
  note: 'Just ask during our visit — we’re happy to recommend products that suit your particular fabric.',
  cta: {
    title: 'Time for a deep clean?',
    text: 'Home care keeps the surface tidy, but deeper dirt and odours need a proper clean. Book online and we’ll come to you.',
  },
};
