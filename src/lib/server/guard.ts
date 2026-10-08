import 'server-only';
import {headers} from 'next/headers';
import {getStore} from '@/lib/data/store';
import {pickClientIp} from './client-ip';

export async function clientIp() {
  return pickClientIp(await headers());
}

/** Rate limit per IP and action, e.g. limit('booking', 5, 600) = 5 attempts per 10 minutes. */
export async function withinRateLimit(action: string, max: number, windowSeconds: number) {
  const ip = await clientIp();
  return getStore().hitRateLimit(`${action}:${ip}`, windowSeconds, max);
}
