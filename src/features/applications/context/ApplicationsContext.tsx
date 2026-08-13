// oxlint-disable react/only-export-components
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { mockApplications } from '../data/mockApplications'
import {
  loadApplications,
  saveApplications,
} from '../storage/applicationsStorage'
import type { Application, ApplicationStatus } from '../types'

interface ApplicationsContextValue {
  applications: Application[]
  createApplication: (application: Application) => void
  updateApplication: (application: Application) => void
  deleteApplication: (id: Application['id']) => void
  changeApplicationStatus: (
    id: Application['id'],
    status: ApplicationStatus,
  ) => void
}

interface ApplicationsProviderProps {
  children: ReactNode
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(
  null,
)

export function ApplicationsProvider({
  children,
}: ApplicationsProviderProps) {
  const [applications, setApplications] = useState<Application[]>(() => [
    ...(loadApplications() ?? mockApplications),
  ])

  useEffect(() => {
    saveApplications(applications)
  }, [applications])

  const createApplication = useCallback((application: Application) => {
    setApplications((current) => [...current, application])
  }, [])

  const updateApplication = useCallback((application: Application) => {
    setApplications((current) =>
      current.map((item) =>
        item.id === application.id
          ? {
              ...application,
              id: item.id,
              createdAt: item.createdAt,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    )
  }, [])

  const deleteApplication = useCallback((id: Application['id']) => {
    setApplications((current) => current.filter((item) => item.id !== id))
  }, [])

  const changeApplicationStatus = useCallback(
    (id: Application['id'], status: ApplicationStatus) => {
      setApplications((current) =>
        current.map((item) =>
          item.id === id && item.status !== status
            ? { ...item, status, updatedAt: new Date().toISOString() }
            : item,
        ),
      )
    },
    [],
  )

  const value = useMemo<ApplicationsContextValue>(
    () => ({
      applications,
      createApplication,
      updateApplication,
      deleteApplication,
      changeApplicationStatus,
    }),
    [
      applications,
      createApplication,
      updateApplication,
      deleteApplication,
      changeApplicationStatus,
    ],
  )

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  )
}

export function useApplications() {
  const context = useContext(ApplicationsContext)

  if (!context) {
    throw new Error('useApplications must be used within ApplicationsProvider')
  }

  return context
}
