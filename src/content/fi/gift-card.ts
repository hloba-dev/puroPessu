import type {GiftCardPage} from '../types';

export const giftCard: GiftCardPage = {
  metaTitle: 'Lahjakortti sohvan ja patjan pesuun',
  metaDescription:
    'Anna lahjaksi puhdas sohva tai raikas patja. Puron lahjakortti tiettyyn palveluun tai vapaaseen summaan, toimitetaan PDF-tiedostona sähköpostiin.',
  h1: 'Lahjakortti huonekalujen pesuun',
  intro:
    'Puhdas sohva tai raikas patja on lahja, joka näkyy arjessa joka päivä. Valitse palvelu tai summa, niin saat lahjakortin sähköpostiisi PDF-tiedostona. Saaja varaa ajan itse silloin, kun hänelle sopii.',
  how: {
    title: 'Näin tilaat lahjakortin',
    steps: [
      {
        title: 'Valitse palvelu tai summa',
        text: 'Valitse hinnastosta palvelu, esimerkiksi sohvan pesu, tai päätä summa itse.',
      },
      {
        title: 'Lähetä pyyntö lomakkeella',
        text: 'Täytä alla oleva lomake. Kerro, millaisen lahjakortin haluat.',
      },
      {
        title: 'Saat laskun',
        text: 'Lähetämme laskun lahjakortista sähköpostiisi.',
      },
      {
        title: 'Lahjakortti sähköpostiin',
        text: 'Kun lasku on maksettu, saat lahjakortin PDF-tiedostona, jossa on koodi. Saaja syöttää koodin varatessaan ajan verkossa.',
      },
    ],
  },
  options: {
    title: 'Valitse lahjakortti',
    lead: 'Voit valita palvelun suoraan hinnastosta tai antaa lahjaksi haluamasi summan.',
    custom: 'Vapaa summa',
  },
  terms: {
    title: 'Lahjakortin ehdot',
    items: [
      'Lahjakortti on voimassa {months} kuukautta ostopäivästä.',
      'Yhteen varaukseen voi käyttää yhden lahjakortin.',
      'Arvolahjakortilla voi maksaa mitä tahansa palveluja kortin arvoon asti. Palvelulahjakortti kattaa siihen merkityn palvelun.',
      'Jos varaus maksaa enemmän kuin lahjakortti kattaa, erotus maksetaan pesun jälkeen.',
      'Lahjakorttia ei voi vaihtaa rahaksi.',
      'Jos lahjakortti on tiettyyn palveluun, maksuttoman alueen ulkopuolella matkakulu maksetaan erikseen.',
    ],
  },
  form: {
    title: 'Tilaa lahjakortti',
    lead: 'Täytä lomake, niin lähetämme laskun ja maksun jälkeen lahjakortin sähköpostiisi.',
  },
  faqTitle: 'Usein kysyttyä lahjakortista',
  faq: [
    {
      q: 'Milloin saan lahjakortin?',
      a: 'Lähetämme lahjakortin sähköpostiisi, kun lasku on maksettu. Jos tarvitset kortin tiettyyn päivään mennessä, mainitse siitä lomakkeessa.',
    },
    {
      q: 'Miten saaja käyttää lahjakortin?',
      a: 'Saaja varaa ajan verkossa tavalliseen tapaan ja syöttää lahjakortin koodin varauksen yhteydessä.',
    },
    {
      q: 'Voiko lahjakortin tulostaa?',
      a: 'Kyllä. Saat lahjakortin PDF-tiedostona, jonka voit tulostaa kortiksi tai lähettää saajalle sellaisenaan.',
    },
    {
      q: 'Missä lahjakorttia voi käyttää?',
      a: 'Pesemme Helsingissä, Espoossa, Vantaalla, Kauniaisissa ja lähialueilla. Matkakulu lasketaan saajan postinumeron mukaan, ja lähialueella matka on maksuton.',
    },
    {
      q: 'Mitä jos varaus maksaa enemmän kuin lahjakortin arvo?',
      a: 'Erotus maksetaan pesun jälkeen, kuten muissakin varauksissa. Ennakkomaksua ei tarvita.',
    },
  ],
};
