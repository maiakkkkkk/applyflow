import { useEffect } from 'react'
import type { Toast } from './ToastContext'

const TOAST_TIMEOUT_MS = 5000

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  useEffect(() => {
    const timeout = window.setTimeout(
      () => onDismiss(toast.id),
      TOAST_TIMEOUT_MS,
    )
    return () => window.clearTimeout(timeout)
  }, [onDismiss, toast.id])

  return (
    <div
      className={`toast toast--${toast.variant}`}
      role={toast.variant === 'error' ? 'alert' : 'status'}
      aria-atomic="true"
    >
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label={`Dismiss ${toast.variant} notification`}
      >
        Dismiss
      </button>
    </div>
  )
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[]
  onDismiss: (id: string) => void
}) {
  return (
    <div className="toast-viewport" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
