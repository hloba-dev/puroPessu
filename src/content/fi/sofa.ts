import type {ServiceLanding} from '../types';

export const sofa: ServiceLanding = {
  metaTitle: 'Sohvan pesu Helsinki, Espoo, Vantaa — alk. {price}',
  metaDescription:
    'Kangassohvan höyrypesu kotonasi Helsingissä, Espoossa ja Vantaalla alk. {price}. Tahranpoisto ja hajunpoisto sisältyvät hintaan, maksu vasta työn jälkeen.',
  breadcrumb: 'Sohvan pesu',
  badge: 'Kangassohvat ja nojatuolit',
  h1: 'Sohvan pesu pääkaupunkiseudulla — höyrypesu kotonasi',
  intro:
    'Pesemme kangassohvat ja nojatuolit paikan päällä, joten sohvaa ei tarvitse kantaa mihinkään. Hinnat alkaen {price}, ja aikoja on joka päivä klo {from}–{to}, myös iltaisin ja viikonloppuisin. Pesun jälkeen kuivatamme sohvan puhaltimilla, ja kuivatus sisältyy aina hintaan. Maksat vasta, kun työ on tehty.',
  prices: {
    title: 'Sohvan pesun hinnat',
    lead: 'Hinta määräytyy sohvan koon ja mallin mukaan. Näet kiinteän hinnan jo varausta tehdessäsi. Ensitilaajan alennus ja pakettitarjoukset näkyvät hinnastossa ja varauksessa.',
    note: 'Vähimmäistilaus on {min}. Varauksessa näkyvä hinta on lopullinen. Voit liittää varaukseen kuvia. Jos niissä näkyy hyvin likainen huonekalu, otamme yhteyttä ja sovimme hinnan ennen käyntiä.',
  },
  gallery: {
    title: 'Ennen ja jälkeen',
    lead: 'Kuvia sohvista, jotka olemme pesseet asiakkaiden kotona pääkaupunkiseudulla.',
  },
  promise: {
    title: 'Rehellisesti tahroista',
    paragraphs: [
      'Suurin osa tahroista lähtee: kahvi, ruoka, rasva, lika ja käytössä kertynyt harmaus. Esikäsittelemme jokaisen tahran sen mukaan, mistä se on peräisin.',
      'Kaikki tahrat eivät silti katoa kokonaan. Vanha ja kiinnittynyt tahra, valkaisuaineen jälki tai farkuista tarttunut väri voi vaalentua mutta jäädä näkyviin. Sanomme sen suoraan ennen kuin aloitamme.',
      'Jos et ole tyytyväinen lopputulokseen, pesemme uudelleen veloituksetta. Se on tyytyväisyystakuumme.',
    ],
  },
  why: {
    title: 'Miksi Puro',
    items: [
      {
        title: 'Pesu kotonasi',
        text: 'Tulemme paikan päälle välineinemme. Sohva pysyy paikallaan, ja voit jatkaa päivääsi samalla.',
      },
      {
        title: 'Kuuma höyry ja tehokas imu',
        text: 'Höyry irrottaa lian syvältä kankaasta, ja imu vie sen pois pesuaineen kanssa. Kankaaseen ei jää jäämiä, jotka keräisivät uutta likaa.',
      },
      {
        title: 'Hellävaraiset pesuaineet',
        text: 'Käytämme allergiaystävällisiä ja biohajoavia pesuaineita. Ne sopivat koteihin, joissa on lapsia ja lemmikkejä.',
      },
      {
        title: 'Kiinteä hinta, ei ennakkomaksua',
        text: 'Näet hinnan ennen varausta. Maksat vasta, kun olet nähnyt lopputuloksen.',
      },
      {
        title: 'Kuivatus puhaltimilla veloituksetta',
        text: 'Pesun jälkeen jätämme sohvan kuivumaan puhaltimien avulla. Kuivatus sisältyy aina hintaan, eikä siitä tule lisämaksua.',
      },
    ],
  },
  process: {
    title: 'Näin sohvan pesu etenee',
    steps: [
      {
        title: 'Tarkistus',
        text: 'Katsomme kankaan, pesuohjelapun ja tahrat. Kerromme, mitä on odotettavissa, ennen kuin aloitamme.',
      },
      {
        title: 'Imurointi',
        text: 'Imuroimme murut, pölyn ja karvat myös saumoista ja tyynyjen alta.',
      },
      {
        title: 'Tahranpoisto',
        text: 'Esikäsittelemme tahrat ja likaisimmat kohdat, kuten käsinojat ja niskatyynyt, tahran laatuun sopivalla aineella.',
      },
      {
        title: 'Höyrypesu ja imu',
        text: 'Pesemme koko pinnan kuumalla höyryllä ja imemme lian ja pesuaineen pois. Kangas jää vain kosteaksi, ei märäksi.',
      },
      {
        title: 'Kuivatus puhaltimilla',
        text: 'Lopuksi kuivatamme sohvan puhaltimilla. Kuivatus on aina veloituksetta mukana hinnassa, ja neuvomme vielä tuuletuksessa.',
      },
    ],
  },
  odor: {
    title: 'Hajunpoisto sisältyy hintaan',
    lead: 'Haju istuu usein syvemmällä kuin tahra – pehmusteessa ja saumoissa. Käsittelemme hajun lähteen samalla pesukerralla, eikä siitä veloiteta erikseen.',
    cases: [
      {
        title: 'Koira ja muut lemmikit',
        text: 'Lemmikin haju kertyy kankaaseen vähitellen. Imuroimme karvat ensin pois, ja pesu raikastaa koko sohvan.',
      },
      {
        title: 'Virtsa tai oksennus',
        text: 'Vahinko kannattaa pestä mahdollisimman pian. Mitä vähemmän neste on ehtinyt imeytyä pehmusteeseen, sitä paremmin haju lähtee.',
      },
      {
        title: 'Tupakansavu',
        text: 'Savu tarttuu kankaaseen ja pehmusteisiin. Pesu poistaa kellertävän kalvon ja suurimman osan hajusta.',
      },
      {
        title: 'Lasten tahrat',
        text: 'Maito ja mehu alkavat haista kuivuttuaan kankaaseen. Poistamme tahran ja hajun samalla kertaa.',
      },
    ],
    insurance:
      'Pyydettäessä kirjoitamme pesusta lyhyen selvityksen vakuutusyhtiötäsi varten, esimerkiksi lemmikin aiheuttaman vahingon tai vesivahingon jälkeen.',
    linkLabel: 'Lue lisää hajunpoistosta',
  },
  materials: {
    title: 'Mitkä kankaat pesemme',
    lead: 'Useimmat sohvakankaat kestävät höyrypesun hyvin. Tarkistamme aina pesuohjelapun ja kokeilemme epävarmaa kangasta ensin huomaamattomaan kohtaan.',
    suitable: [
      {
        title: 'Mikrokuitu',
        text: 'Yleisin sohvakangas. Kestää höyrypesun hyvin, ja tahrat irtoavat siitä yleensä helposti.',
      },
      {
        title: 'Villa ja villasekoite',
        text: 'Pesemme miedolla aineella ja maltillisella lämmöllä, jotta kuidut eivät huovu.',
      },
      {
        title: 'Alcantara',
        text: 'Mokkamainen tekokuitu puhdistuu hyvin. Harjaamme nukan pesun jälkeen tasaiseksi.',
      },
      {
        title: 'Bouclé',
        text: 'Kiharainen lanka kerää likaa silmukoihinsa. Pesemme kevyellä otteella, ettei pinta nukkaannu.',
      },
      {
        title: 'Sametti',
        text: 'Harjaamme nukan pesun jälkeen samaan suuntaan, jotta pinta kuivuu tasaisena.',
      },
      {
        title: 'Polyesteri',
        text: 'Kestävä kangas, joka sietää kuuman höyryn ja tehokkaan tahranpoiston.',
      },
      {
        title: 'Chenille',
        text: 'Pehmeä nukkapinta. Vältämme liikaa kosteutta, jotta kangas ei jää laikukkaaksi.',
      },
      {
        title: 'Puuvillasekoite',
        text: 'Puuvilla imee vettä ja kuivuu hitaammin, joten pesemme sen maltillisella kosteudella.',
      },
    ],
    exceptionsTitle: 'Mitä emme pese',
    exceptions: [
      {
        title: 'Aito mokka ja nupukki',
        text: 'Nahkaa ei pestä vedellä. Mokka ja nupukki tummuvat ja kovettuvat märkäpesussa.',
      },
      {
        title: 'Silkki',
        text: 'Silkkiverhoilu ei kestä märkäpesua, joten emme ota sitä pestäväksi.',
      },
      {
        title: 'Pellava ja viskoosi',
        text: 'Nämä voivat kutistua tai saada vesirenkaita. Pesemme ne vain tapauskohtaisesti, kun olemme tarkistaneet kankaan ennen aloittamista.',
      },
    ],
  },
  compare: {
    title: 'Vuokrapesuri vai ammattilainen?',
    lead: 'Vuokrapesurilla sohvan saa raikkaammaksi, mutta tulos ja riskit eroavat ammattipesusta. Tässä tärkeimmät erot.',
    headers: {aspect: 'Vertailukohta', rental: 'Vuokrapesuri', pro: 'Ammattilainen'},
    rows: [
      {
        aspect: 'Lämpö',
        rental: 'Lämmin vesi, joka ei irrota rasvaa kunnolla',
        pro: 'Kuuma höyry irrottaa rasvan ja lian syvältä',
      },
      {
        aspect: 'Imuteho ja kuivumisaika',
        rental: 'Heikko imu, kangas jää märäksi ja kuivuu hitaasti',
        pro: 'Tehokas imu ja kuivatus puhaltimilla, joka sisältyy hintaan',
      },
      {
        aspect: 'Pesuainejäämät',
        rental: 'Ainetta jää helposti kankaaseen keräämään likaa',
        pro: 'Pesuaine huuhdellaan ja imetään pois',
      },
      {
        aspect: 'Aika ja vaiva',
        rental: 'Pesurin haku, pesu ja palautus vievät helposti puoli päivää',
        pro: 'Tulemme kotiisi, sinun ei tarvitse tehdä mitään',
      },
      {
        aspect: 'Vesirenkaiden riski',
        rental: 'Liika vesi jättää helposti renkaita ja laikkuja',
        pro: 'Kangas tarkistetaan ensin ja kosteus pidetään hallinnassa',
      },
      {
        aspect: 'Kokonaiskustannus',
        rental: 'Vuokra, pesuaine ja oma aika – eikä tulosta taata',
        pro: 'Kiinteä hinta, näet sen ennen varausta',
      },
    ],
    linkLabel: 'Katso koko vertailu',
  },
  areaTitle: 'Sohvan pesu koko pääkaupunkiseudulla',
  areaLead:
    'Tulemme Helsinkiin, Espooseen, Vantaalle, Kauniaisiin ja kauemmaksikin – matkakulu lasketaan postinumerosta varauksen yhteydessä.',
  faqTitle: 'Usein kysyttyä sohvan pesusta',
  faq: [
    {
      q: 'Kuinka kauan sohva kuivuu?',
      a: 'Ilman apua kangassohva kuivuu tyypillisesti 4–8 tunnissa. Aikaan vaikuttavat kangas, pehmusteen paksuus ja huoneen ilmanvaihto. Nopeutamme kuivumista puhaltimilla, ja kuivatus sisältyy aina hintaan.',
    },
    {
      q: 'Lähtevätkö kaikki tahrat?',
      a: 'Useimmat lähtevät. Vanhat ja kiinnittyneet tahrat, valkaisuaineen jäljet ja farkuista tarttunut väri voivat vaalentua mutta jäädä näkyviin. Kerromme arviomme ennen kuin aloitamme.',
    },
    {
      q: 'Miten valmistaudun pesuun?',
      a: 'Ota sohvalta pois peitot, tavarat ja irtotyynyt, joita ei pestä, ja jätä sen ympärille vähän tilaa. Jos tiedät, mistä tahrat ovat peräisin, kerro siitä meille. Muuta valmistelua ei tarvita.',
    },
    {
      q: 'Sopiiko pesu kotiin, jossa on lapsia tai lemmikkejä?',
      a: 'Sopii. Käytämme allergiaystävällisiä ja biohajoavia pesuaineita, jotka imetään pesun lopuksi pois kankaasta. Pidä lemmikit poissa sohvalta, kunnes se on kuivunut.',
    },
    {
      q: 'Kauanko pesu kestää?',
      a: 'Tavallisen sohvan pesu ei vie koko päivää. Kesto riippuu sohvan koosta, mallista ja tahrojen määrästä, ja kerromme arvion, kun olemme nähneet sohvan.',
    },
    {
      q: 'Mitä materiaaleja ette pese?',
      a: 'Emme pese aitoa mokkaa, nupukkia emmekä silkkiä. Pellavan ja viskoosin pesemme vain tarkistuksen jälkeen, koska ne voivat kutistua tai saada vesirenkaita. Nahkasohville meillä on oma, käsin tehtävä puhdistus.',
    },
    {
      q: 'Milloin maksan?',
      a: 'Maksat vasta, kun työ on tehty ja olet nähnyt lopputuloksen. Ennakkomaksua ei ole, ja varauksessa näkyvä hinta on lopullinen.',
    },
    {
      q: 'En tiedä sohvan kokoa tai kangasta. Mitä teen?',
      a: 'Lähetä kuva sohvasta ja sen pesuohjelapusta WhatsAppissa. Katsomme kuvan ja kerromme, mikä hinta ja menetelmä sopivat.',
    },
    {
      q: 'Kuinka usein sohva kannattaa pestä?',
      a: 'Päivittäisessä käytössä oleva sohva kannattaa pestä noin kerran vuodessa, lapsiperheissä ja lemmikkikodeissa tarvittaessa useammin. Säännöllinen imurointi pidentää pesuväliä.',
    },
  ],
  cta: {
    title: 'Varaa sohvan pesu',
    text: 'Valitse vapaa aika netissä – näet hinnan ennen varausta ja maksat vasta työn jälkeen.',
  },
};
