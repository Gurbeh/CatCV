import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import * as React from 'react'

export function AppHeader() {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement | null>(null)
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
        <Link to="/" className="flex items-center gap-2 hover:opacity-90" aria-label="CatCV Home">
          <img src="/logo.png" alt="CatCV" className="h-10 w-auto" />
          <span className="sr-only">CatCV</span>
        </Link>
        <nav className="relative flex items-center gap-2">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'underline' : 'hover:underline')}>Home</NavLink>
          <div ref={menuRef} className="relative">
            <Button variant="ghost" size="icon" aria-label="Account menu" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((v) => !v)}>
              <User className="h-4 w-4" />
            </Button>
            {open ? (
              <div role="menu" className="absolute right-0 z-50 mt-2 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                <div className="cursor-default select-none rounded-sm px-2 py-1.5 text-sm opacity-60">Signed in as demo</div>
                <div className="-mx-1 my-1 h-px bg-border" />
                <div className="cursor-default select-none rounded-sm px-2 py-1.5 text-sm opacity-60">Sign out (coming soon)</div>
              </div>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  )
}
