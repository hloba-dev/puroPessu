import type {NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import {updateAdminSession} from './lib/supabase/proxy';

const handleI18n = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return updateAdminSession(request);
  }
  return handleI18n(request);
}

export const config = {
  // Skip API routes, Next internals, generated OG images and anything with a file extension.
  matcher: ['/((?!api|_next|_vercel|.*opengraph-image.*|.*\\..*).*)']
};
