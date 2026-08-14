import { AppIcon } from '../../../components/icons/AppIcon'
import type { Application } from '../../applications/types'
import { applicationStatuses } from '../../applications/utils/applicationAnalytics'

const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' })

export function RecentApplications({ applications }: { applications: Application[] }) {
  return (
    <section className="dashboard-panel recent-panel" aria-labelledby="recent-title">
      <header className="dashboard-panel__header">
        <div>
          <h2 id="recent-title">Recently updated</h2>
          <p>Your latest application activity.</p>
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
                {applicationStatuses.find(({ status }) => status === application.status)?.label}
              </span>
              <time dateTime={application.updatedAt}>{dateFormatter.format(new Date(application.updatedAt))}</time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
