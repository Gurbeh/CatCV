// Browser-only Supabase client
import { createBrowserClient, isBrowser } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let browserClient: SupabaseClient | undefined
export function getBrowserSupabase() {
  if (!isBrowser()) throw new Error('getBrowserSupabase called on server')
  if (!browserClient) browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return browserClient
}

