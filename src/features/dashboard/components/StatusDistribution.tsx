import type { ApplicationStatus } from '../../applications/types'
import { applicationStatuses } from '../../applications/utils/applicationAnalytics'

interface StatusDistributionProps {
  statusCounts: Record<ApplicationStatus, number>
  total: number
}

export function StatusDistribution({ statusCounts, total }: StatusDistributionProps) {
  return (
    <section className="dashboard-panel status-panel" aria-labelledby="distribution-title">
      <header className="dashboard-panel__header">
        <div>
          <h2 id="distribution-title">Status distribution</h2>
          <p>See how your applications are moving through the pipeline.</p>
        </div>
        <span className="dashboard-panel__total">{total} total</span>
      </header>
      <ul className="status-distribution">
        {applicationStatuses.map(({ status, label }) => {
          const count = statusCounts[status]
          const percentage = total ? (count / total) * 100 : 0
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
