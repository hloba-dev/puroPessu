import type {CareProductsPage} from '../types';

export const careProducts: CareProductsPage = {
  metaTitle: 'Huonekalujen hoitotuotteet kotiin — mitä kannattaa hankkia',
  metaDescription:
    'Mitä sohvan, nahkahuonekalujen ja patjan hoitoon kannattaa pitää kotona pesujen välillä? Tuotetyypit, oikea käyttö ja yleisimmät virheet.',
  h1: 'Hoitotuotteet kotiin',
  intro:
    'Hyvin hoidettu sohva pysyy siistinä pidempään ja kestää vuosia. Ammattipesujen välillä pärjää muutamalla perustuotteella — kunhan tietää, mitä mihinkin käyttää.',
  products: [
    {
      title: 'Valkoiset mikrokuituliinat',
      text: 'Tahran ensiapuun ja kevyeen puhdistukseen. Valkoisesta liinasta näet heti, irtoaako tahra — tai kangas.',
      use: 'Painele tahraa kevyesti, älä hankaa. Käännä liinaa puhtaalle kohdalle sitä mukaa, kun likaa siirtyy siihen.',
    },
    {
      title: 'pH-neutraali verhoilupuhdistusaine',
      text: 'Pieniin tahroihin kankaissa, jotka kestävät vettä. Tarkista huonekalun hoito-ohjeesta, että kankaan koodi on W tai W/S.',
      use: 'Testaa ensin piilossa olevaan kohtaan. Laimenna ohjeen mukaan, levitä liinalla eikä suoraan kankaalle, ja kuivaa painelemalla puhtaalla liinalla.',
    },
    {
      title: 'Nahan puhdistusaine ja hoitoaine',
      text: 'Pinnoitetun nahan säännölliseen puhdistukseen ja ravitsemiseen, jotta nahka ei kuivu eikä halkeile.',
      use: 'Testaa ensin piilossa olevaan kohtaan. Puhdista nahka, anna sen kuivua ja levitä vasta sitten hoitoaine ohuena kerroksena pehmeällä liinalla. Muutama kerta vuodessa riittää yleensä.',
    },
    {
      title: 'Tekstiilien suojasuihke',
      text: 'Hylkii nesteitä ja antaa hetken aikaa pyyhkiä roiskeen pois ennen kuin se imeytyy. Suojasuihke ei tee kankaasta tahratonta eikä korvaa pesua, ja sen teho heikkenee käytössä.',
      use: 'Testaa ensin piilossa olevaan kohtaan. Suihkuta puhtaalle ja kuivalle pinnalle ohuena kerroksena hyvin tuuletetussa tilassa ja anna kuivua ennen käyttöä.',
    },
    {
      title: 'Pehmeä verhoiluharja ja imuri verhoilusuuttimella',
      text: 'Säännöllinen imurointi poistaa pölyn, hiekan ja karvat, jotka muuten kuluttavat kangasta ja painuvat syvemmälle.',
      use: 'Imuroi kevyesti ja tyynyjen alta myös. Harjaa nukkapintaisia kankaita nukan suuntaan, ja käytä samettiin vain pehmeää harjaa.',
    },
    {
      title: 'Entsyymipohjainen tahran- ja hajunpoistaja',
      text: 'Lemmikkien vahinkoihin, kuten virtsaan ja oksennukseen. Entsyymit hajottavat orgaanisen lian, joka muuten jää haisemaan.',
      use: 'Testaa ensin piilossa olevaan kohtaan. Imeytä ensin mahdollisimman paljon nestettä pois, levitä tuote ja anna sen vaikuttaa ohjeen mukaan. Älä sekoita muihin puhdistusaineisiin.',
    },
  ],
  avoid: {
    title: 'Näitä kannattaa välttää',
    items: [
      'Valkaisuaineet ja klooripohjaiset tuotteet — ne haalistavat ja heikentävät kuitua pysyvästi.',
      'Värilliset liinat ja pyyhkeet — väri voi siirtyä kosteaan kankaaseen.',
      'Vauvan kosteuspyyhkeet nahkaan — niiden aineet kuivattavat ja voivat vahingoittaa pintaa ajan myötä.',
      'Höyrypuhdistin aniliininahkaan tai samettiin, jos et tunne materiaalia — kuumuus ja kosteus voivat jättää pysyviä jälkiä.',
      'Etikka- ja ruokasoodakikat arkoihin kankaisiin — ne voivat jättää rajoja, haalistaa väriä tai jättää jäämiä.',
      'Hiustenkuivaaja kuivatukseen — kuumuus voi kutistaa kangasta ja kiinnittää jäljelle jääneen tahran.',
    ],
  },
  note: 'Kysy meiltä pesukäynnin aikana — suosittelemme mielellämme juuri sinun kankaallesi sopivia tuotteita.',
  cta: {
    title: 'Aika syväpuhdistukselle?',
    text: 'Kotihoito pitää pinnan siistinä, mutta syvemmälle kertynyt lika ja hajut vaativat pesun. Varaa aika netissä, niin tulemme luoksesi.',
  },
};
