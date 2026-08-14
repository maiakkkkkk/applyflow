import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useToast } from './ToastContext'
import { ToastProvider } from './ToastProvider'

function ToastHarness() {
  const { showToast } = useToast()
  return (
    <button type="button" onClick={() => showToast('Application saved.', 'success')}>
      Show toast
    </button>
  )
}

describe('ToastProvider', () => {
  it('displays a toast', async () => {
    render(<ToastProvider><ToastHarness /></ToastProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Show toast' }))

    expect(screen.getByRole('status')).toHaveTextContent('Application saved.')
  })

  it('dismisses a toast manually', async () => {
    render(<ToastProvider><ToastHarness /></ToastProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Show toast' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Dismiss success notification' }),
    )

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
