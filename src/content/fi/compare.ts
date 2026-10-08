import type {ComparePage} from '../types';

export const compare: ComparePage = {
  metaTitle: 'Vuokrapesuri vai ammattilainen? Rehellinen vertailu',
  metaDescription:
    'Kannattaako sohva pestä vuokrapesurilla vai tilata ammattilainen? Vertailimme tuloksen, kuivumisen, riskit ja todelliset kustannukset.',
  h1: 'Vuokrapesuri vai ammattilainen?',
  intro:
    'Vuokrapesurilla saa monesti ihan kelvollisen tuloksen, ja joskus se on täysin järkevä valinta. Siksi kerromme suoraan, missä vuokralaite riittää ja missä ero ammattilaiseen alkaa näkyä.',
  table: {
    title: 'Vertailu kohta kohdalta',
    headers: {aspect: 'Asia', rental: 'Vuokrapesuri', pro: 'Puro'},
    rows: [
      {
        aspect: 'Veden lämpötila ja höyry',
        rental: 'Lämmin vesi hanasta, laite ei yleensä lämmitä sitä itse.',
        pro: 'Kuuma höyry irrottaa rasvan ja lian kuitujen syvältä.',
      },
      {
        aspect: 'Imuteho',
        rental: 'Kotikäyttöön mitoitettu, osa vedestä jää kankaaseen.',
        pro: 'Tehokas imu vetää veden ja lian pois kankaasta ja täytteestä.',
      },
      {
        aspect: 'Kuivumisaika',
        rental: 'Usein vuorokausi tai enemmän, jos vettä jää paljon.',
        pro: 'Kuivatamme puhaltimilla, ja kuivatus sisältyy aina hintaan.',
      },
      {
        aspect: 'Pesuainejäämät',
        rental: 'Jäävät helposti kankaaseen, jolloin pinta likaantuu uudelleen nopeasti.',
        pro: 'Pesuaine huuhdellaan ja imetään pois, jäämiä ei jää.',
      },
      {
        aspect: 'Vesirenkaat ja ylikastelu',
        rental: 'Todellinen riski, varsinkin vaaleissa kankaissa.',
        pro: 'Kosteus pidetään hallinnassa, ja koko pinta käsitellään tasaisesti.',
      },
      {
        aspect: 'Tahrojen esikäsittely',
        rental: 'Yleispesuaine kaikkeen, tahran laatua on vaikea arvioida.',
        pro: 'Jokainen tahra esikäsitellään sen tyypin mukaan ennen pesua.',
      },
      {
        aspect: 'Hajut',
        rental: 'Pinnan pesu ei yleensä yllä hajun lähteeseen asti.',
        pro: 'Hajunpoisto kuuluu hintaan.',
      },
      {
        aspect: 'Aika ja vaiva',
        rental: 'Laitteen nouto ja palautus, pesu ja siivous vievät helposti puoli päivää.',
        pro: 'Tulemme kotiisi kaiken kanssa, sinä teet sillä aikaa muuta.',
      },
      {
        aspect: 'Jos jotain menee pieleen',
        rental: 'Riski on sinulla.',
        pro: 'Jos et ole tyytyväinen, pesemme uudelleen veloituksetta.',
      },
      {
        aspect: 'Kustannus',
        rental: 'Halvempi, jos oma aika ei maksa mitään.',
        pro: 'Kiinteä hinta, joka ei muutu käynnin aikana.',
      },
    ],
  },
  cost: {
    title: 'Mitä vuokraaminen oikeasti maksaa?',
    paragraphs: [
      'Pesurin vuokra on tyypillisesti noin 20–40 euroa vuorokaudelta. Siihen tulee lisäksi pesuaine, jota myydään yleensä erikseen, noin 10–20 euroa pullo.',
      'Laite pitää myös hakea ja palauttaa, usein autolla. Kun mukaan lasketaan nouto, pesu, kuivatus ja palautus, kuluu helposti puoli päivää, ja vuokra-ajan paineessa työ tehdään usein kiireellä.',
      'Kolmen istuttavan sohvan pesu maksaa meillä {price}. Hinta sisältää esikäsittelyn, pesun, huuhtelun, hajunpoiston ja kuivatuksen puhaltimilla, eikä se muutu käynnin aikana. Jos sohva on vahvatekoinen ja vain kevyesti likainen, vuokralaite voi silti olla edullisempi — kunhan muistat laskea mukaan myös oman aikasi.',
    ],
  },
  mistakes: {
    title: 'Yleisimmät virheet vuokrapesurin kanssa',
    items: [
      {
        title: 'Liikaa vettä',
        text: 'Vesi imeytyy täytteeseen asti, eikä kotikonetta saa sitä enää pois. Seurauksena on pitkä kuivuminen, ummehtunut haju ja pahimmillaan kellertäviä läikkiä.',
      },
      {
        title: 'Liikaa pesuainetta',
        text: 'Enemmän ei ole tehokkaampaa. Ylimääräinen pesuaine jää kuituihin tahmeaksi kalvoksi, joka kerää uutta likaa nopeasti.',
      },
      {
        title: 'Huuhtelu unohtuu',
        text: 'Pelkkä pesukierros jättää pesuaineen kankaaseen. Puhtaalla vedellä huuhtelu on yhtä tärkeää kuin itse pesu.',
      },
      {
        title: 'Vain tahran pesu',
        text: 'Kun pestään pelkkä tahrakohta, sen ympärille jää usein selvä raja. Koko pinta kannattaa käsitellä saumasta saumaan.',
      },
      {
        title: 'Kärsimätön kuivatus',
        text: 'Sohvaa käytetään ennen kuin se on kuiva, tai sitä kuivataan hiustenkuivaajalla. Molemmat voivat jättää jälkiä. Tuuleta huonetta ja anna ajan tehdä työnsä.',
      },
    ],
  },
  whenRental: {
    title: 'Milloin vuokrapesuri riittää',
    items: [
      'Kangas on kestävää synteettistä materiaalia, joka sietää vettä hyvin.',
      'Lika on kevyttä ja tasaista, eikä pinnassa ole vaikeita tahroja.',
      'Sinulla on aikaa tehdä työ huolella ja antaa sen kuivua rauhassa.',
      'Pestävänä on laaja kokolattiamatto, jota pitää puhdistaa säännöllisesti.',
    ],
  },
  whenPro: {
    title: 'Milloin ammattilainen kannattaa',
    items: [
      'Kankaassa on vanhoja tai tunnistamattomia tahroja.',
      'Huonekalussa on hajua, esimerkiksi lemmikin tai tupakan jäljiltä.',
      'Kangas on vaalea, arka tai sinulle tuntematon.',
      'Kyseessä on nahkasohva tai patja.',
      'Et halua käyttää vapaapäivääsi laitteen roudaamiseen ja pesemiseen.',
    ],
  },
  faqTitle: 'Usein kysyttyä',
  faq: [
    {
      q: 'Voiko vuokrapesuri pilata sohvan?',
      a: 'Harvoin kokonaan, mutta liika vesi voi jättää vesirenkaita, kutistaa joitakin kankaita tai saada täytteen haisemaan. Riski on suurin vaaleissa ja luonnonkuituisissa kankaissa.',
    },
    {
      q: 'Kauanko sohva kuivuu vuokrapesurin jälkeen?',
      a: 'Se riippuu siitä, kuinka paljon vettä kankaaseen jäi. Usein kuivuminen kestää vuorokauden tai pidempään. Ilman apua verhoilu kuivuu tyypillisesti 4–8 tunnissa, kun vettä ei jää liikaa. Me nopeutamme kuivumista puhaltimilla, ja kuivatus sisältyy aina hintaan.',
    },
    {
      q: 'Voinko pestä nahkasohvan vuokrapesurilla?',
      a: 'Emme suosittele. Nahka ei kestä kastelua, ja se voi kuivua, kovettua tai värjäytyä. Me puhdistamme nahan käsin.',
    },
    {
      q: 'Saako vuokrapesurilla poistettua hajut?',
      a: 'Pintahajuja ehkä, mutta jos haju on imeytynyt täytteeseen, pelkkä pesu ei yleensä riitä. Meillä hajunpoisto sisältyy pesun hintaan.',
    },
    {
      q: 'Kokeilin jo itse, ja tuli läikkiä. Voitteko korjata?',
      a: 'Usein voimme. Vesirenkaat ja pesuainejäämät lähtevät yleensä, kun koko pinta pestään ja huuhdellaan tasaisesti. Kerro tilanteesta etukäteen, niin arvioimme sen ennen aloittamista.',
    },
    {
      q: 'Kannattaako ensin kokeilla itse ja tilata ammattilainen vasta sitten?',
      a: 'Kevyelle lialle kestävässä kankaassa se voi toimia. Jos kyse on tahroista, hajusta tai arasta kankaasta, kannattaa kääntyä suoraan ammattilaisen puoleen — epäonnistunut kotipesu tekee työstä usein vaikeamman.',
    },
  ],
  cta: {
    title: 'Anna meidän hoitaa pesu',
    text: 'Varaa aika netissä ja valitse itsellesi sopiva hetki. Tulemme kotiisi, ja maksat vasta, kun työ on tehty.',
  },
};
