import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddleware } from '@/lib/supabase/auth'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: { headers: req.headers } })
  const supabase = createSupabaseMiddleware(req, res)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = new URL(req.url)
  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/auth/callback')
  const isPublicRoute = url.pathname === '/' || url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.startsWith('/favicon') || url.pathname.startsWith('/images') || url.pathname.startsWith('/dist')

  if (!session && !isAuthRoute && !isPublicRoute) {
    const redirectUrl = new URL('/login', url.origin)
    redirectUrl.searchParams.set('returnTo', url.pathname + url.search)
    return NextResponse.redirect(redirectUrl)
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', url.origin))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|dist).*)'],
}

