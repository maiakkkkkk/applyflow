import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../features/auth/context/AuthContext'

const navigationItems = [
  { label: 'Dashboard', to: '/', icon: 'dashboard' },
  { label: 'Applications', to: '/applications', icon: 'applications' },
  { label: 'Follow-ups', to: '/follow-ups', icon: 'follow-ups' },
]

function NavigationIcon({ name }: { name: string }) {
  if (name === 'dashboard') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z" /></svg>
  if (name === 'applications') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6V4h6v2m-9 3h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Zm-2 5h16M9 6h6" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v3m10-3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm3 9 2 2 4-4" /></svg>
}

function Brand() {
  return <><span className="brand-mark" aria-hidden="true">A</span><span>ApplyFlow</span></>
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState('')
  const metadata = user?.user_metadata
  const avatarUrl = typeof metadata?.avatar_url === 'string' ? metadata.avatar_url : typeof metadata?.picture === 'string' ? metadata.picture : ''
  const identity = user?.email ?? 'Signed in'
  const initials = identity.split(/[@._\s-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U'

  async function handleSignOut() {
    if (isSigningOut) return
    setIsSigningOut(true)
    setSignOutError('')
    try {
      await signOut()
      navigate('/auth', { replace: true })
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Unable to sign out.')
      setIsSigningOut(false)
    }
  }

  return <>
    <NavLink className="brand" to="/" aria-label="ApplyFlow home" onClick={onNavigate}><Brand /></NavLink>
    <nav className="primary-navigation" aria-label="Primary navigation">
      <p className="navigation-label">Workspace</p>
      {navigationItems.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={onNavigate} className={({ isActive }) => isActive ? 'navigation-link navigation-link--active' : 'navigation-link'}><NavigationIcon name={item.icon} /><span>{item.label}</span></NavLink>)}
    </nav>
    <div className="sidebar-user">
      <div className="user-identity">
        {avatarUrl ? <img className="user-avatar" src={avatarUrl} alt="" referrerPolicy="no-referrer" /> : <span className="user-avatar user-avatar--fallback" aria-hidden="true">{initials}</span>}
        <div><span className="user-identity__label">Signed in as</span><span className="user-identity__email" title={identity}>{identity}</span></div>
      </div>
      {signOutError && <p className="sign-out-error" role="alert">{signOutError}</p>}
      <button className="sign-out-button" type="button" onClick={handleSignOut} disabled={isSigningOut}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4m5-4 3-3-3-3m3 3H9" /></svg>{isSigningOut ? 'Signing out…' : 'Sign out'}
      </button>
    </div>
  </>
}

export function AppShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setIsMenuOpen(false), [location.pathname])

  return <div className="app-shell">
    <aside className="app-sidebar"><SidebarContent /></aside>
    <header className="mobile-header">
      <NavLink className="brand" to="/" aria-label="ApplyFlow home"><Brand /></NavLink>
      <button className="mobile-menu-button" type="button" aria-expanded={isMenuOpen} aria-controls="mobile-navigation" aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setIsMenuOpen((open) => !open)}><span /><span /><span /></button>
    </header>
    {isMenuOpen && <button className="mobile-navigation-backdrop" type="button" aria-label="Close navigation menu" onClick={() => setIsMenuOpen(false)} />}
    <aside id="mobile-navigation" className={`mobile-navigation${isMenuOpen ? ' mobile-navigation--open' : ''}`} aria-hidden={!isMenuOpen}><SidebarContent onNavigate={() => setIsMenuOpen(false)} /></aside>
    <div className="app-content"><Outlet /></div>
  </div>
}
