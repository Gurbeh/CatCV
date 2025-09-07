'use client'

import * as React from 'react'
import { JobsProvider } from '@/lib/jobsContext'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/state/authContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <JobsProvider>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </JobsProvider>
    </AuthProvider>
  )
}
