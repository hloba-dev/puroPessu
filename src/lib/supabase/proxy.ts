import {NextResponse, type NextRequest} from 'next/server';
import {createServerClient} from '@supabase/ssr';
import {isSupabaseConfigured, supabaseAnonKey, supabaseUrl} from './env';

/** Refreshes the Supabase auth session for /admin and bounces anonymous visitors to the login page. */
export async function updateAdminSession(request: NextRequest) {
  let response = NextResponse.next({request});
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({name, value}) => request.cookies.set(name, value));
        response = NextResponse.next({request});
        cookiesToSet.forEach(({name, value, options}) => response.cookies.set(name, value, options));
      }
    }
  });

  const {
    data: {user}
  } = await supabase.auth.getUser();

  const {pathname} = request.nextUrl;
  // the login page and the magic-link callback must stay reachable without a session
  const isPublic = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/auth/');
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return response;
}
