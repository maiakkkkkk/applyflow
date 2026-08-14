import { useEffect, useRef } from 'react'
import { useTranslation } from '../../i18n/useTranslation'

export interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  isPending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive = false,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = 'confirm-dialog-title'
  const descriptionId = 'confirm-dialog-description'

  useEffect(() => {
    confirmButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isPending) onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isPending, onCancel])

  return (
    <div className="confirm-overlay">
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <h2 id={titleId}>{title}</h2>
        <p id={descriptionId}>{description}</p>
        <div className="confirm-dialog__actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onCancel}
            disabled={isPending}
          >
            {cancelLabel ?? t('general.cancel')}
          </button>
          <button
            ref={confirmButtonRef}
            className={destructive ? 'destructive-button' : 'primary-button'}
            type="button"
            onClick={() => {
              if (!isPending) onConfirm()
            }}
            disabled={isPending}
          >
            {isPending ? t('general.deleting') : (confirmLabel ?? t('general.confirm'))}
          </button>
        </div>
      </div>
    </div>
  )
}
