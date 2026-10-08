import {NextResponse, type NextRequest} from 'next/server';
import {quoteTravel} from '@/lib/booking/travel';
import {getSettings} from '@/lib/data/public';
import {getStore} from '@/lib/data/store';

export const dynamic = 'force-dynamic';

/** GET /api/travel?postal=00100 → travel fee for the postal code (distance from the base in settings). */
export async function GET(request: NextRequest) {
  const postal = request.nextUrl.searchParams.get('postal') ?? '';
  if (!/^\d{5}$/.test(postal)) return NextResponse.json({status: 'invalid'}, {status: 400});

  const [settings, row] = await Promise.all([getSettings(), getStore().findPostalCode(postal)]);
  return NextResponse.json(quoteTravel(row, settings), {
    headers: {'Cache-Control': 'public, max-age=300'}
  });
}
