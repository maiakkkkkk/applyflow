import { FollowUpItem } from '../features/applications/components/FollowUpItem'
import { useToast } from '../components/feedback/ToastContext'
import { useApplications } from '../features/applications/context/ApplicationsContext'
import type { Application } from '../features/applications/types'
import {
  groupFollowUps,
  isValidDateOnly,
  type FollowUpGroup,
} from '../features/applications/utils/followUps'
import { useTranslation } from '../i18n/useTranslation'


const groups: ReadonlyArray<{ key: FollowUpGroup; label: 'follow.overdue' | 'follow.today' | 'follow.upcoming'; help: 'follow.overdueHelp' | 'follow.todayHelp' | 'follow.upcomingHelp' }> = [
  { key: 'overdue', label: 'follow.overdue', help: 'follow.overdueHelp' }, { key: 'today', label: 'follow.today', help: 'follow.todayHelp' }, { key: 'upcoming', label: 'follow.upcoming', help: 'follow.upcomingHelp' },
]

export function FollowUpsPage() {
  const { t } = useTranslation()
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
      showToast(t('follow.completed'), 'success')
    } catch {
      showToast(t('follow.completeFailed'), 'error')
    }
  }

  async function rescheduleFollowUp(
    application: Application,
    nextActionAt: string,
  ) {
    if (!isValidDateOnly(nextActionAt)) return
    try {
      await updateApplication({ ...application, nextActionAt })
      showToast(t('follow.rescheduled'), 'success')
    } catch {
      showToast(t('follow.rescheduleFailed'), 'error')
    }
  }

  return (
    <main className="follow-ups-page">
      <header className="page-header follow-ups-header">
        <p className="eyebrow">{t('follow.eyebrow')}</p><h1>{t('follow.title')}</h1><p className="page-description">{t('follow.description')}</p>
      </header>

      {error && (
        <p className="remote-error" role="alert">
          {error}
        </p>
      )}

      {isLoading && (
        <div className="data-loading workspace-loading" aria-live="polite">
          <span className="dashboard-loading__indicator" aria-hidden="true" />
          {t('follow.loading')}
        </div>
      )}

      {!isLoading && scheduledApplications.length === 0 && (
        <div className="follow-ups-empty">
          <h2>{t('follow.empty')}</h2><p>{t('follow.emptyHelp')}</p>
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
              <div><h2 id={`follow-up-${group.key}`}>{t(group.label)}</h2><p>{t(group.help)}</p></div>
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
                {t('follow.groupEmpty', { group: t(group.label).toLowerCase() })}
              </p>
            )}
          </section>
        ))}
      </div>}
    </main>
  )
}
