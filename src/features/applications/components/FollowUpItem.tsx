import { useState } from 'react'
import type { Application, ApplicationStatus } from '../types'
import { AppIcon } from '../../../components/icons/AppIcon'

interface FollowUpItemProps {
  application: Application & { nextActionAt: string }
  onComplete: (application: Application) => Promise<void>
  onReschedule: (application: Application, nextActionAt: string) => Promise<void>
}

const statusLabels: Record<ApplicationStatus, string> = {
  saved: 'Saved',
  applied: 'Applied',
  test: 'Test',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

function formatDate(dateValue: string) {
  const [year, month, day] = dateValue.split('-').map(Number)
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
    new Date(year, month - 1, day),
  )
}

export function FollowUpItem({
  application,
  onComplete,
  onReschedule,
}: FollowUpItemProps) {
  const [nextActionAt, setNextActionAt] = useState(application.nextActionAt)
  const [pendingAction, setPendingAction] = useState<
    'complete' | 'reschedule' | null
  >(null)

  async function runAction(
    action: 'complete' | 'reschedule',
    mutation: () => Promise<void>,
  ) {
    if (pendingAction) return
    setPendingAction(action)
    try {
      await mutation()
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <article className="follow-up-item">
      <div className="follow-up-item__details">
        <h3>{application.position}</h3>
        <p>{application.company}</p>
        <div className="follow-up-item__meta">
          <span className={`status-badge status-badge--${application.status}`}>
            {statusLabels[application.status]}
          </span>
          <time dateTime={application.nextActionAt}>
            <AppIcon name="calendar" />
            {formatDate(application.nextActionAt)}
          </time>
        </div>
      </div>

      <div className="follow-up-item__actions">
        <div className="follow-up-reschedule">
          <label htmlFor={`follow-up-date-${application.id}`}>
            Reschedule
          </label>
          <div>
            <input
              id={`follow-up-date-${application.id}`}
              type="date"
              value={nextActionAt}
              onChange={(event) => setNextActionAt(event.target.value)}
            />
            <button
              className="secondary-button"
              type="button"
              disabled={
                pendingAction !== null ||
                !nextActionAt ||
                nextActionAt === application.nextActionAt
              }
              onClick={() =>
                void runAction('reschedule', () =>
                  onReschedule(application, nextActionAt),
                )
              }
            >
              <AppIcon name="calendar" />
              {pendingAction === 'reschedule' ? 'Updating…' : 'Update'}
            </button>
          </div>
        </div>
        <button
          className="primary-button"
          type="button"
          disabled={pendingAction !== null}
          onClick={() =>
            void runAction('complete', () => onComplete(application))
          }
        >
          <AppIcon name="check" />
          {pendingAction === 'complete' ? 'Completing…' : 'Mark complete'}
        </button>
      </div>
    </article>
  )
}
