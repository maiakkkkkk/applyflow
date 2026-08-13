import { FollowUpItem } from '../features/applications/components/FollowUpItem'
import { useApplications } from '../features/applications/context/ApplicationsContext'
import type { Application } from '../features/applications/types'
import {
  groupFollowUps,
  isValidDateOnly,
  type FollowUpGroup,
} from '../features/applications/utils/followUps'


const groups: ReadonlyArray<{ key: FollowUpGroup; label: string }> = [
  { key: 'overdue', label: 'Overdue' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
]

export function FollowUpsPage() {
  const { applications, updateApplication, isLoading, error } = useApplications()
  const { scheduledApplications, groupedApplications } = groupFollowUps(
    applications,
    new Date(),
  )

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
