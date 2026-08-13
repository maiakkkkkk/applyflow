// oxlint-disable react/only-export-components
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '../../auth/context/AuthContext'
import {
  createApplication as createApplicationRecord,
  deleteApplication as deleteApplicationRecord,
  listApplications,
  updateApplication as updateApplicationRecord,
} from '../data/applicationsRepository'
import type { Application, ApplicationStatus } from '../types'

interface ApplicationsContextValue {
  applications: Application[]
  isLoading: boolean
  error: string | null
  reloadApplications: () => Promise<void>
  createApplication: (application: Application) => Promise<void>
  updateApplication: (application: Application) => Promise<void>
  deleteApplication: (id: Application['id']) => Promise<void>
  changeApplicationStatus: (
    id: Application['id'],
    status: ApplicationStatus,
  ) => Promise<void>
}

interface ApplicationsProviderProps {
  children: ReactNode
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(
  null,
)

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'The application request could not be completed.'
}

export function ApplicationsProvider({
  children,
}: ApplicationsProviderProps) {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestVersion = useRef(0)
  const activeUserId = useRef<string | null>(user?.id ?? null)

  useEffect(() => {
    activeUserId.current = user?.id ?? null
    requestVersion.current += 1
    const version = requestVersion.current
    const userId = user?.id

    setApplications([])
    setError(null)

    if (!userId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    void listApplications(userId)
      .then((loadedApplications) => {
        if (
          requestVersion.current === version &&
          activeUserId.current === userId
        ) {
          setApplications(loadedApplications)
        }
      })
      .catch((loadError: unknown) => {
        if (
          requestVersion.current === version &&
          activeUserId.current === userId
        ) {
          setError(getErrorMessage(loadError))
        }
      })
      .finally(() => {
        if (
          requestVersion.current === version &&
          activeUserId.current === userId
        ) {
          setIsLoading(false)
        }
      })
  }, [user?.id])

  const reloadApplications = useCallback(async () => {
    const userId = activeUserId.current
    if (!userId) {
      setApplications([])
      return
    }

    const version = ++requestVersion.current
    setIsLoading(true)
    setError(null)

    try {
      const loadedApplications = await listApplications(userId)
      if (
        requestVersion.current === version &&
        activeUserId.current === userId
      ) {
        setApplications(loadedApplications)
      }
    } catch (reloadError) {
      if (
        requestVersion.current === version &&
        activeUserId.current === userId
      ) {
        setError(getErrorMessage(reloadError))
      }
      throw reloadError
    } finally {
      if (
        requestVersion.current === version &&
        activeUserId.current === userId
      ) {
        setIsLoading(false)
      }
    }
  }, [])

  const createApplication = useCallback(async (application: Application) => {
    const userId = activeUserId.current
    if (!userId) throw new Error('You must be signed in to create applications.')

    setError(null)
    try {
      const createdApplication = await createApplicationRecord(
        userId,
        application,
      )
      if (activeUserId.current === userId) {
        setApplications((current) => [...current, createdApplication])
      }
    } catch (createError) {
      if (activeUserId.current === userId) {
        setError(getErrorMessage(createError))
      }
      throw createError
    }
  }, [])

  const updateApplication = useCallback(async (application: Application) => {
    const userId = activeUserId.current
    if (!userId) throw new Error('You must be signed in to update applications.')

    const currentApplication = applications.find(
      (item) => item.id === application.id,
    )
    if (!currentApplication) throw new Error('Application not found.')

    const applicationToSave: Application = {
      ...application,
      id: currentApplication.id,
      createdAt: currentApplication.createdAt,
      updatedAt: new Date().toISOString(),
    }

    setError(null)
    try {
      const updatedApplication = await updateApplicationRecord(
        userId,
        application.id,
        applicationToSave,
      )
      if (activeUserId.current === userId) {
        setApplications((current) =>
          current.map((item) =>
            item.id === updatedApplication.id ? updatedApplication : item,
          ),
        )
      }
    } catch (updateError) {
      if (activeUserId.current === userId) {
        setError(getErrorMessage(updateError))
      }
      throw updateError
    }
  }, [applications])

  const deleteApplication = useCallback(async (id: Application['id']) => {
    const userId = activeUserId.current
    if (!userId) throw new Error('You must be signed in to delete applications.')

    setError(null)
    try {
      await deleteApplicationRecord(userId, id)
      if (activeUserId.current === userId) {
        setApplications((current) => current.filter((item) => item.id !== id))
      }
    } catch (deleteError) {
      if (activeUserId.current === userId) {
        setError(getErrorMessage(deleteError))
      }
      throw deleteError
    }
  }, [])

  const changeApplicationStatus = useCallback(
    async (id: Application['id'], status: ApplicationStatus) => {
      const application = applications.find((item) => item.id === id)
      if (!application || application.status === status) return
      await updateApplication({ ...application, status })
    },
    [applications, updateApplication],
  )

  const value = useMemo<ApplicationsContextValue>(
    () => ({
      applications,
      isLoading,
      error,
      reloadApplications,
      createApplication,
      updateApplication,
      deleteApplication,
      changeApplicationStatus,
    }),
    [
      applications,
      isLoading,
      error,
      reloadApplications,
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
