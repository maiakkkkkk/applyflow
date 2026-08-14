import { AppIcon } from '../../../components/icons/AppIcon'
import type { Application } from '../../applications/types'
import { useTranslation } from '../../../i18n/useTranslation'

export function RecentApplications({ applications }: { applications: Application[] }) {
  const { t, locale } = useTranslation()
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
  return (
    <section className="dashboard-panel recent-panel" aria-labelledby="recent-title">
      <header className="dashboard-panel__header">
        <div>
          <h2 id="recent-title">{t('dashboard.recent')}</h2><p>{t('dashboard.recentHelp')}</p>
        </div>
      </header>
      <ul className="recent-applications">
        {applications.map((application) => (
          <li key={application.id}>
            <span className="recent-application__icon" aria-hidden="true"><AppIcon name="applications" /></span>
            <div className="recent-application__identity">
              <strong>{application.position}</strong>
              <span>{application.company}</span>
            </div>
            <div className="recent-application__meta">
              <span className={`status-badge status-badge--${application.status}`}>
                {t(`status.${application.status}`)}
              </span>
              <time dateTime={application.updatedAt}>{dateFormatter.format(new Date(application.updatedAt))}</time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
