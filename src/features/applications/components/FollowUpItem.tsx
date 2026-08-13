import { useState } from 'react'
import type { Application, ApplicationStatus } from '../types'

interface FollowUpItemProps {
  application: Application & { nextActionAt: string }
  onComplete: (application: Application) => void
  onReschedule: (application: Application, nextActionAt: string) => void
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

  return (
    <article className="follow-up-item">
      <div className="follow-up-item__details">
        <p>{application.company}</p>
        <h3>{application.position}</h3>
        <div className="follow-up-item__meta">
          <span className={`status-badge status-badge--${application.status}`}>
            {statusLabels[application.status]}
          </span>
          <time dateTime={application.nextActionAt}>
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
                !nextActionAt || nextActionAt === application.nextActionAt
              }
              onClick={() => onReschedule(application, nextActionAt)}
            >
              Update
            </button>
          </div>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={() => onComplete(application)}
        >
          Mark complete
        </button>
      </div>
    </article>
  )
}
