import { useContext } from 'react'
import { AppIcon } from '../../../components/icons/AppIcon'
import { PreferencesContext } from '../context/PreferencesContext'

export function PreferencesControls() {
  const preferences = useContext(PreferencesContext)
  if (!preferences) return null
  const { locale, theme, setLocale, setTheme, t } = preferences
  return <section className="preferences-controls" aria-label={t('prefs.appearance')}>
    <div className="language-control" role="group" aria-label={t('prefs.language')}>
      <button type="button" aria-pressed={locale === 'pt-BR'} onClick={() => setLocale('pt-BR')}>PT-BR</button>
      <button type="button" aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>EN</button>
    </div>
    <button className="theme-control" type="button" role="switch" aria-checked={theme === 'dark'} aria-label={t('prefs.themeLabel')} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      <span className="theme-control__track"><span className="theme-control__thumb"><AppIcon name={theme === 'light' ? 'sun' : 'moon'} /></span></span>
      <span>{theme === 'light' ? t('prefs.light') : t('prefs.dark')}</span>
    </button>
  </section>
}
