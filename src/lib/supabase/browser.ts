import {createBrowserClient} from '@supabase/ssr';
import type {Database} from './database.types';
import {supabaseAnonKey, supabaseUrl} from './env';

export function createBrowserSupabase() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
