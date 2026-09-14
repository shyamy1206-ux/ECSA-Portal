import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// An anonymous client for fetching public data in Server Components 
// without opting into dynamic rendering via cookies()
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { persistSession: false }
    }
  );
}
