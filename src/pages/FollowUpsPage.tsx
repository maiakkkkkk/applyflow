import { FollowUpItem } from '../features/applications/components/FollowUpItem'
import { useApplications } from '../features/applications/context/ApplicationsContext'
import type { Application } from '../features/applications/types'

type ScheduledApplication = Application & { nextActionAt: string }
type FollowUpGroup = 'overdue' | 'today' | 'upcoming'

const groups: ReadonlyArray<{ key: FollowUpGroup; label: string }> = [
  { key: 'overdue', label: 'Overdue' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
]

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isValidDateOnly(value: string) {
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

export function FollowUpsPage() {
  const { applications, updateApplication, isLoading, error } = useApplications()
  const today = getLocalDateKey()
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

  function completeFollowUp(application: Application) {
    const updatedApplication = { ...application }
    delete updatedApplication.nextActionAt
    void updateApplication(updatedApplication).catch(() => undefined)
  }

  function rescheduleFollowUp(
    application: Application,
    nextActionAt: string,
  ) {
    if (!isValidDateOnly(nextActionAt)) return
    void updateApplication({ ...application, nextActionAt }).catch(() => undefined)
  }

  return (
    <main className="follow-ups-page">
      <header className="page-header">
        <p className="eyebrow">Next actions</p>
        <h1>Follow-ups</h1>
        <p className="page-description">
          Review overdue actions and plan your next conversations.
        </p>
      </header>

      {error && (
        <p className="remote-error" role="alert">
          {error}
        </p>
      )}

      {isLoading && (
        <div className="data-loading" aria-live="polite">
          Loading follow-ups…
        </div>
      )}

      {!isLoading && scheduledApplications.length === 0 && (
        <div className="follow-ups-empty">
          <h2>No follow-ups scheduled</h2>
          <p>Add a next action date to an active application to see it here.</p>
        </div>
      )}

      {!isLoading && <div className="follow-up-groups">
        {groups.map((group) => (
          <section
            className="follow-up-group"
            key={group.key}
            aria-labelledby={`follow-up-${group.key}`}
          >
            <header>
              <h2 id={`follow-up-${group.key}`}>{group.label}</h2>
              <span>{groupedApplications[group.key].length}</span>
            </header>

            {groupedApplications[group.key].length > 0 ? (
              <div className="follow-up-list">
                {groupedApplications[group.key].map((application) => (
                  <FollowUpItem
                    key={application.id}
                    application={application}
                    onComplete={completeFollowUp}
                    onReschedule={rescheduleFollowUp}
                  />
                ))}
              </div>
            ) : (
              <p className="follow-up-group__empty">
                No {group.label.toLowerCase()} follow-ups.
              </p>
            )}
          </section>
        ))}
      </div>}
    </main>
  )
}
