import { NextResponse, type NextRequest } from 'next/server'

const AUTH_ROUTES = ['/login', '/sign-up']
const PROTECTED_PREFIXES = ['/dashboard', '/jobs']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  // Defer auth checks to client AuthGuard for now to avoid Edge runtime issues.
  // Keep minimal redirect logic: prevent signed-in users from visiting auth routes via cookie hint.
  const hasSbAuth = req.cookies.has('sb-access-token') || req.cookies.has('sb:token')
  if (hasSbAuth && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|site.webmanifest|logo.png|icon.png|dist/).*)'],
}

