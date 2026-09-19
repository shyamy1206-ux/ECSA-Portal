import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')

  // Prevent redirecting to internal Vercel deployment URLs (which trigger Vercel Auth)
  // Use x-forwarded-host if available (the domain the user actually typed in)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const origin = forwardedHost ? `https://${forwardedHost}` : requestUrl.origin;

  let redirectUrl = next ? `${origin}${next}` : `${origin}/app`;

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
        redirectUrl = `${origin}/admin`;
      }
    }
  }

  return NextResponse.redirect(redirectUrl)
}
