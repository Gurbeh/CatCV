import React from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { AppHeader } from '../AppHeader'
import { useAuthStore } from '@/lib/authStore'

describe('AppHeader', () => {
  beforeEach(() => {
    // reset store to pre-hydration
    useAuthStore.setState({ user: undefined } as any, true)
  })
  afterEach(() => {
    useAuthStore.setState({ user: undefined } as any, true)
  })

  it('before hydration: shows skeleton, no Login/Sign Up', () => {
    // user: undefined => isReady false
    useAuthStore.setState({ user: undefined } as any)
    const { container } = render(<AppHeader />)
    // skeleton present
    const skeleton = container.querySelector('[class*="animate-pulse"]')
    expect(skeleton).toBeInTheDocument()
    // auth links absent
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()
  })

  it('after hydration (logged out): shows Login and Sign Up', () => {
    // user: null => isReady true, not logged in
    useAuthStore.setState({ user: null } as any)
    const { container } = render(<AppHeader />)
    // skeleton gone
    const skeleton = container.querySelector('[class*="animate-pulse"]')
    expect(skeleton).not.toBeInTheDocument()
    // auth links present
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })

  it('after hydration (logged in): shows Dashboard, no Login/Sign Up', () => {
    useAuthStore.setState({ user: { id: 'u1', email: 'a@b.com' } } as any)
    const { container } = render(<AppHeader />)
    // skeleton gone
    const skeleton = container.querySelector('[class*="animate-pulse"]')
    expect(skeleton).not.toBeInTheDocument()
    // dashboard link present
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    // auth links absent
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()
  })
})

