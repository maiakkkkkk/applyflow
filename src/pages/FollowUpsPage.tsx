import { FollowUpItem } from '../features/applications/components/FollowUpItem'
import { useToast } from '../components/feedback/ToastContext'
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

const groupDescriptions: Record<FollowUpGroup, string> = {
  overdue: 'Actions that have passed their scheduled date.',
  today: 'Actions scheduled for today.',
  upcoming: 'Actions planned for the days ahead.',
}

export function FollowUpsPage() {
  const { showToast } = useToast()
  const { applications, updateApplication, isLoading, error } = useApplications()
  const { scheduledApplications, groupedApplications } = groupFollowUps(
    applications,
    new Date(),
  )

  async function completeFollowUp(application: Application) {
    const updatedApplication = { ...application }
    delete updatedApplication.nextActionAt
    try {
      await updateApplication(updatedApplication)
      showToast('Follow-up completed.', 'success')
    } catch {
      showToast('Unable to complete the follow-up. Please try again.', 'error')
    }
  }

  async function rescheduleFollowUp(
    application: Application,
    nextActionAt: string,
  ) {
    if (!isValidDateOnly(nextActionAt)) return
    try {
      await updateApplication({ ...application, nextActionAt })
      showToast('Follow-up rescheduled.', 'success')
    } catch {
      showToast('Unable to reschedule the follow-up. Please try again.', 'error')
    }
  }

  return (
    <main className="follow-ups-page">
      <header className="page-header follow-ups-header">
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
        <div className="data-loading workspace-loading" aria-live="polite">
          <span className="dashboard-loading__indicator" aria-hidden="true" />
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
              <div><h2 id={`follow-up-${group.key}`}>{group.label}</h2><p>{groupDescriptions[group.key]}</p></div>
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
