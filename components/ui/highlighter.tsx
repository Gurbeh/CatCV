import * as React from 'react'
import { cn } from '@/lib/utils'

type HighlighterProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'blue' | 'green'
  action?: 'highlight' | 'underline'
}

// Simple gradient highlight span inspired by MagicUI
export function Highlighter({
  className,
  variant = 'blue',
  action = 'highlight',
  ...props
}: HighlighterProps) {
  const styles = {
    blue: {
      highlight:
        'text-blue-600 bg-gradient-to-r from-blue-200 via-pink-200 to-purple-200 rounded px-2 py-1',
      underline:
        'text-blue-600 underline decoration-blue-400 decoration-4 underline-offset-4',
    },
    green: {
      highlight:
        'text-green-700 bg-gradient-to-r from-green-200 via-yellow-200 to-orange-200 rounded px-2 py-1',
      underline:
        'text-green-700 underline decoration-green-400 decoration-4 underline-offset-4',
    },
  }
  return <span className={cn(styles[variant][action], className)} {...props} />
}
