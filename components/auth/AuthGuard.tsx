'use client'

import * as React from 'react'
import { useAuth } from '@/lib/state/authContext'
import { usePathname, useRouter } from 'next/navigation'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    if (!loading && !user) {
      const url = new URL('/login', window.location.origin)
      url.searchParams.set('returnTo', pathname)
      router.replace(url.toString())
    }
  }, [user, loading, router, pathname])

  if (loading) return null
  if (!user) return null
  return <>{children}</>
}

