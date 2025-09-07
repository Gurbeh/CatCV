import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/providers'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { getAuthSession } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'CatCV',
  description: 'Track your job hunt with CatCV',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { data } = await getAuthSession()
  const initialUser = data.session?.user
    ? { id: data.session.user.id, email: data.session.user.email ?? '' }
    : null
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SpeedInsights />
        <Providers initialUser={initialUser}>{children}</Providers>
      </body>
    </html>
  )
}
