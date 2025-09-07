import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/lib/supabase/auth'

const AUTH_ROUTES = ['/login', '/sign-up']
const PROTECTED_PREFIXES = ['/dashboard', '/jobs']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createSupabaseMiddlewareClient(req, res)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  if (!session && isProtected) {
    const url = new URL('/login', req.url)
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|site.webmanifest|logo.png|icon.png|dist/).*)'],
}

