import { Link } from 'react-router'
import { AppIcon } from '../components/icons/AppIcon'
import { useApplications } from '../features/applications/context/ApplicationsContext'
import { calculateApplicationAnalytics } from '../features/applications/utils/applicationAnalytics'
import { MetricCard } from '../features/dashboard/components/MetricCard'
import { RecentApplications } from '../features/dashboard/components/RecentApplications'
import { StatusDistribution } from '../features/dashboard/components/StatusDistribution'
import { useTranslation } from '../i18n/useTranslation'

export function DashboardPage() {
  const { applications, isLoading, error } = useApplications()
  const { t } = useTranslation()
  const { statusCounts, activeApplications, recentApplications } = calculateApplicationAnalytics(applications)
  const metrics = [
    { label: t('dashboard.total'), value: applications.length, icon: 'applications' as const }, { label: t('dashboard.active'), value: activeApplications, icon: 'dashboard' as const }, { label: t('dashboard.interviews'), value: statusCounts.interview, icon: 'calendar' as const }, { label: t('dashboard.offers'), value: statusCounts.offer, icon: 'check' as const, tone: 'success' as const }, { label: t('dashboard.rejected'), value: statusCounts.rejected, icon: 'close' as const, tone: 'danger' as const },
  ]

  return (
    <main className="dashboard-page">
      <header className="page-header dashboard-header">
        <div className="page-heading">
          <p className="eyebrow">{t('dashboard.overview')}</p><h1>{t('dashboard.title')}</h1><p className="page-description">{t('dashboard.description')}</p>
        </div>
        <Link className="secondary-button dashboard-header__action" to="/applications">
          {t('dashboard.view')} <AppIcon name="externalLink" />
        </Link>
      </header>

      {error && <p className="remote-error" role="alert">{error}</p>}
      {isLoading && (
        <div className="dashboard-loading" aria-live="polite">
          <span className="dashboard-loading__indicator" aria-hidden="true" />
          <div><strong>{t('dashboard.loading')}</strong><span>{t('dashboard.loadingHelp')}</span></div>
        </div>
      )}

      {!isLoading && applications.length === 0 && (
        <section className="dashboard-empty" aria-labelledby="dashboard-empty-title">
          <span className="dashboard-empty__icon" aria-hidden="true"><AppIcon name="applications" /></span>
          <h2 id="dashboard-empty-title">{t('dashboard.empty')}</h2><p>{t('dashboard.emptyHelp')}</p><Link className="primary-button" to="/applications"><AppIcon name="plus" /> {t('dashboard.add')}</Link>
        </section>
      )}

      {!isLoading && applications.length > 0 && <>
        <section className="metrics-grid" aria-label={t('dashboard.summary')}>
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
