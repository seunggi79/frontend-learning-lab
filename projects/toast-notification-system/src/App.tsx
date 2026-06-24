import { useEffect, useRef } from 'react'
import { ToastProvider, ToastViewport, useToast } from './shared/toast'
import './App.css'

function ToastDemo() {
  const toast = useToast()
  const loadingTimer = useRef<ReturnType<typeof window.setTimeout> | null>(
    null,
  )

  useEffect(() => {
    return () => {
      if (loadingTimer.current) {
        window.clearTimeout(loadingTimer.current)
      }
    }
  }, [])

  const showLoadingToSuccessToast = () => {
    const id = toast.loading('파일 업로드 중입니다.')

    if (loadingTimer.current) {
      window.clearTimeout(loadingTimer.current)
    }

    loadingTimer.current = window.setTimeout(() => {
      toast.update(id, {
        type: 'success',
        title: '파일 업로드가 완료되었습니다.',
        duration: 3000,
      })
      loadingTimer.current = null
    }, 1500)
  }

  return (
    <main className="demo-shell">
      <section className="demo-header" aria-labelledby="demo-title">
        <p className="demo-kicker">React + TypeScript</p>
        <h1 id="demo-title">Toast Notification System</h1>
        <p className="demo-copy">
          아래 버튼으로 success, error, warning, info, loading 업데이트,
          전체 삭제 동작을 바로 확인할 수 있습니다.
        </p>
      </section>

      <section className="demo-panel" aria-label="Toast controls">
        <button
          type="button"
          className="demo-button demo-button--success"
          onClick={() => toast.success('프로필이 저장되었습니다.')}
        >
          Success Toast
        </button>

        <button
          type="button"
          className="demo-button demo-button--error"
          onClick={() => toast.error('결제에 실패했습니다.')}
        >
          Error Toast
        </button>

        <button
          type="button"
          className="demo-button demo-button--warning"
          onClick={() => toast.warning('세션이 곧 만료됩니다.')}
        >
          Warning Toast
        </button>

        <button
          type="button"
          className="demo-button demo-button--info"
          onClick={() => toast.info('새 댓글이 추가되었습니다.')}
        >
          Info Toast
        </button>

        <button
          type="button"
          className="demo-button demo-button--loading"
          onClick={showLoadingToSuccessToast}
        >
          Loading -&gt; Success Toast
        </button>

        <button
          type="button"
          className="demo-button demo-button--neutral"
          onClick={toast.clear}
        >
          Clear Toasts
        </button>
      </section>

      <section className="demo-note" aria-label="Implementation notes">
        <div>
          <strong>Position</strong>
          <span>bottom-right viewport</span>
        </div>
        <div>
          <strong>Limit</strong>
          <span>visible toast 최대 3개</span>
        </div>
        <div>
          <strong>Duplicate</strong>
          <span>같은 type + title은 중복 방지</span>
        </div>
      </section>
    </main>
  )
}

function App() {
  return (
    <ToastProvider>
      <ToastDemo />
      <ToastViewport />
    </ToastProvider>
  )
}

export default App
