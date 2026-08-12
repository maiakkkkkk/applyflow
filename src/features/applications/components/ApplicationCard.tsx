import type {
  Application,
  ApplicationSource,
  ApplicationStatus,
  WorkMode,
} from '../types'

interface ApplicationCardProps {
  application: Application
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

export function ApplicationCard({ application }: ApplicationCardProps) {
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

      <dl className="application-card__details">
        {workMode && (
          <div>
            <dt>Work mode</dt>
            <dd>{workModeLabels[workMode]}</dd>
          </div>
        )}
        <div>
          <dt>Source</dt>
          <dd>{sourceLabels[source]}</dd>
        </div>
      </dl>

      {technologies && technologies.length > 0 && (
        <ul className="technology-list" aria-label="Technologies">
          {technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      )}
    </article>
  )
}
