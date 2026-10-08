import {NextResponse, type NextRequest} from 'next/server';
import {isSupabaseConfigured} from '@/lib/supabase/env';
import {createAuthClient} from '@/lib/supabase/server';

/** Magic-link landing: exchanges the one-time code for a session cookie. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const target = request.nextUrl.clone();
  target.search = '';

  if (isSupabaseConfigured && code) {
    const supabase = await createAuthClient();
    const {error} = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      target.pathname = '/admin';
      return NextResponse.redirect(target);
    }
  }
  target.pathname = '/admin/login';
  target.searchParams.set('error', 'link');
  return NextResponse.redirect(target);
}
