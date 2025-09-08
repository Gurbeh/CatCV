import { createMiddlewareClient } from '@supabase/ssr'
import type { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createSupabaseMiddlewareClient(req: NextRequest, res: NextResponse) {
  return createMiddlewareClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
    request: req,
    response: res,
  })
}

