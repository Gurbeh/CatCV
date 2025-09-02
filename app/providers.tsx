'use client'

import { JobsProvider } from '@/lib/jobsContext'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JobsProvider>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </JobsProvider>
  )
}
