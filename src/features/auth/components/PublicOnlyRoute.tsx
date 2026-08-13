import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

export function PublicOnlyRoute() {
  const { session, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="auth-loading" aria-live="polite">
        Loading your session…
      </main>
    )
  }

  return session ? <Navigate to="/" replace /> : <Outlet />
}
