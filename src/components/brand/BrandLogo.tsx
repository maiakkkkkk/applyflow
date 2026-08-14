import { BrandMark } from './BrandMark'

interface BrandLogoProps {
  className?: string
  compact?: boolean
}

export function BrandLogo({ className = '', compact = false }: BrandLogoProps) {
  return (
    <span className={`brand-logo${compact ? ' brand-logo--compact' : ''}${className ? ` ${className}` : ''}`}>
      <BrandMark className="brand-logo__mark" />
      {!compact && (
        <span className="brand-logo__wordmark" aria-hidden="true">
          <span className="brand-logo__apply">Apply</span><span className="brand-logo__flow">Flow</span>
        </span>
      )}
    </span>
  )
}
