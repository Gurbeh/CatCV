import { cookies as nextCookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createBrowserClient, createServerClient, createMiddlewareClient, type SupabaseClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createSupabaseBrowserClient(): SupabaseClient {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function createSupabaseServerClient() {
  const cookieStore = nextCookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

export function createSupabaseMiddleware(req: NextRequest, res: NextResponse) {
  return createMiddlewareClient({ req, res }, { supabaseUrl, supabaseKey: supabaseAnonKey })
}

export async function getServerSession() {
  const supabase = createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

