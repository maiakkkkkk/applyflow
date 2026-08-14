import type {
  ApplicationSource,
  ApplicationStatus,
  WorkMode,
} from '../types'
import { AppIcon } from '../../../components/icons/AppIcon'

export interface ApplicationFilters {
  search: string
  status: ApplicationStatus | ''
  workMode: WorkMode | ''
  source: ApplicationSource | ''
}

interface ApplicationsFiltersProps {
  filters: ApplicationFilters
  onChange: (filters: ApplicationFilters) => void
  onClear: () => void
}

export function ApplicationsFilters({
  filters,
  onChange,
  onClear,
}: ApplicationsFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(Boolean)

  return (
    <div className="filters" aria-label="Application filters">
      <div className="filter-field filter-field--search">
        <label htmlFor="application-search">Search</label>
        <input
          id="application-search"
          type="search"
          placeholder="Company, position, or technology"
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
        />
      </div>

      <div className="filter-field">
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value as ApplicationStatus | '',
            })
          }
        >
          <option value="">All statuses</option>
          <option value="saved">Saved</option>
          <option value="applied">Applied</option>
          <option value="test">Test</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="work-mode-filter">Work mode</label>
        <select
          id="work-mode-filter"
          value={filters.workMode}
          onChange={(event) =>
            onChange({
              ...filters,
              workMode: event.target.value as WorkMode | '',
            })
          }
        >
          <option value="">All work modes</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">On-site</option>
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="source-filter">Source</label>
        <select
          id="source-filter"
          value={filters.source}
          onChange={(event) =>
            onChange({
              ...filters,
              source: event.target.value as ApplicationSource | '',
            })
          }
        >
          <option value="">All sources</option>
          <option value="linkedin">LinkedIn</option>
          <option value="gupy">Gupy</option>
          <option value="company">Company website</option>
          <option value="referral">Referral</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button
        className="clear-filters-button"
        type="button"
        onClick={onClear}
        disabled={!hasActiveFilters}
      >
        <AppIcon name="close" />
        Clear filters
      </button>
    </div>
  )
}
