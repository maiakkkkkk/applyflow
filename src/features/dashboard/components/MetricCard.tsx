import { AppIcon, type AppIconName } from '../../../components/icons/AppIcon'

interface MetricCardProps {
  icon: AppIconName
  label: string
  value: number
  tone?: 'brand' | 'success' | 'danger'
}

export function MetricCard({ icon, label, value, tone = 'brand' }: MetricCardProps) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <div className="metric-card__icon"><AppIcon name={icon} /></div>
      <div className="metric-card__content">
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  )
}
