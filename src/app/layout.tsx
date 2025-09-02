'use client'

import './globals.css'
import { AppHeader } from '@/components/AppHeader'
import { JobsProvider } from '@/lib/jobsContext'
import { Toaster } from '@/components/ui/sonner'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showHeader = pathname !== '/login'
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <JobsProvider>
          {showHeader ? <AppHeader /> : null}
          <main className="container mx-auto flex-1 px-4 py-6">{children}</main>
        </JobsProvider>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  )
}
