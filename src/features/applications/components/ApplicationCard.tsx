import type { Application } from '../types'
import { AppIcon } from '../../../components/icons/AppIcon'
import { useTranslation } from '../../../i18n/useTranslation'

interface ApplicationCardProps {
  application: Application
  onEdit: (application: Application) => void
  onDelete: (application: Application) => void
}

function formatDate(value: string, locale: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(year, month - 1, day))
}

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
}: ApplicationCardProps) {
  const { t, locale } = useTranslation()
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
          {t(`status.${status}`)}
        </span>
      </div>

      <div className="application-card__metadata">
        {application.location && <span><AppIcon name="mapPin" />{application.location}</span>}
        {workMode && <span>{t(`work.${workMode}`)}</span>}
        {application.employmentType && <span>{t(`employment.${application.employmentType}`)}</span>}
        <span>{t(`source.${source}`)}</span>
      </div>

      {(application.salaryMin !== undefined || application.salaryMax !== undefined) && (
        <p className="application-card__salary">
          {application.salaryMin !== undefined ? new Intl.NumberFormat(locale, { style: 'currency', currency: application.salaryCurrency ?? 'BRL', maximumFractionDigits: 0 }).format(application.salaryMin) : '—'} – {application.salaryMax !== undefined ? new Intl.NumberFormat(locale, { style: 'currency', currency: application.salaryCurrency ?? 'BRL', maximumFractionDigits: 0 }).format(application.salaryMax) : '—'}
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
          {application.appliedAt && <span><AppIcon name="calendar" />{t('card.applied', { date: formatDate(application.appliedAt, locale) })}</span>}
          {application.nextActionAt && <span className="application-card__next-action"><AppIcon name="calendar" />{t('card.nextAction', { date: formatDate(application.nextActionAt, locale) })}</span>}
        </div>
        <div className="application-card__action-buttons">
        {application.jobUrl && <a href={application.jobUrl} target="_blank" rel="noreferrer"><AppIcon name="externalLink" />{t('card.viewJob')}</a>}
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
      </div>
    </article>
  )
}
