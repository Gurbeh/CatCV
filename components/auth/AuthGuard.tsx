'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase/client'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = getBrowserSupabase()
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/login')
      else setReady(true)
    })
  }, [router])

  if (!ready) return null
  return <>{children}</>
}
