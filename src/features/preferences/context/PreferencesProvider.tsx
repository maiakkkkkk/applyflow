import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { translations, type TranslationKey } from '../../../i18n/translations'
import { PreferencesContext, type Locale, type Theme } from './PreferencesContext'

export const LOCALE_KEY = 'applyflow:locale'
export const THEME_KEY = 'applyflow:theme'
export const DEFAULT_LOCALE: Locale = 'pt-BR'
export const DEFAULT_THEME: Theme = 'light'

function readLocale(): Locale { const value = localStorage.getItem(LOCALE_KEY); return value === 'pt-BR' || value === 'en' ? value : DEFAULT_LOCALE }
function readTheme(): Theme { const value = localStorage.getItem(THEME_KEY); return value === 'light' || value === 'dark' ? value : DEFAULT_THEME }

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocale)
  const [theme, setThemeState] = useState<Theme>(readTheme)
  const t = useMemo(() => (key: TranslationKey, values: Record<string, string | number> = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), translations[locale][key]), [locale])
  function setLocale(value: Locale) { localStorage.setItem(LOCALE_KEY, value); setLocaleState(value) }
  function setTheme(value: Theme) { localStorage.setItem(THEME_KEY, value); setThemeState(value) }
  useEffect(() => { document.documentElement.lang = locale; document.title = t('meta.title'); document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', t('meta.description')) }, [locale, t])
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  return <PreferencesContext.Provider value={{ locale, theme, setLocale, setTheme, t }}>{children}</PreferencesContext.Provider>
}
