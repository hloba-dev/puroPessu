import type {LegalPage} from '../types';

export const privacy: LegalPage = {
  metaTitle: 'Privacy notice',
  metaDescription:
    'How Puro handles your personal data: what we collect and why, how long we keep it and how you can use your rights.',
  h1: 'Privacy notice',
  updated: '2026-10-04',
  updatedLabel: 'Last updated',
  intro:
    'This notice explains in plain language what personal data we collect, what we use it for and who we may share it with. It also explains your rights and how to use them.',
  sections: [
    {
      title: '1. Who is responsible for your data',
      paragraphs: [
        'The controller of your personal data is {company} (business ID {yTunnus}).',
        'Address: {address}. E-mail: {email}. Phone: {phone}.',
        'For any question about data protection, please write to the e-mail address above.',
      ],
    },
    {
      title: '2. What data we collect',
      bullets: [
        'Bookings: name, phone number, e-mail, address, notes about the floor and parking, the items to be cleaned, time, price, preferred language, a gift card code if you use one, and any photos of the furniture that you attach to the booking.',
        'Business quote requests: the contact person’s name and details, company name, business ID, a description of the job, billing address and any photos you send.',
        'Contact form messages: name, contact details and the content of your message.',
        'Gift card orders: the buyer’s and recipient’s names, the buyer’s contact details and the card message.',
        'Data deletion requests: name, contact details and the content of the request.',
        'Technical data: your IP address, used for rate limiting to prevent abuse, and your cookie choice.',
      ],
    },
    {
      title: '3. Why we use it and on what legal basis',
      paragraphs: ['We only process personal data when we have a lawful basis for it:'],
      bullets: [
        'Performing a contract (GDPR Art. 6(1)(b)): taking your booking, doing the job and the communication around it.',
        'Legal obligation (Art. 6(1)(c)): bookkeeping and other duties required by law.',
        'Legitimate interest (Art. 6(1)(f)): customer service, preventing abuse and improving our service.',
        'Consent (Art. 6(1)(a)): marketing messages and analytics and advertising cookies. You can withdraw your consent at any time.',
      ],
    },
    {
      title: '4. Where the data comes from',
      paragraphs: [
        'We get the data from you: through the booking and contact forms, and from conversations by phone, WhatsApp and e-mail. The name of a gift card recipient is given to us by the buyer.',
      ],
    },
    {
      title: '5. Service providers and transfers',
      paragraphs: [
        'We use service providers who process data on our behalf, following our instructions and only as far as needed to run the service.',
        'Some of these providers may process data outside the EU/EEA. In that case the transfer is based on the European Commission’s standard contractual clauses or another lawful transfer mechanism.',
        'We never sell personal data.',
      ],
      bullets: [
        'Database and file storage: Supabase.',
        'Website hosting: our website hosting provider.',
        'Sending e-mail messages, such as confirmations and reminders: our e-mail provider’s SMTP server.',
        'Visitor analytics and ad measurement, only with your consent: Google Analytics and Google Ads, managed through Google Tag Manager.',
      ],
    },
    {
      title: '6. How long we keep it',
      bullets: [
        'Booking and invoicing data: as long as the Finnish Accounting Act requires. Currently, accounting vouchers are kept for six years from the end of the financial year in which they were created.',
        'Contact messages and quote requests, including photos: up to 12 months after the matter is closed.',
        'Marketing consent: until you withdraw it.',
        'Abuse-prevention logs: only for a short period.',
      ],
    },
    {
      title: '7. Cookies and similar technologies',
      bullets: [
        'Necessary storage: your cookie choice is saved in your browser’s local storage, and a session cookie is used for the admin login.',
        'Analytics and marketing tools are switched on only after you consent. We use Google Consent Mode v2: the Google Tag Manager container loads with consent denied by default, and no analytics or advertising cookies are stored until you give consent.',
        'You can change your choice at any time via “Cookie settings” in the footer.',
        'The map on the contact page is loaded from OpenStreetMap only when you click on it.',
      ],
    },
    {
      title: '8. Your rights',
      paragraphs: [
        'To use any of the rights below, e-mail us at {email} or use the data deletion form on this site. We reply within one month of receiving your request.',
      ],
      bullets: [
        'Access: you can find out what data we hold about you and get a copy of it.',
        'Rectification: you can ask us to correct inaccurate or incomplete data.',
        'Erasure: you can ask us to delete your data, unless the law requires us to keep it.',
        'Restriction: you can ask us to limit how your data is processed.',
        'Objection: you can object to processing based on legitimate interest.',
        'Portability: you can receive the data you gave us in a machine-readable format.',
        'Withdrawing consent: you can withdraw your consent at any time. This does not affect processing carried out before the withdrawal.',
      ],
    },
    {
      title: '9. Security',
      paragraphs: [
        'Only people who need the data for their work can access it. Connections to the site are encrypted, and access controls are in place in the database.',
      ],
    },
    {
      title: '10. Complaints',
      paragraphs: [
        'If you believe your personal data is being processed unlawfully, you have the right to lodge a complaint with the Finnish Data Protection Ombudsman (Tietosuojavaltuutetun toimisto, tietosuoja.fi). We would appreciate it if you contacted us first, so we can try to put things right.',
      ],
    },
    {
      title: '11. Changes to this notice',
      paragraphs: [
        'We may update this notice when our service or the law changes. The date of the latest update is shown at the top of the page.',
      ],
    },
  ],
};
