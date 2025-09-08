import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll().map((c) => ({ name: c.name, value: c.value }))
      },
      setAll(cookies) {
        cookies.forEach((c) => res.cookies.set({ name: c.name, value: c.value, ...c.options }))
      },
    },
  })

  const url = req.nextUrl
  const path = url.pathname

  // Protected app routes: require authentication
  if (path.startsWith('/dashboard') || path.startsWith('/jobs')) {
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }

  // Auth routes: redirect authenticated users away from login/sign-up
  if (path === '/login' || path === '/sign-up') {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
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
