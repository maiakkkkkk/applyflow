import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ToastViewport } from './ToastViewport'
import {
  ToastContext,
  type Toast,
  type ToastVariant,
} from './ToastContext'

function createToastId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, variant: ToastVariant) => {
    const id = createToastId()
    setToasts((current) => [...current, { id, message, variant }])
    return id
  }, [])

  const value = useMemo(
    () => ({ showToast, dismissToast }),
    [dismissToast, showToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}
