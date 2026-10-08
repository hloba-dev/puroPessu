import type {AboutPage} from '../types';

export const about: AboutPage = {
  metaTitle: 'Tietoa meistä — Puro, huonekalujen pesu paikan päällä',
  metaDescription:
    'Puro pesee sohvat, patjat ja muut verhoillut huonekalut kotonasi pääkaupunkiseudulla. Lopullinen hinta, rehellinen arvio tahroista ja palvelu kolmella kielellä.',
  h1: 'Tietoa Purosta',
  intro:
    'Puro pesee verhoillut huonekalut ja patjat asiakkaan kotona tai toimitiloissa Helsingissä, Espoossa, Vantaalla, Kauniaisissa ja lähialueilla. Tällä sivulla kerromme, miten toimimme ja mihin voit luottaa.',
  story: {
    title: 'Miksi Puro on olemassa',
    paragraphs: [
      'Huonekalujen pesun tilaamisen pitäisi olla yhtä helppoa kuin minkä tahansa muun arjen palvelun. Siksi verkkovarauksessa näet todelliset vapaat ajat ja lopullisen hinnan heti, ilman tarjouksen odottelua.',
      'Yhtä tärkeää on rehellisyys lopputuloksesta. Kerromme etukäteen, mitkä tahrat todennäköisesti lähtevät ja mitkä eivät, emmekä lupaa ihmeitä. Tulemme luoksesi joka päivä, myös iltaisin ja viikonloppuisin, ja palvelemme suomeksi, venäjäksi ja englanniksi.',
      'Nimi tulee suomen sanasta puro: kirkasta, virtaavaa vettä. Se kuvaa työtämme hyvin – puhdas vesi vie lian mukanaan ja jättää jälkeensä vain puhtaan kankaan.',
    ],
  },
  values: {
    title: 'Mihin sitoudumme',
    items: [
      {
        title: 'Rehellisyys tahroista',
        text: 'Arvioimme tahrat ennen pesua ja kerromme suoraan, mitä voit odottaa. Vanha tai syvälle imeytynyt tahra ei aina lähde kokonaan, ja sanomme sen ääneen.',
      },
      {
        title: 'Lopullinen hinta',
        text: 'Varauksessa näkyvä hinta on se, jonka maksat. Jos varaukseen liitetyissä kuvissa näkyy erittäin likainen huonekalu, sovimme hinnan kanssasi jo ennen käyntiä, ja sinä päätät.',
      },
      {
        title: 'Täsmällisyys ja selkeä viestintä',
        text: 'Tulemme sovittuun aikaan ja kerromme hyvissä ajoin, jos jokin muuttuu. Saat selkeät ohjeet ennen pesua ja sen jälkeen.',
      },
      {
        title: 'Puhdasta ilman jäämiä',
        text: 'Pesuaine huuhdellaan ja imetään kankaasta pois. Pintaan ei jää tahmeaa kalvoa, joka keräisi uutta likaa.',
      },
    ],
  },
  method: {
    title: 'Miten pesemme',
    paragraphs: [
      'Tahrat esikäsitellään ensin, minkä jälkeen kangas pestään kuumalla höyryllä ja lika imetään pois yhdessä pesuaineen kanssa. Käytämme allergiaystävällisiä, biohajoavia pesuaineita. Hajunpoisto sisältyy jokaiseen pesuun.',
      'Nahkahuonekalut puhdistamme käsin. Ilman apua kangaspinnat kuivuvat tyypillisesti 4–8 tunnissa, mutta nopeutamme kuivumista puhaltimilla, ja kuivatus sisältyy aina hintaan. Jos et ole tyytyväinen lopputulokseen, pesemme uudelleen maksutta – se on tyytyväisyystakuumme.',
    ],
  },
  facts: [
    {title: 'Joka päivä {from}–{to}', text: 'Myös iltaisin ja viikonloppuisin.'},
    {title: 'Vähimmäistilaus {min}', text: 'Matkakulu lasketaan postinumeron mukaan, lähialueella matka on maksuton.'},
    {title: 'Kolme kieltä', text: 'Palvelemme suomeksi, venäjäksi ja englanniksi.'},
    {title: 'Maksu vasta pesun jälkeen', text: 'Ei ennakkomaksua, hinta on lopullinen, ja kuivatus puhaltimilla sisältyy aina hintaan.'},
  ],
  cta: {
    title: 'Varaa pesu',
    text: 'Valitse sopiva aika verkossa ja näe lopullinen hinta heti.',
  },
};
