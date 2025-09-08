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
      const { src, alt, ...rest } = props
      return <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} {...rest} />
    },
  }
})

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('@/lib/supabase/server', () => ({
  signOutAction: vi.fn(async () => {}),
}))

