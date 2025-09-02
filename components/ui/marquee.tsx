import * as React from 'react'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  items: string[]
  className?: string
}

// Basic marquee component inspired by MagicUI
export function Marquee({ items, className }: MarqueeProps) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <div className="flex w-max animate-marquee gap-8 px-2">
        {items.concat(items).map((item, i) => (
          <span
            key={i}
            className="text-sm text-muted-foreground whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
