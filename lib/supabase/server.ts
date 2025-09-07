"use server"

// Server-only Supabase: SSR client + actions
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { z } from 'zod'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

type CookieOptions = {
  path?: string
  domain?: string
  maxAge?: number
  expires?: Date
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'lax' | 'strict' | 'none'
}

async function getServerSupabase() {
  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const entries = cookieStore.getAll()
        return entries.map((c) => ({ name: c.name, value: c.value }))
      },
      setAll(cookies) {
        cookies.forEach((c) => {
          cookieStore.set(c.name, c.value, c.options as CookieOptions)
        })
      },
    },
  })
}

const signInSchema = z.object({ email: z.string().email(), password: z.string().min(6) })
const signUpSchema = z.object({ email: z.string().email(), password: z.string().min(6) })

export async function signInAction(_: unknown, formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  })
  if (!parsed.success) return { ok: false, error: 'Invalid credentials' }

  const supabase = await getServerSupabase()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { ok: false, error: error.message }
  const redirectTo = String(formData.get('redirectTo') ?? '/dashboard')
  const { redirect } = await import('next/navigation')
  redirect(redirectTo)
}

export async function signIn(formData: FormData) {
  await signInAction(undefined, formData)
}

export async function signUpAction(_: unknown, formData: FormData) {
  const parsed = signUpSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  })
  if (!parsed.success) return { ok: false, error: 'Invalid input' }

  const supabase = await getServerSupabase()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/login` },
  })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function signOutAction() {
  const supabase = await getServerSupabase()
  await supabase.auth.signOut()
  return { ok: true }
}
