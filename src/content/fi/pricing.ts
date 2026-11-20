import type {PricingPage} from '../types';

export const pricing: PricingPage = {
  metaTitle: 'Hinnasto — sohvan pesu alk. {price}, vähimmäistilaus {min}',
  metaDescription:
    'Puron hinnasto: sohvien, nojatuolien ja patjojen pesu paikan päällä pääkaupunkiseudulla. Pakettihinnat ja alennukset, 30 min kuivatus kaupan päälle, ei ennakkomaksua.',
  h1: 'Hinnasto',
  intro:
    'Kaikki palvelumme löytyvät yhdestä hinnastosta. Sama hinta näkyy varauslomakkeessa ja myöhemmin laskulla. Ei piilokuluja eikä yllätyksiä paikan päällä. Ensitilaajan alennus, kanta-asiakasalennus ja pakettitarjoukset näkyvät hinnastossa ja varauksessa. Yksityisasiakkaiden hinnat sisältävät arvonlisäveron (ALV 25,5 %); yrityksille teemme tarjouksen pyynnöstä.',
  rules: {
    title: 'Näin hinnoittelemme',
    items: [
      {
        title: 'Hinta on lopullinen',
        text: 'Varauksessa näkyvä summa on se, jonka maksat. Laskulle ei tule mitään, mistä ei ole sovittu etukäteen.',
      },
      {
        title: 'Ei ennakkomaksua',
        text: 'Maksat vasta, kun työ on tehty ja olet nähnyt lopputuloksen omin silmin.',
      },
      {
        title: 'Vähimmäistilaus {min}',
        text: 'Jos tilauksesi jää tätä pienemmäksi, erotus lisätään laskulle omana rivinään. Näet sen jo varausta tehdessäsi.',
      },
      {
        title: 'Erittäin likaisista kohteista sovitaan etukäteen',
        text: 'Voit liittää varaukseen kuvia. Jos niissä näkyy poikkeuksellisen likainen huonekalu, otamme yhteyttä ja sovimme hinnan ennen käyntiä. Sinä päätät, haluatko pesun.',
      },
      {
        title: 'Alk.-hinnat tarkentuvat paikan päällä',
        text: 'Kun hinnan edessä lukee alk. (alkaen), lopullinen hinta riippuu koosta tai materiaalista. Vahvistamme sen kanssasi ennen pesua.',
      },
      {
        title: '30 min kuivatus ja hajunpoisto sisältyvät aina hintaan',
        text: 'Jokaisen pesun jälkeen kuivatamme huonekaluja puhaltimilla 30 minuuttia, ja jokaiseen pesuun kuuluu hajunpoisto. Kumpikaan ei ole lisämaksullinen. Kuivatuksen jälkeen pinta tuntuu kuivalta; kokonaan sohva kuivuu 2–3 tunnissa.',
      },
    ],
  },
  deduction: {
    title: 'Kotitalousvähennys',
    lead: 'Yksityisasiakkaana voit vähentää verotuksessa 40 % kotonasi tehdyn pesun työn osuudesta. Vähennystä on korotettu vuosille 2026–2027, ja korotus on voimassa takautuvasti 1.1.2026 alkaen.',
    registered: '{company} (Y-tunnus {yTunnus}) kuuluu ennakkoperintärekisteriin, mikä on kotitalousvähennyksen edellytys.',
    items: [
      {
        title: '40 % työn osuudesta',
        text: 'Vähennys lasketaan arvonlisäverollisesta työn osuudesta. Tarvikkeet ja matkakulut eivät kuulu siihen.',
      },
      {
        title: 'Enintään 2 100 € henkilöä kohden vuodessa',
        text: 'Vuoden vähennyksestä vähennetään 150 euron omavastuu henkilöä kohden.',
      },
      {
        title: 'Lasketaan koko vuodelta',
        text: 'Vähennys lasketaan kaikista vuoden aikana teetetyistä kotitaloustöistä, ei yhdestä pesusta. Lopullinen määrä selviää vasta verotuksessa, emmekä voi luvata tiettyä palautusta yhdestä pesusta.',
      },
      {
        title: 'Molemmat puolisot voivat hakea',
        text: 'Vähennys on henkilökohtainen: kummallakin on oma enimmäismääränsä, ja kumpikin hakee oman osuutensa.',
      },
      {
        title: 'Työn osuus näkyy laskulla',
        text: 'Erittelemme laskulle työn osuuden, josta vähennys lasketaan.',
      },
      {
        title: 'Vain yksityishenkilöille ja kotona tehtyyn työhön',
        text: 'Vähennys koskee kotona tai vapaa-ajan asunnolla tehtyä pesua. Yritykset eivät voi saada sitä, eikä se koske auton verhoilun pesua.',
      },
    ],
    note: 'Haet vähennystä itse veroilmoituksellasi. Ajantasaiset ehdot löydät Verohallinnon sivuilta:',
    linkLabel: 'vero.fi — kotitalousvähennys',
  },
  travel: {
    title: 'Matkakulut',
    lead: 'Matkakulu lasketaan automaattisesti postinumerosi perusteella, kun teet varauksen. Lähialueella matka on maksuton.',
  },
  photoHint:
    'Etkö ole varma koosta tai materiaalista? Lähetä kuva WhatsAppissa, niin kerromme, mikä hinnaston rivi sopii.',
  faqTitle: 'Usein kysyttyä hinnoista',
  faq: [
    {
      q: 'Mitä hintaan sisältyy?',
      a: 'Tahrojen esikäsittely, pesu ja imu, hajunpoisto, 30 minuutin kuivatus puhaltimilla sekä ammattipesuaineet ja laitteet. Pesemme paikan päällä, joten huonekalua ei tarvitse kuljettaa minnekään.',
    },
    {
      q: 'Miksi on vähimmäistilaus?',
      a: 'Jokaiseen käyntiin kuluu aikaa matkaan, laitteiden kantamiseen ja valmisteluun, oli tilaus pieni tai iso. Vähimmäistilaus kattaa nämä kulut. Moni yhdistääkin samaan käyntiin esimerkiksi sohvan ja patjan.',
    },
    {
      q: 'Sisältävätkö hinnat arvonlisäveron?',
      a: 'Kyllä. Kaikki hinnaston hinnat sisältävät arvonlisäveron.',
    },
    {
      q: 'Voiko hinta muuttua paikan päällä?',
      a: 'Ei ilman sinun hyväksyntääsi. Hinta voi muuttua vain, jos huonekalu on eri kokoa tai materiaalia kuin varauksessa. Silloin kerromme uuden hinnan ennen aloitusta, ja sinä päätät. Erittäin likaisista huonekaluista sovimme varaukseen liitettyjen kuvien perusteella jo ennen käyntiä.',
    },
    {
      q: 'Saako pesusta kotitalousvähennyksen?',
      a: 'Kotona tehtävä huonekalujen pesu voi oikeuttaa kotitalousvähennykseen työn osuudesta. Tarkista ajantasaiset ehdot Verohallinnon sivuilta osoitteesta vero.fi ennen kuin haet vähennystä.',
    },
    {
      q: 'Milloin maksan?',
      a: 'Vasta pesun jälkeen, kun olet tarkistanut lopputuloksen. Ennakkomaksua ei peritä, eikä varauksesta veloiteta mitään etukäteen.',
    },
  ],
  cta: {
    title: 'Katso vapaat ajat',
    text: 'Valitse huonekalut ja syötä postinumerosi, niin näet lopullisen hinnan ja vapaat ajat heti.',
  },
};
