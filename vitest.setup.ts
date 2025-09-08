import '@testing-library/jest-dom/vitest'

// Next.js mocks
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
      // naive shim for tests
      const { src, alt, ...rest } = props
      return <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} {...rest} />
    },
  }
})

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Server action placeholder
vi.mock('@/lib/supabase/server', () => ({
  signOutAction: vi.fn(async () => {}),
}))

