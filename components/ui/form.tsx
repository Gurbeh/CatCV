import * as React from 'react'

// Minimal form wrapper to align with shadcn api expectations.
// You can replace with react-hook-form integration later without changing call sites.

export function Form({ className, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  return <form className={className} {...props} />
}

