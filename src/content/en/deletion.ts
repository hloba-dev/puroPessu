import type {DeletionPage} from '../types';

export const deletion: DeletionPage = {
  metaTitle: 'Request deletion of your personal data',
  metaDescription:
    'Ask Puro to delete your personal data. Here is what we delete, what the law requires us to keep and how the request works.',
  h1: 'Request deletion of your data',
  intro:
    "Want us to delete the information we hold about you? Fill in the form below and we'll take care of it.",
  paragraphs: [
    'You can ask us at any time to delete the personal data we hold about you, such as your contact details, booking history and the messages and photos you have sent.',
    'Some things we can’t delete straight away. The Finnish Accounting Act requires us to keep invoices and other accounting records — currently for six years from the end of the financial year in which they were created. We keep that data only for as long as the law requires and use it for nothing else.',
    'We will confirm the deletion by e-mail within one month of your request.',
  ],
  steps: {
    title: 'How it works',
    items: [
      'You send the request using the form below.',
      'We verify your identity by e-mail or phone, so that nobody else can have your data deleted.',
      'We delete or anonymise your data in all our systems.',
      'We send you a confirmation once it’s done.',
    ],
  },
  form: {
    title: 'Deletion request',
    lead: 'Use the same contact details you used when booking or contacting us, so we can find your data.',
  },
};
