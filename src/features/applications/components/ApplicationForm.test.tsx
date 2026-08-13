import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createApplicationFixture } from '../../../test/fixtures/applications'
import { ApplicationForm } from './ApplicationForm'

describe('ApplicationForm', () => {
  it('reports all required fields', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ApplicationForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Save application' }))

    expect(screen.getByText('Company is required.')).toBeVisible()
    expect(screen.getByText('Position is required.')).toBeVisible()
    expect(screen.getByText('Status is required.')).toBeVisible()
    expect(screen.getByText('Source is required.')).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits valid required and optional values including nextActionAt', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ApplicationForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByLabelText('Company *'), ' Acme ')
    await user.type(screen.getByLabelText('Position *'), ' Engineer ')
    await user.selectOptions(screen.getByLabelText('Status *'), 'interview')
    await user.selectOptions(screen.getByLabelText('Source *'), 'referral')
    await user.selectOptions(screen.getByLabelText('Work mode'), 'remote')
    await user.type(screen.getByLabelText('Location'), ' São Paulo ')
    await user.type(screen.getByLabelText('Job URL'), 'https://example.com/job')
    await user.type(screen.getByLabelText('Next action date'), '2026-08-20')
    await user.type(screen.getByLabelText('Technologies'), 'React, TypeScript')
    await user.type(screen.getByLabelText('Notes'), ' Follow up ')
    await user.click(screen.getByRole('button', { name: 'Save application' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        company: 'Acme',
        position: 'Engineer',
        status: 'interview',
        source: 'referral',
        workMode: 'remote',
        location: 'São Paulo',
        jobUrl: 'https://example.com/job',
        nextActionAt: '2026-08-20',
        technologies: ['React', 'TypeScript'],
        notes: 'Follow up',
      }),
    )
  })

  it('prefills edit mode and preserves optional fields', () => {
    const application = createApplicationFixture({
      company: 'Globex',
      position: 'Staff Engineer',
      nextActionAt: '2026-08-25',
      notes: 'Referral from Ana',
    })

    render(
      <ApplicationForm application={application} onSubmit={vi.fn()} onCancel={vi.fn()} />,
    )

    expect(screen.getByRole('heading', { name: 'Edit application' })).toBeVisible()
    expect(screen.getByLabelText('Company *')).toHaveValue('Globex')
    expect(screen.getByLabelText('Position *')).toHaveValue('Staff Engineer')
    expect(screen.getByLabelText('Next action date')).toHaveValue('2026-08-25')
    expect(screen.getByLabelText('Notes')).toHaveValue('Referral from Ana')
  })

  it('omits blank optional fields from a submission', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ApplicationForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByLabelText('Company *'), 'Acme')
    await user.type(screen.getByLabelText('Position *'), 'Engineer')
    await user.selectOptions(screen.getByLabelText('Status *'), 'applied')
    await user.selectOptions(screen.getByLabelText('Source *'), 'linkedin')
    await user.click(screen.getByRole('button', { name: 'Save application' }))

    const submitted = onSubmit.mock.calls[0][0]
    expect(submitted).not.toHaveProperty('nextActionAt')
    expect(submitted).not.toHaveProperty('notes')
    expect(submitted).not.toHaveProperty('technologies')
  })
})
