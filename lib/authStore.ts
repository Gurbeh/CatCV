'use client'

import { create } from 'zustand'

type AuthUser = { id: string; email: string }

type AuthState = {
  // undefined => not resolved yet (hydrating / fetching)
  user: AuthUser | null | undefined
  setUser: (user: AuthUser | null) => void
  isLoggedIn: () => boolean
  isReady: () => boolean
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  isLoggedIn: () => !!get().user,
  isReady: () => get().user !== undefined,
}))
