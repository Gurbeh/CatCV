import '@testing-library/jest-dom/vitest'

import React from 'react'
import { vi } from 'vitest'

vi.mock('next/link', () => {
  return {
    default: ({ href, children, ...props }: any) => (
      <a href={typeof href === 'string' ? href : ''} {...props}>
        {children}
      </a>
    ),
  }
})

vi.mock('next/image', () => {
  return {
    default: (props: any) => {
      const { src, alt, priority: _priority, ...rest } = props
      return <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} {...rest} />
    },
  }
})

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock next/headers to avoid cookie mutation errors in jsdom
vi.mock('next/headers', () => ({
  cookies: async () => ({
    getAll: () => [],
    get: (_name?: string) => undefined,
    set: (_name: string, _value: string, _opts?: any) => {},
    delete: (_name: string) => {},
  }),
  headers: () => new Headers(),
  draftMode: () => ({ isEnabled: false, enable: () => {}, disable: () => {} }),
}))

vi.mock('@/lib/supabase/server', () => ({
  signOutAction: vi.fn(async () => {}),
}))
