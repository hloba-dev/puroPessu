import {getSettings} from '@/lib/data/public';
import {getStore} from '@/lib/data/store';

export const dynamic = 'force-dynamic';

const stamp = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
// RFC 5545 text escaping
const text = (value: string) => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

const summary: Record<string, string> = {
  fi: 'Puro — verhoilupesu kotonasi',
  ru: 'Puro — химчистка мебели на дому',
  en: 'Puro — upholstery cleaning at home'
};

/** "Add to calendar" file for a booking, addressed by its private manage token. */
export async function GET(_request: Request, ctx: RouteContext<'/api/booking/[token]/ics'>) {
  const {token} = await ctx.params;
  const [booking, settings] = await Promise.all([getStore().getBookingByToken(token), getSettings()]);
  if (!booking || booking.status === 'cancelled') return new Response('Not found', {status: 404});

  const end = new Date(new Date(booking.startsAt).getTime() + booking.durationMin * 60_000).toISOString();
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Puro//Booking//FI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.id}@puropesu.fi`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(booking.startsAt)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${text(summary[booking.locale] ?? summary.fi)}`,
    `LOCATION:${text(`${booking.address}, ${booking.postalCode} ${booking.city}`)}`,
    `DESCRIPTION:${text(`${booking.refCode}\n${booking.items.map((i) => `${i.name} × ${i.qty}`).join('\n')}\n${settings.phone}`)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="puro-${booking.refCode}.ics"`,
      'Cache-Control': 'no-store'
    }
  });
}
