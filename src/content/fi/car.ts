import type {ServiceLanding} from '../types';

export const car: ServiceLanding = {
  metaTitle: "Auton verhoilupesu Helsinki — alk. {price}, paikan päällä",
  metaDescription:
    "Auton penkkien, mattojen ja oviverhoilujen höyrypesu kotipihallasi tai parkkihallissa Helsingissä, Espoossa ja Vantaalla. Hajunpoisto kuuluu hintaan, ei ennakkomaksua.",
  breadcrumb: "Auton verhoilupesu",
  badge: "Tulemme auton luo",
  h1: "Auton verhoilupesu Helsingissä paikan päällä",
  intro:
    "Pesemme auton penkit, matot ja oviverhoilut siellä, missä auto seisoo: kotipihalla, taloyhtiön parkkipaikalla tai parkkihallissa. Tarvitsemme vain pistorasian, vesi kulkee mukanamme. Pesun jälkeen kuivatamme sisätilan puhaltimilla, ja kuivatus sisältyy aina hintaan. Hinnat alk. {price}, ja liikumme joka päivä klo {from}–{to}.",
  prices: {
    title: "Hinnat",
    lead: "Hinta määräytyy pestävien istuinten ja osien mukaan. Näet hinnan jo varausta tehdessäsi.",
    note: "Vähimmäistilaus on {min}. ”Alk.”-merkityt hinnat vahvistetaan ennen kuin aloitamme. Voit liittää varaukseen kuvia, ja jos niissä näkyy hyvin likainen sisätila, sovimme hinnan jo ennen käyntiä. Laskussa ei ole yllätyksiä.",
  },
  gallery: {
    title: "Ennen ja jälkeen",
    lead: "Näin harmaantunut penkki muuttuu yhden pesukerran aikana.",
  },
  promise: {
    title: "Rehellisesti tahroista",
    paragraphs: [
      "Useimmat tahrat lähtevät: kahvi, maito, kura, rasva ja lasten eväät. Esikäsittelemme tahrat ja huuhtelemme ne kuumalla höyryllä pois kankaasta.",
      "Vanhat, pinttyneet tai kankaan väriä syöneet tahrat voivat vaalentua mutta jäädä näkyviin. Kerromme sen suoraan ennen kuin aloitamme.",
      "Jos et ole tyytyväinen lopputulokseen, pesemme uudelleen veloituksetta. Se on tyytyväisyystakuumme.",
    ],
  },
  why: {
    title: "Miksi Puro",
    items: [
      {
        title: "Pesu omalla pihallasi",
        text: "Autoa ei tarvitse viedä minnekään eikä jättää päiväksi pesulaan. Se pysyy koko ajan silmiesi edessä.",
      },
      {
        title: "Lika lähtee, ei vain siirry",
        text: "Höyry irrottaa lian ja imu vie sen pois yhdessä pesuaineen kanssa. Kankaaseen ei jää tahmeaa jäämää, joka keräisi uutta likaa.",
      },
      {
        title: "Hajunpoisto ilman lisämaksua",
        text: "Jos autossa haisee tupakka, koira tai kaatunut maito, käsittelemme hajun pesun yhteydessä.",
      },
      {
        title: "Miedot pesuaineet",
        text: "Käytämme allergiaystävällisiä ja biohajoavia pesuaineita, joten turvaistuin ja penkit ovat pesun jälkeen turvallisia lapsillekin.",
      },
      {
        title: "Kuivatus puhaltimilla veloituksetta",
        text: "Pesun jälkeen kuivatamme penkit ja matot puhaltimilla. Kuivatus sisältyy aina hintaan, eikä siitä tule lisämaksua.",
      },
    ],
  },
  process: {
    title: "Näin pesu etenee",
    steps: [
      {
        title: "Varaa aika verkossa",
        text: "Valitse pestävät osat ja sopiva aika. Kalenteri näyttää oikeat vapaat ajat, myös illat ja viikonloput.",
      },
      {
        title: "Tulemme paikalle",
        text: "Tarvitsemme pistorasian auton lähelle. Vesi on mukana, tai käytämme omaasi, jos se on kätevämpää.",
      },
      {
        title: "Tarkistus ja esikäsittely",
        text: "Käymme materiaalit ja tahrat läpi kanssasi ja kerromme, mitä on odotettavissa. Sitten tahrat esikäsitellään.",
      },
      {
        title: "Höyrypesu ja imu",
        text: "Pesemme verhoilun kuumalla höyryllä ja imemme lian ja kosteuden pois. Nahkapenkit puhdistamme käsin.",
      },
      {
        title: "Kuivatus puhaltimilla",
        text: "Lopuksi kuivatamme sisätilan puhaltimilla veloituksetta. Sen jälkeen ikkunoiden pitäminen raollaan tai lämmitys auttaa vielä.",
      },
    ],
  },
  odor: {
    title: "Hajut pois autosta",
    lead: "Pieni tila ja kesän lämpö voimistavat hajuja. Moni haju asuu penkin pehmusteessa, eikä se lähde tuulettamalla tai hajukuusella.",
    cases: [
      {
        title: "Kaatunut maito tai kahvi",
        text: "Maito valuu saumoista pehmusteeseen ja alkaa haista ensimmäisenä lämpimänä päivänä. Huuhtelemme sen pois syvältä.",
      },
      {
        title: "Lemmikin haju",
        text: "Koiran karvat ja haju tarttuvat kankaaseen ja mattoihin. Pesu poistaa hajun lähteen eikä vain peitä sitä.",
      },
      {
        title: "Tupakansavu",
        text: "Savu imeytyy kankaaseen ja pehmusteeseen. Pesemme penkit ja matot, ja kattoverhoilun käsittelemme varovasti kohdepesuna.",
      },
      {
        title: "Oksennus",
        text: "Kuivaa pahin pois heti ja varaa pesu. Esikäsittely hajottaa hajua aiheuttavat aineet ennen höyrypesua.",
      },
    ],
    insurance: "Saat pyynnöstä kirjallisen selvityksen tehdystä työstä vakuutusyhtiötä varten.",
    linkLabel: "Lue lisää hajunpoistosta",
  },
  materials: {
    title: "Mitä pesemme",
    lead: "Pesemme henkilöautojen, asuntoautojen ja -vaunujen sisäverhoilut. Myös yksittäisen istuimen voi tilata.",
    suitable: [
      {
        title: "Kangaspenkit",
        text: "Viisipaikkaisen auton pesuun kuuluvat penkit, matot ja oviverhoilut. Myös yksittäiset istuimet ja asuntoautojen istuinryhmät.",
      },
      {
        title: "Alcantara",
        text: "Pesemme mokkamaisen pinnan hellävaraisesti ja harjaamme nukan lopuksi suoraksi.",
      },
      {
        title: "Nahkapenkit",
        text: "Puhdistamme nahan käsin miedolla pesuaineella. Höyryä ei suunnata suoraan nahkaan.",
      },
      {
        title: "Turvaistuinten päälliset",
        text: "Murut, maito ja mehu lähtevät, kun päällinen pestään huolella koko pinnalta.",
      },
      {
        title: "Lattiamatot",
        text: "Tekstiilimatot pestään samalla kertaa, ja ne kuivuvat nopeasti auton ulkopuolella.",
      },
    ],
    exceptionsTitle: "Hyvä tietää",
    exceptions: [
      {
        title: "Kattoverhoilu",
        text: "Kattoon teemme vain kohdepesun. Jos kangas kastuu liikaa, liima voi irrota ja katto alkaa roikkua.",
      },
      {
        title: "Istuinlämmitys ja sähköt",
        text: "Lämmitetyissä ja sähkösäätöisissä penkeissä käytämme kosteutta harkiten ja imemme sen tarkasti pois.",
      },
      {
        title: "Maalipinnat ja moottoritila",
        text: "Emme kiillota maalipintaa emmekä pese moottoritilaa. Keskitymme sisäverhoiluun.",
      },
    ],
  },
  compare: {
    title: "Märkäimuri vai ammattilainen?",
    lead: "Rautakaupan märkäimurilla saa pintalikaa pois, mutta tulos ja kuivumisaika eroavat selvästi.",
    headers: {aspect: "Vertailukohta", rental: "Märkäimuri rautakaupasta", pro: "Puro"},
    rows: [
      {aspect: "Lämpötila", rental: "Yleensä kylmä tai haalea vesi", pro: "Kuuma höyry irrottaa rasvaisen lian"},
      {aspect: "Pesuaine", rental: "Jää helposti kankaaseen ja kerää likaa", pro: "Huuhdellaan ja imetään pois"},
      {aspect: "Kosteus", rental: "Penkki jää märäksi ja kuivuu hitaasti", pro: "Tehokas imu ja kuivatus puhaltimilla, sisältyy hintaan"},
      {aspect: "Tahrat", rental: "Yksi aine kaikkiin tahroihin", pro: "Esikäsittely tahran mukaan"},
      {aspect: "Haju", rental: "Peittyy hetkeksi hajusteella", pro: "Hajun lähde pestään pois"},
      {aspect: "Oma vaiva", rental: "Haku, pesu, palautus ja siivous", pro: "Sinä teet muuta, me pesemme"},
    ],
    linkLabel: "Katso koko vertailu",
  },
  areaTitle: "Missä toimimme",
  areaLead:
    "Tulemme Helsinkiin, Espooseen, Vantaalle, Kauniaiseen ja ympäryskuntiin, ja matkakulu lasketaan postinumerosi perusteella varauksessa.",
  faqTitle: "Usein kysyttyä",
  faq: [
    {
      q: "Mitä tarvitsette paikan päällä?",
      a: "Pistorasian, johon ylettyy jatkojohdolla, ja tilaa avata auton ovet. Vesi tulee mukanamme, mutta voimme käyttää myös omaa hanaasi.",
    },
    {
      q: "Voiko pesun tehdä parkkihallissa?",
      a: "Voi, kunhan lähellä on pistorasia ja hallissa saa tehdä tällaista työtä. Tarkista tarvittaessa taloyhtiöltä etukäteen. Emme jätä vettä lattialle.",
    },
    {
      q: "Kauanko penkit kuivuvat?",
      a: "Ilman apua verhoilu kuivuu tyypillisesti 4–8 tunnissa. Nopeutamme kuivumista puhaltimilla, ja kuivatus sisältyy aina hintaan. Sen jälkeen auttaa, kun pidät ikkunat raollaan tai lämmityksen päällä. Talvella auto kannattaa jättää lämpimään halliin, jos se on mahdollista.",
    },
    {
      q: "Voinko ajaa heti pesun jälkeen?",
      a: "Voit, mutta penkit ovat vielä kosteat. Laita istuimelle pyyhe ja anna lämmityksen puhaltaa, niin vaatteet pysyvät kuivina.",
    },
    {
      q: "Pesettekö asuntoautoja ja -vaunuja?",
      a: "Pesemme. Istuinryhmät, makuupaikkojen patjat ja tyynyt hoituvat paikan päällä. Kerro varauksessa, mitä haluat pestä, niin varaamme riittävästi aikaa.",
    },
    {
      q: "Lähteekö kattoverhoilun tahra?",
      a: "Se vaalenee usein selvästi, mutta kattoon teemme vain kevyen kohdepesun. Liian märkä katto voi irrota liimastaan, emmekä ota sitä riskiä.",
    },
    {
      q: "Onko pesu turvallinen istuinlämmityksen kanssa?",
      a: "On, kun kosteutta käytetään hallitusti. Pesemme lämmitetyt ja sähkösäätöiset penkit tavallista kuivemmin ja imemme kosteuden huolella pois.",
    },
    {
      q: "Teettekö myös ulkopesun tai moottoritilan?",
      a: "Emme. Keskitymme sisäverhoiluun eli penkkeihin, mattoihin ja oviverhoiluihin. Maalipinnat ja moottoritila jäävät muille.",
    },
    {
      q: "Milloin maksan?",
      a: "Vasta kun työ on tehty ja olet nähnyt tuloksen. Ennakkomaksua ei ole. Varauksessa näkyvä hinta on lopullinen, ja ”alk.”-hinnoista sovitaan ennen aloitusta.",
    },
  ],
  cta: {
    title: "Varaa auton verhoilupesu",
    text: "Valitse vapaa aika verkossa ja maksa vasta, kun penkit ovat puhtaat.",
  },
};
