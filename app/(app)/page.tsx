import Link from 'next/link'
import Image from 'next/image'
import { buttonClasses } from '@/components/ui/button'
import { Marquee } from '@/components/ui/marquee'
import { Highlighter } from '@/components/ui/highlighter'

export default function HomePage() {
  const fakeCompanies = ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Soylent', 'Wonka Industries']
  return (
    <div className="flex flex-col items-center gap-8 py-20 text-center">
      <Image src="/logo.png" alt="CatCV" width={1032} height={725} className="h-24 w-auto" priority />
      <h1 className="text-4xl font-bold leading-tight">
        Track your <Highlighter action="underline">job hunt</Highlighter> with{' '}
        <Highlighter variant="green">CatCV</Highlighter>
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Save opportunities, follow up with ease and stay organized while searching for your next role.
      </p>
      <div className="flex gap-4">
        <Link href="/dashboard" className={buttonClasses({ size: 'lg' })}>
          Login
        </Link>
        <Link href="/dashboard" className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
          Sign Up
        </Link>
      </div>
      <div className="w-full max-w-3xl pt-10">
        <Marquee items={fakeCompanies} />
      </div>
    </div>
  )
}
