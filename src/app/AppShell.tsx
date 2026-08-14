import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { BrandLogo } from '../components/brand/BrandLogo'
import { AppIcon, type AppIconName } from '../components/icons/AppIcon'
import { PreferencesControls } from '../features/preferences/components/PreferencesControls'
import { useTranslation } from '../i18n/useTranslation'
import { useAuth } from '../features/auth/context/AuthContext'

const navigationItems: ReadonlyArray<{ label: 'nav.dashboard' | 'nav.applications' | 'nav.followUps'; to: string; icon: AppIconName }> = [
  { label: 'nav.dashboard', to: '/', icon: 'dashboard' }, { label: 'nav.applications', to: '/applications', icon: 'applications' }, { label: 'nav.followUps', to: '/follow-ups', icon: 'followUps' },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, signOut } = useAuth()
  const { t } = useTranslation()
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
      setSignOutError(error instanceof Error ? error.message : t('nav.signOutError'))
      setIsSigningOut(false)
    }
  }

  return <>
    <NavLink className="brand" to="/" aria-label="ApplyFlow home" onClick={onNavigate}><BrandLogo /></NavLink>
    <nav className="primary-navigation" aria-label="Primary navigation">
      <p className="navigation-label">{t('nav.workspace')}</p>
      {navigationItems.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={onNavigate} className={({ isActive }) => isActive ? 'navigation-link navigation-link--active' : 'navigation-link'}><AppIcon name={item.icon} /><span>{t(item.label)}</span></NavLink>)}
    </nav>
    <PreferencesControls />
    <div className="sidebar-user">
      <div className="user-identity">
        {avatarUrl ? <img className="user-avatar" src={avatarUrl} alt="" referrerPolicy="no-referrer" /> : <span className="user-avatar user-avatar--fallback" aria-hidden="true">{initials}</span>}
        <div><span className="user-identity__label">{t('nav.signedInAs')}</span><span className="user-identity__email" title={identity}>{identity}</span></div>
      </div>
      {signOutError && <p className="sign-out-error" role="alert">{signOutError}</p>}
      <button className="sign-out-button" type="button" onClick={handleSignOut} disabled={isSigningOut}>
        <AppIcon name="logout" />{isSigningOut ? t('nav.signingOut') : t('nav.signOut')}
      </button>
    </div>
  </>
}

export function AppShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setIsMenuOpen(false), [location.pathname])
  useEffect(() => {
    if (!isMenuOpen) return
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isMenuOpen])

  return <div className="app-shell">
    <aside className="app-sidebar"><SidebarContent /></aside>
    <header className="mobile-header">
      <NavLink className="brand" to="/" aria-label="ApplyFlow home"><BrandLogo /></NavLink>
      <button className="mobile-menu-button" type="button" aria-expanded={isMenuOpen} aria-controls="mobile-navigation" aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setIsMenuOpen((open) => !open)}><AppIcon name={isMenuOpen ? 'close' : 'menu'} /></button>
    </header>
    {isMenuOpen && <button className="mobile-navigation-backdrop" type="button" tabIndex={-1} aria-label="Close navigation menu" onClick={() => setIsMenuOpen(false)} />}
    <aside id="mobile-navigation" className={`mobile-navigation${isMenuOpen ? ' mobile-navigation--open' : ''}`} aria-hidden={!isMenuOpen}><SidebarContent onNavigate={() => setIsMenuOpen(false)} /></aside>
    <div className="app-content"><Outlet /></div>
  </div>
}
