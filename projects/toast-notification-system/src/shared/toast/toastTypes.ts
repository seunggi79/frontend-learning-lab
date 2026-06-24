export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export type ToastPosition =
  | 'top-right'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-center'

export type ToastStatus = 'visible' | 'dismissing'

export type ToastId = string

export interface ToastActionButton {
  label: string
  onClick: (id: ToastId) => void
}

export interface ToastOptions {
  action?: ToastActionButton
  description?: string | null
  duration?: number | null
  position?: ToastPosition
}

export interface ToastUpdateOptions extends ToastOptions {
  title?: string
  type?: ToastType
}

export interface Toast {
  id: ToastId
  type: ToastType
  title: string
  action?: ToastActionButton
  description?: string
  duration: number | null
  position: ToastPosition
  status: ToastStatus
  createdAt: number
}

export interface ToastState {
  toasts: Toast[]
}

export type ToastAction =
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'UPDATE_TOAST'; id: ToastId; options: ToastUpdateOptions }
  | { type: 'DISMISS_TOAST'; id: ToastId }
  | { type: 'REMOVE_TOAST'; id: ToastId }
  | { type: 'CLEAR_TOASTS' }

export type ToastCreate = (
  title: string,
  options?: ToastOptions,
) => ToastId

export interface ToastApi {
  success: ToastCreate
  error: ToastCreate
  warning: ToastCreate
  info: ToastCreate
  loading: ToastCreate
  update: (id: ToastId, options: ToastUpdateOptions) => void
  dismiss: (id: ToastId) => void
  clear: () => void
}

export const DEFAULT_TOAST_POSITION: ToastPosition = 'top-right'

export const TOAST_LIMIT = 3

export const TOAST_REMOVE_DELAY = 240

export const DEFAULT_TOAST_DURATIONS: Record<ToastType, number | null> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
  loading: null,
}
