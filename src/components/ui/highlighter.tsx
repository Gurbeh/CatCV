import * as React from 'react'
import { cn } from '@/lib/utils'

// Simple gradient highlight span inspired by MagicUI
export function Highlighter({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'relative rounded px-2 py-1 text-blue-600',
        'bg-gradient-to-r from-blue-200 via-pink-200 to-purple-200',
        className,
      )}
      {...props}
    />
  )
}
