import { useState } from 'react'
import type { Application } from '../types'
import { AppIcon } from '../../../components/icons/AppIcon'
import { useTranslation } from '../../../i18n/useTranslation'

interface FollowUpItemProps {
  application: Application & { nextActionAt: string }
  onComplete: (application: Application) => Promise<void>
  onReschedule: (application: Application, nextActionAt: string) => Promise<void>
}

function formatDate(dateValue: string, locale: string) {
  const [year, month, day] = dateValue.split('-').map(Number)
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
    new Date(year, month - 1, day),
  )
}

export function FollowUpItem({
  application,
  onComplete,
  onReschedule,
}: FollowUpItemProps) {
  const { t, locale } = useTranslation()
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
            {t(`status.${application.status}`)}
          </span>
          <time dateTime={application.nextActionAt}>
            <AppIcon name="calendar" />
            {formatDate(application.nextActionAt, locale)}
          </time>
        </div>
      </div>

      <div className="follow-up-item__actions">
        <div className="follow-up-reschedule">
          <label htmlFor={`follow-up-date-${application.id}`}>
            {t('follow.reschedule')}
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
              {pendingAction === 'reschedule' ? t('follow.updating') : t('follow.update')}
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
          {pendingAction === 'complete' ? t('follow.completing') : t('follow.complete')}
        </button>
      </div>
    </article>
  )
}
