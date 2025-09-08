import * as React from 'react'

import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonClasses({variant, size, className})}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export function buttonClasses({
  variant = 'default',
  size = 'md',
  className,
}: Pick<ButtonProps, 'variant' | 'size' | 'className'> = {}) {
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    default:
      'relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md hover:from-blue-500 hover:to-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50',
    secondary:
      'relative overflow-hidden bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40',
    ghost:
      'bg-transparent hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/30',
    destructive:
      'bg-destructive text-destructive-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50',
    outline:
      'border border-input bg-transparent hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40',
  }
  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-9 px-4 text-sm',
    lg: 'h-10 px-6 text-base',
    icon: 'h-9 w-9 p-0',
  }
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}
