import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/providers'
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: 'CatCV',
  description: 'Track your job hunt with CatCV',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SpeedInsights />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

