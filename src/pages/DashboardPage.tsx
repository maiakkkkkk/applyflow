import { useApplications } from '../features/applications/context/ApplicationsContext'
import type { ApplicationStatus } from '../features/applications/types'

const statuses: ReadonlyArray<{
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

const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
})

export function DashboardPage() {
  const { applications } = useApplications()
  const statusCounts = Object.fromEntries(
    statuses.map(({ status }) => [
      status,
      applications.filter((application) => application.status === status)
        .length,
    ]),
  ) as Record<ApplicationStatus, number>
  const activeApplications = applications.filter(
    ({ status }) => status !== 'rejected' && status !== 'withdrawn',
  ).length
  const recentApplications = [...applications]
    .sort(
      (first, second) =>
        Date.parse(second.updatedAt) - Date.parse(first.updatedAt),
    )
    .slice(0, 5)
  const metrics = [
    { label: 'Total applications', value: applications.length },
    { label: 'Active applications', value: activeApplications },
    { label: 'Interviews', value: statusCounts.interview },
    { label: 'Offers', value: statusCounts.offer },
    { label: 'Rejected applications', value: statusCounts.rejected },
  ]

  return (
    <main className="dashboard-page">
      <header className="page-header">
        <p className="eyebrow">Overview</p>
        <h1>Dashboard</h1>
        <p className="page-description">
          A snapshot of your job application progress.
        </p>
      </header>

      <section className="metrics-grid" aria-label="Application summary">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <div className="dashboard-sections">
        <section className="dashboard-panel" aria-labelledby="distribution-title">
          <h2 id="distribution-title">Status distribution</h2>
          <ul className="status-distribution">
            {statuses.map(({ status, label }) => {
              const count = statusCounts[status]
              const percentage = applications.length
                ? (count / applications.length) * 100
                : 0

              return (
                <li key={status}>
                  <div>
                    <span>{label}</span>
                    <strong>{count}</strong>
                  </div>
                  <div
                    className="status-progress"
                    role="progressbar"
                    aria-label={`${label}: ${count}`}
                    aria-valuenow={count}
                    aria-valuemin={0}
                    aria-valuemax={applications.length}
                  >
                    <span style={{ width: `${percentage}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="dashboard-panel" aria-labelledby="recent-title">
          <h2 id="recent-title">Recently updated</h2>
          {recentApplications.length > 0 ? (
            <ul className="recent-applications">
              {recentApplications.map((application) => (
                <li key={application.id}>
                  <div>
                    <strong>{application.position}</strong>
                    <span>{application.company}</span>
                  </div>
                  <div className="recent-application__meta">
                    <span className={`status-badge status-badge--${application.status}`}>
                      {statuses.find(({ status }) => status === application.status)?.label}
                    </span>
                    <time dateTime={application.updatedAt}>
                      {dateFormatter.format(new Date(application.updatedAt))}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dashboard-empty">No applications to display yet.</p>
          )}
        </section>
      </div>
    </main>
  )
}
