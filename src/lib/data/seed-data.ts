/**
 * Seed data — the single definition of the default catalog and settings (price policy v3).
 * `npm run db:seed:generate` turns it into supabase/seed.sql; the app itself
 * reads it only as a fallback when Supabase is not configured (local demo / CI).
 * In production the database is the source of truth and is edited in /admin.
 */
import type {Category, GalleryItem, L10n, Service, ServiceOption, Settings, Unit} from '@/lib/types';

export const seedSettings: Settings = {
  companyName: 'Puro',
  legalName: 'Puropesu',
  // Placeholders — replace in /admin → Настройки (or in the `settings` table).
  phone: '+358 40 000 0000',
  whatsapp: '358400000000',
  email: 'info@puropesu.fi',
  yTunnus: '0000000-0',
  address: {street: 'Esimerkkikatu 1', postalCode: '00100', city: 'Helsinki'},
  social: {facebook: '', instagram: '', googleReviews: ''},
  baseLat: 60.1699,
  baseLng: 24.9384,
  roadFactor: 1.3,
  minOrderCents: 10000,
  openFrom: '06:00',
  openTo: '21:00',
  slotStep: 30,
  travelZones: [
    {maxKm: 35, feeCents: 0},
    {maxKm: 50, feeCents: 2500},
    {maxKm: 100, feeCents: 5000},
    {maxKm: 150, feeCents: 10000}
  ],
  leadTimeHours: 3,
  bufferMin: 30,
  bookingHorizonDays: 60,
  timezone: 'Europe/Helsinki',
  promotions: {
    firstOrderPct: 10,
    repeatOrderPct: 5,
    multiItemPct: 5,
    multiItemMin: 3,
    bundleChairsCount: 4,
    bundleChairsExtraCents: 3000,
    bundleMattressSingleExtraCents: 5000,
    bundleMattressDoubleExtraCents: 7500,
    // open question in the price sheet; until decided the customer gets the better of the two
    stackBundlesWithPercent: false
  }
};

export const seedCategories: Category[] = [
  {id: 1, slug: 'sofas', sort: 10, isActive: true, name: {fi: 'Sohvat ja nojatuolit', ru: 'Диваны и кресла', en: 'Sofas and armchairs'}},
  {id: 2, slug: 'leather', sort: 20, isActive: true, name: {fi: 'Nahkakalusteet', ru: 'Кожаная мебель', en: 'Leather furniture'}},
  {id: 3, slug: 'chairs', sort: 30, isActive: true, name: {fi: 'Tuolit', ru: 'Стулья', en: 'Chairs'}},
  {id: 4, slug: 'beds', sort: 40, isActive: true, name: {fi: 'Sängyt ja patjat', ru: 'Кровати и матрасы', en: 'Beds and mattresses'}},
  {id: 5, slug: 'odor', sort: 50, isActive: true, name: {fi: 'Hajunpoisto', ru: 'Удаление запахов', en: 'Odor removal'}},
  {id: 6, slug: 'vehicles', sort: 60, isActive: true, name: {fi: 'Ajoneuvot', ru: 'Транспорт', en: 'Vehicles'}},
  {id: 7, slug: 'boats', sort: 70, isActive: true, name: {fi: 'Veneet', ru: 'Лодки и катера', en: 'Boats'}},
  {id: 8, slug: 'other', sort: 80, isActive: true, name: {fi: 'Muut pesukohteet', ru: 'Прочее', en: 'Other items'}},
  // price-list rows for companies: shown on /yrityksille and /hinnasto, ordered through a quote request
  {id: 9, slug: 'business', sort: 90, isActive: true, name: {fi: 'Yrityksille', ru: 'Для бизнеса', en: 'For business'}}
];

const ODOR: L10n = {fi: 'Hajunpoisto (sisältyy hintaan)', ru: 'Удаление запаха (входит в цену)', en: 'Odor removal (included)'};

interface SeedService {
  slug: string;
  category: string;
  name: L10n;
  description: L10n;
  /** EUR */
  price: number;
  min: number;
  unit?: Unit;
  from?: boolean;
  /** price-list-only row: not a line in the online booking */
  addon?: boolean;
  /** offers the free "odor removal" note as a per-item option */
  odor?: boolean;
}

