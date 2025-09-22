'use client'

import * as React from 'react'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { Toaster } from 'sonner'

export function Providers({ children, initialUser }: { children: React.ReactNode; initialUser: { id: string; email: string } | null }) {
  return (
    <React.Fragment>
      <AuthProvider initialUser={initialUser}>
        {children}
      </AuthProvider>
      <Toaster richColors closeButton position="top-right" />
    </React.Fragment>
  )
}
