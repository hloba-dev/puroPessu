import 'server-only';
import {redirect} from 'next/navigation';
import {isSupabaseConfigured} from '@/lib/supabase/env';
import {createAuthClient} from '@/lib/supabase/server';

async function session() {
  if (!isSupabaseConfigured) return null;
  const supabase = await createAuthClient();
  const {
    data: {user}
  } = await supabase.auth.getUser();
  if (!user) return null;
  const {data: admin} = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  return {supabase, user, isAdmin: Boolean(admin)};
}

/** The signed-in user, if they are listed in the `admins` table; otherwise null. */
export async function getAdmin() {
  const current = await session();
  return current?.isAdmin ? {supabase: current.supabase, user: current.user} : null;
}

/** Gate for every admin page and Server Action. RLS enforces the same rule in the database. */
export async function requireAdmin() {
  const current = await session();
  if (!current) redirect('/admin/login');
  if (!current.isAdmin) {
    // signed in, but not an admin: end the session so the login form is usable again
    await current.supabase.auth.signOut();
    redirect('/admin/login?error=not_admin');
  }
  return {supabase: current.supabase, user: current.user};
}