const S: SeedService[] = [
  // Sohvat ja nojatuolit
  {slug: 'armchair', category: 'sofas', price: 50, min: 40, odor: true,
    name: {fi: 'Nojatuoli', ru: 'Кресло', en: 'Armchair'},
    description: {fi: 'Nojatuoli tai korvanojatuoli, kaikki pinnat.', ru: 'Кресло, в том числе «с ушами», все поверхности.', en: 'Armchair or wingback, all surfaces.'}},
  {slug: 'sofa-2', category: 'sofas', price: 109, min: 45, odor: true,
    name: {fi: '2-istuttava sohva', ru: '2-местный диван', en: '2-seater sofa'},
    description: {fi: 'Istuintyynyt, selkänoja ja käsinojat.', ru: 'Сиденья, спинка и подлокотники.', en: 'Seat cushions, backrest and armrests.'}},
  {slug: 'sofa-3', category: 'sofas', price: 149, min: 60, odor: true,
    name: {fi: '3-istuttava sohva', ru: '3-местный диван', en: '3-seater sofa'},
    description: {fi: 'Yleisin sohvakoko, kaikki pinnat höyryllä.', ru: 'Самый частый размер, все поверхности с паром.', en: 'The most common size, all surfaces steam-cleaned.'}},
  {slug: 'sofa-4', category: 'sofas', price: 169, min: 120, odor: true,
    name: {fi: '4-istuttava sohva', ru: '4-местный диван', en: '4-seater sofa'},
    description: {fi: 'Suora 4-istuttava tai divaanisohva.', ru: 'Прямой 4-местный диван или диван с оттоманкой.', en: 'Straight 4-seater or chaise sofa.'}},
  {slug: 'corner', category: 'sofas', price: 169, min: 90, odor: true,
    name: {fi: 'Kulmasohva', ru: 'Угловой диван', en: 'Corner sofa'},
    description: {fi: 'Tavallinen L-mallinen kulmasohva.', ru: 'Обычный угловой диван Г-образной формы.', en: 'Standard L-shaped corner sofa.'}},
  {slug: 'corner-large', category: 'sofas', price: 199, min: 120, odor: true,
    name: {fi: 'Iso kulmasohva', ru: 'Большой угловой диван', en: 'Large corner sofa'},
    description: {fi: 'U-mallinen tai yli 3 metrin kulmasohva.', ru: 'П-образный или угловой диван длиннее 3 метров.', en: 'U-shaped or over 3 m corner sofa.'}},
  {slug: 'sofa-5-6', category: 'sofas', price: 199, min: 120, odor: true,
    name: {fi: '5–6-istuttava sohva', ru: '5–6-местный диван', en: '5–6-seater sofa'},
    description: {fi: 'Suuri moduulisohva tai kahden sohvan kokonaisuus.', ru: 'Большой модульный диван.', en: 'Large modular sofa.'}},
  {slug: 'ottoman-s', category: 'sofas', price: 25, min: 10,
    name: {fi: 'Rahi (pieni)', ru: 'Пуф (маленький)', en: 'Ottoman (small)'},
    description: {fi: 'Pieni rahi tai jalkatuki.', ru: 'Небольшой пуф или подставка для ног.', en: 'Small ottoman or footstool.'}},
  {slug: 'ottoman-l', category: 'sofas', price: 40, min: 15,
    name: {fi: 'Rahi (iso)', ru: 'Пуф (большой)', en: 'Ottoman (large)'},
    description: {fi: 'Iso rahi tai sohvan erillinen moduuli.', ru: 'Большой пуф или отдельный модуль дивана.', en: 'Large ottoman or a separate sofa module.'}},

  // Nahkakalusteet — same prices as fabric furniture
  {slug: 'leather-armchair', category: 'leather', price: 50, min: 40,
    name: {fi: 'Nahkanojatuoli', ru: 'Кожаное кресло', en: 'Leather armchair'},
    description: {fi: 'Puhdistus nahalle tarkoitetulla aineella käsin.', ru: 'Ручная чистка средством для кожи.', en: 'Hand-cleaned with a leather-safe product.'}},
  {slug: 'leather-sofa-2', category: 'leather', price: 109, min: 50,
    name: {fi: '2-istuttava nahkasohva', ru: '2-местный кожаный диван', en: '2-seater leather sofa'},
    description: {fi: 'Puhdistus ja pintalian poisto, sopii aidolle ja keinonahalle.', ru: 'Чистка и снятие поверхностной грязи, для натуральной и искусственной кожи.', en: 'Cleaning and soil removal for genuine and faux leather.'}},
  {slug: 'leather-sofa-3', category: 'leather', price: 149, min: 70,
    name: {fi: '3-istuttava nahkasohva', ru: '3-местный кожаный диван', en: '3-seater leather sofa'},
    description: {fi: 'Puhdistus saumoja ja taitteita myöten.', ru: 'Чистка, включая швы и складки.', en: 'Cleaning including seams and creases.'}},
  {slug: 'leather-corner', category: 'leather', price: 169, min: 100,
    name: {fi: 'Nahkakulmasohva', ru: 'Кожаный угловой диван', en: 'Leather corner sofa'},
    description: {fi: 'Kulmasohva tai 4-istuttava nahkasohva.', ru: 'Угловой или 4-местный кожаный диван.', en: 'Corner or 4-seater leather sofa.'}},

  // Tuolit
  {slug: 'chair-seat', category: 'chairs', price: 14, min: 10, unit: 'piece',
    name: {fi: 'Ruokapöydän tuoli, istuin', ru: 'Обеденный стул, сиденье', en: 'Dining chair, seat'},
    description: {fi: 'Pelkkä istuinosa, hinta kappaleelta.', ru: 'Только сиденье, цена за штуку.', en: 'Seat only, price per chair.'}},
  {slug: 'chair-full', category: 'chairs', price: 20, min: 15, unit: 'piece',
    name: {fi: 'Ruokapöydän tuoli, selkänoja ja istuin', ru: 'Обеденный стул, спинка и сиденье', en: 'Dining chair, backrest and seat'},
    description: {fi: 'Verhoiltu istuin ja selkänoja, hinta kappaleelta.', ru: 'Мягкие сиденье и спинка, цена за штуку.', en: 'Upholstered seat and backrest, price per chair.'}},
  {slug: 'office-chair', category: 'chairs', price: 40, min: 20, unit: 'piece',
    name: {fi: 'Työtuoli', ru: 'Офисное кресло', en: 'Office chair'},
    description: {fi: 'Työtuolin istuin, selkänoja ja käsinojat.', ru: 'Сиденье, спинка и подлокотники офисного кресла.', en: 'Seat, backrest and armrests of an office chair.'}},

  // Sängyt ja patjat
  {slug: 'bed-single', category: 'beds', price: 99, min: 60, odor: true,
    name: {fi: 'Yhden hengen sänky / patja', ru: 'Односпальная кровать / матрас', en: 'Single bed / mattress'},
    description: {fi: '80–120 cm leveä patja, molemmat puolet tarvittaessa.', ru: 'Матрас шириной 80–120 см, при необходимости с двух сторон.', en: '80–120 cm wide mattress, both sides when needed.'}},
  {slug: 'bed-double', category: 'beds', price: 160, min: 90, odor: true,
    name: {fi: 'Parisänky / patja', ru: 'Двуспальная кровать / матрас', en: 'Double bed / mattress'},
    description: {fi: '140–180 cm leveä patja tai runkopatjat ja sijauspatja.', ru: 'Матрас шириной 140–180 см или матрасы с наматрасником.', en: '140–180 cm wide mattress or box springs with a topper.'}},

  // Hajunpoisto
  {slug: 'odor-removal', category: 'odor', price: 0, min: 0, addon: true,
    name: {fi: 'Hajunpoisto pesun yhteydessä', ru: 'Удаление запахов во время чистки', en: 'Odor removal with cleaning'},
    description: {fi: 'Sisältyy pesun hintaan — kerro hajusta varauksen yhteydessä.', ru: 'Входит в цену чистки — сообщите о запахе при записи.', en: 'Included in the cleaning price — mention the odor when booking.'}},

  // Ajoneuvot
  {slug: 'car-5', category: 'vehicles', price: 179, min: 150,
    name: {fi: 'Henkilöauto, 5 paikkaa', ru: 'Легковой автомобиль, 5 мест', en: 'Car, 5 seats'},
    description: {fi: 'Penkit, matot ja oviverhoilut.', ru: 'Сиденья, коврики и обивка дверей.', en: 'Seats, floor mats and door upholstery.'}},
  {slug: 'car-seat', category: 'vehicles', price: 40, min: 20, unit: 'piece',
    name: {fi: 'Yksittäinen istuin', ru: 'Одно сиденье', en: 'Single seat'},
    description: {fi: 'Yksi auton istuin.', ru: 'Одно автомобильное сиденье.', en: 'One car seat.'}},
  {slug: 'camper', category: 'vehicles', price: 149, min: 180, from: true,
    name: {fi: 'Asuntoauton tai -vaunun penkit', ru: 'Сиденья автодома или жилого прицепа', en: 'Motorhome or caravan seats'},
    description: {fi: 'Hinta penkkien määrän mukaan.', ru: 'Цена зависит от количества сидений.', en: 'Priced by the number of seats.'}},

  // Veneet
  {slug: 'boat-textiles', category: 'boats', price: 100, min: 120, from: true,
    name: {fi: 'Veneen tekstiilit', ru: 'Текстиль лодки или катера', en: 'Boat textiles'},
    description: {fi: 'Patjat ja istuintyynyt, hinta veneen koon mukaan.', ru: 'Матрасы и подушки сидений, цена зависит от размера лодки.', en: 'Mattresses and seat cushions, priced by boat size.'}},

  // Muut pesukohteet
  {slug: 'stroller', category: 'other', price: 25, min: 30, from: true,
    name: {fi: 'Lastenvaunut, rattaat tai turvaistuin', ru: 'Детская коляска или автокресло', en: 'Stroller or child car seat'},
    description: {fi: 'Kangasosat höyryllä ja allergiaystävällisellä aineella.', ru: 'Тканевые части паром и гипоаллергенным средством.', en: 'Fabric parts with steam and an allergy-friendly product.'}},
  {slug: 'soft-toy', category: 'other', price: 20, min: 15, from: true,
    name: {fi: 'Isot pehmolelut', ru: 'Большие мягкие игрушки', en: 'Large soft toys'},
    description: {fi: 'Isot pehmolelut, jotka eivät mahdu pesukoneeseen.', ru: 'Большие игрушки, которые не помещаются в стиральную машину.', en: 'Large soft toys that do not fit in a washing machine.'}},

  // Yrityksille (price list only)
  {slug: 'b2b-office-chair', category: 'business', price: 34, min: 20, unit: 'piece', addon: true,
    name: {fi: 'Työtuoli (yrityksille)', ru: 'Офисное кресло (для компаний)', en: 'Office chair (business)'},
    description: {fi: 'Yrityshinta kappaleelta, laskulla.', ru: 'Цена для компаний за штуку, по счёту.', en: 'Business price per chair, by invoice.'}},
  {slug: 'b2b-dining-chair', category: 'business', price: 21, min: 15, unit: 'piece', addon: true,
    name: {fi: 'Ravintolatuoli, selkänoja ja istuin', ru: 'Стул для ресторана, спинка и сиденье', en: 'Restaurant chair, backrest and seat'},
    description: {fi: 'Ravintolat, kahvilat ja neuvotteluhuoneet.', ru: 'Рестораны, кафе и переговорные.', en: 'Restaurants, cafés and meeting rooms.'}},
  {slug: 'b2b-lobby-sofa', category: 'business', price: 50, min: 60, from: true, addon: true,
    name: {fi: 'Toimisto- tai aulasohva', ru: 'Офисный диван или диван в лобби', en: 'Office or lobby sofa'},
    description: {fi: 'Hinta koon mukaan, kuten sohvien hinnastossa.', ru: 'Цена по размеру, как в прайсе на диваны.', en: 'Priced by size, as in the sofa price list.'}}
];

