'use client'

import * as React from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from '@/lib/supabase/auth'

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithPassword: (email: string, password: string) => Promise<{ error?: Error }>
  signUpWithPassword: (email: string, password: string) => Promise<{ error?: Error }>
  signOut: () => Promise<{ error?: Error }>
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), [])
  const [session, setSession] = React.useState<Session | null>(null)
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })

    return () => {
      isMounted = false
      subscription.subscription.unsubscribe()
    }
  }, [supabase])

  const value = React.useMemo<AuthContextValue>(() => ({
    user,
    session,
    loading,
    async signInWithPassword(email: string, password: string) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error ?? undefined }
    },
    async signUpWithPassword(email: string, password: string) {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
      return { error: error ?? undefined }
    },
    async signOut() {
      const { error } = await supabase.auth.signOut()
      return { error: error ?? undefined }
    },
  }), [user, session, loading, supabase])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

