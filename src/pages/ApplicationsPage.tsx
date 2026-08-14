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
import { useTranslation } from '../i18n/useTranslation'

type ViewMode = 'list' | 'board'

const initialFilters: ApplicationFilters = {
  search: '',
  status: '',
  workMode: '',
  source: '',
}

export function ApplicationsPage() {
  const { t } = useTranslation()
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

  const resultLabel = t(filteredApplications.length === 1 ? 'applications.countOne' : 'applications.countMany', { count: filteredApplications.length })

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
      showToast(t('applications.deleted'), 'success')
    } catch {
      showToast(t('applications.deleteFailed'), 'error')
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
      showToast(t('applications.statusMoved', { status: t(`status.${status}`) }), 'success')
    } catch {
      showToast(t('applications.statusFailed'), 'error')
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
            <p className="eyebrow">{t('applications.eyebrow')}</p><h1>{t('applications.title')}</h1><p className="page-description">{t('applications.description')}</p>
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
            {t('applications.add')}
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
                  isEditing ? t('applications.updated') : t('applications.created'),
                  'success',
                )
              } catch (mutationError) {
                showToast(
                  isEditing
                    ? t('applications.updateFailed') : t('applications.createFailed'),
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
            {t('applications.retry')}
          </button>
        </div>
      )}

      <div className="results-toolbar">
        <p className="result-count" aria-live="polite">
          {resultLabel}
        </p>
        <div className="view-toggle" aria-label={t('applications.view')}>
          <button
            type="button"
            aria-pressed={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            <AppIcon name="list" />
            {t('applications.list')}
          </button>
          <button
            type="button"
            aria-pressed={viewMode === 'board'}
            onClick={() => setViewMode('board')}
          >
            <AppIcon name="board" />
            {t('applications.board')}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="data-loading workspace-loading" aria-live="polite">
          <span className="dashboard-loading__indicator" aria-hidden="true" />
          {t('applications.loading')}
        </div>
      ) : filteredApplications.length > 0 ? (
        viewMode === 'list' ? (
          <section className="applications-grid" aria-label={t('applications.region')}>
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
          <h2>{t(applications.length === 0 ? 'applications.empty' : 'applications.none')}</h2><p>{t(applications.length === 0 ? 'applications.emptyHelp' : 'applications.noneHelp')}</p>
        </div>
      )}

      {applicationToDelete && (
        <ConfirmDialog
          title={t('card.deleteTitle', { position: applicationToDelete.position, company: applicationToDelete.company })}
          description={t('card.deleteDescription')} confirmLabel={t('card.deleteConfirm')}
          destructive
          isPending={isDeleting}
          onConfirm={() => void confirmDelete()}
          onCancel={() => setApplicationToDelete(null)}
        />
      )}
    </main>
  )
}
