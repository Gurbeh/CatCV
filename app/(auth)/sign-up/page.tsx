'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import { signUpAction } from '@/lib/supabase/server'

export default function SignUpPage() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>We will send a verification email.</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-2 text-sm">
              <p>Check your email to verify your account.</p>
              <p className="text-muted-foreground">You can close this tab.</p>
            </div>
          ) : (
            <form
              action={async (fd) => {
                const res = await signUpAction(undefined, fd)
                if (res?.ok) setSubmitted(true)
                // else you could show an error via toast
              }}
              className="flex flex-col gap-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required autoComplete="new-password" />
              </div>
              <Button type="submit">Sign up</Button>
              <p className="text-center text-xs text-muted-foreground">
                Already have an account? <Link href="/login" className="underline">Sign in</Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
