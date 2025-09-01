import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom'
import './index.css'
import { Toaster } from '@/components/ui/sonner'
import LoginPage from './app/routes/login'
import HomePage from './app/routes/home'
import NewJobPage from './app/routes/jobs/new'
import JobDetailPage from './app/routes/jobs/id'
import { AppHeader } from './components/AppHeader'
import { JobsProvider } from './lib/jobsContext'

function Layout() {
  const location = useLocation()
  const showHeader = location.pathname !== '/login'
  return (
    <div className="min-h-screen flex flex-col">
      <JobsProvider>
        {showHeader ? <AppHeader /> : null}
        <main className="container mx-auto flex-1 px-4 py-6">
          <Outlet />
        </main>
      </JobsProvider>
      <Toaster richColors closeButton position="top-right" />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'jobs/new', element: <NewJobPage /> },
      { path: 'jobs/:id', element: <JobDetailPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
