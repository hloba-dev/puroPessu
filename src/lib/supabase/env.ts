export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

// Supabase renamed its API keys: "publishable" (sb_publishable_…) is the new name of the anon key.
// Both spellings are accepted, so the values can be pasted exactly as the dashboard shows them.
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/** Without Supabase env the site runs in demo mode on seed data and an in-memory store. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
