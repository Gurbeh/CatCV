import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { AppHeader } from '@/components/AppHeader'

export const metadata: Metadata = {
  title: 'CatCV',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <AppHeader />
          <main className="container mx-auto flex-1 px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
