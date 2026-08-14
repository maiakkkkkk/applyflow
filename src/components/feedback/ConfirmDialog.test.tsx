import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog'

const dialogProps = {
  title: 'Delete Frontend Developer at Nuvem Labs?',
  description: 'This action cannot be undone.',
  confirmLabel: 'Delete application',
  destructive: true,
}

describe('ConfirmDialog', () => {
  it('renders with accessible dialog semantics', () => {
    render(<ConfirmDialog {...dialogProps} onConfirm={vi.fn()} onCancel={vi.fn()} />)

    expect(
      screen.getByRole('dialog', { name: dialogProps.title }),
    ).toHaveAttribute('aria-modal', 'true')
  })

  it('cancels without confirming', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(<ConfirmDialog {...dialogProps} onConfirm={onConfirm} onCancel={onCancel} />)

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('confirms the action', async () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog {...dialogProps} onConfirm={onConfirm} onCancel={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Delete application' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('prevents duplicate confirmation while pending', async () => {
    const onConfirm = vi.fn()

    function Harness() {
      const [isPending, setIsPending] = useState(false)
      return (
        <ConfirmDialog
          {...dialogProps}
          isPending={isPending}
          onConfirm={() => {
            onConfirm()
            setIsPending(true)
          }}
          onCancel={vi.fn()}
        />
      )
    }

    render(<Harness />)
    const confirmButton = screen.getByRole('button', { name: 'Delete application' })
    await userEvent.dblClick(confirmButton)

    expect(onConfirm).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Deleting…' })).toBeDisabled()
  })
})
