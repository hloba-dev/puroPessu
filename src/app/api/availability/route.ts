import {NextResponse, type NextRequest} from 'next/server';
import {buildAvailability} from '@/lib/booking/slots';
import {addDays, utcToZoned, zonedToUtc} from '@/lib/booking/tz';
import {getSettings} from '@/lib/data/public';
import {getStore} from '@/lib/data/store';

export const dynamic = 'force-dynamic';

/**
 * GET /api/availability?duration=90[&exclude=<manage token>]
 * Real free slots for the whole booking horizon, computed from bookings and blocked times.
 * `exclude` ignores one booking's own interval (used when rescheduling it).
 */
export async function GET(request: NextRequest) {
  const duration = Number(request.nextUrl.searchParams.get('duration'));
  if (!Number.isInteger(duration) || duration < 5 || duration > 16 * 60) {
    return NextResponse.json({error: 'invalid_duration'}, {status: 400});
  }
  const exclude = request.nextUrl.searchParams.get('exclude');

  const settings = await getSettings();
  const store = getStore();
  const now = new Date();
  const today = utcToZoned(now, settings.timezone).date;
  const from = zonedToUtc(today, 0, settings.timezone).toISOString();
  const to = zonedToUtc(addDays(today, settings.bookingHorizonDays + 1), 0, settings.timezone).toISOString();

  try {
    const [schedule, own] = await Promise.all([
      store.getSchedule(from, to),
      exclude ? store.getBookingByToken(exclude) : Promise.resolve(null)
    ]);
    const busy = schedule.busy
      .filter((b) => !(own && b.staffId === own.staffId && Date.parse(b.start) === Date.parse(own.startsAt)))
      .map((b) => ({staffId: b.staffId, start: Date.parse(b.start), end: Date.parse(b.end)}));

    const days = buildAvailability({durationMin: duration, settings, staffIds: schedule.staffIds, busy, now});
    return NextResponse.json(
      {days, timezone: settings.timezone, step: settings.slotStep},
      {headers: {'Cache-Control': 'no-store'}}
    );
  } catch (error) {
    console.error('[availability] failed', error);
    return NextResponse.json({error: 'unavailable'}, {status: 503});
  }
}
