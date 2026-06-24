import { useCallback, useMemo } from 'react'
import { useToastDispatch, useToastState } from './ToastProvider'
import type {
  Toast,
  ToastApi,
  ToastId,
  ToastOptions,
  ToastType,
  ToastUpdateOptions,
} from './toastTypes'
import {
  DEFAULT_TOAST_DURATIONS,
  DEFAULT_TOAST_POSITION,
} from './toastTypes'

const createToastId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const resolveDuration = (type: ToastType, duration?: number | null) =>
  duration === undefined ? DEFAULT_TOAST_DURATIONS[type] : duration

export function useToast(): ToastApi {
  const { toasts } = useToastState()
  const dispatch = useToastDispatch()

  const createToast = useCallback(
    (type: ToastType, title: string, options: ToastOptions = {}): ToastId => {
      const existingToast = toasts.find(
        (toast) =>
          toast.status === 'visible' &&
          toast.type === type &&
          toast.title === title,
      )

      if (existingToast) {
        return existingToast.id
      }

      const toast: Toast = {
        id: createToastId(),
        type,
        title,
        action: options.action,
        description: options.description ?? undefined,
        duration: resolveDuration(type, options.duration),
        position: options.position ?? DEFAULT_TOAST_POSITION,
        status: 'visible',
        createdAt: Date.now(),
      }

      dispatch({ type: 'ADD_TOAST', toast })

      return toast.id
    },
    [dispatch, toasts],
  )

  const update = useCallback(
    (id: ToastId, options: ToastUpdateOptions) => {
      const nextOptions =
        options.type && options.duration === undefined
          ? {
              ...options,
              duration: DEFAULT_TOAST_DURATIONS[options.type],
            }
          : options

      dispatch({ type: 'UPDATE_TOAST', id, options: nextOptions })
    },
    [dispatch],
  )

  const dismiss = useCallback(
    (id: ToastId) => {
      dispatch({ type: 'DISMISS_TOAST', id })
    },
    [dispatch],
  )

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR_TOASTS' })
  }, [dispatch])

  return useMemo(
    () => ({
      success: (title, options) => createToast('success', title, options),
      error: (title, options) => createToast('error', title, options),
      warning: (title, options) => createToast('warning', title, options),
      info: (title, options) => createToast('info', title, options),
      loading: (title, options) => createToast('loading', title, options),
      update,
      dismiss,
      clear,
    }),
    [clear, createToast, dismiss, update],
  )
}
