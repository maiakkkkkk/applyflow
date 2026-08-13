import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApplicationFixture } from '../../../test/fixtures/applications'
import type { ApplicationStatus } from '../types'
import { ApplicationsProvider, useApplications } from './ApplicationsContext'
import {
  createApplication,
  deleteApplication,
  listApplications,
  updateApplication,
} from '../data/applicationsRepository'

let authenticatedUser: { id: string } | null = { id: 'user-1' }

vi.mock('../../auth/context/AuthContext', () => ({
  useAuth: () => ({ user: authenticatedUser }),
}))

vi.mock('../data/applicationsRepository', () => ({
  listApplications: vi.fn(),
  createApplication: vi.fn(),
  updateApplication: vi.fn(),
  deleteApplication: vi.fn(),
}))

const mockedList = vi.mocked(listApplications)
const mockedCreate = vi.mocked(createApplication)
const mockedUpdate = vi.mocked(updateApplication)
const mockedDelete = vi.mocked(deleteApplication)

function Harness() {
  const context = useApplications()
  const first = context.applications[0]
  return (
    <div>
      <output aria-label="applications">{context.applications.map(({ company, status }) => `${company}:${status}`).join('|')}</output>
      <output aria-label="loading">{String(context.isLoading)}</output>
      {context.error && <p role="alert">{context.error}</p>}
      <button onClick={() => void context.createApplication(createApplicationFixture({ id: 'new', company: 'Draft' })).catch(() => undefined)}>create</button>
      <button onClick={() => first && void context.updateApplication({ ...first, company: 'Updated' }).catch(() => undefined)}>update</button>
      <button onClick={() => first && void context.changeApplicationStatus(first.id, 'offer' as ApplicationStatus).catch(() => undefined)}>status</button>
      <button onClick={() => first && void context.deleteApplication(first.id).catch(() => undefined)}>delete</button>
    </div>
  )
}

function renderProvider() {
  return render(<ApplicationsProvider><Harness /></ApplicationsProvider>)
}

describe('ApplicationsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authenticatedUser = { id: 'user-1' }
    mockedList.mockResolvedValue([])
  })

  it('loads applications for the authenticated user', async () => {
    mockedList.mockResolvedValue([createApplicationFixture({ company: 'Loaded' })])
    renderProvider()

    expect(await screen.findByLabelText('applications')).toHaveTextContent('Loaded:applied')
    expect(mockedList).toHaveBeenCalledWith('user-1')
    await waitFor(() => expect(screen.getByLabelText('loading')).toHaveTextContent('false'))
  })

  it('keeps an empty state without an authenticated user', () => {
    authenticatedUser = null
    renderProvider()

    expect(screen.getByLabelText('applications')).toBeEmptyDOMElement()
    expect(screen.getByLabelText('loading')).toHaveTextContent('false')
    expect(mockedList).not.toHaveBeenCalled()
  })

  it('persists a create before adding the returned row', async () => {
    const returned = createApplicationFixture({ id: 'server-id', company: 'Created' })
    mockedCreate.mockResolvedValue(returned)
    renderProvider()
    await waitFor(() => expect(screen.getByLabelText('loading')).toHaveTextContent('false'))

    await userEvent.click(screen.getByRole('button', { name: 'create' }))

    await waitFor(() => expect(screen.getByLabelText('applications')).toHaveTextContent('Created:applied'))
    expect(mockedCreate).toHaveBeenCalledWith('user-1', expect.objectContaining({ company: 'Draft' }))
  })

  it('persists updates and status changes through the normal update path', async () => {
    const original = createApplicationFixture({ company: 'Original' })
    mockedList.mockResolvedValue([original])
    mockedUpdate.mockImplementation(async (_userId, _id, application) => application)
    renderProvider()
    await screen.findByText('Original:applied')

    await userEvent.click(screen.getByRole('button', { name: 'update' }))
    await screen.findByText('Updated:applied')
    expect(mockedUpdate).toHaveBeenLastCalledWith('user-1', original.id, expect.objectContaining({ company: 'Updated' }))

    await userEvent.click(screen.getByRole('button', { name: 'status' }))
    await screen.findByText('Updated:offer')
    expect(mockedUpdate).toHaveBeenLastCalledWith('user-1', original.id, expect.objectContaining({ status: 'offer' }))
  })

  it('persists deletion before removing the row', async () => {
    const original = createApplicationFixture({ company: 'Delete me' })
    mockedList.mockResolvedValue([original])
    mockedDelete.mockResolvedValue(undefined)
    renderProvider()
    await screen.findByText('Delete me:applied')

    await userEvent.click(screen.getByRole('button', { name: 'delete' }))

    await waitFor(() => expect(screen.getByLabelText('applications')).toBeEmptyDOMElement())
    expect(mockedDelete).toHaveBeenCalledWith('user-1', original.id)
  })

  it('exposes repository failures without mutating application state', async () => {
    const original = createApplicationFixture({ company: 'Stable' })
    mockedList.mockResolvedValue([original])
    mockedUpdate.mockRejectedValue(new Error('Database unavailable'))
    renderProvider()
    await screen.findByText('Stable:applied')

    await userEvent.click(screen.getByRole('button', { name: 'update' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable')
    expect(screen.getByLabelText('applications')).toHaveTextContent('Stable:applied')
  })

  it('ignores a stale load after the authenticated account changes', async () => {
    let resolveFirst: ((value: ReturnType<typeof createApplicationFixture>[]) => void) | undefined
    mockedList.mockImplementation(() => new Promise((resolve) => { resolveFirst = resolve }))
    const view = renderProvider()

    authenticatedUser = { id: 'user-2' }
    mockedList.mockResolvedValue([createApplicationFixture({ company: 'Second account' })])
    view.rerender(<ApplicationsProvider><Harness /></ApplicationsProvider>)
    await screen.findByText('Second account:applied')

    await act(async () => resolveFirst?.([createApplicationFixture({ company: 'Stale account' })]))
    expect(screen.getByLabelText('applications')).toHaveTextContent('Second account:applied')
    expect(screen.queryByText('Stale account:applied')).not.toBeInTheDocument()
  })
})
