import { useEffect, useState } from 'react'
import { ApplicationCard } from '../features/applications/components/ApplicationCard'
import { ApplicationForm } from '../features/applications/components/ApplicationForm'
import {
  ApplicationsFilters,
  type ApplicationFilters,
} from '../features/applications/components/ApplicationsFilters'
import { mockApplications } from '../features/applications/data/mockApplications'
import {
  loadApplications,
  saveApplications,
} from '../features/applications/storage/applicationsStorage'
import type { Application } from '../features/applications/types'

const initialFilters: ApplicationFilters = {
  search: '',
  status: '',
  workMode: '',
  source: '',
}

export function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(() => [
    ...(loadApplications() ?? mockApplications),
  ])
  const [filters, setFilters] = useState<ApplicationFilters>(initialFilters)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    saveApplications(applications)
  }, [applications])

  const normalizedSearch = filters.search.trim().toLocaleLowerCase()
  const filteredApplications = applications.filter((application) => {
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
        <div className="page-heading-row">
          <div className="page-heading">
            <p className="eyebrow">Job Application Tracker</p>
            <h1>Applications</h1>
            <p className="page-description">
              Keep track of every opportunity and see where each application
              stands.
            </p>
          </div>
          <button
            className="primary-button add-application-button"
            type="button"
            onClick={() => setIsFormOpen(true)}
            aria-expanded={isFormOpen}
            aria-controls="new-application-form"
            disabled={isFormOpen}
          >
            Add application
          </button>
        </div>
      </header>

      {isFormOpen && (
        <div id="new-application-form">
          <ApplicationForm
            onSubmit={(application) => {
              setApplications((current) => [...current, application])
              setIsFormOpen(false)
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}

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
