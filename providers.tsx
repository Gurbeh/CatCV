'use client'

import * as React from 'react'
import { JobsProvider } from '@/lib/jobsContext'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { Toaster } from 'sonner'

export function Providers({ children, initialUser }: { children: React.ReactNode; initialUser: { id: string; email: string } | null }) {
  return (
    <React.Fragment>
      <AuthProvider initialUser={initialUser}>
        <JobsProvider>
          {children}
        </JobsProvider>
      </AuthProvider>
      <Toaster richColors closeButton position="top-right" />
    </React.Fragment>
  )
}
