import { useState } from 'react'
import { ConfirmDialog } from '../components/feedback/ConfirmDialog'
import { AppIcon } from '../components/icons/AppIcon'
import { useToast } from '../components/feedback/ToastContext'
import { ApplicationCard } from '../features/applications/components/ApplicationCard'
import { ApplicationsBoard } from '../features/applications/components/ApplicationsBoard'
import { ApplicationForm } from '../features/applications/components/ApplicationForm'
import {
  ApplicationsFilters,
  type ApplicationFilters,
} from '../features/applications/components/ApplicationsFilters'
import { useApplications } from '../features/applications/context/ApplicationsContext'
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

const statusLabels: Record<ApplicationStatus, string> = {
  saved: 'Saved',
  applied: 'Applied',
  test: 'Test',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export function ApplicationsPage() {
  const { showToast } = useToast()
  const {
    applications,
    createApplication,
    updateApplication,
    deleteApplication,
    changeApplicationStatus,
    isLoading,
    error,
    reloadApplications,
  } = useApplications()
  const [filters, setFilters] = useState<ApplicationFilters>(initialFilters)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [applicationToDelete, setApplicationToDelete] =
    useState<Application | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [pendingStatusIds, setPendingStatusIds] = useState<Set<string>>(
    () => new Set(),
  )

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

  async function confirmDelete() {
    if (!applicationToDelete || isDeleting) return
    const application = applicationToDelete
    setIsDeleting(true)
    try {
      await deleteApplication(application.id)
      if (editingApplication?.id === application.id) closeForm()
      setApplicationToDelete(null)
      showToast('Application deleted.', 'success')
    } catch {
      showToast('Unable to delete the application. Please try again.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  function handleEdit(application: Application) {
    setEditingApplication(application)
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleStatusChange(
    application: Application,
    status: ApplicationStatus,
  ) {
    if (pendingStatusIds.has(application.id)) return
    setPendingStatusIds((current) => new Set(current).add(application.id))
    try {
      await changeApplicationStatus(application.id, status)
      showToast(`Application moved to ${statusLabels[status]}.`, 'success')
    } catch {
      showToast('Unable to change the application status. Please try again.', 'error')
    } finally {
      setPendingStatusIds((current) => {
        const next = new Set(current)
        next.delete(application.id)
        return next
      })
    }
  }

  return (
    <main className="applications-page">
      <header className="page-header applications-header">
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
            <AppIcon name="plus" />
            Add application
          </button>
        </div>
      </header>

      {isFormOpen && (
        <div id="new-application-form">
          <ApplicationForm
            key={editingApplication?.id ?? 'new-application'}
            application={editingApplication ?? undefined}
            onSubmit={async (application) => {
              const isEditing = editingApplication !== null
              try {
                if (isEditing) await updateApplication(application)
                else await createApplication(application)
                closeForm()
                showToast(
                  isEditing ? 'Application updated.' : 'Application created.',
                  'success',
                )
              } catch (mutationError) {
                showToast(
                  isEditing
                    ? 'Unable to update the application. Please try again.'
                    : 'Unable to create the application. Please try again.',
                  'error',
                )
                throw mutationError
              }
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

      {error && (
        <div className="remote-error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void reloadApplications().catch(() => undefined)}
          >
            Try again
          </button>
        </div>
      )}

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
            <AppIcon name="list" />
            List
          </button>
          <button
            type="button"
            aria-pressed={viewMode === 'board'}
            onClick={() => setViewMode('board')}
          >
            <AppIcon name="board" />
            Board
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="data-loading workspace-loading" aria-live="polite">
          <span className="dashboard-loading__indicator" aria-hidden="true" />
          Loading applications…
        </div>
      ) : filteredApplications.length > 0 ? (
        viewMode === 'list' ? (
          <section className="applications-grid" aria-label="Job applications">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onEdit={handleEdit}
                onDelete={setApplicationToDelete}
              />
            ))}
          </section>
        ) : (
          <ApplicationsBoard
            applications={filteredApplications}
            onStatusChange={handleStatusChange}
            pendingStatusIds={pendingStatusIds}
            onEdit={handleEdit}
            onDelete={setApplicationToDelete}
          />
        )
      ) : (
        <div className="empty-state">
          <span className="empty-state__icon" aria-hidden="true"><AppIcon name={applications.length === 0 ? 'applications' : 'search'} /></span>
          <h2>{applications.length === 0 ? 'No applications yet' : 'No applications found'}</h2>
          <p>{applications.length === 0 ? 'Add your first opportunity to begin tracking your job search.' : 'Try changing or clearing your filters.'}</p>
        </div>
      )}

      {applicationToDelete && (
        <ConfirmDialog
          title={`Delete ${applicationToDelete.position} at ${applicationToDelete.company}?`}
          description="This application will be permanently removed. This action cannot be undone."
          confirmLabel="Delete application"
          destructive
          isPending={isDeleting}
          onConfirm={() => void confirmDelete()}
          onCancel={() => setApplicationToDelete(null)}
        />
      )}
    </main>
  )
}
