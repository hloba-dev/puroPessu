import type {CityContent, CitySlug, CityTemplates} from '../types';

export const cityTemplates: CityTemplates = {
  sofa: {
    metaTitle: 'Sohvan pesu {city} — alk. {price}, paikan päällä',
    metaDescription:
      'Sohvan ja nojatuolin höyrypesu kotonasi {inCity} alk. {price}. Joka päivä klo {from}–{to}, ei ennakkomaksua. Katso vapaat ajat ja varaa helposti netissä.',
    h1: 'Sohvan pesu {inCity} — höyrypesu kotonasi',
    breadcrumb: '{city}',
    pricesTitle: 'Sohvan pesun hinnat {inCity}'
  },
  mattress: {
    metaTitle: 'Patjan pesu {city} — alk. {price}, paikan päällä',
    metaDescription:
      'Patjan höyrypesu ja hajunpoisto kotonasi {inCity} alk. {price}. Joka päivä klo {from}–{to}, maksu vasta työn jälkeen. Katso vapaat ajat ja varaa netissä.',
    h1: 'Patjan pesu {inCity} — patja pestään sängyssä',
    breadcrumb: '{city}',
    pricesTitle: 'Patjan pesun hinnat {inCity}'
  },
  badge: 'Paikan päällä · joka päivä {from}–{to}',
  travelTitle: 'Matkakulut: {city}',
  travelFree: 'Koko {city} kuuluu maksuttomaan ajoalueeseen, joten matkakuluja ei peritä.',
  travelFee: '{inCity} matkakulu on {fee}, ja näet sen varauksessa ennen kuin vahvistat ajan.',
  travelRange:
    '{inCity} matkakulu on {minFee}–{maxFee} postinumerosta riippuen, ja varaus laskee sen puolestasi automaattisesti.',
  districtsTitle: 'Alueet, joilla käymme: {city}',
  arrivalTitle: 'Saapuminen ja pysäköinti',
  homesTitle: 'Kodit ja kuivuminen {inCity}',
  galleryTitle: 'Ennen ja jälkeen',
  faqTitle: 'Usein kysyttyä: {city}',
  otherCitiesTitle: 'Tulemme myös näille paikkakunnille',
  otherCityLink: '{city}',
  cta: {
    title: 'Varaa pesu {inCity}',
    text: 'Valitse vapaa aika kalenterista, ja maksat vasta, kun työ on tehty. Tulemme joka päivä, myös iltaisin ja viikonloppuisin.'
  }
};

