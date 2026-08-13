import type { Application, ApplicationStatus } from '../types'

export const applicationStatuses: ReadonlyArray<{
  status: ApplicationStatus
  label: string
}> = [
  { status: 'saved', label: 'Saved' },
  { status: 'applied', label: 'Applied' },
  { status: 'test', label: 'Test' },
  { status: 'interview', label: 'Interview' },
  { status: 'offer', label: 'Offer' },
  { status: 'rejected', label: 'Rejected' },
  { status: 'withdrawn', label: 'Withdrawn' },
]

export function calculateApplicationAnalytics(applications: Application[]) {
  const statusCounts = Object.fromEntries(
    applicationStatuses.map(({ status }) => [
      status,
      applications.filter((application) => application.status === status)
        .length,
    ]),
  ) as Record<ApplicationStatus, number>

  return {
    totalApplications: applications.length,
    activeApplications: applications.filter(
      ({ status }) => status !== 'rejected' && status !== 'withdrawn',
    ).length,
    statusCounts,
    recentApplications: [...applications]
      .sort(
        (first, second) =>
          Date.parse(second.updatedAt) - Date.parse(first.updatedAt),
      )
      .slice(0, 5),
  }
}
