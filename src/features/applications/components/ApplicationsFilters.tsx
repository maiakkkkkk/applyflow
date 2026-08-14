import type {
  ApplicationSource,
  ApplicationStatus,
  WorkMode,
} from '../types'
import { AppIcon } from '../../../components/icons/AppIcon'
import { useTranslation } from '../../../i18n/useTranslation'

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
  const { t } = useTranslation()

  return (
    <div className="filters" aria-label="Application filters">
      <div className="filters__header">
        <div><AppIcon name="filter" /><span>{t('applications.filter')}</span></div>{hasActiveFilters && <span className="filters__active">{t('applications.filtersActive')}</span>}
      </div>
      <div className="filter-field filter-field--search">
        <label htmlFor="application-search">{t('applications.search')}</label>
        <div className="search-input"><AppIcon name="search" /><input
            id="application-search" type="search" placeholder={t('applications.searchPlaceholder')}
            value={filters.search} onChange={(event) => onChange({ ...filters, search: event.target.value })}
          /></div>
      </div>

      <div className="filter-field">
        <label htmlFor="status-filter">{t('applications.status')}</label>
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
          <option value="">{t('applications.allStatuses')}</option>
          {(['saved','applied','test','interview','offer','rejected','withdrawn'] as const).map((status) => <option key={status} value={status}>{t(`status.${status}`)}</option>)}
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="work-mode-filter">{t('applications.workMode')}</label>
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
          <option value="">{t('applications.allWorkModes')}</option>{(['remote','hybrid','onsite'] as const).map((mode) => <option key={mode} value={mode}>{t(`work.${mode}`)}</option>)}
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="source-filter">{t('applications.source')}</label>
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
          <option value="">{t('applications.allSources')}</option>{(['linkedin','gupy','company','referral','other'] as const).map((source) => <option key={source} value={source}>{t(`source.${source}`)}</option>)}
        </select>
      </div>

      <button
        className="clear-filters-button"
        type="button"
        onClick={onClear}
        disabled={!hasActiveFilters}
      >
        <AppIcon name="close" />
        {t('applications.clear')}
      </button>
    </div>
  )
}
