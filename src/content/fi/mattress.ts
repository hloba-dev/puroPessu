import type {ServiceLanding} from '../types';

export const mattress: ServiceLanding = {
  metaTitle: 'Patjan pesu Helsinki, Espoo, Vantaa — alk. {price}',
  metaDescription:
    'Patjan ja sängyn höyrypesu kotonasi Helsingissä, Espoossa ja Vantaalla alk. {price}. Hiki- ja virtsatahrat ja pölypunkit vähemmälle, maksu työn jälkeen.',
  breadcrumb: 'Patjan pesu',
  badge: 'Patjat ja sängyt',
  h1: 'Patjan pesu pääkaupunkiseudulla — patjat ja sängyt kotonasi',
  intro:
    'Pesemme jousipatjat, runkopatjat, sijauspatjat ja lasten patjat kuumalla höyryllä suoraan makuuhuoneessa. Hinnat alkaen {price}, ja aamuaikoja on jo klo {from} alkaen, joten patjalla on koko päivä aikaa kuivua. Nopeutamme kuivumista puhaltimilla, ja kuivatus sisältyy aina hintaan.',
  prices: {
    title: 'Patjan pesun hinnat',
    lead: 'Hinta riippuu patjan koosta ja tyypistä – yhden hengen patja, parisänky tai sijauspatja. Ensitilaajan alennus ja pakettitarjoukset näkyvät hinnastossa ja varauksessa.',
    note: 'Vähimmäistilaus on {min}. Varauksessa näkyvä hinta on lopullinen. Voit liittää varaukseen kuvia. Jos niissä näkyy hyvin likainen patja, otamme yhteyttä ja sovimme hinnan ennen käyntiä.',
  },
  gallery: {
    title: 'Ennen ja jälkeen',
    lead: 'Patjoja, jotka olemme pesseet pääkaupunkiseudun kodeissa.',
  },
  promise: {
    title: 'Rehellisesti patjan tahroista',
    paragraphs: [
      'Tuoreet virtsa-, oksennus- ja juomatahrat sekä patjan yleinen harmaus lähtevät useimmiten hyvin. Esikäsittelemme tahrat ennen höyrypesua.',
      'Vanhat, kellastuneet hikitahrat ovat imeytyneet syvälle kankaaseen. Ne vaalenevat selvästi, mutta eivät aina katoa kokonaan. Kerromme tämän ennen kuin aloitamme.',
      'Jos lopputulos ei miellytä, pesemme patjan uudelleen veloituksetta.',
    ],
  },
  why: {
    title: 'Miksi Puro',
    items: [
      {
        title: 'Pesu makuuhuoneessa',
        text: 'Patjaa ei tarvitse kantaa minnekään. Pesemme sen sängyssä tai lattialla.',
      },
      {
        title: 'Hallittu kosteus',
        text: 'Patjaan ei saa jäädä vettä. Käytämme vain sen verran kosteutta kuin pesu vaatii, ja tehokas imu vie loput pois.',
      },
      {
        title: 'Kuuma höyry',
        text: 'Höyry irrottaa kankaasta hien, ihohilseen ja lian – samalla pölypunkit menettävät ravintoaan.',
      },
      {
        title: 'Allergiaystävälliset aineet',
        text: 'Biohajoavat ja allergiaystävälliset pesuaineet imetään pesun lopuksi pois, joten patjaan ei jää jäämiä.',
      },
      {
        title: 'Kuivatus puhaltimilla veloituksetta',
        text: 'Pesun jälkeen kuivatamme patjan puhaltimilla. Kuivatus sisältyy aina hintaan, eikä siitä tule lisämaksua.',
      },
    ],
  },
  process: {
    title: 'Näin patjan pesu etenee',
    steps: [
      {
        title: 'Tarkistus',
        text: 'Katsomme patjan tyypin, tahrat ja mahdolliset kosteusvauriot ja kerromme, mitä on odotettavissa.',
      },
      {
        title: 'Imurointi',
        text: 'Imuroimme pinnan ja saumat. Samalla lähtee irtonainen pöly ja ihohilse.',
      },
      {
        title: 'Tahrojen esikäsittely',
        text: 'Käsittelemme virtsa-, hiki- ja muut tahrat niiden laadun mukaan.',
      },
      {
        title: 'Höyrypesu ja imu',
        text: 'Pesemme pinnan ja reunat kuumalla höyryllä ja imemme lian ja kosteuden pois. Kääntöpatjasta pesemme halutessasi molemmat puolet.',
      },
      {
        title: 'Kuivatus puhaltimilla',
        text: 'Lopuksi kuivatamme patjan puhaltimilla veloituksetta. Tuuleta huonetta ja jätä patja ilman lakanoita, kunnes se on kuiva.',
      },
    ],
  },
  odor: {
    title: 'Hajunpoisto sisältyy hintaan',
    lead: 'Patjan haju tulee yleensä siitä, mitä kankaan alle on imeytynyt. Käsittelemme hajun samalla kertaa ilman lisämaksua.',
    cases: [
      {
        title: 'Virtsa',
        text: 'Lasten ja lemmikkien vahingot ovat patjoissa yleisimpiä. Mitä nopeammin patja pestään, sitä vähemmän virtsa ehtii imeytyä täytteeseen.',
      },
      {
        title: 'Hiki',
        text: 'Vuosien aikana hikeä kertyy patjaan, ja se alkaa haista. Pesu poistaa hajua aiheuttavan lian ja raikastaa pinnan.',
      },
      {
        title: 'Oksennus',
        text: 'Poista kiinteät jäämät ja kuivaa kohta painelemalla, mutta älä hankaa. Me pesemme tahran ja hajun pois.',
      },
      {
        title: 'Ummehtunut haju',
        text: 'Ummehtunut haju syntyy, kun patja ei pääse tuulettumaan. Pesu ja kunnollinen kuivatus raikastavat sen.',
      },
    ],
    insurance:
      'Pyydettäessä kirjoitamme pesusta lyhyen selvityksen vakuutusyhtiötäsi varten, esimerkiksi lemmikin aiheuttaman vahingon tai vesivahingon jälkeen.',
    linkLabel: 'Lue lisää hajunpoistosta',
  },
  materials: {
    title: 'Mitä patjoja pesemme',
    lead: 'Lähes kaikki kodin patjat voi pestä paikan päällä. Sovitamme kosteuden ja kuivumisajan patjan rakenteeseen.',
    suitable: [
      {
        title: 'Jousipatjat',
        text: 'Tavallisin patjatyyppi. Kestää höyrypesun hyvin ja kuivuu nopeasti, kun ilma pääsee kiertämään.',
      },
      {
        title: 'Runkopatjat ja jenkkisängyt',
        text: 'Pesemme makuupinnan ja reunat. Kangasverhoillun rungon ja sängynpäädyn voi puhdistaa samalla.',
      },
      {
        title: 'Sijauspatjat',
        text: 'Sijauspatja on lähimpänä nukkujaa ja likaantuu eniten. Se kannattaa pestä samalla kertaa kuin sänky.',
      },
      {
        title: 'Vaahtomuovi ja muistivaahto',
        text: 'Vaahto imee vettä helposti, joten pesemme vähemmällä kosteudella. Kuivuminen kestää tavallista pidempään.',
      },
      {
        title: 'Lasten patjat',
        text: 'Lasten patjoille sattuu vahinkoja. Käytämme allergiaystävällisiä aineita, ja aamulla pestyllä patjalla on koko päivä aikaa kuivua.',
      },
    ],
    exceptionsTitle: 'Milloin pesu ei ole oikea ratkaisu',
    exceptions: [
      {
        title: 'Homeinen patja',
        text: 'Jos patjan sisällä on hometta, se kannattaa vaihtaa eikä pestä. Pinnan pesu ei poista hometta täytteestä.',
      },
      {
        title: 'Vanhat kellastuneet hikitahrat',
        text: 'Ne vaalenevat, mutta eivät välttämättä katoa kokonaan. Kerromme arvion ennen pesua.',
      },
      {
        title: 'Untuva- ja höyhensijauspatjat',
        text: 'Untuvatäyte vaatii pesun ja kuivauksen pesulassa, joten emme pese niitä paikan päällä.',
      },
    ],
  },
  compare: {
    title: 'Vuokrapesuri vai ammattilainen?',
    lead: 'Patjan pesussa suurin riski on liika vesi. Märkä täyte kuivuu hitaasti ja voi alkaa haista tai homehtua.',
    headers: {aspect: 'Vertailukohta', rental: 'Vuokrapesuri', pro: 'Ammattilainen'},
    rows: [
      {
        aspect: 'Kosteuden määrä',
        rental: 'Vettä menee helposti liikaa, ja se valuu syvälle täytteeseen',
        pro: 'Kosteus annostellaan patjan rakenteen mukaan',
      },
      {
        aspect: 'Imuteho',
        rental: 'Heikko imu jättää veden patjaan',
        pro: 'Tehokas imu vie lian ja veden pois',
      },
      {
        aspect: 'Kuivumisaika',
        rental: 'Voi venyä pitkäksi, ja patja jää kosteaksi yöksi',
        pro: 'Kuivatus puhaltimilla nopeuttaa kuivumista ja sisältyy hintaan',
      },
      {
        aspect: 'Lämpö',
        rental: 'Lämmin vesi ei irrota hikeä ja rasvaa kunnolla',
        pro: 'Kuuma höyry irrottaa hien ja rasvan',
      },
      {
        aspect: 'Pesuainejäämät',
        rental: 'Aine jää täytteeseen ja kerää likaa',
        pro: 'Aine imetään pois, jäämiä ei jää',
      },
      {
        aspect: 'Kokonaiskustannus',
        rental: 'Vuokra, aineet, kuljetus ja oma aika',
        pro: 'Kiinteä hinta, näet sen ennen varausta',
      },
    ],
    linkLabel: 'Katso koko vertailu',
  },
  areaTitle: 'Patjan pesu koko pääkaupunkiseudulla',
  areaLead:
    'Tulemme Helsinkiin, Espooseen, Vantaalle, Kauniaisiin ja kauemmaksikin – matkakulu lasketaan postinumerosta varauksen yhteydessä.',
  faqTitle: 'Usein kysyttyä patjan pesusta',
  faq: [
    {
      q: 'Kuinka kauan patja kuivuu?',
      a: 'Ilman apua verhoilu kuivuu tyypillisesti 4–8 tunnissa, ja patja vielä kauemmin, vaahtomuovipatja pisimpään. Nopeutamme kuivumista puhaltimilla, ja kuivatus sisältyy aina hintaan. Suosittelemme silti aamuaikaa, jotta patjalla on koko päivä aikaa kuivua. Tuuleta huonetta kuivumisen aikana.',
    },
    {
      q: 'Lähtevätkö virtsa- ja hikitahrat?',
      a: 'Tuoreet virtsatahrat lähtevät yleensä hyvin, ja haju poistuu samalla. Vanhat, kellastuneet hikitahrat vaalenevat selvästi, mutta voivat jäädä hieman näkyviin. Arvioimme tahrat ennen pesua.',
    },
    {
      q: 'Miten valmistaudun pesuun?',
      a: 'Poista lakanat, patjansuojat ja tyynyt ja jätä sängyn ympärille tilaa. Jos haluat pestä myös sijauspatjan tai patjan molemmat puolet, kerro siitä varauksessa.',
    },
    {
      q: 'Sopiiko pesu allergiselle tai lapsen patjalle?',
      a: 'Käytämme allergiaystävällisiä ja biohajoavia pesuaineita, jotka imetään pesun lopuksi pois. Pesu vähentää patjasta pölyä, hilsettä ja pölypunkkien ravintoa, mutta se ei ole lääketieteellinen hoito.',
    },
    {
      q: 'Kauanko pesu kestää?',
      a: 'Itse pesu ei vie kauan – suurin osa ajasta kuluu kuivumiseen. Tarkka kesto riippuu patjojen määrästä, koosta ja tahroista.',
    },
    {
      q: 'Mitä patjoja ette pese?',
      a: 'Emme pese patjoja, joiden sisällä on hometta – ne kannattaa vaihtaa. Untuva- ja höyhensijauspatjat kuuluvat pesulaan. Muut kodin patjat pesemme yleensä paikan päällä.',
    },
    {
      q: 'Milloin maksan?',
      a: 'Maksat vasta pesun jälkeen. Ennakkomaksua ei ole, ja varauksessa näkyvä hinta on lopullinen.',
    },
    {
      q: 'En tiedä patjan kokoa tai tyyppiä.',
      a: 'Mittaa patjan leveys tai lähetä kuva patjasta ja sen tuotelapusta WhatsAppissa. Kerromme, mikä hinta sopii.',
    },
    {
      q: 'Kuinka usein patja kannattaa pestä?',
      a: 'Kerran vuodessa on hyvä nyrkkisääntö, allergikoille ja lapsiperheissä tarpeen mukaan useammin. Patjansuoja pidentää pesuväliä, ja sen voi pestä koneessa säännöllisesti.',
    },
  ],
  cta: {
    title: 'Varaa patjan pesu',
    text: 'Valitse aamuaika, niin patjalla on koko päivä aikaa kuivua. Hinta näkyy ennen varausta, ja maksat vasta työn jälkeen.',
  },
};
