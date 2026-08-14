import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithRouter } from '../test/testUtils'
import { AppShell } from './AppShell'

const signOut = vi.fn()

vi.mock('../features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'alex@example.com', user_metadata: {} },
    signOut,
  }),
}))

function renderShell(path = '/') {
  return renderWithRouter(
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<h1>Dashboard content</h1>} />
        <Route path="applications" element={<h1>Applications content</h1>} />
        <Route path="follow-ups" element={<h1>Follow-ups content</h1>} />
        <Route path="auth" element={<h1>Auth content</h1>} />
      </Route>
    </Routes>,
    { initialEntries: [path] },
  )
}

describe('AppShell', () => {
  beforeEach(() => signOut.mockReset())

  it('renders navigation and identifies the active route', () => {
    renderShell('/applications')
    const applicationLinks = screen.getAllByRole('link', { name: 'Applications' })
    expect(applicationLinks[0]).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { name: 'Applications content' })).toBeVisible()
  })

  it('opens the mobile menu and closes it after navigation', async () => {
    const user = userEvent.setup()
    renderShell()
    const menuButton = screen.getByRole('button', { name: 'Open navigation menu' })

    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    await user.click(screen.getAllByRole('link', { name: 'Follow-ups' })[1])

    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('heading', { name: 'Follow-ups content' })).toBeVisible()
  })

  it('calls the existing sign-out action', async () => {
    const user = userEvent.setup()
    signOut.mockResolvedValue(undefined)
    renderShell()

    await user.click(screen.getAllByRole('button', { name: 'Sign out' })[0])
    expect(signOut).toHaveBeenCalledOnce()
  })
})
