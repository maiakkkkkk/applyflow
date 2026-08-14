import type {
  Application,
  ApplicationSource,
  ApplicationStatus,
  WorkMode,
} from '../types'
import { AppIcon } from '../../../components/icons/AppIcon'

interface ApplicationCardProps {
  application: Application
  onEdit: (application: Application) => void
  onDelete: (application: Application) => void
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

const sourceLabels: Record<ApplicationSource, string> = {
  linkedin: 'LinkedIn',
  gupy: 'Gupy',
  company: 'Company website',
  referral: 'Referral',
  other: 'Other',
}

const workModeLabels: Record<WorkMode, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
}

const employmentTypeLabels = { clt: 'CLT', pj: 'PJ', internship: 'Internship', trainee: 'Trainee', contract: 'Contract', other: 'Other' } as const

function formatDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(year, month - 1, day))
}

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
}: ApplicationCardProps) {
  const { company, position, source, status, technologies, workMode } =
    application

  return (
    <article className="application-card">
      <div className="application-card__header">
        <div>
          <p className="application-card__company">{company}</p>
          <h2>{position}</h2>
        </div>
        <span className={`status-badge status-badge--${status}`}>
          {statusLabels[status]}
        </span>
      </div>

      <div className="application-card__metadata">
        {application.location && <span><AppIcon name="mapPin" />{application.location}</span>}
        {workMode && <span>{workModeLabels[workMode]}</span>}
        {application.employmentType && <span>{employmentTypeLabels[application.employmentType]}</span>}
        <span>{sourceLabels[source]}</span>
      </div>

      {(application.salaryMin !== undefined || application.salaryMax !== undefined) && (
        <p className="application-card__salary">
          {application.salaryCurrency ?? 'BRL'} {application.salaryMin?.toLocaleString() ?? '—'} – {application.salaryMax?.toLocaleString() ?? '—'}
        </p>
      )}

      {technologies && technologies.length > 0 && (
        <ul className="technology-list" aria-label="Technologies">
          {technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      )}

      <div className="application-card__actions">
        <div className="application-card__dates">
          {application.appliedAt && <span><AppIcon name="calendar" />Applied {formatDate(application.appliedAt)}</span>}
          {application.nextActionAt && <span className="application-card__next-action"><AppIcon name="calendar" />Next action {formatDate(application.nextActionAt)}</span>}
        </div>
        <div className="application-card__action-buttons">
        {application.jobUrl && <a href={application.jobUrl} target="_blank" rel="noreferrer"><AppIcon name="externalLink" />View job</a>}
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
      </div>
    </article>
  )
}
