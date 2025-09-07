'use client'
import { create } from 'zustand'

interface UiState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
}

interface UiActions {
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: UiState['theme']) => void
}

type UiStore = UiState & UiActions

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: false,
  theme: 'system',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}))

// Selectors (avoid re-renders by selecting slices where used)
export const selectSidebarOpen = (s: UiStore) => s.sidebarOpen
export const selectTheme = (s: UiStore) => s.theme
export const selectActions = (s: UiStore) => ({
  setSidebarOpen: s.setSidebarOpen,
  toggleSidebar: s.toggleSidebar,
  setTheme: s.setTheme,
})


