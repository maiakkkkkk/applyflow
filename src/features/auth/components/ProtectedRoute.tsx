import { Navigate, Outlet } from 'react-router'
import { ApplicationsProvider } from '../../applications/context/ApplicationsContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../../../i18n/useTranslation'

export function ProtectedRoute() {
  const { session, isLoading } = useAuth()
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <main className="auth-loading" aria-live="polite">
        {t('general.loadingSession')}
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
