import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Marquee } from '@/components/ui/marquee'
import { Highlighter } from '@/components/ui/highlighter'

import { isLoggedIn } from '@/lib/supabase/server'
import { ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const fakeCompanies = ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Soylent', 'Wonka Industries']
  const loggedIn = await isLoggedIn()
  return (
    <div className="flex flex-col items-center gap-8 py-20 text-center">
      <Image src="/android-chrome-512x512.png" alt="CatCV" width={1032} height={725} className="h-24 w-auto" priority />
      <h1 className="text-4xl font-bold leading-tight">
        Track your <Highlighter action="underline">job hunt</Highlighter> with{' '}
        <Highlighter variant="green">CatCV</Highlighter>
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Save opportunities, follow up with ease and stay organized while searching for your next role.
      </p>
      {loggedIn ? (
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href="/dashboard">Open Dashboard</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/jobs/new">
              Track a new job <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      )}
      <div className="w-full max-w-3xl pt-10">
        <Marquee items={fakeCompanies} />
      </div>
    </div>
  )
}
