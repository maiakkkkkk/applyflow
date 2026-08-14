import { useContext } from 'react'
import { PreferencesContext, type Translate } from '../features/preferences/context/PreferencesContext'
import { en } from './translations'

const fallback: Translate = (key, values = {}) => Object.entries(values).reduce<string>((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), en[key])
export function useTranslation() {
  const preferences = useContext(PreferencesContext)
  return { t: preferences?.t ?? fallback, locale: preferences?.locale ?? 'en' as const }
}
