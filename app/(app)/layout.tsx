import { AppHeader } from '@/components/AppHeader'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="container mx-auto flex-1 px-4 py-6">{children}</main>
      </div>
    </AuthGuard>
  )
}

