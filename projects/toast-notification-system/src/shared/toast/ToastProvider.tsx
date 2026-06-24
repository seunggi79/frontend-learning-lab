/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react'
import type { PropsWithChildren } from 'react'
import { initialToastState, toastReducer } from './toastReducer'
import type { ToastAction, ToastState } from './toastTypes'
import { TOAST_REMOVE_DELAY } from './toastTypes'
import './toast.css'

type ToastTimeout = ReturnType<typeof window.setTimeout>

type DismissTimer = {
  duration: number
  timeoutId: ToastTimeout
}

const ToastStateContext = createContext<ToastState | null>(null)
const ToastDispatchContext = createContext<React.Dispatch<ToastAction> | null>(
  null,
)

const clearTimer = (timeoutId: ToastTimeout) => {
  window.clearTimeout(timeoutId)
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(toastReducer, initialToastState)
  const dismissTimers = useRef(new Map<string, DismissTimer>())
  const removeTimers = useRef(new Map<string, ToastTimeout>())

  useEffect(() => {
    const activeToastIds = new Set(state.toasts.map((toast) => toast.id))

    state.toasts.forEach((toast) => {
      if (toast.status === 'visible') {
        const removeTimer = removeTimers.current.get(toast.id)

        if (removeTimer) {
          clearTimer(removeTimer)
          removeTimers.current.delete(toast.id)
        }

        if (toast.duration === null || toast.duration <= 0) {
          const dismissTimer = dismissTimers.current.get(toast.id)

          if (dismissTimer) {
            clearTimer(dismissTimer.timeoutId)
            dismissTimers.current.delete(toast.id)
          }

          return
        }

        const dismissTimer = dismissTimers.current.get(toast.id)

        if (dismissTimer?.duration === toast.duration) {
          return
        }

        if (dismissTimer) {
          clearTimer(dismissTimer.timeoutId)
        }

        const timeoutId = window.setTimeout(() => {
          dispatch({ type: 'DISMISS_TOAST', id: toast.id })
          dismissTimers.current.delete(toast.id)
        }, toast.duration)

        dismissTimers.current.set(toast.id, {
          duration: toast.duration,
          timeoutId,
        })
      }

      if (toast.status === 'dismissing') {
        const dismissTimer = dismissTimers.current.get(toast.id)

        if (dismissTimer) {
          clearTimer(dismissTimer.timeoutId)
          dismissTimers.current.delete(toast.id)
        }

        if (!removeTimers.current.has(toast.id)) {
          const timeoutId = window.setTimeout(() => {
            dispatch({ type: 'REMOVE_TOAST', id: toast.id })
            removeTimers.current.delete(toast.id)
          }, TOAST_REMOVE_DELAY)

          removeTimers.current.set(toast.id, timeoutId)
        }
      }
    })

    dismissTimers.current.forEach((timer, id) => {
      if (!activeToastIds.has(id)) {
        clearTimer(timer.timeoutId)
        dismissTimers.current.delete(id)
      }
    })

    removeTimers.current.forEach((timer, id) => {
      if (!activeToastIds.has(id)) {
        clearTimer(timer)
        removeTimers.current.delete(id)
      }
    })
  }, [state.toasts])

  useEffect(() => {
    const dismissTimerMap = dismissTimers.current
    const removeTimerMap = removeTimers.current

    return () => {
      dismissTimerMap.forEach((timer) => clearTimer(timer.timeoutId))
      removeTimerMap.forEach(clearTimer)
      dismissTimerMap.clear()
      removeTimerMap.clear()
    }
  }, [])

  return (
    <ToastStateContext.Provider value={state}>
      <ToastDispatchContext.Provider value={dispatch}>
        {children}
      </ToastDispatchContext.Provider>
    </ToastStateContext.Provider>
  )
}

export function useToastState() {
  const state = useContext(ToastStateContext)

  if (!state) {
    throw new Error('useToastState must be used within ToastProvider')
  }

  return state
}

export function useToastDispatch() {
  const dispatch = useContext(ToastDispatchContext)

  if (!dispatch) {
    throw new Error('useToastDispatch must be used within ToastProvider')
  }

  return dispatch
}
