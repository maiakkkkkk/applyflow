import type { Application, ApplicationStatus, WorkMode } from '../types'
import { AppIcon } from '../../../components/icons/AppIcon'

interface ApplicationsBoardProps {
  applications: Application[]
  onStatusChange: (application: Application, status: ApplicationStatus) => void
  pendingStatusIds?: ReadonlySet<string>
  onEdit: (application: Application) => void
  onDelete: (application: Application) => void
}

const columns: ReadonlyArray<{
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

const workModeLabels: Record<WorkMode, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
}

export function ApplicationsBoard({
  applications,
  onStatusChange,
  pendingStatusIds = new Set(),
  onEdit,
  onDelete,
}: ApplicationsBoardProps) {
  return (
    <section className="applications-board" aria-label="Applications board">
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
              <h2 id={`column-${column.status}`}>{column.label}</h2>
              <span aria-label={`${columnApplications.length} applications`}>
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
                      {workModeLabels[application.workMode]}
                    </p>
                  )}
                  {application.nextActionAt && <p className="board-card__next-action"><AppIcon name="calendar" />{application.nextActionAt}</p>}
                  {application.technologies && application.technologies.length > 0 && (
                    <ul className="board-card__technologies" aria-label="Technologies">
                      {application.technologies.slice(0, 3).map((technology) => <li key={technology}>{technology}</li>)}
                    </ul>
                  )}

                  <label htmlFor={`board-status-${application.id}`}>
                    Status
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
                        {statusOption.label}
                      </option>
                    ))}
                  </select>

                  <div className="board-card__actions">
                    <button type="button" onClick={() => onEdit(application)}>
                      <AppIcon name="edit" />
                      Edit
                    </button>
                    <button
                      className="card-action--delete"
                      type="button"
                      onClick={() => onDelete(application)}
                    >
                      <AppIcon name="trash" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}

              {columnApplications.length === 0 && (
                <p className="board-column__empty">No applications</p>
              )}
            </div>
          </section>
        )
      })}
    </section>
  )
}
