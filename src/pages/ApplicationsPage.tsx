import { useEffect, useState } from 'react'
import { ApplicationCard } from '../features/applications/components/ApplicationCard'
import { ApplicationsBoard } from '../features/applications/components/ApplicationsBoard'
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
import type {
  Application,
  ApplicationStatus,
} from '../features/applications/types'

type ViewMode = 'list' | 'board'

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
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

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

  function closeForm() {
    setIsFormOpen(false)
    setEditingApplication(null)
  }

  function handleDelete(application: Application) {
    const shouldDelete = window.confirm(
      `Delete the application for ${application.position} at ${application.company}?`,
    )

    if (!shouldDelete) return

    setApplications((current) =>
      current.filter((item) => item.id !== application.id),
    )

    if (editingApplication?.id === application.id) closeForm()
  }

  function handleEdit(application: Application) {
    setEditingApplication(application)
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleStatusChange(
    application: Application,
    status: ApplicationStatus,
  ) {
    if (application.status === status) return

    setApplications((current) =>
      current.map((item) =>
        item.id === application.id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item,
      ),
    )
  }

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
            onClick={() => {
              setEditingApplication(null)
              setIsFormOpen(true)
            }}
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
            key={editingApplication?.id ?? 'new-application'}
            application={editingApplication ?? undefined}
            onSubmit={(application) => {
              setApplications((current) =>
                editingApplication
                  ? current.map((item) =>
                      item.id === application.id ? application : item,
                    )
                  : [...current, application],
              )
              closeForm()
            }}
            onCancel={closeForm}
          />
        </div>
      )}

      <ApplicationsFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(initialFilters)}
      />

      <div className="results-toolbar">
        <p className="result-count" aria-live="polite">
          {resultLabel}
        </p>
        <div className="view-toggle" aria-label="Application view">
          <button
            type="button"
            aria-pressed={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
          <button
            type="button"
            aria-pressed={viewMode === 'board'}
            onClick={() => setViewMode('board')}
          >
            Board
          </button>
        </div>
      </div>

      {filteredApplications.length > 0 ? (
        viewMode === 'list' ? (
          <section className="applications-grid" aria-label="Job applications">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </section>
        ) : (
          <ApplicationsBoard
            applications={filteredApplications}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )
      ) : (
        <div className="empty-state">
          <h2>No applications found</h2>
          <p>Try changing or clearing your filters.</p>
        </div>
      )}
    </main>
  )
}
