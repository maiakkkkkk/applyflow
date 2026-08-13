import { Route, Routes } from 'react-router'
import { ApplicationsProvider } from '../features/applications/context/ApplicationsContext'
import { ApplicationsPage } from '../pages/ApplicationsPage'
import { DashboardPage } from '../pages/DashboardPage'
import { FollowUpsPage } from '../pages/FollowUpsPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { AppShell } from './AppShell'

function App() {
  return (
    <ApplicationsProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="follow-ups" element={<FollowUpsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ApplicationsProvider>
  )
}

export default App
