import type { ApplicationStatus } from '../../applications/types'
import { applicationStatuses } from '../../applications/utils/applicationAnalytics'
import { useTranslation } from '../../../i18n/useTranslation'

interface StatusDistributionProps {
  statusCounts: Record<ApplicationStatus, number>
  total: number
}

export function StatusDistribution({ statusCounts, total }: StatusDistributionProps) {
  const { t } = useTranslation()
  return (
    <section className="dashboard-panel status-panel" aria-labelledby="distribution-title">
      <header className="dashboard-panel__header">
        <div>
          <h2 id="distribution-title">{t('dashboard.distribution')}</h2><p>{t('dashboard.distributionHelp')}</p>
        </div>
        <span className="dashboard-panel__total">{total} {t('dashboard.totalSuffix')}</span>
      </header>
      <ul className="status-distribution">
        {applicationStatuses.map(({ status }) => {
          const count = statusCounts[status]
          const percentage = total ? (count / total) * 100 : 0
          const label = t(`status.${status}`)
          return (
            <li key={status}>
              <div className="status-distribution__meta">
                <span className={`status-dot status-dot--${status}`} aria-hidden="true" />
                <span className="status-distribution__label">{label}</span>
                <strong>{count}</strong>
                <span className="status-distribution__percentage">{Math.round(percentage)}%</span>
              </div>
              <div className="status-progress" role="progressbar" aria-label={`${label}: ${count}`} aria-valuenow={count} aria-valuemin={0} aria-valuemax={total}>
                <span className={`status-progress__value status-progress__value--${status}`} style={{ width: `${percentage}%` }} />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
