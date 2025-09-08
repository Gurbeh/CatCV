import { NextResponse, type NextRequest } from 'next/server'

// Edge-safe middleware: avoid importing Supabase client to keep Edge bundle Node-free
// We infer authentication by checking for the Supabase access token cookie set by our app
// via server actions/pages using @supabase/ssr.

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req })

  const url = req.nextUrl
  const path = url.pathname


  console.log('redirect to 3:', { reqUrl: req?.url, url, path});

  // Supabase cookies (set by @supabase/ssr) commonly include:
  // - 'sb-access-token' and 'sb-refresh-token'
  // Presence of 'sb-access-token' is a good signal that the user is authenticated.
  const hasAccessToken = Boolean(req.cookies.get('sb-access-token')?.value)

  // Protected app routes: require authentication
  if (path.startsWith('/dashboard') || path.startsWith('/jobs')) {
    if (!hasAccessToken) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }

  // Auth routes: redirect authenticated users away from login/sign-up
  if (path === '/login' || path === '/sign-up') {
    if (hasAccessToken) {
      const redirectUrl = new URL('/dashboard', req.url)
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/jobs/:path*', '/login', '/sign-up'],
}
