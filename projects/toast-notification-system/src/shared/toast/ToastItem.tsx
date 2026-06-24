import { useToastDispatch } from './ToastProvider'
import type { Toast } from './toastTypes'

interface ToastItemProps {
  toast: Toast
}

const toastLabels: Record<Toast['type'], string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
  loading: 'Loading',
}

export function ToastItem({ toast }: ToastItemProps) {
  const dispatch = useToastDispatch()
  const isAssertive = toast.type === 'error' || toast.type === 'warning'

  return (
    <div
      className={`toast toast--${toast.type} toast--${toast.status}`}
      role={isAssertive ? 'alert' : 'status'}
      aria-live={isAssertive ? 'assertive' : 'polite'}
    >
      <div className="toast__indicator" aria-hidden="true">
        {toast.type === 'loading' ? (
          <span className="toast__spinner" />
        ) : (
          toastLabels[toast.type].charAt(0)
        )}
      </div>

      <div className="toast__content">
        <p className="toast__title">{toast.title}</p>
        {toast.description ? (
          <p className="toast__description">{toast.description}</p>
        ) : null}
        {toast.action ? (
          <button
            type="button"
            className="toast__action"
            onClick={() => toast.action?.onClick(toast.id)}
          >
            {toast.action.label}
          </button>
        ) : null}
      </div>

      <button
        type="button"
        className="toast__close"
        aria-label="Dismiss notification"
        onClick={() => dispatch({ type: 'DISMISS_TOAST', id: toast.id })}
      >
        x
      </button>
    </div>
  )
}
