import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createApplicationFixture } from '../test/fixtures/applications'
import { renderWithRouter } from '../test/testUtils'
import { DashboardPage } from './DashboardPage'

const mockedUseApplications = vi.fn()

vi.mock('../features/applications/context/ApplicationsContext', () => ({
  useApplications: () => mockedUseApplications(),
}))

describe('DashboardPage', () => {
  it('shows application metrics, distribution, and newest-first recent items', () => {
    const applications = [
      createApplicationFixture({ id: '1', company: 'Old Co', position: 'Old role', status: 'saved', updatedAt: '2026-08-01T12:00:00Z' }),
      createApplicationFixture({ id: '2', company: 'Interview Co', position: 'Interview role', status: 'interview', updatedAt: '2026-08-05T12:00:00Z' }),
      createApplicationFixture({ id: '3', company: 'Offer Co', position: 'Offer role', status: 'offer', updatedAt: '2026-08-06T12:00:00Z' }),
      createApplicationFixture({ id: '4', company: 'Rejected Co', position: 'Rejected role', status: 'rejected', updatedAt: '2026-08-03T12:00:00Z' }),
      createApplicationFixture({ id: '5', company: 'Applied Co', position: 'Applied role', status: 'applied', updatedAt: '2026-08-04T12:00:00Z' }),
      createApplicationFixture({ id: '6', company: 'Newest Co', position: 'Newest role', status: 'withdrawn', updatedAt: '2026-08-07T12:00:00Z' }),
    ]
    mockedUseApplications.mockReturnValue({ applications, isLoading: false, error: null })

    renderWithRouter(<DashboardPage />)

    const metric = (name: string) => screen.getByText(name).closest('article')
    expect(metric('Total applications')).toHaveTextContent('6')
    expect(metric('Active applications')).toHaveTextContent('4')
    expect(metric('Interviews')).toHaveTextContent('1')
    expect(metric('Offers')).toHaveTextContent('1')
    expect(metric('Rejected applications')).toHaveTextContent('1')
    expect(screen.getByRole('progressbar', { name: 'Interview: 1' })).toBeVisible()
    expect(screen.getByRole('progressbar', { name: 'Offer: 1' })).toBeVisible()
    expect(screen.getByRole('progressbar', { name: 'Interview: 1' })).toHaveAttribute('aria-valuemax', '6')
    expect(screen.getAllByText('17%').length).toBeGreaterThan(0)

    const recent = screen.getByRole('heading', { name: 'Recently updated' }).closest('section')
    const items = within(recent as HTMLElement).getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('Newest role')
    expect(items[1]).toHaveTextContent('Offer role')
    expect(items[2]).toHaveTextContent('Interview role')
    expect(items[3]).toHaveTextContent('Applied role')
    expect(items[4]).toHaveTextContent('Rejected role')
    expect(screen.queryByText('Old role')).not.toBeInTheDocument()
  })

  it('shows an intentional empty state when there are no applications', () => {
    mockedUseApplications.mockReturnValue({ applications: [], isLoading: false, error: null })

    renderWithRouter(<DashboardPage />)

    expect(screen.getByRole('heading', { name: 'No applications yet' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Add application' })).toHaveAttribute('href', '/applications')
    expect(screen.queryByLabelText('Application summary')).not.toBeInTheDocument()
  })
})
