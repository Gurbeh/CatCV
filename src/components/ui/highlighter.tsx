import * as React from 'react'
import { cn } from '@/lib/utils'

type HighlighterProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'blue' | 'green'
}

// Simple gradient highlight span inspired by MagicUI
export function Highlighter({
  className,
  variant = 'blue',
  ...props
}: HighlighterProps) {
  const variants = {
    blue: 'text-blue-600 bg-gradient-to-r from-blue-200 via-pink-200 to-purple-200',
    green: 'text-green-700 bg-gradient-to-r from-green-200 via-yellow-200 to-orange-200',
  }
  return (
    <span
      className={cn('relative rounded px-2 py-1', variants[variant], className)}
      {...props}
    />
  )
}
