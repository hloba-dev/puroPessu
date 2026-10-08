import type {ServiceLanding} from '../types';

export const leather: ServiceLanding = {
  metaTitle: 'Nahkasohvan puhdistus Helsinki — alk. {price}, paikan päällä',
  metaDescription:
    'Nahkasohvan ja nojatuolin puhdistus kotonasi pääkaupunkiseudulla alk. {price}. Käsin nahalle sopivilla aineilla, ja kuivatus puhaltimilla sisältyy hintaan.',
  breadcrumb: 'Nahkasohvan puhdistus',
  badge: 'Nahka ja keinonahka',
  h1: 'Nahkasohvan puhdistus Helsingissä — käsin, kotonasi',
  intro:
    'Puhdistamme nahkasohvat ja -nojatuolit käsin nahalle tarkoitetuilla aineilla, ilman höyryä ja liikaa kosteutta. Hinnat alkaen {price}, ja tulemme joka päivä klo {from}–{to}. Puhdistuksen päätteeksi kuivatamme pinnan ja saumat puhaltimilla, ja kuivatus sisältyy aina hintaan.',
  prices: {
    title: 'Nahkasohvan puhdistuksen hinnat',
    lead: 'Hinta riippuu sohvan koosta ja mallista. Kuivatus puhaltimilla sisältyy aina hintaan.',
    note: 'Vähimmäistilaus on {min}. Varauksessa näkyvä hinta on lopullinen. Voit liittää varaukseen kuvia. Jos niissä näkyy hyvin likainen nahka, otamme yhteyttä ja sovimme hinnan ennen käyntiä.',
  },
  gallery: {
    title: 'Ennen ja jälkeen',
    lead: 'Nahkasohvia, jotka olemme puhdistaneet asiakkaiden kotona.',
  },
  promise: {
    title: 'Mitä puhdistus voi luvata',
    paragraphs: [
      'Nahasta lähtevät yleensä hyvin rasva, käsien jättämä kiilto, pöly ja useimmat ruokatahrat. Puhdistuksen jälkeen pinta näyttää tasaisemmalta ja tuntuu taas pehmeältä.',
      'Vanhat imeytyneet tahrat ja farkuista tarttunut väri voivat vaalentua mutta jäädä osittain näkyviin. Haljennutta tai hilseilevää pintaa puhdistus ei korjaa. Kerromme tämän rehellisesti ennen kuin aloitamme.',
      'Jos et ole tyytyväinen lopputulokseen, puhdistamme uudelleen veloituksetta.',
    ],
  },
  why: {
    title: 'Miksi Puro',
    items: [
      {
        title: 'Käsityönä',
        text: 'Nahka puhdistetaan käsin pehmeällä harjalla ja liinalla. Ei höyryä eikä kovaa hankausta.',
      },
      {
        title: 'Nahalle sopivat aineet',
        text: 'Käytämme nahalle tarkoitettuja puhdistusaineita, jotka eivät kuivata pintaa eivätkä irrota väriä.',
      },
      {
        title: 'Kuivatus puhaltimilla veloituksetta',
        text: 'Kuivatamme pinnan ja saumat puhaltimilla puhdistuksen päätteeksi. Kuivatus sisältyy aina hintaan, eikä siitä tule lisämaksua.',
      },
      {
        title: 'Paikan päällä',
        text: 'Sohvaa ei tarvitse kuljettaa minnekään. Puhdistamme sen siinä, missä se on.',
      },
      {
        title: 'Maksu työn jälkeen',
        text: 'Kiinteä hinta näkyy jo varauksessa, eikä ennakkomaksua ole.',
      },
    ],
  },
  process: {
    title: 'Näin nahkasohvan puhdistus etenee',
    steps: [
      {
        title: 'Tarkistus ja nahkatyypin testi',
        text: 'Selvitämme, onko nahka pigmentoitua, puolianiliinia vai aniliinia, ja kokeilemme ainetta huomaamattomaan kohtaan.',
      },
      {
        title: 'Saumojen imurointi',
        text: 'Imuroimme murut ja pölyn saumoista ja tyynyjen väleistä, jotta ne eivät naarmuta pintaa puhdistuksen aikana.',
      },
      {
        title: 'Puhdistus käsin',
        text: 'Vaahdotamme nahkapuhdistusaineen ja käymme pinnan läpi pehmeällä harjalla osa kerrallaan.',
      },
      {
        title: 'Pyyhintä ja kuivaus',
        text: 'Pyyhimme lian ja aineen pois mikrokuituliinalla. Pinnalle ei jää ylimääräistä kosteutta.',
      },
      {
        title: 'Kuivatus puhaltimilla',
        text: 'Lopuksi kuivatamme pinnan ja saumat puhaltimilla. Kuivatus on aina mukana hinnassa veloituksetta, ja neuvomme, miten hoidat nahkaa jatkossa.',
      },
    ],
  },
  odor: {
    title: 'Hajut nahkasohvassa',
    lead: 'Nahan pinta ei juuri ime hajua, mutta saumat, ompeleet ja pehmusteet imevät. Hajunpoisto sisältyy puhdistuksen hintaan.',
    cases: [
      {
        title: 'Tupakansavu',
        text: 'Savu jättää pintaan kellertävän kalvon ja asettuu saumoihin. Puhdistus poistaa kalvon, ja haju vähenee selvästi.',
      },
      {
        title: 'Lemmikin haju',
        text: 'Koiran tai kissan haju kertyy kohtiin, joissa eläin makaa. Puhdistamme ne huolellisesti ja käsittelemme saumat erikseen.',
      },
      {
        title: 'Virtsavahinko',
        text: 'Pinnalta virtsa lähtee helposti, mutta saumoista se valuu pehmusteeseen. Jos se on imeytynyt syvälle, kerromme suoraan, mihin puhdistus riittää.',
      },
      {
        title: 'Hiki ja ihon rasva',
        text: 'Niskakohdat ja käsinojat keräävät rasvaa, joka tummentaa nahkaa ja alkaa haista. Puhdistus poistaa molemmat.',
      },
    ],
    insurance:
      'Pyydettäessä kirjoitamme puhdistuksesta lyhyen selvityksen vakuutusyhtiötäsi varten, esimerkiksi lemmikin aiheuttaman vahingon tai vesivahingon jälkeen.',
    linkLabel: 'Lue lisää hajunpoistosta',
  },
  materials: {
    title: 'Mitä nahkoja puhdistamme',
    lead: 'Nahkatyyppi ratkaisee menetelmän, joten testaamme sen aina ennen aloittamista.',
    suitable: [
      {
        title: 'Pigmentoitu nahka',
        text: 'Yleisin sohvanahka, jonka pinnassa on suojaava värikerros. Kestää puhdistuksen hyvin, ja ero näkyy yleensä selvästi.',
      },
      {
        title: 'Puolianiliininahka',
        text: 'Ohut suojakerros ja luonnollinen pinta. Puhdistamme miedolla aineella ja kevyellä otteella.',
      },
      {
        title: 'Aniliininahka',
        text: 'Suojaamaton ja imukykyinen nahka. Käytämme hellävaraisinta menetelmää, emmekä käytä höyryä tai paljon kosteutta.',
      },
      {
        title: 'Keinonahka',
        text: 'Puhdistuu samoilla periaatteilla kuin aito nahka. Vältämme aineita, jotka kuivattaisivat pintaa.',
      },
      {
        title: 'Liimattu nahka (bonded)',
        text: 'Puhdistamme kevyesti. Tällainen pinta kuluu ja hilseilee ajan myötä, eikä puhdistus pysäytä sitä.',
      },
    ],
    exceptionsTitle: 'Mitä puhdistus ei tee',
    exceptions: [
      {
        title: 'Mokka ja nupukki',
        text: 'Nukkapintainen nahka ei kestä samaa käsittelyä, joten emme puhdista sitä.',
      },
      {
        title: 'Haljennut tai hilseilevä pinta',
        text: 'Puhdistus ei palauta rikkoutunutta pintaa. Uudelleenvärjäys ja korjaus ovat verhoilijan työtä, eivät puhdistusta.',
      },
      {
        title: 'Farkkujen värjäämä nahka',
        text: 'Farkkujen sininen väri imeytyy vaaleaan nahkaan. Se vaalenee, mutta voi jäädä osittain näkyviin.',
      },
    ],
  },
  compare: {
    title: 'Itse vai ammattilainen?',
    lead: 'Kotikonstit tuntuvat helpoilta, mutta moni niistä vahingoittaa nahan pintaa pysyvästi.',
    headers: {aspect: 'Vertailukohta', rental: 'Itse / kotikonstit', pro: 'Ammattilainen'},
    rows: [
      {
        aspect: 'Puhdistusaine',
        rental: 'Astianpesuaine tai yleispuhdistaja kuivattaa nahkaa ja jättää kalvon',
        pro: 'Nahalle tarkoitettu, mieto puhdistusaine',
      },
      {
        aspect: 'Vauvanpyyhkeet',
        rental: 'Haalistavat ja kuivattavat pintaa vähitellen',
        pro: 'Lika irrotetaan vaahdolla ja pehmeällä harjalla',
      },
      {
        aspect: 'Alkoholi ja liuottimet',
        rental: 'Liuottavat värikerrosta ja jättävät vaaleita laikkuja',
        pro: 'Tahrat käsitellään aineella, joka on testattu nahkatyypille',
      },
      {
        aspect: 'Kosteus',
        rental: 'Märkä liina tai höyry voi jättää läikkiä ja kovettaa nahkaa',
        pro: 'Kosteus pidetään vähäisenä, ja pinta kuivataan heti',
      },
      {
        aspect: 'Hoito',
        rental: 'Ruokaöljy tai väärä rasva tekee pinnasta tahmean',
        pro: 'Neuvomme, millainen hoitoaine sopii juuri sinun nahallesi',
      },
      {
        aspect: 'Kustannus ja riski',
        rental: 'Halpa aloittaa, mutta vaurion korjaus on verhoilijan työtä',
        pro: 'Kiinteä hinta, näet sen ennen varausta',
      },
    ],
    linkLabel: 'Katso koko vertailu',
  },
  areaTitle: 'Nahkasohvan puhdistus koko pääkaupunkiseudulla',
  areaLead:
    'Tulemme Helsinkiin, Espooseen, Vantaalle, Kauniaisiin ja kauemmaksikin – matkakulu lasketaan postinumerosta varauksen yhteydessä.',
  faqTitle: 'Usein kysyttyä nahkasohvan puhdistuksesta',
  faq: [
    {
      q: 'Kuinka pian sohvaa voi käyttää?',
      a: 'Nahka puhdistetaan vähällä kosteudella, ja kuivatamme pinnan ja saumat lopuksi puhaltimilla. Kuivatus sisältyy aina hintaan. Kerromme paikan päällä, milloin sohvalle voi istua.',
    },
    {
      q: 'Lähtevätkö kaikki tahrat?',
      a: 'Rasva, lika ja useimmat ruokatahrat lähtevät hyvin. Kuulakärkikynä, vanhat imeytyneet tahrat ja farkkujen väri voivat jäädä osittain näkyviin. Kerromme arviomme ennen aloittamista.',
    },
    {
      q: 'Miten valmistaudun puhdistukseen?',
      a: 'Tyhjennä sohva tavaroista ja jätä sen ympärille tilaa liikkua. Jos sohvaa on aiemmin käsitelty jollain aineella, kerro siitä meille.',
    },
    {
      q: 'Ovatko aineet turvallisia lapsille ja lemmikeille?',
      a: 'Käytämme nahalle tarkoitettuja tuotteita, ja ylimääräinen aine pyyhitään pinnalta pois. Pidä lemmikit poissa sohvalta, kunnes pinta on kuivunut.',
    },
    {
      q: 'Kauanko puhdistus kestää?',
      a: 'Aika riippuu sohvan koosta ja likaisuudesta. Käsityö vie aikansa, mutta yleensä kaikki tehdään samalla käynnillä.',
    },
    {
      q: 'Mitä nahkoja ette puhdista?',
      a: 'Emme puhdista mokkaa emmekä nupukkia. Haljennutta tai hilseilevää pintaa emme voi korjata puhdistamalla – se on verhoilijan työtä.',
    },
    {
      q: 'Miten maksu hoidetaan?',
      a: 'Maksat vasta työn jälkeen, kun olet nähnyt tuloksen. Ennakkomaksua ei peritä.',
    },
    {
      q: 'En tiedä, mitä nahkaa sohvani on.',
      a: 'Ei hätää, se selviää paikan päällä testillä. Voit myös lähettää kuvan sohvasta ja sen tuotelapusta WhatsAppissa, niin arvioimme jo etukäteen.',
    },
    {
      q: 'Kuinka usein nahkasohva kannattaa puhdistaa?',
      a: 'Päivittäisessä käytössä oleva nahkasohva kannattaa puhdistaa ja hoitaa kerran tai kaksi vuodessa. Väliajoin riittää pölyjen pyyhkiminen kuivalla tai hieman kostealla liinalla.',
    },
  ],
  cta: {
    title: 'Varaa nahkasohvan puhdistus',
    text: 'Valitse vapaa aika netissä. Hinta näkyy ennen varausta, ja maksat vasta työn jälkeen.',
  },
};
