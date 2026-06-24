# Toast Notification System

Vite + React + TypeScript 환경에서 외부 toast 라이브러리 없이 구현한 Toast Notification System입니다.

## 구현 요약

- `Context + useReducer` 기반 local state 관리
- toast 타입 지원: `success`, `error`, `warning`, `info`, `loading`
- 위치 지원: `top-right`, `top-center`, `bottom-right`, `bottom-center`
- 기본 duration
  - `success`, `info`: 3000ms
  - `warning`: 4000ms
  - `error`: 5000ms
  - `loading`: 자동 dismiss 없음
- 한 번에 visible toast 최대 3개 표시
- 같은 `type + title` toast가 visible 상태면 중복 추가 방지
- dismiss 시 즉시 삭제하지 않고 `dismissing` 상태로 전환 후 제거
- 자동 dismiss timer와 loading demo timer cleanup 처리
- 접근성 적용
  - `success`, `info`, `loading`: `role="status"`, `aria-live="polite"`
  - `error`, `warning`: `role="alert"`, `aria-live="assertive"`

## 주요 파일

Toast 시스템은 `src/shared/toast/` 아래에 구현되어 있습니다.

- `toastTypes.ts`: toast 타입, 옵션, action, 기본 duration 정의
- `toastReducer.ts`: add, update, dismiss, remove, clear reducer
- `ToastProvider.tsx`: toast 상태와 dispatch context 제공, timer 관리
- `ToastViewport.tsx`: toast 목록 렌더링, 위치별 viewport 지원
- `ToastItem.tsx`: toast 카드 UI, 접근성, 닫기 버튼, action 버튼
- `useToast.ts`: 외부에서 사용하는 toast API hook
- `toast.css`: viewport, 카드, 타입별 색상, 애니메이션, 모바일 스타일
- `index.ts`: 외부 사용을 위한 export

Demo UI는 `src/App.tsx`, `src/App.css`에 구현되어 있습니다.

상세 구현 기록은 `docs/toast-notification-system.md`에 정리되어 있습니다.

## 제공 API

```ts
const toast = useToast()

const id = toast.success('프로필이 저장되었습니다.')
toast.error('결제에 실패했습니다.')
toast.warning('세션이 곧 만료됩니다.')
toast.info('새 댓글이 추가되었습니다.')
toast.loading('파일 업로드 중입니다.')

toast.update(id, {
  type: 'success',
  title: '파일 업로드가 완료되었습니다.',
  duration: 3000,
})

toast.dismiss(id)
toast.clear()
```

각 toast 생성 함수는 toast `id`를 반환합니다.

## 사용 예시

```tsx
import { ToastProvider, ToastViewport, useToast } from './shared/toast'

function Demo() {
  const toast = useToast()

  return (
    <button onClick={() => toast.success('프로필이 저장되었습니다.')}>
      Success Toast
    </button>
  )
}

function App() {
  return (
    <ToastProvider>
      <Demo />
      <ToastViewport position="bottom-right" />
    </ToastProvider>
  )
}
```

`ToastViewport`의 `position` prop을 생략하면 toast별 `position` 옵션에 따라 여러 viewport가 렌더링됩니다.

## Demo UI

과제 확인용 demo UI에는 다음 버튼이 있습니다.

- `Success Toast`: `toast.success("프로필이 저장되었습니다.")`
- `Error Toast`: `toast.error("결제에 실패했습니다.")`
- `Warning Toast`: `toast.warning("세션이 곧 만료됩니다.")`
- `Info Toast`: `toast.info("새 댓글이 추가되었습니다.")`
- `Loading -> Success Toast`: loading toast 생성 후 1500ms 뒤 success로 update
- `Clear Toasts`: `toast.clear()`

## 실행 방법

```bash
npm install
npm run dev
```

빌드 확인:

```bash
npm run lint
npm run build
```

일반적으로 Vite 개발 서버는 `http://localhost:5173`에서 실행됩니다.
