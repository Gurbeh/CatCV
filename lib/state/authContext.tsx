'use client'

import * as React from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from '@/lib/supabase/auth'
import { toast } from 'sonner'

type AuthContextValue = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (params: { email: string; password: string }) => Promise<void>
  signUp: (params: { email: string; password: string }) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [session, setSession] = React.useState<Session | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), [])

  React.useEffect(() => {
    let isMounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setIsLoading(false)
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

  const signIn = React.useCallback(async ({ email, password }: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message?.toLowerCase().includes('email not confirmed')) {
        toast.error('Please confirm your email before signing in.')
      } else {
        toast.error(error.message)
      }
      return
    }
    toast.success('Signed in')
  }, [supabase])

  const signUp = React.useCallback(async ({ email, password }: { email: string; password: string }) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Check your email to confirm your account')
  }, [supabase])

  const signOut = React.useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Signed out')
  }, [supabase])

  const value = React.useMemo<AuthContextValue>(() => ({ user, session, isLoading, signIn, signUp, signOut }), [user, session, isLoading, signIn, signUp, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

