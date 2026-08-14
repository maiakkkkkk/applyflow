import { createContext } from 'react'
import type { TranslationKey } from '../../../i18n/translations'

export type Locale = 'pt-BR' | 'en'
export type Theme = 'light' | 'dark'
export type Translate = (key: TranslationKey, values?: Record<string, string | number>) => string

export interface PreferencesValue {
  locale: Locale
  theme: Theme
  setLocale: (locale: Locale) => void
  setTheme: (theme: Theme) => void
  t: Translate
}

export const PreferencesContext = createContext<PreferencesValue | null>(null)
