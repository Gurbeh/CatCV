'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/state/authContext'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    if (isLoading) return
    const isAuthRoute = pathname?.startsWith('/login') || pathname?.startsWith('/sign-up')
    if (!user && !isAuthRoute) {
      router.replace('/login')
    }
    if (user && isAuthRoute) {
      router.replace('/dashboard')
    }
  }, [user, isLoading, pathname, router])

  if (isLoading) return null
  const isAuthRoute = pathname?.startsWith('/login') || pathname?.startsWith('/sign-up')
  if (!user && !isAuthRoute) return null
  return <>{children}</>
}

