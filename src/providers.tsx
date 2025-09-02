'use client'

import * as React from 'react'
import { JobsProvider } from '@/lib/jobsContext'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JobsProvider>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </JobsProvider>
  )
}

