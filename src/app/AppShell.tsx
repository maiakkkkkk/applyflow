import { NavLink, Outlet } from 'react-router'

const navigationItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Applications', to: '/applications' },
  { label: 'Follow-ups', to: '/follow-ups' },
]

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="brand" to="/" aria-label="ApplyFlow home">
          ApplyFlow
        </NavLink>
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
      </header>

      <Outlet />
    </div>
  )
}
