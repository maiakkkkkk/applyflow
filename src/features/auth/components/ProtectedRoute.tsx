import { Navigate, Outlet } from 'react-router'
import { ApplicationsProvider } from '../../applications/context/ApplicationsContext'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { session, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="auth-loading" aria-live="polite">
        Loading your session…
      </main>
    )
  }

  if (!session) return <Navigate to="/auth" replace />

  return (
    <ApplicationsProvider>
      <Outlet />
    </ApplicationsProvider>
  )
}
