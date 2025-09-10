"use client"

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/authStore'
import { signInNoRedirect } from '@/lib/supabase/server'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectToParam = searchParams.get('redirectTo') || '/dashboard'
  const setUser = useAuthStore((s) => s.setUser)
  const [loading, setLoading] = React.useState<'email' | 'google' | null>(null)

  // فقط مسیرهای داخلی را قبول کن (برای جلوگیری از open redirect)
  const safeNext = React.useMemo(() => {
    try {
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : (process.env.NEXT_PUBLIC_SITE_URL ?? '')
      const url = new URL(redirectToParam, origin)
      return url.origin === origin ? (url.pathname + url.search + url.hash || '/dashboard') : '/xvvxxvdashboard'
    } catch {
      return '/dashboard'
    }
  }, [redirectToParam])

  async function signInWithGoogle() {
    setLoading('google')
    const supabase = getBrowserSupabase()

    // ✅ در فایل‌های client، از origin واقعی مرورگر استفاده کن
    const siteUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL ?? '')

    const redirectTo = `${siteUrl}/auth/callback?next=${encodeURIComponent(safeNext)}`

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })

    // برای دیباگ: ببین دقیقاً کجا می‌ره
    // eslint-disable-next-line no-console
    console.log('Google OAuth redirect:', {
      siteUrl,
      redirectTo,
      data,
      dataURL: data?.url,
      envSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    })

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Google OAuth error', error)
      setLoading(null)
      return
    }

    // معمولاً Supabase خودش ریدایرکت می‌کند، ولی اگر URL داد، دستی هم هندل می‌کنیم
    if (data?.url) window.location.href = data.url
    else setLoading(null)
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use your email and password or continue with Google.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <form
              action={async (fd) => {
                setLoading('email')
                try {
                  const res = await signInNoRedirect(undefined, fd)
                  if (res?.ok) {
                    const supabase = getBrowserSupabase()
                    const { data } = await supabase.auth.getUser()
                    const u = data.user ? { id: data.user.id, email: data.user.email ?? '' } : null
                    setUser(u)

                    const origin =
                      typeof window !== 'undefined'
                        ? window.location.origin
                        : (process.env.NEXT_PUBLIC_SITE_URL ?? '')
                    const nextFromForm = String(fd.get('redirectTo') || '/dashboard')
                    let nextSafe = '/dashboard'
                    try {
                      const nu = new URL(nextFromForm, origin)
                      nextSafe = nu.origin === origin
                        ? (nu.pathname + nu.search + nu.hash || '/dashboard')
                        : '/dashboard'
                    } catch {
                      nextSafe = '/dashboard'
                    }

                    router.replace(nextSafe)
                  }
                } finally {
                  setLoading(null)
                }
              }}
              className="flex flex-col gap-4"
            >
              <input type="hidden" name="redirectTo" value={safeNext} />
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" disabled={loading !== null} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required autoComplete="current-password" disabled={loading !== null} />
              </div>
              <Button type="submit" disabled={loading !== null}>{loading === 'email' ? 'Signing in…' : 'Sign in'}</Button>
            </form>

            <div className="relative py-2 text-center">
              <span className="px-2 text-xs uppercase text-muted-foreground">Or</span>
            </div>

            <Button
              variant="outline"
              type="button"
              onClick={signInWithGoogle}
              disabled={loading !== null}
              className="group relative flex h-11 items-center justify-center gap-3 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent/40 disabled:opacity-60"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 256 262"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path fill="#EA4335" d="M255.7 133.5c0-10.9-.9-18.8-2.8-27H130v48.9h71.7c-1.4 12-9 30-25.8 42.1l-.2 1.4 37.5 29 2.6.3c24-22.1 39.9-54.6 39.9-95.7"/>
                <path fill="#34A853" d="M130 261c36.3 0 66.8-11.9 89.1-32.4l-42.4-32.8c-11.4 8-26.6 13.6-46.7 13.6-35.7 0-66-22.1-76.8-52.7l-1.6.1-41.5 32.1-.5 1.5C31.8 231.9 77.9 261 130 261"/>
                <path fill="#4A90E2" d="M53.2 155.4C50.6 147.4 49 138.9 49 130s1.6-17.4 4.2-25.4ل-.1-1.7L11.1 70.2 9.9 71C1.8 87.7-2.9 108.2-2.9 130s4.7 42.3 12.8 59l41.4-32.1"/>
                <path fill="#FBBC05" d="M130 50.5c25.2 0 42.1 10.9 51.8 20l37.8-36.9C196.7 12.1 166.3 0 130 0 77.9 0 31.8 29.1 9.9 71l43.3 33.6C64 72.6 94.3 50.5 130 50.5"/>
              </svg>
              <span>{loading === 'google' ? 'Redirecting…' : 'Continue with Google'}</span>
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              No account? <Link href="/sign-up" className="underline">Create one</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