export const cities: Record<CitySlug, CityContent> = {
  helsinki: {
    name: 'Helsinki',
    inCity: 'Helsingissä',
    sofa: {
      intro: [
        'Helsingissä sohva on usein kannettu kerrostaloon kapeaa porraskäytävää pitkin, eikä sitä huvita viedä samaa reittiä takaisin pesulaan. Siksi tulemme kotiisi ja pesemme sohvan siinä, missä se on – Töölön ja Kallion kivitaloissa yhtä hyvin kuin Lauttasaaren tai Vuosaaren uudemmissa kodeissa.',
        'Pesemme sohvat, nojatuolit, rahit ja sängynpäädyt kuumalla höyryllä ja imemme lian ja kosteuden kankaasta saman tien. Pesuaineet ovat allergiaystävällisiä ja biohajoavia, ja hajunpoisto kuuluu aina hintaan. Pesun jälkeen kuivatamme sohvan puhaltimilla, ja kuivatus sisältyy aina hintaan.'
      ]
    },
    mattress: {
      intro: [
        'Helsinkiläisessä yksiössä tai kaksiossa samassa huoneessa usein nukutaan, tehdään etätöitä ja kuivataan pyykkiä. Patja kerää siksi pölyä, hikeä ja kosteutta tavallista nopeammin, eikä sen kantaminen hissittömän talon portaissa houkuttele ketään.',
        'Patjan pesu Helsingissä tehdään kotonasi höyryllä ja tehokkaalla imulla, joten patja pysyy sängyssä koko ajan. Patja kuivuu ilman apua sohvaa hitaammin, joten nopeutamme kuivumista puhaltimilla. Kuivatus sisältyy aina hintaan, ja aamupäivän pesu jättää patjalle koko päivän aikaa kuivua.'
      ]
    },
    districts: [
      'Kallio',
      'Töölö',
      'Kamppi',
      'Punavuori',
      'Kruununhaka',
      'Lauttasaari',
      'Munkkiniemi',
      'Pasila',
      'Arabianranta',
      'Herttoniemi',
      'Vuosaari',
      'Malmi',
      'Kannelmäki',
      'Pitäjänmäki'
    ],
    arrival:
      'Kantakaupungissa, kuten Kalliossa, Töölössä ja Punavuoressa, pysäköinti on vyöhykkeistä ja sisäpihat ovat usein lukittuja. Kerro varauksessa ovikoodi ja paikka, johon auton voi jättää työn ajaksi – esimerkiksi taloyhtiön piha tai vieraspaikka. Esikaupunkialueilla, kuten Malmilla ja Vuosaaressa, paikka löytyy yleensä helpommin.',
    homes:
      'Suurin osa helsinkiläisistä asuu kerrostalossa, ja vanhoissa kivitaloissa hissi voi olla pieni tai puuttua kokonaan. Se ei haittaa, koska laitteemme kulkevat portaissakin ja huonekalu pestään paikallaan. Kuivatamme pestyt huonekalut puhaltimilla, ja kuivatus sisältyy aina hintaan. Kerrostaloasunnossa kuivumista auttaa lisäksi ristivetotuuletus, joten kerro etukäteen, jos ikkunoita ei voi pitää auki.',
    faq: [
      {
        q: 'Pääsettekö Suomenlinnaan tai saarille?',
        a: 'Tulemme saarille, joille pääsee autolla, kuten Lauttasaareen, Kulosaareen ja Laajasaloon. Suomenlinnasta ja muista saarista, joille ei ole tieyhteyttä, sovitaan erikseen ennen varausta.'
      },
      {
        q: 'Asun vanhassa talossa ilman hissiä – onnistuuko pesu?',
        a: 'Onnistuu. Kannamme laitteet portaita pitkin, ja sohva tai patja pestään paikallaan, joten sitä ei tarvitse siirtää. Kerro varauksessa kerros, niin osaamme varautua.'
      },
      {
        q: 'Pitääkö minun järjestää teille pysäköintipaikka?',
        a: 'Ei välttämättä, mutta kerro varauksen lisätiedoissa, jos talolla on vieraspaikka tai piha, jolle saa ajaa. Muuten pysäköimme lähimmälle sallitulle paikalle.'
      }
    ]
  },

  espoo: {
    name: 'Espoo',
    inCity: 'Espoossa',
    sofa: {
      intro: [
        'Espoossa pesemme paljon perheiden sohvia: Tapiolan ja Haukilahden omakotitaloissa, Matinkylän ja Olarin kerrostaloissa sekä Espoonlahden ja Kivenlahden rivitaloissa. Mehutahrat, kurainen koira ja iltapalan murut näkyvät sohvassa ennen pitkää.',
        'Sohvan pesu Espoossa tehdään kotonasi kuumalla höyryllä ja imulla, ja hajunpoisto kuuluu aina hintaan – siitä on apua etenkin, jos koira tai kissa nukkuu sohvalla. Biohajoavat ja allergiaystävälliset pesuaineet sopivat koteihin, joissa on pieniä lapsia ja lemmikkejä.'
      ]
    },
    mattress: {
      intro: [
        'Lapsiperheessä patjoja on monta, ja jokaisella on oma tarinansa: vuotanut vaippa, vatsatauti tai iltasadun aikana kaatunut mehulasi. Patjan pesu Espoossa hoituu kotonasi, joten yhdellä käynnillä voi pestä koko perheen sängyt.',
        'Höyrypesu ja imu poistavat likaa ja hajuja patjan pintakerroksista, ja hajunpoisto kuuluu hintaan. Nopeutamme patjan kuivumista puhaltimilla veloituksetta, ja rivi- tai omakotitalossa kuivumista auttaa lisäksi lämmin huone, jossa ilma kiertää hyvin.'
      ]
    },
    districts: [
      'Tapiola',
      'Leppävaara',
      'Matinkylä',
      'Olari',
      'Espoonlahti',
      'Kivenlahti',
      'Soukka',
      'Niittykumpu',
      'Otaniemi',
      'Espoon keskus',
      'Kauklahti',
      'Kalajärvi',
      'Laajalahti',
      'Haukilahti'
    ],
    arrival:
      'Omakoti- ja rivitaloalueilla, kuten Haukilahdessa, Soukassa ja Kauklahdessa, pysäköimme yleensä pihaan tai kadun varteen lähelle ovea. Matinkylän, Leppävaaran ja Espoon keskuksen kerrostaloissa kerro varauksessa ovikoodi ja vieraspaikan sijainti. Arki-illat varataan usein ensimmäisinä, joten viikonloppu voi olla helpompi vaihtoehto.',
    homes:
      'Espoossa on paljon rivi- ja omakotitaloja, joissa sohva on usein olohuoneessa ison ikkunan edessä. Kuivatamme sohvan pesun jälkeen puhaltimilla, ja kuivatus sisältyy aina hintaan. Talossa kuivumista auttaa myös toimiva ilmanvaihto ja lämmin huone. Jos sohva on takkahuoneessa, älä lämmitä takkaa heti pesun jälkeen – tasainen huonelämpö on kankaalle parempi.',
    faq: [
      {
        q: 'Sohvalla nukkuu koira – lähtevätkö karvat ja haju?',
        a: 'Imuroimme irtokarvat ennen pesua, ja hajunpoisto kuuluu jokaiseen pesuun. Jos haju on imeytynyt syvälle täytteeseen, kerromme rehellisesti etukäteen, mihin pesulla voi päästä.'
      },
      {
        q: 'Voinko pestä samalla käynnillä sohvan ja lasten patjat?',
        a: 'Voit. Lisää varaukseen kaikki pestävät huonekalut, niin näet koko hinnan valmiiksi ja kalenteri varaa työlle riittävästi aikaa.'
      },
      {
        q: 'Tuletteko myös Pohjois-Espooseen?',
        a: 'Tulemme, esimerkiksi Kalajärvelle ja Espoon keskuksen pohjoispuolelle. Mahdollinen matkakulu lasketaan postinumerostasi, ja näet sen varauksessa ennen kuin vahvistat.'
      }
    ]
  },

  vantaa: {
    name: 'Vantaa',
    inCity: 'Vantaalla',
    sofa: {
      intro: [
        'Vantaalla moni lähtee töihin aikaisin tai palaa myöhään – lentoasemalle, logistiikka-alan työpaikoille tai junalla Helsinkiin. Siksi sohvan pesu Vantaalla onnistuu joka päivä, myös iltaisin ja viikonloppuisin, ja vapaat ajat näet suoraan kalenterista.',
        'Tulemme Tikkurilaan, Myyrmäkeen, Korsoon tai Kivistöön ja pesemme sohvan, nojatuolin tai irtotyynyt kotonasi kuumalla höyryllä. Maksat vasta, kun työ on tehty, ja hinta on se, minkä näit varauksessa. Jos lopputulos ei miellytä, pesemme uudelleen veloituksetta.'
      ]
    },
    mattress: {
      intro: [
        'Vuorotyössä nukutaan välillä päivällä ja välillä yöllä, joten patja on kovassa käytössä. Patjan pesu Vantaalla kannattaa ajoittaa niin, että patja ehtii kuivua ennen seuraavaa unijaksoa. Ilman apua patja kuivuu sohvaa hitaammin, mutta nopeutamme kuivumista puhaltimilla, ja kuivatus sisältyy aina hintaan.',
        'Varaa esimerkiksi aamuaika vapaapäivälle tai ilta-aika ennen vapaata yötä. Pesemme patjan kotonasi, poistamme hajut ja kuivatamme sen puhaltimilla, eikä sinun tarvitse siirtää sitä minnekään.'
      ]
    },
    districts: [
      'Tikkurila',
      'Myyrmäki',
      'Martinlaakso',
      'Hakunila',
      'Korso',
      'Koivukylä',
      'Aviapolis',
      'Kivistö',
      'Pakkala',
      'Länsimäki',
      'Simonkylä',
      'Rekola'
    ],
    arrival:
      'Vantaalla pysäköinti on yleensä helppoa: Myyrmäen, Martinlaakson ja Hakunilan kerrostaloilla on vieraspaikkoja, ja Korson ja Rekolan pientaloalueilla voimme ajaa pihaan. Tikkurilan keskustassa kerro varauksessa ovikoodi ja minne auton voi jättää. Aikaiset aamut ja myöhäiset illat menevät usein nopeasti, joten varaa ne hyvissä ajoin.',
    homes:
      'Vantaalla on vanhempia kerrostalolähiöitä, uusia alueita kuten Kivistö ja Aviapolis sekä runsaasti pientaloja. Uusissa kerrostaloissa hissi on yleensä tilava ja koneellinen ilmanvaihto kuivattaa kankaan tasaisesti. Pientalossa ikkunan raottaminen ja lämmin huone nopeuttavat kuivumista. Kuivatamme lisäksi puhaltimilla, ja kuivatus sisältyy aina hintaan.',
    faq: [
      {
        q: 'Onko iltaisin aikoja Vantaalla?',
        a: 'On. Työskentelemme joka päivä, myös iltaisin ja viikonloppuisin. Vapaat ajat näkyvät varauskalenterissa, ja voit varata suoraan netissä.'
      },
      {
        q: 'Voiko pesun tehdä, jos en itse ole koko aikaa kotona?',
        a: 'Joku täytyy olla avaamassa ovi ja näyttämässä pestävät huonekalut. Kirjoita järjestely varauksen lisätietoihin, niin sovitaan loput – maksu hoidetaan vasta työn jälkeen.'
      },
      {
        q: 'Tuletteko Kivistöön ja muualle Pohjois-Vantaalle?',
        a: 'Tulemme koko Vantaalle, myös Kivistöön, Keimolaan ja Seutulaan. Jos postinumerollesi kuuluu matkakulu, se näkyy varauksessa ennen vahvistamista.'
      }
    ]
  },

  kauniainen: {
    name: 'Kauniainen',
    inCity: 'Kauniaisissa',
    sofa: {
      intro: [
        'Kauniaisissa koti on usein väljä omakotitalo, ja olohuoneen sohva on valittu sisustuksen mukaan – monesti vaaleaa pellavaa, villaa tai muuta luonnonkuitua. Vaalea kangas on kaunis, mutta jokainen kahvitahra ja harmaantunut käsinoja näkyy siinä heti.',
        'Sohvan pesu Kauniaisissa tehdään kotonasi: tarkistamme ensin kankaan, säädämme höyryn ja pesuaineen sen mukaan ja pesemme koko pinnan tasaisesti, jotta siihen ei jää reunoja. Lopuksi kuivatamme sohvan puhaltimilla, ja kuivatus sisältyy aina hintaan.'
      ]
    },
    mattress: {
      intro: [
        'Isossa talossa sänkyjä on usein useampi: makuuhuoneet, vierashuone ja ehkä jo kotoa muuttaneiden lasten huoneet. Patjan pesu Kauniaisissa kannattaa siksi tehdä kerralla, jolloin kaikki patjat hoituvat yhdellä käynnillä.',
        'Pesemme patjat höyryllä ja imulla allergiaystävällisillä, biohajoavilla aineilla, ja hajunpoisto kuuluu hintaan. Väljässä talossa patjat kuivuvat yleensä hyvin, kun huoneissa on lämmin ja ilma pääsee kiertämään.'
      ]
    },
    districts: [
      'Kauniaisten keskusta',
      'Kasavuori',
      'Gallträsk',
      'Koivuhovi',
      'Kera',
      'Karakallio',
      'Viherlaakso',
      'Laaksolahti',
      'Kilo'
    ],
    arrival:
      'Kauniaisten omakotitaloalueilla pysäköimme yleensä talon pihaan tai viereiselle kadulle. Kerro varauksessa, jos tontilla on portti tai jos pihaan ei saa ajaa. Kauniainen on pieni ja ympäröity Espoolla, joten käynti sopii usein samaan päivään Espoon töiden kanssa.',
    homes:
      'Kauniaisissa on paljon omakotitaloja, joista osa on vanhoja huviloita, sekä pienempiä kerrostaloja keskustan lähellä. Isoissa taloissa sohva on usein suuri kulmasohva tai useamman huonekalun kokonaisuus, joten varaa pesulle riittävästi aikaa. Kuivatamme pestyt huonekalut puhaltimilla veloituksetta, ja isossa huoneessa raollaan oleva ikkuna ja tasainen lämpö auttavat lisäksi.',
    faq: [
      {
        q: 'Sopiiko höyrypesu vaalealle pellavasohvalle?',
        a: 'Useimmiten sopii. Testaamme kankaan ensin huomaamattomasta kohdasta, ja jos se ei kestä märkäpesua, kerromme sen ennen kuin aloitamme.'
      },
      {
        q: 'Pesettekö myös vanhoja, arvokkaita huonekaluja?',
        a: 'Katsomme jokaisen huonekalun erikseen. Hauraan antiikkiverhoilun tai silkkikankaan kohdalla kerromme rehellisesti, jos pesu ei ole turvallinen. Jos olet epävarma, lähetä kuva yhteydenottolomakkeella ennen varausta.'
      },
      {
        q: 'Veloitatteko matkakuluja Kauniaisiin?',
        a: 'Matkakulu riippuu postinumerosta. Varaus laskee sen automaattisesti, ja näet sen ennen kuin vahvistat ajan.'
      }
    ]
  },

  kerava: {
    name: 'Kerava',
    inCity: 'Keravalla',
    sofa: {
      intro: [
        'Kerava on pääradan varren kaupunki, josta moni käy töissä pääkaupunkiseudulla. Kun arki kuluu junassa, sohvan pesua ei halua jättää viikonlopun puuhaksi – siksi tulemme Keravalle joka päivä, myös iltaisin ja viikonloppuisin.',
        'Pesemme sohvan kotonasi Kalevassa, Sompiossa, Kaskelassa tai missä päin Keravaa asutkin, kuumalla höyryllä ja imulla. Kuivatamme sohvan lopuksi puhaltimilla, ja kuivatus sisältyy hintaan. Hinta on lopullinen: maksat vasta, kun työ on tehty.'
      ]
    },
    mattress: {
      intro: [
        'Patjan pesu Keravalla on helppo hoitaa vapaapäivänä: tulemme kotiisi, pesemme patjan sängyssä ja kuivatamme sen puhaltimilla veloituksetta. Patja kuivuu silti sohvaa hitaammin, joten aamupäivän aika on yleensä paras.',
        'Pesu poistaa patjan pinnasta pölyä, hikeä ja tahroja, ja hajunpoisto kuuluu hintaan. Allergiaystävälliset pesuaineet sopivat myös lasten ja allergisten patjoille.'
      ]
    },
    districts: [
      'Keravan keskusta',
      'Kaleva',
      'Kurkela',
      'Ahjo',
      'Savio',
      'Sompio',
      'Jaakkola',
      'Kilta',
      'Alikerava',
      'Kaskela',
      'Ylikerava',
      'Kivisilta'
    ],
    arrival:
      'Keravan pientaloalueilla, kuten Kaskelassa, Sompiossa ja Ylikeravalla, pysäköimme yleensä pihaan tai kadun varteen. Keskustan ja aseman lähellä olevissa kerrostaloissa kerro varauksessa ovikoodi ja vieraspaikka. Keravalle löytyy usein aikoja samoille päiville kuin Järvenpäähän ja Tuusulaan.',
    homes:
      'Keravalla on keskustan kerrostaloja, rivitaloja, laajoja omakotitaloalueita ja uusi Kivisillan alue. Rivitalossa sohva on usein lähellä terassin ovea, jonka raottaminen auttaa kuivumista. Uusissa taloissa koneellinen ilmanvaihto hoitaa suuren osan työstä.',
    faq: [
      {
        q: 'Onko Keravalla aikoja myös viikonloppuisin?',
        a: 'On. Työskentelemme joka päivä, myös iltaisin ja viikonloppuisin, ja vapaat ajat näet suoraan varauskalenterista.'
      },
      {
        q: 'Tuleeko Keravalle matkakuluja?',
        a: 'Se riippuu postinumerosta. Mahdollinen matkakulu lasketaan varauksessa automaattisesti, ja näet sen ennen kuin vahvistat ajan.'
      },
      {
        q: 'Voinko pestä samalla kertaa myös nojatuolit ja ruokatuolit?',
        a: 'Voit. Pesemme kangasverhoillut nojatuolit, rahit ja tuolit samalla käynnillä. Lisää ne varaukseen, niin näet koko hinnan etukäteen.'
      }
    ]
  },

  jarvenpaa: {
    name: 'Järvenpää',
    inCity: 'Järvenpäässä',
    sofa: {
      intro: [
        'Järvenpää sijaitsee pääradan ja Tuusulanjärven välissä, ja kodit vaihtelevat keskustan kerrostaloista Kyrölän, Saunakallion ja Haarajoen omakotitaloihin. Sohvan pesu Järvenpäässä tehdään aina kotona, joten sohvaa ei tarvitse kuljettaa minnekään.',
        'Kuuma höyry ja imu nostavat lian kankaasta, ja hajunpoisto kuuluu jokaiseen pesuun. Jos sohva on kulunut lapsiperheen arjessa tai koiran lepopaikkana, mainitse siitä varauksessa, niin varaudumme tahroihin ja hajuihin.'
      ]
    },
    mattress: {
      intro: [
        'Patja on kodin ahkerimmin käytetty huonekalu, ja sen pesu jää helposti tekemättä, koska sitä on hankala kuljettaa. Patjan pesu Järvenpäässä hoituu kotonasi – tuomme laitteet, pesemme ja kuivatamme patjan puhaltimilla.',
        'Ilman apua patja kuivuu sohvaa hitaammin. Nopeutamme kuivumista puhaltimilla, ja kuivatus sisältyy aina hintaan. Jos pesemme usean perheenjäsenen patjat samalla kertaa, sopikaa etukäteen, missä kukin nukkuu, jos kaikki patjat eivät ehdi kuivua iltaan mennessä.'
      ]
    },
    districts: [
      'Järvenpään keskusta',
      'Haarajoki',
      'Kyrölä',
      'Saunakallio',
      'Pajala',
      'Kinnari',
      'Jamppa',
      'Harjula',
      'Mustakivi',
      'Wärtsilä',
      'Lepola',
      'Sorto'
    ],
    arrival:
      'Järvenpään omakotialueilla pääsemme yleensä pihaan asti, ja keskustan kerrostaloissa riittää ovikoodi ja tieto vieraspaikasta. Jos taloon on hankala löytää navigaattorilla, lisää varaukseen lyhyt ajo-ohje. Seuraavalle päivälle löytyy usein vapaita aikoja, mutta tilanne vaihtelee kalenterin mukaan.',
    homes:
      'Järvenpäässä on eri vuosikymmenten omakoti- ja rivitaloja sekä uusia kerrostaloja keskustan tuntumassa. Omakotitalossa sohva on usein takkahuoneessa tai yläkerran oleskelutilassa, jonne sen kantaminen olisi työlästä – pesemme sen siellä, missä se on. Talossa kuivumista auttaa, kun annat ilman kiertää ovien ollessa auki.',
    faq: [
      {
        q: 'Tuletteko Haarajoelle asti?',
        a: 'Tulemme koko Järvenpäähän, myös Haarajoelle. Mahdollinen matkakulu lasketaan postinumerosta, ja näet sen varauksessa ennen vahvistamista.'
      },
      {
        q: 'Sohva on yläkerrassa – pitääkö se kantaa alas?',
        a: 'Ei tarvitse. Kannamme laitteet sinne, missä sohva on, ja pesemme sen paikallaan.'
      },
      {
        q: 'Maksetaanko pesu etukäteen?',
        a: 'Ei. Emme peri ennakkomaksua, vaan maksat, kun työ on tehty ja olet nähnyt lopputuloksen.'
      }
    ]
  },

  tuusula: {
    name: 'Tuusula',
    inCity: 'Tuusulassa',
    sofa: {
      intro: [
        'Tuusulassa moni asuu omakotitalossa Hyrylässä, Jokelassa, Kellokoskella tai Tuusulanjärven rannan tuntumassa. Isot olohuoneet ja kulmasohvat ovat tavallisia, ja niissä vietetään paljon aikaa koko perheen kanssa.',
        'Sohvan pesu Tuusulassa tehdään kotonasi kuumalla höyryllä ja imulla. Luonnon keskellä sohvaan kertyy hiekkaa, siitepölyä ja lemmikin karvoja, joten imuroimme ne ensin ja pesemme sitten koko pinnan tasaisesti.'
      ]
    },
    mattress: {
      intro: [
        'Kesällä patjoille kulkeutuu rannalta hiekkaa ja kosteutta, talvella sisäilma on kuivaa ja pölyä on enemmän. Patjan pesu Tuusulassa poistaa pölyä, hikeä ja tahroja patjan pinnasta, ja hajunpoisto kuuluu hintaan.',
        'Pesemme patjan siinä huoneessa, jossa se on, ja kuivatamme sen puhaltimilla. Kuivatus sisältyy aina hintaan. Omakotitalossa kuivumista auttaa lisäksi, kun huone on lämmin ja ikkuna raollaan.'
      ]
    },
    districts: [
      'Hyrylä',
      'Jokela',
      'Kellokoski',
      'Riihikallio',
      'Lahela',
      'Rusutjärvi',
      'Ruotsinkylä',
      'Paijala',
      'Sula',
      'Tuusulan kirkonkylä',
      'Mattila'
    ],
    arrival:
      'Tuusulan omakotialueilla pysäköimme yleensä talon pihaan. Jos talo on yksityistien varrella tai pihatie on talvella kapea, kerro siitä varauksen lisätiedoissa. Hyrylän keskustan kerrostaloissa riittää ovikoodi ja tieto vieraspaikasta.',
    homes:
      'Tuusulassa on paljon omakoti- ja rivitaloja sekä maaseutumaisia pihapiirejä, Hyrylässä myös kerrostaloja. Tilavassa talossa sohva on usein takkahuoneessa: vältä takan lämmittämistä heti pesun jälkeen ja anna kankaan kuivua tasaisessa huonelämmössä.',
    faq: [
      {
        q: 'Tuletteko Jokelaan ja Kellokoskelle?',
        a: 'Tulemme. Jokela ja Kellokoski kuuluvat alueeseemme samoin kuin Hyrylä ja Riihikallio. Mahdollinen matkakulu lasketaan postinumerosta ja näkyy varauksessa ennen vahvistamista.'
      },
      {
        q: 'Talomme on järven rannalla yksityistien päässä – löydättekö perille?',
        a: 'Yleensä löydämme. Kirjoita varaukseen ajo-ohje tai maamerkki, jos navigaattori ei ohjaa suoraan talolle.'
      },
      {
        q: 'Voiko pesun varata viikonlopuksi?',
        a: 'Voi. Tulemme joka päivä, myös iltaisin ja viikonloppuisin, ja vapaat ajat näkyvät varauskalenterissa.'
      }
    ]
  },

  sipoo: {
    name: 'Sipoo',
    inCity: 'Sipoossa',
    sofa: {
      intro: [
        'Sipoossa kodit ovat usein väljiä ja pihat isoja – Nikkilässä, Söderkullassa ja Talmassa sekä kylien välisellä maaseudulla. Sohvan vieminen pesulaan tarkoittaisi pakettiautoa ja kahta kantajaa, joten pesemme sen mieluummin kotonasi.',
        'Sohvan pesu Sipoossa onnistuu joka päivä, myös iltaisin ja viikonloppuisin. Pesemme kankaan höyryllä ja imulla, hinta näkyy varauksessa valmiina, eikä ennakkomaksua tarvita.'
      ]
    },
    mattress: {
      intro: [
        'Maalla patjat kokevat kaikenlaista: koiran, joka hyppää sänkyyn märkänä, ja talven kuivan, pölyisen sisäilman. Patjan pesu Sipoossa tehdään kotonasi, joten patjaa ei tarvitse kuljettaa pitkiä matkoja.',
        'Pesemme patjan, poistamme hajut ja kuivatamme sen puhaltimilla paikan päällä, eikä kuivatuksesta veloiteta erikseen. Isossa talossa patja kuivuu yleensä hyvin, kun huone pysyy lämpimänä ja ilma pääsee vaihtumaan.'
      ]
    },
    districts: [
      'Nikkilä',
      'Söderkulla',
      'Talma',
      'Box',
      'Paippinen',
      'Kalkkiranta',
      'Hindsby',
      'Sipoonranta',
      'Eriksnäs',
      'Gumbostrand',
      'Massby'
    ],
    arrival:
      'Sipoon maaseudulla pihatiet voivat olla pitkiä ja kapeita, ja osa taloista on yksityisteiden varrella. Kerro varauksessa, jos pihaan pääsee vain tietystä suunnasta tai jos auraus on talvella epävarmaa. Nikkilän ja Söderkullan keskustoissa pysäköinti on yleensä helppoa.',
    homes:
      'Sipoossa asutaan enimmäkseen omakotitaloissa, ja moni koti on vanha maalaistalo tai huvila. Vanhoissa taloissa on usein painovoimainen ilmanvaihto, joten tuuleta pesun jälkeen ikkunoista, niin kangas kuivuu nopeammin.',
    faq: [
      {
        q: 'Palveletteko ruotsiksi?',
        a: 'Palvelemme suomeksi, venäjäksi ja englanniksi. Varaus tehdään netissä, ja lomakkeella kaikki tarvittavat tiedot kysytään valmiiksi.'
      },
      {
        q: 'Tuletteko Sipoon rannikolle ja saaristoon?',
        a: 'Tulemme kaikkiin osoitteisiin, joihin pääsee autolla, kuten Kalkkirantaan ja Gumbostrandiin. Saarista, joille ei ole tieyhteyttä, sovitaan erikseen.'
      },
      {
        q: 'Pihatiemme on pitkä ja talvella liukas – haittaako se?',
        a: 'Ei yleensä. Kerro varauksessa tien kunto ja missä auton voi kääntää, niin pääsemme mahdollisimman lähelle ovea.'
      }
    ]
  },

  kirkkonummi: {
    name: 'Kirkkonummi',
    inCity: 'Kirkkonummella',
    sofa: {
      intro: [
        'Kirkkonummella asutaan Masalan ja keskustan kerrostaloissa, Veikkolan omakotitaloissa ja meren rannalla Kantvikissa ja Upinniemessä. Moni pitää lisäksi kesämökkiä kunnan pitkällä rannikolla.',
        'Sohvan pesu Kirkkonummella tehdään kotonasi höyryllä ja imulla. Kostea meri-ilma ja mökkitalven jälkeinen tunkkainen haju tarttuvat kankaaseen, ja siksi hajunpoisto kuuluu jokaiseen pesuun.'
      ]
    },
    mattress: {
      intro: [
        'Kesämökin patjat ovat usein seisseet koko talven viileässä ja kosteassa, ja keväällä niistä nousee ummehtunut haju. Patjan pesu Kirkkonummella sopii hyvin mökkikauden alkuun tai loppuun – kunhan mökille pääsee autolla.',
        'Höyry ja imu poistavat pölyä ja hajuja patjan pinnasta, ja nopeutamme patjan kuivumista puhaltimilla veloituksetta. Jos patjassa on hometta, sanomme sen suoraan: sitä ei saa pesulla pois.'
      ]
    },
    districts: [
      'Kirkkonummen keskusta',
      'Masala',
      'Veikkola',
      'Jorvas',
      'Kantvik',
      'Upinniemi',
      'Sundsberg',
      'Gesterby',
      'Porkkala',
      'Täkter'
    ],
    arrival:
      'Masalassa ja keskustassa pysäköimme yleensä vieraspaikoille, ja Veikkolan omakotialueilla pihaan. Mökeille ja rantataloille johtaa usein yksityistie, joten kirjoita varaukseen ajo-ohje. Kesäviikonloput täyttyvät usein nopeasti, joten mökin pesu kannattaa varata hyvissä ajoin.',
    homes:
      'Kirkkonummella on kerrostaloja Masalassa ja keskustassa, mutta suurin osa kodeista on omakoti- ja rivitaloja. Kesämökeissä ei aina ole lämmitystä, mikä hidastaa kuivumista – kerro mökin varustuksesta varauksessa, niin osaamme varautua.',
    faq: [
      {
        q: 'Pesettekö kesämökin sohvan ja patjat?',
        a: 'Pesemme, jos mökille pääsee autolla ja siellä on sähköt, sillä laitteemme tarvitsevat virtaa. Kerro mökin varustuksesta varauksen lisätiedoissa.'
      },
      {
        q: 'Tuletteko Porkkalaan ja Upinniemeen?',
        a: 'Tulemme kaikkialle Kirkkonummelle, minne on tieyhteys. Mahdollinen matkakulu lasketaan postinumerosta ja näkyy varauksessa ennen vahvistamista.'
      },
      {
        q: 'Mökin patjasta lähtee ummehtunut haju – saako sen pois?',
        a: 'Pintaan tarttunut ummehtunut haju lähtee yleensä pesulla ja hajunpoistolla. Jos patjassa on hometta, pesu ei auta, ja silloin suosittelemme uutta patjaa.'
      }
    ]
  },

  nurmijarvi: {
    name: 'Nurmijärvi',
    inCity: 'Nurmijärvellä',
    sofa: {
      intro: [
        'Nurmijärvellä moni asuu isossa omakotitalossa Klaukkalassa, Rajamäellä tai kirkonkylässä, ja olohuoneessa on usein iso kulmasohva, jolle koko perhe mahtuu iltaisin. Sohvan pesu Nurmijärvellä hoituu kotonasi, joten raskasta sohvaa ei tarvitse liikuttaa.',
        'Pesemme sohvan, nojatuolit ja rahin kuumalla höyryllä ja imulla, ja hajunpoisto kuuluu hintaan. Lopuksi kuivatamme sohvan puhaltimilla, eikä kuivatuksesta tule lisämaksua.'
      ]
    },
    mattress: {
      intro: [
        'Isossa perheessä patjoja on monta, ja lasten patjoissa on yleensä eniten tahroja ja hajuja. Patjan pesu Nurmijärvellä kannattaa tehdä kerralla kaikille sängyille, jolloin näet koko hinnan varauksessa yhtenä summana.',
        'Pesu tehdään paikan päällä allergiaystävällisillä, biohajoavilla aineilla. Ilman apua patja kuivuu sohvaa hitaammin, joten nopeutamme kuivumista puhaltimilla. Kuivatus sisältyy aina hintaan.'
      ]
    },
    districts: [
      'Klaukkala',
      'Rajamäki',
      'Nurmijärven kirkonkylä',
      'Palojoki',
      'Kiljava',
      'Röykkä',
      'Perttula',
      'Lepsämä',
      'Metsäkylä',
      'Valkjärvi'
    ],
    arrival:
      'Nurmijärven omakotialueilla, kuten Klaukkalassa, Palojoella ja Röykässä, pääsemme yleensä pihaan asti. Kylissä ja haja-asutusalueella osoite voi olla navigaattorille hankala, joten lisää varaukseen ajo-ohje. Arki-illat täyttyvät usein ensin, joten viikonlopulta voi löytyä aika helpommin.',
    homes:
      'Nurmijärvellä suurin osa kodeista on omakoti- ja rivitaloja, ja tilaa on yleensä runsaasti. Isossa talossa kuivuminen sujuu tavallisesti hyvin, kun ilmanvaihto toimii. Jos pestävä sohva on alakerran takkahuoneessa, anna sen kuivua rauhassa ennen kuin sytytät takan.',
    faq: [
      {
        q: 'Tuletteko Rajamäelle ja Kiljavalle?',
        a: 'Tulemme koko Nurmijärvelle, myös Rajamäelle ja Kiljavalle. Mahdollinen matkakulu lasketaan postinumerosta, ja näet sen varauksessa ennen kuin vahvistat.'
      },
      {
        q: 'Meillä on iso kulmasohva ja useita patjoja – riittääkö yksi käynti?',
        a: 'Yleensä riittää. Lisää kaikki pestävät huonekalut varaukseen, niin kalenteri varaa työlle tarpeeksi aikaa ja näet lopullisen hinnan etukäteen.'
      },
      {
        q: 'Onko pesu turvallinen lapsille ja koiralle?',
        a: 'Käytämme allergiaystävällisiä ja biohajoavia pesuaineita. Pidä silti lapset ja lemmikit poissa kostealta sohvalta, kunnes se on kuivunut.'
      }
    ]
  },

  porvoo: {
    name: 'Porvoo',
    inCity: 'Porvoossa',
    sofa: {
      intro: [
        'Porvoossa huonekaluilla on usein historiaa: Vanhan Porvoon puutaloissa ja keskustan vanhoissa kodeissa on sohvia ja nojatuoleja, jotka ovat kulkeneet suvussa sukupolvelta toiselle. Pesemme ne kotonasi ja katsomme ensin kankaan kunnon, jotta pesutapa sopii materiaalille.',
        'Sohvan pesu Porvoossa onnistuu yhtä hyvin Länsi-Porvoon, Kevätkummun ja Gammelbackan uudemmissa kodeissa. Monessa porvoolaisessa perheessä puhutaan sekä suomea että ruotsia; me palvelemme suomeksi, venäjäksi ja englanniksi, ja varaus hoituu kokonaan netissä.'
      ]
    },
    mattress: {
      intro: [
        'Vanhassa puutalossa ilma kulkee toisin kuin uudessa kerrostalossa, ja patjat voivat kerätä kosteutta ja hajuja. Patjan pesu Porvoossa tehdään sängyssä, joten patjaa ei tarvitse kantaa jyrkkiä portaita alas.',
        'Pesu poistaa pölyä, hikeä ja tahroja patjan pinnasta, ja hajunpoisto kuuluu hintaan. Nopeutamme kuivumista puhaltimilla, ja kuivatus sisältyy aina hintaan. Puutalossa kuivumista auttavat lisäksi tasainen lämpö ja tuuletus.'
      ]
    },
    districts: [
      'Vanha Porvoo',
      'Porvoon keskusta',
      'Länsi-Porvoo',
      'Kevätkumpu',
      'Hamari',
      'Gammelbacka',
      'Tolkkinen',
      'Kokonniemi',
      'Näsinmäki',
      'Hinthaara',
      'Kerkkoo',
      'Kulloo'
    ],
    arrival:
      'Vanhan Porvoon kapeilla kujilla pysäköinti on rajoitettua, joten kerro varauksessa, mihin auton voi jättää ja miten taloon pääsee sisään. Länsi-Porvoossa, Hamarissa ja Gammelbackassa pysäköinti on yleensä helpompaa. Viikonloppuajat kannattaa varata hyvissä ajoin.',
    homes:
      'Porvoossa on vanhoja puutaloja, keskustan kerrostaloja ja runsaasti omakotitaloja sekä maaseudun pihapiirejä. Vanhoissa taloissa portaat ovat usein kapeita ja jyrkkiä, mutta laitteemme kulkevat niissä, ja huonekalu pestään paikallaan. Puutalossa kangas kuivuu parhaiten, kun huonelämpö pysyy tasaisena.',
    faq: [
      {
        q: 'Veloitatteko matkakuluja Porvooseen?',
        a: 'Matkakulu lasketaan postinumerostasi, ja se näkyy varauksessa ennen kuin vahvistat ajan. Näin tiedät kokonaishinnan etukäteen.'
      },
      {
        q: 'Pesettekö vanhan, suvussa kulkeneen sohvan?',
        a: 'Katsomme kankaan ja rakenteen ennen pesua. Jos verhoilu on hauras tai kangas ei kestä märkäpesua, kerromme sen rehellisesti etukäteen.'
      },
      {
        q: 'Tuletteko Porvoon saaristoon?',
        a: 'Tulemme osoitteisiin, joihin pääsee autolla. Saarista, joille ei ole tieyhteyttä, sovitaan erikseen ennen varausta.'
      }
    ]
  },

  hyvinkaa: {
    name: 'Hyvinkää',
    inCity: 'Hyvinkäällä',
    sofa: {
      intro: [
        'Hyvinkää on pääradan varren kaupunki, jossa kodit vaihtelevat keskustan kerrostaloista Paavolan ja Hakalan omakotitaloihin ja Sveitsin alueen metsäisiin kortteleihin. Sohvan pesu Hyvinkäällä tehdään kotonasi, joten sohvaa ei tarvitse kuljettaa minnekään.',
        'Höyrypesu ja imu irrottavat lian kankaasta, ja hajunpoisto kuuluu hintaan. Kun pesu on valmis, maksat sen hinnan, jonka näit varauksessa – et euroakaan enempää.'
      ]
    },
    mattress: {
      intro: [
        'Patjan pesu Hyvinkäällä on helppo ajoittaa vapaapäivälle: tulemme aamulla, pesemme patjan ja kuivatamme sen puhaltimilla, jolloin patjalla on koko päivä aikaa kuivua. Kuivatus sisältyy aina hintaan.',
        'Pesemme vaahto-, joustin- ja runkopatjat sekä sijauspatjat, kunhan materiaali kestää märkäpesun. Allergiaystävälliset pesuaineet sopivat myös allergiselle nukkujalle.'
      ]
    },
    districts: [
      'Hyvinkään keskusta',
      'Paavola',
      'Sveitsi',
      'Hakala',
      'Hyvinkäänkylä',
      'Martti',
      'Noppo',
      'Puolimatka',
      'Vehkoja',
      'Ahdenkallio',
      'Sahanmäki',
      'Kytäjä'
    ],
    arrival:
      'Hyvinkään keskustassa kerro varauksessa ovikoodi ja missä auto voi seistä työn ajan. Paavolan, Hakalan ja Hyvinkäänkylän omakotialueilla pääsemme yleensä pihaan. Kytäjän kaltaisilla kyläalueilla lisää varaukseen ajo-ohje.',
    homes:
      'Hyvinkäällä on kerrostaloja keskustassa ja Sveitsin tuntumassa sekä laajoja omakoti- ja rivitaloalueita. Omakotitalossa pesty sohva kuivuu yleensä hyvin, kun huoneessa on lämmin. Kerrostalossa kannattaa raottaa ikkunaa ja pitää ilmanvaihto tehokkaalla.',
    faq: [
      {
        q: 'Tuletteko Kytäjälle asti?',
        a: 'Tulemme koko Hyvinkäälle, myös kyläalueille. Mahdollinen matkakulu lasketaan postinumerosta, ja näet sen varauksessa ennen kuin vahvistat.'
      },
      {
        q: 'Voinko nukkua patjalla samana yönä?',
        a: 'Usein voit, jos pesu tehdään aamulla tai aamupäivällä. Ilman apua patja kuivuu sohvaa hitaammin, ja aikaan vaikuttavat huoneen lämpö ja ilmanvaihto. Nopeutamme kuivumista puhaltimilla, ja kuivatus sisältyy aina hintaan.'
      },
      {
        q: 'Entä jos tahra ei lähde?',
        a: 'Kerromme etukäteen, mitkä tahrat todennäköisesti lähtevät ja mitkä eivät. Jos et ole tyytyväinen lopputulokseen, pesemme uudelleen veloituksetta.'
      }
    ]
  }
};
