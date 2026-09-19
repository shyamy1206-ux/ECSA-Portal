import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (e) {
    // Silently ignore auth errors in middleware to prevent 500s on misconfiguration
  }

  // Allow access to health check in development without auth
  const isHealthCheck = request.nextUrl.pathname === '/admin/health'
  const isDev = process.env.NODE_ENV === 'development'

  // Protect /app and /admin routes
  if (
    !user &&
    ! (isDev && isHealthCheck) &&
    (request.nextUrl.pathname.startsWith('/app') || request.nextUrl.pathname.startsWith('/admin'))
  ) {
    const url = request.nextUrl.clone()
    url.searchParams.set('next', request.nextUrl.pathname)
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Prevent logged-in users from accessing /login
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Admin Role Check
  if (
    user && 
    request.nextUrl.pathname.startsWith('/admin') && 
    !(isDev && isHealthCheck)
  ) {
    try {
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', ['ecsa_admin', 'super_admin'])
        .limit(1)
        .maybeSingle();

      if (error || !roleData) {
        const url = request.nextUrl.clone();
        url.pathname = '/app';
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }
    } catch (e) {
      // If fetching fails, default to denied
      const url = request.nextUrl.clone();
      url.pathname = '/app';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse
}
