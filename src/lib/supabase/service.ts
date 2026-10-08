import 'server-only';
import {createClient} from '@supabase/supabase-js';
import type {Database} from './database.types';
import {isSupabaseConfigured, supabaseAnonKey, supabaseUrl} from './env';

// "Secret key" (sb_secret_…) is the new name of the service-role key; both env names work.
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/** True when server-side writes can reach the database; otherwise the in-memory demo store is used. */
export const hasServiceRole = isSupabaseConfigured && Boolean(serviceKey);

const options = {auth: {persistSession: false, autoRefreshToken: false}} as const;

/** Service-role client: bypasses RLS. Server only — never import from client components. */
export function createServiceClient() {
  if (!hasServiceRole) throw new Error('SUPABASE_SECRET_KEY is not configured');
  return createClient<Database>(supabaseUrl, serviceKey, options);
}

/** Anonymous, cookie-less client for cached public reads (RLS applies). */
export function createPublicClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, options);
}
