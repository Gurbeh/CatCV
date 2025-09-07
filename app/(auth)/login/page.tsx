"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/authStore'
import { signInNoRedirect } from '@/lib/supabase/server'

export default function LoginPage() {
  const router = useRouter()
  const redirectTo = '/dashboard'
  const setUser = useAuthStore((s) => s.setUser)
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use your email and password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (fd) => {
              const res = await signInNoRedirect(undefined, fd)
              if (res?.ok) {
                const supabase = getBrowserSupabase()
                const { data } = await supabase.auth.getUser()
                const u = data.user ? { id: data.user.id, email: data.user.email ?? '' } : null
                setUser(u)
                router.replace(String(fd.get('redirectTo') || '/dashboard'))
              }
            }}
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
            <Button type="submit">Sign in</Button>
            <p className="text-center text-xs text-muted-foreground">
              No account? <Link href="/sign-up" className="underline">Create one</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
