"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/authStore'

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isReady = useAuthStore((s) => s.isReady())
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn())

  useEffect(() => {
    if (!isReady) return
    if (isLoggedIn) {
      router.push('/')
    }
  }, [isReady, isLoggedIn, router])

  if (!isReady || isLoggedIn) return null
  return <>{children}</>
}
