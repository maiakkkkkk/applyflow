import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../features/auth/context/AuthContext'

const navigationItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Applications', to: '/applications' },
  { label: 'Follow-ups', to: '/follow-ups' },
]

export function AppShell() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState('')

  async function handleSignOut() {
    if (isSigningOut) return

    setIsSigningOut(true)
    setSignOutError('')

    try {
      await signOut()
      navigate('/auth', { replace: true })
    } catch (error) {
      setSignOutError(
        error instanceof Error ? error.message : 'Unable to sign out.',
      )
      setIsSigningOut(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="brand" to="/" aria-label="ApplyFlow home">
          ApplyFlow
        </NavLink>
        <div className="app-header__actions">
          <nav className="primary-navigation" aria-label="Primary navigation">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  isActive
                    ? 'navigation-link navigation-link--active'
                    : 'navigation-link'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            className="sign-out-button"
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </header>

      {signOutError && (
        <p className="app-header-error" role="alert">
          {signOutError}
        </p>
      )}

      <Outlet />
    </div>
  )
}
