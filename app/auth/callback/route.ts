import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  // We passed the 'next' parameter state during OAuth initialization
  // Sometimes OAuth providers return state param containing the next URL.
  // For Supabase, the best way to handle 'next' is via the query parameter if we pass it, or decoding state.
  // Actually, Supabase passes 'next' back directly in the query if we set it in options.redirectTo
  const next = requestUrl.searchParams.get('next')

  let redirectUrl = next ? `${requestUrl.origin}${next}` : `${requestUrl.origin}/app`;

  if (code) {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (session && !next) {
      // Check user role for default routing if 'next' is not specified
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      const role = roleData?.role;
      
      if (role === 'super_admin' || role === 'ecsa_admin') {
        redirectUrl = `${requestUrl.origin}/admin`;
      }
    }
  }

  // Fallback if no code and no next (though should not happen)
  return NextResponse.redirect(redirectUrl)
}
