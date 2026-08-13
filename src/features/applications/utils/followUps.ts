import type { Application } from '../types'

export type ScheduledApplication = Application & { nextActionAt: string }
export type FollowUpGroup = 'overdue' | 'today' | 'upcoming'

export function getLocalDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isValidDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

function hasScheduledFollowUp(
  application: Application,
): application is ScheduledApplication {
  return (
    application.status !== 'rejected' &&
    application.status !== 'withdrawn' &&
    typeof application.nextActionAt === 'string' &&
    isValidDateOnly(application.nextActionAt)
  )
}

export function groupFollowUps(applications: Application[], now: Date) {
  const today = getLocalDateKey(now)
  const scheduledApplications = applications
    .filter(hasScheduledFollowUp)
    .sort((first, second) =>
      first.nextActionAt.localeCompare(second.nextActionAt),
    )
  const groupedApplications: Record<FollowUpGroup, ScheduledApplication[]> = {
    overdue: [],
    today: [],
    upcoming: [],
  }

  for (const application of scheduledApplications) {
    if (application.nextActionAt < today) {
      groupedApplications.overdue.push(application)
    } else if (application.nextActionAt === today) {
      groupedApplications.today.push(application)
    } else {
      groupedApplications.upcoming.push(application)
    }
  }

  return { scheduledApplications, groupedApplications }
}