function buildServices(): Service[] {
  let optionId = 1;
  return S.map((s, index) => {
    const id = index + 1;
    const category = seedCategories.find((c) => c.slug === s.category)!;
    const options: ServiceOption[] = s.odor
      ? [{id: optionId++, serviceId: id, slug: 'odor', name: ODOR, priceCents: 0, durationMin: 10}]
      : [];
    return {
      id,
      categoryId: category.id,
      categorySlug: category.slug,
      slug: s.slug,
      name: s.name,
      description: s.description,
      priceCents: s.price * 100,
      priceFrom: s.from ?? false,
      unit: s.unit ?? 'item',
      durationMin: s.min,
      isSmall: s.price <= 50,
      isAddon: s.addon ?? false,
      isActive: category.isActive,
      sort: (index + 1) * 10,
      options
    };
  });
}

export const seedServices: Service[] = buildServices();

const G = (
  n: number,
  file: string,
  serviceSlug: string,
  caption: L10n,
  isFeatured = true
): GalleryItem => ({
  id: `seed-${String(n).padStart(2, '0')}`,
  beforeUrl: `/images/before-after/${String(n).padStart(2, '0')}-${file}-before.jpg`,
  afterUrl: `/images/before-after/${String(n).padStart(2, '0')}-${file}-after.jpg`,
  caption,
  serviceSlug,
  sort: n * 10,
  isFeatured
});

