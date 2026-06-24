# Toast Notification System

Vite + React + TypeScript 기반으로 만든 Toast Notification System 구현 기록입니다.

외부 toast 라이브러리를 사용하지 않고 React의 기본 기능인 `Context`, `useReducer`, custom hook, CSS만으로 구현했습니다.

## Goal

이 프로젝트의 목표는 다음 기능을 직접 구현하면서 React 상태 관리와 UI 컴포넌트 분리 방식을 연습하는 것입니다.

- toast 생성, 수정, 닫기, 전체 삭제
- 타입별 toast UI
- 위치별 viewport 렌더링
- 자동 dismiss timer 관리
- loading toast를 success toast로 update하는 흐름
- 접근성을 고려한 live region 처리

## Supported Toast Types

| Type | Default Duration | Accessibility |
| --- | ---: | --- |
| `success` | 3000ms | `role="status"`, `aria-live="polite"` |
| `info` | 3000ms | `role="status"`, `aria-live="polite"` |
| `warning` | 4000ms | `role="alert"`, `aria-live="assertive"` |
| `error` | 5000ms | `role="alert"`, `aria-live="assertive"` |
| `loading` | 자동 dismiss 없음 | `role="status"`, `aria-live="polite"` |

## Supported Positions

- `top-right`
- `top-center`
- `bottom-right`
- `bottom-center`

`ToastViewport`는 `position` prop을 받을 수 있습니다.

```tsx
<ToastViewport position="bottom-right" />
```

`position`을 생략하면 toast마다 가진 position 기준으로 viewport가 렌더링됩니다.

## API

`useToast` hook에서 다음 API를 제공합니다.

```ts
toast.success(title, options?)
toast.error(title, options?)
toast.warning(title, options?)
toast.info(title, options?)
toast.loading(title, options?)
toast.update(id, options)
toast.dismiss(id)
toast.clear()
```

각 toast 생성 함수는 toast `id`를 반환합니다.

```ts
const id = toast.loading('파일 업로드 중입니다.')

setTimeout(() => {
  toast.update(id, {
    type: 'success',
    title: '파일 업로드가 완료되었습니다.',
    duration: 3000,
  })
}, 1500)
```

## File Structure

```text
src/shared/toast/
├── ToastItem.tsx
├── ToastProvider.tsx
├── ToastViewport.tsx
├── index.ts
├── toast.css
├── toastReducer.ts
├── toastTypes.ts
└── useToast.ts
```

## File Responsibilities

### `toastTypes.ts`

toast에서 사용하는 타입을 정의합니다.

- `ToastType`
- `ToastPosition`
- `ToastStatus`
- `ToastOptions`
- `ToastUpdateOptions`
- `Toast`
- 기본 duration
- toast 최대 표시 개수
- remove delay

### `toastReducer.ts`

toast 상태 변경 로직을 담당합니다.

처리하는 action:

- `ADD_TOAST`
- `UPDATE_TOAST`
- `DISMISS_TOAST`
- `REMOVE_TOAST`
- `CLEAR_TOASTS`

중복 방지와 최대 3개 visible toast 제한도 reducer에서 처리합니다.

### `ToastProvider.tsx`

toast 상태와 dispatch context를 제공합니다.

또한 자동 dismiss timer와 dismiss 후 remove timer를 관리합니다. 컴포넌트가 unmount될 때 timer를 정리해서 메모리 누수를 막습니다.

### `ToastViewport.tsx`

toast 목록을 위치별로 렌더링합니다.

`position` prop이 있으면 해당 위치의 toast만 보여주고, prop이 없으면 toast별 position에 맞춰 여러 viewport를 렌더링합니다.

### `ToastItem.tsx`

개별 toast UI를 렌더링합니다.

담당하는 내용:

- 타입별 indicator
- title, description 출력
- action 버튼 출력
- 닫기 버튼
- 접근성 role과 `aria-live`

### `useToast.ts`

외부 컴포넌트에서 사용하는 toast API를 제공합니다.

컴포넌트에서는 reducer action을 직접 알 필요 없이 다음처럼 사용할 수 있습니다.

```tsx
const toast = useToast()

toast.success('프로필이 저장되었습니다.')
toast.clear()
```

### `toast.css`

toast UI 스타일을 담당합니다.

포함된 스타일:

- viewport 위치별 배치
- toast 카드 스타일
- 타입별 색상 구분
- 닫기 버튼
- action 버튼
- loading spinner
- enter/dismiss animation
- 모바일 max-width 대응

## Demo UI

`src/App.tsx`에는 과제 확인용 demo UI가 있습니다.

버튼:

- `Success Toast`
- `Error Toast`
- `Warning Toast`
- `Info Toast`
- `Loading -> Success Toast`
- `Clear Toasts`

`Loading -> Success Toast` 버튼은 loading toast를 만들고 1500ms 뒤 success toast로 update합니다.

## What I Practiced

- React Context 분리
- `useReducer`로 상태 변경 로직 모으기
- custom hook으로 사용 API 감추기
- timer cleanup
- 접근성 live region
- 컴포넌트와 스타일 책임 분리
- 과제 확인용 demo UI 구성
