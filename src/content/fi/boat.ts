import type {ServiceLanding} from '../types';

export const boat: ServiceLanding = {
  metaTitle: "Veneen tekstiilien pesu Helsinki — alk. {price}, paikan päällä",
  metaDescription:
    "Veneen patjojen, istuintyynyjen ja verhoilun höyrypesu satamassa tai kotonasi pääkaupunkiseudulla. Ummehtunut haju pois ennen vesillelaskua tai talvea.",
  breadcrumb: "Veneen tekstiilit",
  badge: "Satamaan tai kotiin",
  h1: "Veneen tekstiilien pesu Helsingissä",
  intro:
    "Pesemme veneen patjat, istuintyynyt ja verhoillut paneelit suoraan veneessä satamassa. Irrotettavat tyynyt voi pestä myös kotonasi. Pesun jälkeen kuivatamme pehmusteet puhaltimilla, ja kuivatus sisältyy aina hintaan. Hinnat alk. {price}, ja tulemme joka päivä klo {from}–{to}.",
  prices: {
    title: "Hinnat",
    lead: "Hinta riippuu patjojen ja tyynyjen määrästä ja koosta. Valitse varauksessa lähin vaihtoehto, niin näet hinnan heti.",
    note: "Vähimmäistilaus on {min}. ”Alk.”-merkityt hinnat vahvistetaan ennen kuin aloitamme. Voit liittää varaukseen kuvia, ja jos niissä näkyy hyvin likaisia tekstiilejä, sovimme hinnan jo ennen käyntiä.",
  },
  gallery: {
    title: "Ennen ja jälkeen",
    lead: "Talven jälkeen tyynyt ovat usein harmaita ja ummehtuneita. Tältä ne näyttävät pesun jälkeen.",
  },
  promise: {
    title: "Rehellisesti tahroista",
    paragraphs: [
      "Useimmat tahrat lähtevät: ruoka, juomat, aurinkorasva ja satamapöly. Esikäsittelemme tahrat ja huuhtelemme ne pois kuumalla höyryllä.",
      "Vanhat hometäplät ja kankaan väriä syöneet tahrat voivat vaalentua mutta jäädä näkyviin. Kerromme sen ennen kuin aloitamme.",
      "Jos et ole tyytyväinen, pesemme uudelleen veloituksetta. Se on tyytyväisyystakuumme.",
    ],
  },
  why: {
    title: "Miksi Puro",
    items: [
      {
        title: "Pesu veneessä tai kotona",
        text: "Tyynyjä ei tarvitse kantaa autoon ja pesulaan. Tulemme satamaan, tai pesemme irrotettavat tyynyt kotonasi.",
      },
      {
        title: "Kosteus hallinnassa",
        text: "Kosteassa veneessä märkä vaahtomuovi on homeen alku. Imemme veden tarkasti pois, jotta pehmuste ei jää märäksi.",
      },
      {
        title: "Hajunpoisto kuuluu hintaan",
        text: "Ummehtunut talvisäilytyksen haju tai dieselin käry käsitellään pesun yhteydessä ilman lisämaksua.",
      },
      {
        title: "Kauden mukaan",
        text: "Keväällä ennen vesillelaskua tai syksyllä ennen talvisäilytystä. Illat ja viikonloput käyvät myös.",
      },
      {
        title: "Kuivatus puhaltimilla veloituksetta",
        text: "Kosteassa veneessä kuivatus on tärkeää. Kuivatamme pehmusteet puhaltimilla, ja kuivatus sisältyy aina hintaan.",
      },
    ],
  },
  process: {
    title: "Näin pesu etenee",
    steps: [
      {
        title: "Varaa aika verkossa",
        text: "Kerro, mitä pestään ja missä vene on. Kalenteri näyttää oikeat vapaat ajat.",
      },
      {
        title: "Tulemme paikalle",
        text: "Tarvitsemme pistorasian laiturilta tai veneestä. Vesi tulee mukanamme.",
      },
      {
        title: "Tarkistus ja esikäsittely",
        text: "Katsomme materiaalit, tahrat ja mahdollisen homeen ja kerromme, mitä on odotettavissa. Sitten tahrat esikäsitellään.",
      },
      {
        title: "Höyrypesu ja imu",
        text: "Pesemme kankaat kuumalla höyryllä ja imemme lian ja kosteuden pois. Vinyyli- ja tekonahkapinnat puhdistamme käsin.",
      },
      {
        title: "Kuivatus puhaltimilla",
        text: "Lopuksi kuivatamme tyynyt ja patjat puhaltimilla veloituksetta. Pidä sen jälkeen luukut auki tai nosta tyynyt kyljelleen tuulettumaan.",
      },
    ],
  },
  odor: {
    title: "Hajut pois veneestä",
    lead: "Veneessä haju jää helposti pehmusteisiin, koska ilma vaihtuu huonosti ja kosteutta riittää. Tuulettaminen auttaa vain hetken.",
    cases: [
      {
        title: "Talvisäilytyksen ummehtunut haju",
        text: "Suljetussa veneessä tyynyt imevät kosteutta koko talven. Pesu ja kunnollinen kuivatus poistavat tunkkaisen hajun.",
      },
      {
        title: "Dieselin haju",
        text: "Polttoaineen käry tarttuu kankaisiin. Esikäsittely irrottaa öljyiset jäämät ennen höyrypesua.",
      },
      {
        title: "Hometäplät",
        text: "Pinnalla olevat pienet täplät vaalenevat ja lähtevät usein kokonaan. Kerromme heti, jos home on mennyt syvemmälle.",
      },
      {
        title: "Ruoka- ja juomaroiskeet",
        text: "Kaatunut viini, olut tai grilliruoka jättää hajun pehmusteeseen. Huuhtelemme sen pois syvältä.",
      },
    ],
    insurance: "Saat pyynnöstä kirjallisen selvityksen tehdystä työstä vakuutusyhtiötä varten, esimerkiksi vesivahingon jälkeen.",
    linkLabel: "Lue lisää hajunpoistosta",
  },
  materials: {
    title: "Mitä pesemme",
    lead: "Pesemme veneen sisätilojen tekstiilit, sekä kiinteät että irrotettavat.",
    suitable: [
      {
        title: "Hyttipatjat",
        text: "Keula- ja peräpiikin patjat pestään paikan päällä ilman, että niitä tarvitsee kantaa ulos.",
      },
      {
        title: "Kangaspäällysteiset istuintyynyt",
        text: "Salongin ja avotilan tyynyt kangaspäällisineen.",
      },
      {
        title: "Vinyyli- ja tekonahkatyynyt",
        text: "Puhdistamme käsin miedolla pesuaineella, jotta pinta ei kuivu eikä halkeile.",
      },
      {
        title: "Verhot ja irrotettavat päälliset",
        text: "Hytin verhot ja päälliset pestään samalla kertaa.",
      },
      {
        title: "Verhoillut paneelit",
        text: "Kankaalla verhoillut seinä- ja kattopaneelit puhdistamme kevyesti, jotta liima pysyy.",
      },
    ],
    exceptionsTitle: "Hyvä tietää",
    exceptions: [
      {
        title: "Home vaahtomuovin sisällä",
        text: "Jos home on kasvanut pehmusteen ytimeen, sitä ei saa pestyä pois. Silloin vaahtomuovi kannattaa vaihtaa, ja kerromme sen suoraan.",
      },
      {
        title: "Kuomu ja sprayhood",
        text: "Kuomujen ja sprayhoodien pesu ja kyllästys on eri työ, jota emme tee.",
      },
      {
        title: "Tiikki ja gelcoat",
        text: "Emme pese tiikkikansia emmekä gelcoat-pintoja. Keskitymme tekstiileihin.",
      },
    ],
  },
  compare: {
    title: "Harja ja letku vai ammattilainen?",
    lead: "Moni pesee tyynyt laiturilla harjalla ja puutarhaletkulla. Pinta voi näyttää puhtaalta, mutta vaahtomuovi jää märäksi.",
    headers: {aspect: "Vertailukohta", rental: "Harja ja puutarhaletku", pro: "Puro"},
    rows: [
      {aspect: "Kosteus", rental: "Vaahtomuovi imee vettä ja kuivuu päiviä", pro: "Vesi imetään pois, ja kuivatamme puhaltimilla"},
      {aspect: "Homeriski", rental: "Märkä pehmuste kosteassa veneessä homehtuu", pro: "Kosteus hallitaan koko pesun ajan"},
      {aspect: "Lika", rental: "Pinta puhdistuu, lika jää syvemmälle", pro: "Kuuma höyry ja imu vievät lian pois"},
      {aspect: "Pesuaine", rental: "Jää kankaaseen, jos huuhtelu ei riitä", pro: "Huuhdellaan ja imetään pois"},
      {aspect: "Haju", rental: "Usein pahenee, jos tyyny ei kuivu", pro: "Hajun lähde pestään pois"},
    ],
    linkLabel: "Katso koko vertailu",
  },
  areaTitle: "Missä toimimme",
  areaLead:
    "Tulemme satamiin ja koteihin Helsingissä, Espoossa, Vantaalla, Kauniaisissa ja ympäryskunnissa, ja matkakulu lasketaan postinumerosta varauksessa.",
  faqTitle: "Usein kysyttyä",
  faq: [
    {
      q: "Milloin veneen tekstiilit kannattaa pestä?",
      a: "Keväällä ennen vesillelaskua saat raikkaan veneen kesäksi. Syksyllä ennen talvisäilytystä pesu estää lian ja kosteuden muuttumisen hajuksi ja homeeksi talven aikana.",
    },
    {
      q: "Tarvitaanko veneessä sähköä?",
      a: "Kyllä, tarvitsemme pistorasian laiturilta tai veneestä. Vesi tulee mukanamme. Jos sähköä ei ole, irrotettavat tyynyt voi pestä kotonasi.",
    },
    {
      q: "Voitteko pestä tyynyt kotonani?",
      a: "Voimme, jos tyynyt ja patjat irtoavat veneestä. Tuo ne kotiin, niin pesemme ne siellä, ja ne kuivuvat lämpimässä sisätilassa nopeammin.",
    },
    {
      q: "Kauanko tyynyt kuivuvat?",
      a: "Ilman apua tyynyt kuivuvat tyypillisesti 4–8 tunnissa, patjat kauemmin. Nopeutamme kuivumista puhaltimilla, ja kuivatus sisältyy aina hintaan. Pidä luukut auki ja nosta tyynyt kyljelleen. Älä sulje venettä, ennen kuin pehmusteet ovat kuivia.",
    },
    {
      q: "Lähtevätkö hometäplät?",
      a: "Pinnalla olevat täplät vaalenevat ja lähtevät usein kokonaan. Jos home on kasvanut vaahtomuovin sisään, pesu ei riitä, ja silloin vaahtomuovi kannattaa vaihtaa. Kerromme tämän ennen kuin aloitamme.",
    },
    {
      q: "Saako dieselin hajun pois?",
      a: "Kankaasta yleensä kyllä. Jos polttoainetta on imeytynyt syvälle pehmusteeseen, haju voi jäädä heikkona. Mainitse diesel varauksessa, niin varaudumme siihen.",
    },
    {
      q: "Pesettekö kuomun tai sprayhoodin?",
      a: "Emme. Kuomujen pesu ja kyllästys on oma erikoistyönsä. Me keskitymme sisätilojen tekstiileihin.",
    },
    {
      q: "Entä tiikkikansi ja gelcoat?",
      a: "Niitä emme pese. Ne vaativat eri menetelmät ja aineet kuin tekstiilit.",
    },
    {
      q: "Milloin maksan?",
      a: "Vasta kun työ on tehty ja olet nähnyt tuloksen. Ennakkomaksua ei ole, ja ”alk.”-hinnoista sovitaan ennen aloitusta.",
    },
  ],
  cta: {
    title: "Varaa veneen tekstiilien pesu",
    text: "Valitse vapaa aika verkossa, niin vene on raikas kun kausi alkaa.",
  },
};
