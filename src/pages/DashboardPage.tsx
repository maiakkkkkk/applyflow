import { Link } from 'react-router'
import { AppIcon } from '../components/icons/AppIcon'
import { useApplications } from '../features/applications/context/ApplicationsContext'
import { calculateApplicationAnalytics } from '../features/applications/utils/applicationAnalytics'
import { MetricCard } from '../features/dashboard/components/MetricCard'
import { RecentApplications } from '../features/dashboard/components/RecentApplications'
import { StatusDistribution } from '../features/dashboard/components/StatusDistribution'

export function DashboardPage() {
  const { applications, isLoading, error } = useApplications()
  const { statusCounts, activeApplications, recentApplications } = calculateApplicationAnalytics(applications)
  const metrics = [
    { label: 'Total applications', value: applications.length, icon: 'applications' as const },
    { label: 'Active applications', value: activeApplications, icon: 'dashboard' as const },
    { label: 'Interviews', value: statusCounts.interview, icon: 'calendar' as const },
    { label: 'Offers', value: statusCounts.offer, icon: 'check' as const, tone: 'success' as const },
    { label: 'Rejected applications', value: statusCounts.rejected, icon: 'close' as const, tone: 'danger' as const },
  ]

  return (
    <main className="dashboard-page">
      <header className="page-header dashboard-header">
        <div className="page-heading">
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p className="page-description">A clear view of your applications and latest activity.</p>
        </div>
        <Link className="secondary-button dashboard-header__action" to="/applications">
          View applications <AppIcon name="externalLink" />
        </Link>
      </header>

      {error && <p className="remote-error" role="alert">{error}</p>}
      {isLoading && (
        <div className="dashboard-loading" aria-live="polite">
          <span className="dashboard-loading__indicator" aria-hidden="true" />
          <div><strong>Loading dashboard</strong><span>Preparing your application overview…</span></div>
        </div>
      )}

      {!isLoading && applications.length === 0 && (
        <section className="dashboard-empty" aria-labelledby="dashboard-empty-title">
          <span className="dashboard-empty__icon" aria-hidden="true"><AppIcon name="applications" /></span>
          <h2 id="dashboard-empty-title">No applications yet</h2>
          <p>Add your first opportunity to start building your application overview.</p>
          <Link className="primary-button" to="/applications"><AppIcon name="plus" /> Add application</Link>
        </section>
      )}

      {!isLoading && applications.length > 0 && <>
        <section className="metrics-grid" aria-label="Application summary">
          {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
        </section>
        <div className="dashboard-sections">
          <StatusDistribution statusCounts={statusCounts} total={applications.length} />
          <RecentApplications applications={recentApplications} />
        </div>
      </>}
    </main>
  )
}
