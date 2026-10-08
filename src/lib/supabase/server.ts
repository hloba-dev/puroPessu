import 'server-only';
import {cookies} from 'next/headers';
import {createServerClient} from '@supabase/ssr';
import type {Database} from './database.types';
import {supabaseAnonKey, supabaseUrl} from './env';

/** Cookie-bound client for the signed-in admin; RLS decides what the user may touch. */
export async function createAuthClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({name, value, options}) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component: the proxy refreshes the session instead.
        }
      }
    }
  });
}
