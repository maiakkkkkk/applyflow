import { Route, Routes } from 'react-router'
import { ToastProvider } from '../components/feedback/ToastProvider'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
import { PublicOnlyRoute } from '../features/auth/components/PublicOnlyRoute'
import { AuthProvider } from '../features/auth/context/AuthContext'
import { PreferencesProvider } from '../features/preferences/context/PreferencesProvider'
import { ApplicationsPage } from '../pages/ApplicationsPage'
import { AuthPage } from '../pages/AuthPage'
import { DashboardPage } from '../pages/DashboardPage'
import { FollowUpsPage } from '../pages/FollowUpsPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { AppShell } from './AppShell'

function App() {
  return (
    <PreferencesProvider><ToastProvider>
      <AuthProvider>
        <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="auth" element={<AuthPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="follow-ups" element={<FollowUpsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
        </Routes>
      </AuthProvider>
    </ToastProvider></PreferencesProvider>
  )
}

export default App
