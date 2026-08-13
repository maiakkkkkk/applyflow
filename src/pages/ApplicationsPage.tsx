import { useState } from 'react'
import { ApplicationCard } from '../features/applications/components/ApplicationCard'
import {
  ApplicationsFilters,
  type ApplicationFilters,
} from '../features/applications/components/ApplicationsFilters'
import { mockApplications } from '../features/applications/data/mockApplications'

const initialFilters: ApplicationFilters = {
  search: '',
  status: '',
  workMode: '',
  source: '',
}

export function ApplicationsPage() {
  const [filters, setFilters] = useState<ApplicationFilters>(initialFilters)

  const normalizedSearch = filters.search.trim().toLocaleLowerCase()
  const filteredApplications = mockApplications.filter((application) => {
    const searchableContent = [
      application.company,
      application.position,
      ...(application.technologies ?? []),
    ]
      .join(' ')
      .toLocaleLowerCase()

    const matchesSearch =
      !normalizedSearch || searchableContent.includes(normalizedSearch)
    const matchesStatus =
      !filters.status || application.status === filters.status
    const matchesWorkMode =
      !filters.workMode || application.workMode === filters.workMode
    const matchesSource =
      !filters.source || application.source === filters.source

    return (
      matchesSearch && matchesStatus && matchesWorkMode && matchesSource
    )
  })

  const resultLabel = `${filteredApplications.length} ${
    filteredApplications.length === 1 ? 'application' : 'applications'
  }`

  return (
    <main className="applications-page">
      <header className="page-header">
        <a className="brand" href="/" aria-label="ApplyFlow home">
          ApplyFlow
        </a>
        <div className="page-heading">
          <p className="eyebrow">Job Application Tracker</p>
          <h1>Applications</h1>
          <p className="page-description">
            Keep track of every opportunity and see where each application
            stands.
          </p>
        </div>
      </header>

      <ApplicationsFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(initialFilters)}
      />

      <p className="result-count" aria-live="polite">
        {resultLabel}
      </p>

      {filteredApplications.length > 0 ? (
        <section className="applications-grid" aria-label="Job applications">
          {filteredApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </section>
      ) : (
        <div className="empty-state">
          <h2>No applications found</h2>
          <p>Try changing or clearing your filters.</p>
        </div>
      )}
    </main>
  )
}
