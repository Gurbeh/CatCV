import { AppHeader } from '@/components/AppHeader'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <AuthGuard>
        <main className="container mx-auto flex-1 px-4 py-6">{children}</main>
      </AuthGuard>
    </div>
  )
}
