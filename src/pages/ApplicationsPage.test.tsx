import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ToastProvider } from '../components/feedback/ToastProvider'
import { createApplicationFixture } from '../test/fixtures/applications'
import { ApplicationsPage } from './ApplicationsPage'

const mockedUseApplications = vi.fn()

vi.mock('../features/applications/context/ApplicationsContext', () => ({
  useApplications: () => mockedUseApplications(),
}))

const application = createApplicationFixture({
  id: 'application-1',
  company: 'Nuvem Labs',
  position: 'Frontend Developer',
})

function renderPage(deleteApplication: ReturnType<typeof vi.fn>) {
  mockedUseApplications.mockReturnValue({
    applications: [application],
    createApplication: vi.fn(),
    updateApplication: vi.fn(),
    deleteApplication,
    changeApplicationStatus: vi.fn(),
    isLoading: false,
    error: null,
    reloadApplications: vi.fn(),
  })
  return render(<ToastProvider><ApplicationsPage /></ToastProvider>)
}

describe('ApplicationsPage feedback', () => {
  beforeEach(() => mockedUseApplications.mockReset())

  it('deletes only after confirmation and shows success feedback', async () => {
    const deleteApplication = vi.fn().mockResolvedValue(undefined)
    renderPage(deleteApplication)

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(deleteApplication).not.toHaveBeenCalled()
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete application' }),
    )

    expect(deleteApplication).toHaveBeenCalledWith(application.id)
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Application deleted.',
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps the dialog open and shows human-readable feedback after failure', async () => {
    const deleteApplication = vi.fn().mockRejectedValue(new Error('SQL details'))
    renderPage(deleteApplication)

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete application' }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to delete the application. Please try again.',
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.queryByText('SQL details')).not.toBeInTheDocument()
  })
})
