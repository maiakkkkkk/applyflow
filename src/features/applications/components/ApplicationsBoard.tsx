import type { Application, ApplicationStatus } from '../types'
import { AppIcon } from '../../../components/icons/AppIcon'
import { useTranslation } from '../../../i18n/useTranslation'

interface ApplicationsBoardProps {
  applications: Application[]
  onStatusChange: (application: Application, status: ApplicationStatus) => void
  pendingStatusIds?: ReadonlySet<string>
  onEdit: (application: Application) => void
  onDelete: (application: Application) => void
}

const columns: ReadonlyArray<{
  status: ApplicationStatus
}> = [
  { status: 'saved' }, { status: 'applied' }, { status: 'test' }, { status: 'interview' }, { status: 'offer' }, { status: 'rejected' }, { status: 'withdrawn' },
]

export function ApplicationsBoard({
  applications,
  onStatusChange,
  pendingStatusIds = new Set(),
  onEdit,
  onDelete,
}: ApplicationsBoardProps) {
  const { t, locale } = useTranslation()
  return (
    <section className="applications-board" aria-label={t('applications.boardRegion')}>
      {columns.map((column) => {
        const columnApplications = applications.filter(
          (application) => application.status === column.status,
        )

        return (
          <section
            className={`board-column board-column--${column.status}`}
            key={column.status}
            aria-labelledby={`column-${column.status}`}
          >
            <header className="board-column__header">
              <h2 id={`column-${column.status}`}>{t(`status.${column.status}`)}</h2>
              <span aria-label={t(columnApplications.length === 1 ? 'board.countOne' : 'board.countMany', { count: columnApplications.length })}>
                {columnApplications.length}
              </span>
            </header>

            <div className="board-column__cards">
              {columnApplications.map((application) => (
                <article className="board-card" key={application.id}>
                  <p className="board-card__company">{application.company}</p>
                  <h3>{application.position}</h3>

                  {application.workMode && (
                    <p className="board-card__work-mode">
                      {t(`work.${application.workMode}`)}
                    </p>
                  )}
                  {application.nextActionAt && <p className="board-card__next-action"><AppIcon name="calendar" />{new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${application.nextActionAt}T00:00:00Z`))}</p>}
                  {application.technologies && application.technologies.length > 0 && (
                    <ul className="board-card__technologies" aria-label="Technologies">
                      {application.technologies.slice(0, 3).map((technology) => <li key={technology}>{technology}</li>)}
                    </ul>
                  )}

                  <label htmlFor={`board-status-${application.id}`}>
                    {t('applications.status')}
                  </label>
                  <select
                    id={`board-status-${application.id}`}
                    value={application.status}
                    disabled={pendingStatusIds.has(application.id)}
                    onChange={(event) =>
                      onStatusChange(
                        application,
                        event.target.value as ApplicationStatus,
                      )
                    }
                  >
                    {columns.map((statusOption) => (
                      <option
                        key={statusOption.status}
                        value={statusOption.status}
                      >
                        {t(`status.${statusOption.status}`)}
                      </option>
                    ))}
                  </select>

                  <div className="board-card__actions">
                    <button type="button" onClick={() => onEdit(application)}>
                      <AppIcon name="edit" />
                      {t('card.edit')}
                    </button>
                    <button
                      className="card-action--delete"
                      type="button"
                      onClick={() => onDelete(application)}
                    >
                      <AppIcon name="trash" />
                      {t('card.delete')}
                    </button>
                  </div>
                </article>
              ))}

              {columnApplications.length === 0 && (
                <p className="board-column__empty">{t('board.noApplications')}</p>
              )}
            </div>
          </section>
        )
      })}
    </section>
  )
}
