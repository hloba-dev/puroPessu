import type {LegalPage} from '../types';

export const privacy: LegalPage = {
  metaTitle: 'Tietosuojaseloste',
  metaDescription:
    'Miten Puro käsittelee henkilötietojasi: mitä tietoja keräämme, miksi, kuinka kauan säilytämme niitä ja miten käytät oikeuksiasi.',
  h1: 'Tietosuojaseloste',
  updated: '2026-10-04',
  updatedLabel: 'Päivitetty',
  intro:
    'Tässä selosteessa kerromme selkeästi, mitä henkilötietoja keräämme, mihin niitä käytämme ja kenelle niitä voidaan luovuttaa. Kerromme myös, mitä oikeuksia sinulla on ja miten voit käyttää niitä.',
  sections: [
    {
      title: '1. Rekisterinpitäjä',
      paragraphs: [
        'Henkilötietojesi käsittelystä vastaa {company} (Y-tunnus {yTunnus}).',
        'Osoite: {address}. Sähköposti: {email}. Puhelin: {phone}.',
        'Kaikissa tietosuojaan liittyvissä asioissa voit ottaa yhteyttä yllä olevaan sähköpostiosoitteeseen.',
      ],
    },
    {
      title: '2. Mitä tietoja keräämme',
      bullets: [
        'Varaukset: nimi, puhelinnumero, sähköposti, osoite, lisätiedot kerroksesta ja pysäköinnistä, pestävät kohteet, ajankohta, hinta, asiointikieli, mahdollinen lahjakortin koodi sekä varaukseen liittämäsi valokuvat huonekaluista.',
        'Yritysten tarjouspyynnöt: yhteyshenkilön nimi ja yhteystiedot, yrityksen nimi, Y-tunnus, kuvaus työstä, laskutusosoite sekä lähettämäsi valokuvat.',
        'Yhteydenottolomakkeen viestit: nimi, yhteystiedot ja viestin sisältö.',
        'Lahjakorttitilaukset: ostajan ja saajan nimi, ostajan yhteystiedot sekä kortin viesti.',
        'Tietojen poistopyynnöt: nimi, yhteystiedot ja pyynnön sisältö.',
        'Tekniset tiedot: IP-osoite väärinkäytösten estämiseksi sekä evästevalintasi.',
      ],
    },
    {
      title: '3. Käsittelyn tarkoitus ja peruste',
      paragraphs: ['Käsittelemme henkilötietoja vain silloin, kun siihen on laillinen peruste:'],
      bullets: [
        'Sopimuksen täyttäminen (EU:n tietosuoja-asetuksen 6 artiklan 1 kohdan b alakohta): varauksen vastaanottaminen, työn tekeminen ja siihen liittyvä yhteydenpito.',
        'Lakisääteinen velvoite (6 artiklan 1 kohdan c alakohta): kirjanpito ja muut lakiin perustuvat velvoitteet.',
        'Oikeutettu etu (6 artiklan 1 kohdan f alakohta): asiakaspalvelu, väärinkäytösten estäminen ja palvelun kehittäminen.',
        'Suostumus (6 artiklan 1 kohdan a alakohta): markkinointiviestit sekä analytiikka- ja mainosevästeet. Voit perua suostumuksesi milloin tahansa.',
      ],
    },
    {
      title: '4. Mistä tiedot saadaan',
      paragraphs: [
        'Saamme tiedot sinulta itseltäsi: ajanvaraus- ja yhteydenottolomakkeista sekä puhelimitse, WhatsAppissa ja sähköpostitse käydyistä keskusteluista. Lahjakortin saajan nimen saamme kortin ostajalta.',
      ],
    },
    {
      title: '5. Tietojen käsittelijät ja siirrot',
      paragraphs: [
        'Käytämme palveluntarjoajia, jotka käsittelevät tietoja puolestamme, ohjeidemme mukaan ja vain siinä laajuudessa kuin palvelun toimiminen vaatii.',
        'Osa palveluntarjoajista voi käsitellä tietoja EU:n ja ETA-alueen ulkopuolella. Silloin siirrossa käytetään EU:n komission vakiosopimuslausekkeita tai muuta lainmukaista siirtoperustetta.',
        'Emme myy henkilötietoja kenellekään.',
      ],
      bullets: [
        'Tietokanta ja tiedostojen, kuten valokuvien, tallennus: Supabase.',
        'Sivuston ylläpito: verkkosivustomme ylläpitopalvelun tarjoaja.',
        'Vahvistus- ja muistutusviestien lähetys: sähköpostipalveluntarjoajamme SMTP-palvelin.',
        'Kävijäanalytiikka ja mainonnan mittaus vain suostumuksellasi: Google Analytics ja Google Ads, joita hallitaan Google Tag Manager -palvelun kautta.',
      ],
    },
    {
      title: '6. Säilytysaika',
      bullets: [
        'Varaus- ja laskutustiedot säilytetään niin kauan kuin kirjanpitolaki edellyttää. Tällä hetkellä tositteet säilytetään kuusi vuotta sen tilikauden lopusta, jolloin ne on laadittu.',
        'Yhteydenotot ja tarjouspyynnöt kuvineen säilytetään enintään 12 kuukautta asian käsittelyn päättymisestä.',
        'Markkinointisuostumus on voimassa, kunnes perut sen.',
        'Väärinkäytösten estämiseen liittyvät lokitiedot säilytetään vain lyhyen ajan.',
      ],
    },
    {
      title: '7. Evästeet ja vastaavat tekniikat',
      bullets: [
        'Välttämätön tallennus: evästevalintasi tallennetaan selaimesi paikalliseen tallennustilaan, ja ylläpidon kirjautumisessa käytetään istuntoevästettä.',
        'Analytiikka- ja markkinointityökalut otetaan käyttöön vasta suostumuksesi jälkeen. Käytämme Google Consent Mode v2 -tilaa: Google Tag Manager -säiliö latautuu suostumus oletuksena evättynä, eikä analytiikka- tai mainosevästeitä tallenneta ennen kuin annat suostumuksesi.',
        'Voit muuttaa valintaasi milloin tahansa sivun alalaidan linkistä ”Evästeasetukset”.',
        'Yhteystietosivun kartta ladataan OpenStreetMapista vasta, kun klikkaat sitä.',
      ],
    },
    {
      title: '8. Rekisteröidyn oikeudet',
      paragraphs: [
        'Voit käyttää alla lueteltuja oikeuksia lähettämällä sähköpostia osoitteeseen {email} tai sivuston tietojen poistolomakkeella. Vastaamme viimeistään kuukauden kuluessa pyynnön saapumisesta.',
      ],
      bullets: [
        'Tarkastusoikeus: saat tietää, mitä tietoja sinusta käsittelemme, ja saat niistä kopion.',
        'Oikaisu: voit pyytää virheellisten tai puutteellisten tietojen korjaamista.',
        'Poisto: voit pyytää tietojesi poistamista, ellei laki velvoita meitä säilyttämään niitä.',
        'Käsittelyn rajoittaminen: voit pyytää, että tietojasi käsitellään vain rajoitetusti.',
        'Vastustaminen: voit vastustaa oikeutettuun etuun perustuvaa käsittelyä.',
        'Siirto: voit saada antamasi tiedot koneluettavassa muodossa.',
        'Suostumuksen peruminen: voit perua suostumuksesi milloin tahansa. Peruminen ei vaikuta aiemman käsittelyn lainmukaisuuteen.',
      ],
    },
    {
      title: '9. Tietoturva',
      paragraphs: [
        'Tietoihin pääsevät vain ne, jotka tarvitsevat niitä työssään. Yhteydet sivustolle ovat salattuja, ja tietokannassa on käyttöoikeuksia rajoittavat suojaukset.',
      ],
    },
    {
      title: '10. Valitusoikeus',
      paragraphs: [
        'Jos katsot, että henkilötietojasi käsitellään lainvastaisesti, voit tehdä valituksen tietosuojavaltuutetulle (Tietosuojavaltuutetun toimisto, tietosuoja.fi). Toivomme, että otat ensin yhteyttä meihin, jotta voimme korjata asian.',
      ],
    },
    {
      title: '11. Muutokset tähän selosteeseen',
      paragraphs: [
        'Voimme päivittää tätä selostetta, kun palvelumme tai lainsäädäntö muuttuu. Viimeisimmän päivityksen päivämäärä näkyy sivun yläreunassa.',
      ],
    },
  ],
};
