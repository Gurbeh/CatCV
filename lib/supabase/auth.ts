import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createBrowserClient, createServerClient, createMiddlewareClient, type CookieOptions } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function createSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: '', ...options })
      },
    },
    headers: {
      get(name: string) {
        return headers().get(name) ?? undefined
      },
    },
  })
}

export function createSupabaseMiddlewareClient(req: NextRequest, res: NextResponse) {
  return createMiddlewareClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
    request: req,
    response: res,
  })
}

export type AuthProfile = {
  id: string
  email: string | null
}

