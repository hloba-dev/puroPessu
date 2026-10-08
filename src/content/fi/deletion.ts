import type {DeletionPage} from '../types';

export const deletion: DeletionPage = {
  metaTitle: 'Henkilötietojen poistopyyntö',
  metaDescription:
    'Pyydä Puroa poistamaan henkilötietosi. Kerromme, mitä poistamme, mitä laki velvoittaa säilyttämään ja miten pyyntö etenee.',
  h1: 'Pyydä tietojesi poistamista',
  intro:
    'Haluatko, että poistamme sinua koskevat tiedot? Täytä alla oleva lomake, niin hoidamme asian.',
  paragraphs: [
    'Voit milloin tahansa pyytää, että poistamme sinusta tallennetut henkilötiedot, kuten yhteystiedot, varaushistorian ja lähettämäsi viestit ja kuvat.',
    'Kaikkea emme voi poistaa heti. Kirjanpitolaki velvoittaa säilyttämään laskut ja muut tositteet, tällä hetkellä kuusi vuotta sen tilikauden lopusta, jolloin ne on laadittu. Nämä tiedot säilytämme vain lain vaatiman ajan, emmekä käytä niitä muuhun.',
    'Vahvistamme poiston sähköpostilla viimeistään kuukauden kuluessa pyynnöstäsi.',
  ],
  steps: {
    title: 'Näin pyyntö etenee',
    items: [
      'Lähetät pyynnön alla olevalla lomakkeella.',
      'Varmistamme henkilöllisyytesi sähköpostitse tai puhelimitse, jotta kukaan muu ei voi pyytää tietojasi poistettaviksi.',
      'Poistamme tai anonymisoimme tietosi kaikista järjestelmistämme.',
      'Lähetämme sinulle vahvistuksen, kun poisto on tehty.',
    ],
  },
  form: {
    title: 'Poistopyyntö',
    lead: 'Anna samat yhteystiedot, joita käytit varatessasi tai ollessasi meihin yhteydessä, niin löydämme tietosi.',
  },
};
