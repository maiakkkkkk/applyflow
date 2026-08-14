import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../../../i18n/useTranslation'

export function PublicOnlyRoute() {
  const { session, isLoading } = useAuth()
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <main className="auth-loading" aria-live="polite">
        {t('general.loadingSession')}
      </main>
    )
  }

  return session ? <Navigate to="/" replace /> : <Outlet />
}
