"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'

  useEffect(() => {
    const supabase = getBrowserSupabase()
    // Simply accessing the client on this page allows @supabase/ssr to parse the code hash
    // and persist the session in cookies/localStorage. Then we can redirect.
    supabase.auth.getSession().finally(() => {
      router.replace(next)
    })
  }, [router, next])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-sm text-muted-foreground">Signing you in…</div>
    </div>
  )
}
