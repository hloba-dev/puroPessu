import 'server-only';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import fontkit from '@pdf-lib/fontkit';
import {PDFDocument, StandardFonts, rgb, type PDFFont} from 'pdf-lib';
import type {Locale} from '@/i18n/routing';

interface GiftCardPdf {
  code: string;
  /** "150 €" or the service name */
  value: string;
  validUntil: string;
  recipientName?: string | null;
  message?: string | null;
  locale: Locale;
  siteUrl: string;
}

const copy: Record<Locale, {title: string; value: string; code: string; valid: string; to: string; how: string}> = {
  fi: {
    title: 'LAHJAKORTTI',
    value: 'Arvo',
    code: 'Koodi',
    valid: 'Voimassa',
    to: 'Saaja',
    how: 'Varaa aika verkossa ja syötä koodi yhteystietojen kohdalla:'
  },
  ru: {
    title: 'ПОДАРОЧНЫЙ СЕРТИФИКАТ',
    value: 'Номинал',
    code: 'Код',
    valid: 'Действует до',
    to: 'Для кого',
    how: 'Запишитесь онлайн и введите код на шаге с контактами:'
  },
  en: {
    title: 'GIFT CARD',
    value: 'Value',
    code: 'Code',
    valid: 'Valid until',
    to: 'To',
    how: 'Book online and enter the code in the contact details step:'
  }
};

async function loadFonts(doc: PDFDocument): Promise<{regular: PDFFont; bold: PDFFont; unicode: boolean}> {
  try {
    doc.registerFontkit(fontkit);
    const dir = path.join(process.cwd(), 'assets/fonts');
    const [regular, bold] = await Promise.all([
      readFile(path.join(dir, 'NotoSans-Regular.ttf')),
      readFile(path.join(dir, 'NotoSans-Bold.ttf'))
    ]);
    return {
      regular: await doc.embedFont(regular, {subset: true}),
      bold: await doc.embedFont(bold, {subset: true}),
      unicode: true
    };
  } catch {
    // font files missing: fall back to the built-in Latin fonts
    return {
      regular: await doc.embedFont(StandardFonts.Helvetica),
      bold: await doc.embedFont(StandardFonts.HelveticaBold),
      unicode: false
    };
  }
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

/** One-page A5 landscape gift card with the code the recipient enters when booking. */
export async function buildGiftCardPdf(card: GiftCardPdf): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const {regular, bold, unicode} = await loadFonts(doc);
  const t = copy[unicode ? card.locale : card.locale === 'ru' ? 'en' : card.locale];
  // the built-in fonts cannot draw Cyrillic or other non-Latin-1 characters
  const safe = (text: string) => (unicode ? text : text.replace(/[^\x20-\x7E -ÿ]/g, '?'));

  const page = doc.addPage([595.28, 419.53]);
  const {width, height} = page.getSize();
  const dark = rgb(0.008, 0.008, 0.016);
  const cyan = rgb(0.243, 0.784, 0.894);
  const muted = rgb(0.66, 0.68, 0.71);
  const white = rgb(1, 1, 1);

  page.drawRectangle({x: 0, y: 0, width, height, color: dark});
  page.drawRectangle({x: 0, y: 0, width, height: 6, color: cyan});
  page.drawText('Puro', {x: 40, y: height - 62, size: 30, font: bold, color: white});
  page.drawText(safe(t.title), {x: 40, y: height - 96, size: 13, font: bold, color: cyan});

  let y = height - 150;
  const row = (label: string, value: string, size = 20) => {
    page.drawText(safe(label), {x: 40, y, size: 10, font: regular, color: muted});
    page.drawText(safe(value), {x: 40, y: y - size - 4, size, font: bold, color: white});
    y -= size + 30;
  };
  row(t.value, card.value, 26);
  row(t.code, card.code, 22);
  row(t.valid, card.validUntil, 14);

  const rightX = 330;
  let ry = height - 150;
  if (card.recipientName) {
    page.drawText(safe(t.to), {x: rightX, y: ry, size: 10, font: regular, color: muted});
    page.drawText(safe(card.recipientName), {x: rightX, y: ry - 22, size: 16, font: bold, color: white});
    ry -= 52;
  }
  if (card.message) {
    for (const line of wrap(safe(card.message), regular, 12, width - rightX - 40)) {
      page.drawText(line, {x: rightX, y: ry, size: 12, font: regular, color: white});
      ry -= 18;
    }
  }

  page.drawText(safe(t.how), {x: 40, y: 44, size: 10, font: regular, color: muted});
  page.drawText(card.siteUrl, {x: 40, y: 26, size: 12, font: bold, color: cyan});

  return Buffer.from(await doc.save());
}
