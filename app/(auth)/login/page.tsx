import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { signIn } from '@/lib/supabase/server'

export default function LoginPage() {
  const redirectTo = '/dashboard'
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use your email and password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signIn} className="flex flex-col gap-4">
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
