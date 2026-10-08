/**
 * Client address for rate limiting.
 * `x-real-ip` is set by the platform (Vercel) or by the reverse proxy (`proxy_set_header X-Real-IP $remote_addr`).
 * Without it the LAST x-forwarded-for hop is used: the first entries are whatever the client sent
 * and would let anyone dodge the limiter by inventing addresses.
 */
export function pickClientIp(headers: Headers): string {
  const real = headers.get('x-real-ip')?.trim();
  if (real) return real;
  const hops = (headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((hop) => hop.trim())
    .filter(Boolean);
  return hops[hops.length - 1] ?? 'unknown';
}
