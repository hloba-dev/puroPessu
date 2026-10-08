import type {BusinessPage} from '../types';

export const business: BusinessPage = {
  metaTitle: 'Huonekalujen pesu yrityksille — laskulla, myös iltaisin',
  metaDescription:
    'Toimistotuolien, aulasohvien ja vastaanottojen kalusteiden pesu paikan päällä pääkaupunkiseudulla. Laskulla, sopimuspesuna ja aukioloaikojen ulkopuolella.',
  badge: 'Yrityksille · laskulla',
  h1: 'Tekstiilikalusteiden pesu yrityksille pääkaupunkiseudulla',
  intro:
    'Pesemme toimistojen, hotellien, ravintoloiden ja vastaanottojen verhoillut kalusteet paikan päällä. Työ tehdään teille sopivaan aikaan, ja maksu hoituu laskulla. Kertapesu tai säännöllinen sopimuspesu – kumpikin onnistuu.',
  method: {
    title: 'Menetelmä liiketiloihin',
    paragraphs: [
      'Käytämme höyrypesua ja tehokasta imua. Kuuma vesi irrottaa lian, ja lika imetään kankaasta pois yhdessä pesuaineen kanssa. Kankaaseen ei jää pesuainejäämiä, jotka keräisivät likaa nopeasti uudelleen. Ilman apua kalusteet kuivuvat tyypillisesti 4–8 tunnissa. Nopeutamme kuivumista puhaltimilla, ja kuivatus sisältyy aina hintaan.',
      'Pesuaineemme ovat allergiaystävällisiä ja biohajoavia, eikä niistä jää tiloihin voimakasta tuoksua. Teemme työn mielellään aikaisin aamulla ennen aukioloaikaa, illalla tai viikonloppuna, jotta asiakkaidenne ja henkilökuntanne arki ei keskeydy.',
    ],
  },
  segments: [
    {
      id: 'toimistot',
      title: 'Toimistot',
      text: 'Toimistotuolit likaantuvat huomaamatta: istuin tummuu ja käsinojiin kertyy rasvaa. Pesemme tuolit, aulan sohvat ja neuvotteluhuoneiden istuimet työpäivän jälkeen, joten aamulla tilat ovat taas käytössä.',
      bullets: [
        'Toimistotuolit',
        'Aulan ja taukotilojen sohvat',
        'Neuvotteluhuoneiden tuolit',
        'Puhelinkoppien ja akustiikkapaneelien kangaspintojen täsmäpuhdistus',
      ],
    },
    {
      id: 'hotellit-ravintolat',
      title: 'Hotellit ja ravintolat',
      text: 'Ravintolan sohvat ja tuolit joutuvat koville joka päivä. Hotellissa siistit patjat ja sängynpäädyt ovat osa vieraan kokemusta. Pesemme kalusteet sulkemisajan jälkeen tai vieraiden välissä.',
      bullets: [
        'Ravintolan penkit, sohvat ja tuolit',
        'Hotellin aulan kalusteet',
        'Patjat ja sängynpäädyt vieraiden välissä',
        'Hajunpoisto pesun yhteydessä',
      ],
    },
    {
      id: 'terveydenhuolto',
      title: 'Klinikat ja vastaanotot',
      text: 'Lääkäri-, hammaslääkäri- ja fysioterapiavastaanottojen odotustiloissa istuu päivittäin paljon ihmisiä. Käytämme hajusteettomia, allergiaystävällisiä tuotteita ja pesemme kalusteet vastaanottoaikojen ulkopuolella.',
      bullets: [
        'Odotustilojen tuolit ja sohvat',
        'Henkilökunnan taukotilojen kalusteet',
        'Hajusteettomat, allergiaystävälliset pesuaineet',
        'Työ vastaanottoaikojen ulkopuolella',
      ],
    },
  ],
  prices: {
    title: 'Hinnat',
    lead: 'Yritysten hinnat perustuvat julkiseen hinnastoomme. Yritysalennuksista sovitaan tapauskohtaisesti määrän mukaan, ja säännöllisestä sopimuspesusta teemme erillisen tarjouksen.',
    note: 'Tämän sivun hinnat sisältävät arvonlisäveron. Laskulla arvonlisävero näkyy eriteltynä.',
  },
  example: {
    title: 'Esimerkki: toimiston sopimuspesu',
    lead: 'Toimistossa on {chairs} työtuolia ja aulassa kolmen istuttava sohva. Kalusteet pestään {times} kertaa vuodessa.',
    lines: ['{chairs} toimistotuolia × {chairPrice}', 'Kolmen istuttava aulasohva: {sofaPrice}'],
    total: 'Yhteensä {total} / käynti',
    note: 'Luvut on laskettu julkisen hinnaston mukaan. Sopimuspesun hinta sovitaan tarjouksella, ja se voi olla tätä edullisempi.',
  },
  terms: {
    title: 'Näin yhteistyö toimii',
    items: [
      {
        title: 'Laskulla',
        text: 'Yritykset maksavat laskulla. Maksuehdosta sovitaan tarjouksen yhteydessä.',
      },
      {
        title: 'Teille sopivaan aikaan',
        text: 'Työskentelemme joka päivä, myös iltaisin ja viikonloppuisin. Pesu onnistuu aikaisin aamulla ennen aukioloaikaa, illalla tai viikonloppuna.',
      },
      {
        title: 'Sopimuspesu 2–12 kertaa vuodessa',
        text: 'Käyntitiheys sovitaan tilojen käytön mukaan, ja me pidämme aikataulusta huolen.',
      },
      {
        title: 'Yksi yhteyshenkilö ja kirjallinen tarjous',
        text: 'Saatte yhden yhteyshenkilön ja kirjallisen tarjouksen, josta näkyy, mitä pestään ja mihin hintaan.',
      },
    ],
  },
  form: {
    title: 'Pyydä tarjous',
    lead: 'Kertokaa lyhyesti kohteesta ja liittäkää halutessanne enintään 30 kuvaa, niin lähetämme kirjallisen tarjouksen.',
  },
  faqTitle: 'Usein kysyttyä yrityksiltä',
  faq: [
    {
      q: 'Voiko pesun maksaa laskulla?',
      a: 'Kyllä. Yritysasiakkaat maksavat laskulla, ja maksuehto sovitaan tarjouksen yhteydessä. Arvonlisävero näkyy laskulla eriteltynä.',
    },
    {
      q: 'Voitteko tulla aukioloaikojen ulkopuolella?',
      a: 'Kyllä. Työskentelemme joka päivä, myös iltaisin ja viikonloppuisin, joten pesu voidaan ajoittaa niin, ettei se häiritse asiakkaita tai henkilökuntaa.',
    },
    {
      q: 'Kuinka pian tiloja voi käyttää pesun jälkeen?',
      a: 'Ilman apua kalusteet kuivuvat tyypillisesti 4–8 tunnissa materiaalista ja ilmanvaihdosta riippuen. Nopeutamme kuivumista puhaltimilla, ja kuivatus sisältyy aina hintaan. Illalla pestyt kalusteet ovat yleensä käyttökunnossa seuraavana aamuna.',
    },
    {
      q: 'Miten tarjous tehdään?',
      a: 'Useimmiten kuvat riittävät. Lähettäkää lomakkeella kuvia kalusteista ja kertokaa niiden määrä, niin teemme kirjallisen tarjouksen. Tarvittaessa käymme katsomassa kohteen paikan päällä.',
    },
    {
      q: 'Onko yrityksille vähimmäistilaus?',
      a: 'Yrityksille pätee sama vähimmäistilaus kuin kaikille muillekin. Se näkyy hinnastossa.',
    },
    {
      q: 'Kuinka usein sopimuspesu kannattaa tehdä?',
      a: 'Se riippuu kuormituksesta. Vilkkaassa ravintolassa tai odotustilassa pesu voi olla tarpeen jopa kuukausittain, toimistossa usein riittää pari kertaa vuodessa. Sopimuksen voi tehdä 2–12 käynnille vuodessa.',
    },
    {
      q: 'Mitä pesuaineita käytätte? Entä allergiat?',
      a: 'Käytämme allergiaystävällisiä, biohajoavia pesuaineita, joista ei jää voimakasta tuoksua. Pesuaine huuhdellaan ja imetään pois, joten kankaaseen ei jää jäämiä.',
    },
  ],
};
