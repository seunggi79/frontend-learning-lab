import type {
  Toast,
  ToastAction,
  ToastState,
  ToastUpdateOptions,
} from './toastTypes'
import { TOAST_LIMIT } from './toastTypes'

export const initialToastState: ToastState = {
  toasts: [],
}

const hasVisibleDuplicate = (toasts: Toast[], toast: Toast) =>
  toasts.some(
    (item) =>
      item.status === 'visible' &&
      item.type === toast.type &&
      item.title === toast.title,
  )

const applyToastLimit = (toasts: Toast[]) => {
  let visibleCount = 0

  return toasts.map((toast) => {
    if (toast.status !== 'visible') {
      return toast
    }

    visibleCount += 1

    if (visibleCount <= TOAST_LIMIT) {
      return toast
    }

    return {
      ...toast,
      status: 'dismissing',
    } satisfies Toast
  })
}

const updateToast = (toast: Toast, options: ToastUpdateOptions): Toast => {
  const nextToast: Toast = {
    ...toast,
    type: options.type ?? toast.type,
    title: options.title ?? toast.title,
    duration:
      options.duration === undefined ? toast.duration : options.duration,
    position: options.position ?? toast.position,
  }

  if ('description' in options) {
    nextToast.description = options.description ?? undefined
  }

  if ('action' in options) {
    nextToast.action = options.action
  }

  return nextToast
}

export const toastReducer = (
  state: ToastState,
  action: ToastAction,
): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST': {
      if (hasVisibleDuplicate(state.toasts, action.toast)) {
        return state
      }

      return {
        toasts: applyToastLimit([action.toast, ...state.toasts]),
      }
    }

    case 'UPDATE_TOAST':
      return {
        toasts: state.toasts.map((toast) =>
          toast.id === action.id ? updateToast(toast, action.options) : toast,
        ),
      }

    case 'DISMISS_TOAST':
      return {
        toasts: state.toasts.map((toast) =>
          toast.id === action.id && toast.status === 'visible'
            ? { ...toast, status: 'dismissing' }
            : toast,
        ),
      }

    case 'REMOVE_TOAST':
      return {
        toasts: state.toasts.filter((toast) => toast.id !== action.id),
      }

    case 'CLEAR_TOASTS':
      return initialToastState

    default:
      return state
  }
}
