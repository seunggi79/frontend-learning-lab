import { ToastItem } from './ToastItem'
import { useToastState } from './ToastProvider'
import type { ToastPosition } from './toastTypes'

const positions: ToastPosition[] = [
  'top-right',
  'top-center',
  'bottom-right',
  'bottom-center',
]

const positionLabels: Record<ToastPosition, string> = {
  'top-right': 'Top right notifications',
  'top-center': 'Top center notifications',
  'bottom-right': 'Bottom right notifications',
  'bottom-center': 'Bottom center notifications',
}

interface ToastViewportProps {
  position?: ToastPosition
}

export function ToastViewport({ position }: ToastViewportProps) {
  const { toasts } = useToastState()
  const viewportPositions = position ? [position] : positions

  return (
    <>
      {viewportPositions.map((viewportPosition) => {
        const positionedToasts = toasts.filter(
          (toast) => toast.position === viewportPosition,
        )

        if (positionedToasts.length === 0) {
          return null
        }

        return (
          <div
            key={viewportPosition}
            className={`toast-viewport toast-viewport--${viewportPosition}`}
            aria-label={positionLabels[viewportPosition]}
          >
            {positionedToasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} />
            ))}
          </div>
        )
      })}
    </>
  )
}