/** Placeholder pairs — replace the files in public/images/before-after/ or upload real ones in /admin. */
export const seedGallery: GalleryItem[] = [
  G(1, 'kangassohva', 'sofas', {fi: 'Kangassohva', ru: 'Тканевый диван', en: 'Fabric sofa'}),
  G(2, 'ruokapoydan-tuoli', 'chairs', {fi: 'Ruokapöydän tuoli', ru: 'Обеденный стул', en: 'Dining chair'}),
  G(3, 'boucle-sohva', 'sofas', {fi: 'Bouclé-sohva', ru: 'Диван букле', en: 'Bouclé sofa'}),
  G(4, 'korvanojatuoli', 'sofas', {fi: 'Korvanojatuoli', ru: 'Кресло с «ушами»', en: 'Wingback chair'}),
  G(5, 'patja', 'beds', {fi: 'Patja', ru: 'Матрас', en: 'Mattress'}),
  G(6, 'vaalea-kangassohva', 'sofas', {fi: 'Vaalea kangassohva', ru: 'Светлый тканевый диван', en: 'Light fabric sofa'}),
  G(7, 'nojatuoli-ja-rahi', 'sofas', {fi: 'Nojatuoli ja rahi', ru: 'Кресло и пуф', en: 'Armchair and ottoman'}),
  G(8, 'kulmasohva', 'sofas', {fi: 'Kulmasohva', ru: 'Угловой диван', en: 'Corner sofa'}),
  G(9, 'nahkasohva', 'leather', {fi: 'Nahkasohva', ru: 'Кожаный диван', en: 'Leather sofa'}, false),
  G(10, 'parisanky', 'beds', {fi: 'Parisänky', ru: 'Двуспальная кровать', en: 'Double bed'}, false)
];

/** Demo reviews are seeded as drafts (is_published = false) and never shown on the site. */
export const seedDraftReviews = [
  {author: 'Demo-asiakas', rating: 5, locale: 'fi', source: 'site', text: 'DEMO — korvaa oikealla arvostelulla ja julkaise hallintapaneelista.'},
  {author: 'Демо-клиент', rating: 5, locale: 'ru', source: 'site', text: 'ДЕМО — замените настоящим отзывом и опубликуйте в админке.'},
  {author: 'Demo customer', rating: 5, locale: 'en', source: 'site', text: 'DEMO — replace with a real review and publish it in the admin panel.'}
] as const;
