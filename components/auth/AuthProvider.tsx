'use client'

import * as React from 'react'
import { useAuthStore } from '@/lib/authStore'
import { getBrowserSupabase } from '@/lib/supabase/client'

type Props = {
  initialUser: { id: string; email: string } | null
  children: React.ReactNode
}

export function AuthProvider({ initialUser, children }: Props) {
  const setUser = useAuthStore((s) => s.setUser)
  React.useEffect(() => {
    setUser(initialUser)
    const supabase = getBrowserSupabase()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ? { id: session.user.id, email: session.user.email ?? '' } : null
      setUser(u)
    })
    return () => sub.subscription.unsubscribe()
  }, [setUser, initialUser])
  return <>{children}</>
}
