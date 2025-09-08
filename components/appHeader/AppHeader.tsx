"use client"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button, buttonClasses } from '@/components/ui/button'
import { User } from 'lucide-react'
import * as React from 'react'
import { signOutAction } from '@/lib/supabase/server'
import { useAuthStore } from '@/lib/authStore'

export function AppHeader() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const email = useAuthStore((s) => s.user?.email ?? null)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn())
  const menuRef = React.useRef<HTMLDivElement | null>(null)
  const isReady = useAuthStore((s) => s.isReady())
  
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    if (open) {
      document.addEventListener('mousedown', onDocClick)
      document.addEventListener('keydown', onKey)
    }
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  return (
    <header className="w-full border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90" aria-label="CatCV Home">
          <Image src="/logo.png" alt="CatCV" width={1032} height={725} className="h-10 w-auto" priority />
          <span className="sr-only">CatCV</span>
        </Link>
        <nav className="relative flex items-center gap-2">
          {!isReady ? (
            <div className="h-9 w-28 animate-pulse rounded bg-muted" />
          ) : isLoggedIn ? (
            <>
              <Link href="/dashboard" className={pathname === '/dashboard' ? 'underline' : 'hover:underline'}>Dashboard</Link>
              <div ref={menuRef} className="relative">
                <Button variant="ghost" size="icon" aria-label="Account menu" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((v) => !v)}>
                  <User className="h-4 w-4" />
                </Button>
                {open ? (
                  <div role="menu" className="absolute right-0 z-50 mt-2 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                    <div className="cursor-default select-none rounded-sm px-2 py-1.5 text-sm opacity-60">Signed in as {email}</div>
                    <div className="-mx-1 my-1 h-px bg-border" />
                    <form
                      action={async () => {
                        await signOutAction()
                        window.location.href = '/'
                      }}
                    >
                      <button className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent">
                        Sign out
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className={buttonClasses({ size: 'sm' })}>Login</Link>
              <Link href="/sign-up" className={buttonClasses({ variant: 'outline', size: 'sm' })}>Sign Up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
