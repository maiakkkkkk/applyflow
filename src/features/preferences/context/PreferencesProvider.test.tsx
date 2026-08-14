import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { PreferencesControls } from '../components/PreferencesControls'
import { useTranslation } from '../../../i18n/useTranslation'
import { LOCALE_KEY, PreferencesProvider, THEME_KEY } from './PreferencesProvider'

function Probe() {
  const { t } = useTranslation()
  return <><PreferencesControls /><output>{t('nav.applications')}</output></>
}

function renderPreferences() { return render(<PreferencesProvider><Probe /></PreferencesProvider>) }

afterEach(() => { localStorage.clear(); delete document.documentElement.dataset.theme; document.documentElement.lang = 'en' })

describe('PreferencesProvider', () => {
  it('defaults to PT-BR and light theme and updates the document', () => {
    renderPreferences()
    expect(screen.getByText('Candidaturas')).toBeVisible()
    expect(document.documentElement.lang).toBe('pt-BR')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('switches locale immediately and persists English', async () => {
    renderPreferences()
    await userEvent.click(screen.getByRole('button', { name: 'EN' }))
    expect(screen.getByText('Applications')).toBeVisible()
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem(LOCALE_KEY)).toBe('en')
  })

  it('toggles and persists dark theme', async () => {
    renderPreferences()
    await userEvent.click(screen.getByRole('switch'))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem(THEME_KEY)).toBe('dark')
  })

  it('restores valid persisted preferences', () => {
    localStorage.setItem(LOCALE_KEY, 'en'); localStorage.setItem(THEME_KEY, 'dark')
    renderPreferences()
    expect(screen.getByText('Applications')).toBeVisible()
    expect(document.documentElement.lang).toBe('en')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('falls back safely from invalid stored values', () => {
    localStorage.setItem(LOCALE_KEY, 'invalid'); localStorage.setItem(THEME_KEY, 'system')
    renderPreferences()
    expect(screen.getByText('Candidaturas')).toBeVisible()
    expect(document.documentElement.lang).toBe('pt-BR')
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
