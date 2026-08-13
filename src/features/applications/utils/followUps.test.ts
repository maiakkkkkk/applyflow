import { describe, expect, it } from 'vitest'
import { createApplicationFixture } from '../../../test/fixtures/applications'
import { groupFollowUps } from './followUps'

describe('groupFollowUps', () => {
  it('groups active follow-ups by local date, excludes ineligible rows, and sorts ascending', () => {
    const fixture = (id: string, nextActionAt: string | undefined, status: 'applied' | 'rejected' | 'withdrawn' = 'applied') =>
      createApplicationFixture({ id, company: id, nextActionAt, status })
    const applications = [
      fixture('later overdue', '2026-08-12'),
      fixture('earlier overdue', '2026-08-01'),
      fixture('today', '2026-08-13'),
      fixture('later upcoming', '2026-08-20'),
      fixture('earlier upcoming', '2026-08-14'),
      fixture('rejected', '2026-08-13', 'rejected'),
      fixture('withdrawn', '2026-08-13', 'withdrawn'),
      fixture('missing', undefined),
    ]

    const result = groupFollowUps(applications, new Date(2026, 7, 13, 23, 30))

    expect(result.groupedApplications.overdue.map(({ id }) => id)).toEqual([
      'earlier overdue', 'later overdue',
    ])
    expect(result.groupedApplications.today.map(({ id }) => id)).toEqual(['today'])
    expect(result.groupedApplications.upcoming.map(({ id }) => id)).toEqual([
      'earlier upcoming', 'later upcoming',
    ])
    expect(result.scheduledApplications).toHaveLength(5)
  })
})
