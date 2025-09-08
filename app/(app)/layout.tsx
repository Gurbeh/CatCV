import { AppHeader } from '@/components/appHeader/AppHeader'
import { AuthGuard } from '@/components/auth/AuthGuard'
// Auth is enforced via middleware; no client guard to avoid loops

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
