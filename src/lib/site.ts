export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://puropesu.fi').replace(
  /\/$/,
  ''
);

export const BRAND = 'Puro';

export function waLink(whatsapp: string, text?: string) {
  const digits = whatsapp.replace(/\D/g, '');
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
