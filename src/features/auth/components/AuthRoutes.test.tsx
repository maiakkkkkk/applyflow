import { screen } from '@testing-library/react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithRouter } from '../../../test/testUtils'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'

const mockedUseAuth = vi.fn()

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockedUseAuth(),
}))

vi.mock('../../applications/context/ApplicationsContext', () => ({
  ApplicationsProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

function Location() {
  return <output aria-label="location">{useLocation().pathname}</output>
}

function TestRoutes() {
  return (
    <>
      <Location />
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="auth" element={<h1>Sign in</h1>} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<h1>Protected content</h1>} />
        </Route>
        <Route path="fallback" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

describe('authentication route guards', () => {
  beforeEach(() => mockedUseAuth.mockReset())

  it('shows the auth loading state', () => {
    mockedUseAuth.mockReturnValue({ session: null, isLoading: true })
    renderWithRouter(<TestRoutes />)

    expect(screen.getByText(/loading your session/i)).toBeInTheDocument()
  })

  it('redirects an unauthenticated protected route to /auth', async () => {
    mockedUseAuth.mockReturnValue({ session: null, isLoading: false })
    renderWithRouter(<TestRoutes />)

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeVisible()
    expect(screen.getByLabelText('location')).toHaveTextContent('/auth')
  })

  it('renders protected content for an authenticated session', () => {
    mockedUseAuth.mockReturnValue({ session: { user: { id: 'user-1' } }, isLoading: false })
    renderWithRouter(<TestRoutes />)

    expect(screen.getByRole('heading', { name: 'Protected content' })).toBeVisible()
  })

  it('redirects an authenticated visitor from /auth into the application', async () => {
    mockedUseAuth.mockReturnValue({ session: { user: { id: 'user-1' } }, isLoading: false })
    renderWithRouter(<TestRoutes />, { initialEntries: ['/auth'] })

    expect(await screen.findByRole('heading', { name: 'Protected content' })).toBeVisible()
    expect(screen.getByLabelText('location')).toHaveTextContent('/')
  })
})
