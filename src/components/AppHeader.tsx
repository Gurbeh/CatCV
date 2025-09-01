import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { User } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90" aria-label="CatCV Home">
          <img src="/logo.png" alt="CatCV" className="h-10 w-auto" />
          <span className="sr-only">CatCV</span>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'underline' : 'hover:underline')}>Home</NavLink>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account menu">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="opacity-60" aria-disabled>
                Signed in as demo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="opacity-60" aria-disabled>
                Sign out (coming soon)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}
