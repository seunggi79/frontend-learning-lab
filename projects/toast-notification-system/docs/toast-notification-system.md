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

## Toast에 필요한 것

Toast는 화면에 잠깐 나타나는 작은 UI처럼 보이지만, 실제로는 여러 가지 프론트엔드 개념이 함께 들어가는 작은 시스템입니다.

### Local State

Toast는 서버에서 저장하거나 받아오는 데이터가 아니라, 화면에 잠깐 보여주는 UI 상태입니다.

그래서 React Query 같은 server state가 아니라 `useReducer`, Context 같은 local state로 관리하는 것이 자연스럽습니다.

### Queue

Toast는 한 번에 여러 개 생길 수 있습니다.

따라서 `Toast[]` 형태의 목록으로 관리하고, 새 toast를 추가하거나 dismiss된 toast를 제거합니다. 이 목록이 queue 역할을 합니다.

```ts
interface ToastState {
  toasts: Toast[]
}
```

### Timer

`success`, `info`, `warning`, `error` toast는 일정 시간이 지나면 자동으로 사라져야 합니다.

이를 위해 `setTimeout`을 사용하고, toast가 사라지거나 컴포넌트가 unmount될 때 timer를 cleanup해야 합니다.

cleanup을 하지 않으면 이미 사라진 toast에 대해 dispatch가 실행되거나, 메모리 누수가 생길 수 있습니다.

### Type별 스타일

Toast type마다 의미가 다르기 때문에 시각적 구분이 필요합니다.

- `success`: 작업 성공
- `error`: 작업 실패
- `warning`: 주의 필요
- `info`: 일반 정보
- `loading`: 진행 중

색상, indicator, spinner, 접근성 role 등을 type에 따라 다르게 적용합니다.

### Loading 상태 업데이트

`loading` toast는 비동기 작업이 진행 중임을 보여줍니다.

작업이 끝나기 전에 자동으로 사라지면 안 되므로 기본 duration을 `null`로 둡니다. 작업이 완료되면 같은 toast id를 사용해 `success`나 `error`로 update합니다.

```ts
const id = toast.loading('파일 업로드 중입니다.')

toast.update(id, {
  type: 'success',
  title: '파일 업로드가 완료되었습니다.',
  duration: 3000,
})
```

### 중복 방지

같은 toast가 여러 번 쌓이면 사용자가 같은 메시지를 반복해서 보게 됩니다.

예를 들어 저장 버튼을 여러 번 눌렀을 때 `프로필이 저장되었습니다.`가 여러 개 뜨는 것은 좋은 UX가 아닙니다. 그래서 같은 `type + title`의 toast가 이미 visible 상태라면 새로 추가하지 않습니다.

### 최대 표시 개수 제한

Toast가 너무 많이 보이면 화면을 가리고 사용성을 떨어뜨립니다.

이 프로젝트에서는 visible toast를 최대 3개로 제한합니다. 3개를 초과하면 초과된 toast는 `dismissing` 상태로 전환됩니다.

### 접근성

Toast는 화면에 갑자기 나타나는 정보이므로 스크린 리더 사용자도 알 수 있어야 합니다.

- `success`, `info`, `loading`: `role="status"`, `aria-live="polite"`
- `error`, `warning`: `role="alert"`, `aria-live="assertive"`

긴급하지 않은 정보는 polite로 읽고, 오류나 경고처럼 중요한 정보는 assertive로 읽도록 합니다.

### 렌더링 최적화

Toast는 앱 어디에서든 호출될 수 있지만, toast 상태가 바뀔 때 앱 전체가 불필요하게 리렌더링되면 좋지 않습니다.

이를 줄이기 위해 다음처럼 책임을 분리합니다.

- `ToastProvider`: 상태와 dispatch 제공
- `ToastViewport`: toast 상태만 구독해서 렌더링
- `useToast`: 개발자가 사용하는 API 제공
- `ToastItem`: 개별 toast UI만 담당

state context와 dispatch context를 분리하면 dispatch만 필요한 컴포넌트의 불필요한 리렌더링도 줄일 수 있습니다.

## RADIO로 정리하기

이 프로젝트는 `RADIO` 흐름으로 설계해볼 수 있습니다.

### R - Requirements

무엇을 해야 하는지 정리하는 단계입니다.

Requirements:

- toast type은 `success`, `error`, `warning`, `info`, `loading`을 지원한다.
- toast position은 `top-right`, `top-center`, `bottom-right`, `bottom-center`를 지원한다.
- toast 목록은 local state로 관리한다.
- `Context + useReducer` 방식으로 구현한다.
- 각 toast 생성 함수는 id를 반환한다.
- loading toast는 기본적으로 자동으로 사라지지 않는다.
- 기본 duration을 type별로 다르게 둔다.
- 한 번에 표시되는 toast는 최대 3개로 제한한다.
- 같은 `type + title` toast는 중복 추가하지 않는다.
- dismiss 시 바로 삭제하지 않고 `dismissing` 상태를 거친다.
- timer는 cleanup한다.
- 접근성을 고려한다.

### A - Architecture

코드를 어떻게 나눌지 정리하는 단계입니다.

Architecture:

```text
src/shared/toast/
├── ToastProvider.tsx
├── ToastViewport.tsx
├── ToastItem.tsx
├── useToast.ts
├── toastReducer.ts
├── toastTypes.ts
├── toast.css
└── index.ts
```

각 파일의 책임:

- `ToastProvider`: 상태, dispatch, timer 관리
- `ToastViewport`: toast 목록 렌더링
- `ToastItem`: toast 한 개의 UI와 접근성 처리
- `useToast`: 개발자가 사용하는 API 제공
- `toastReducer`: 상태 변경 규칙 관리
- `toastTypes`: 타입과 상수 정의
- `toast.css`: 스타일과 애니메이션 관리
- `index.ts`: 외부 export 관리

### D - Data Model

토스트 하나를 어떤 데이터로 표현할지 정리하는 단계입니다.

Data Model:

```ts
interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'loading'
  title: string
  description?: string
  duration: number | null
  position: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'
  status: 'visible' | 'dismissing'
  createdAt: number
}
```

중요한 필드는 `status`입니다.

toast를 바로 삭제하면 dismiss animation을 보여줄 수 없습니다. 그래서 먼저 `dismissing` 상태로 바꾸고, animation 시간이 지난 뒤 `REMOVE_TOAST`로 제거합니다.

### I - Interface

개발자가 어떻게 사용할지 정리하는 단계입니다.

Interface:

```ts
toast.success('프로필이 저장되었습니다.')
toast.error('결제에 실패했습니다.')
toast.warning('세션이 곧 만료됩니다.')
toast.info('새 댓글이 추가되었습니다.')

const id = toast.loading('파일 업로드 중입니다.')

toast.update(id, {
  type: 'success',
  title: '파일 업로드가 완료되었습니다.',
  duration: 3000,
})

toast.dismiss(id)
toast.clear()
```

좋은 interface는 내부 구현을 숨기고, 사용하는 쪽에서는 의도만 표현할 수 있게 해줍니다.

개발자는 reducer action, timer, queue 처리 방식을 몰라도 됩니다.

### O - Optimization

서비스가 커졌을 때 생길 문제를 미리 막는 단계입니다.

Optimization:

- 중복 toast 방지로 같은 메시지가 계속 쌓이는 문제를 막는다.
- 최대 표시 개수 제한으로 화면이 toast로 가득 차는 문제를 막는다.
- timer cleanup으로 메모리 누수와 stale dispatch를 막는다.
- loading toast update로 불필요한 toast 생성과 화면 깜빡임을 줄인다.
- Context를 분리해서 불필요한 리렌더링을 줄인다.
- 접근성 규칙을 type별로 고정해서 알림 의미를 일관되게 전달한다.

## 실제 사용 시나리오

Toast는 사용자가 어떤 행동을 했을 때 결과를 짧게 알려주는 데 많이 사용합니다.

| Scenario | Toast Type | Example |
| --- | --- | --- |
| 프로필 저장 성공 | `success` | `toast.success('프로필이 저장되었습니다.')` |
| 장바구니 담기 성공 | `success` | `toast.success('장바구니에 담았습니다.')` |
| 결제 실패 | `error` | `toast.error('결제에 실패했습니다.')` |
| 네트워크 오류 | `error` 또는 `warning` | `toast.error('네트워크 오류가 발생했습니다.')` |
| 권한 없음 | `error` | `toast.error('권한이 없습니다.')` |
| 파일 업로드 완료 | `success` | `toast.success('파일 업로드가 완료되었습니다.')` |
| 자동 저장 실패 | `warning` 또는 `error` | `toast.warning('자동 저장에 실패했습니다. 다시 시도합니다.')` |
| 세션 만료 | `warning` | `toast.warning('세션이 곧 만료됩니다.')` |
| 파일 업로드 중 | `loading` | `toast.loading('파일 업로드 중입니다.')` |

### 시나리오별 판단 기준

`success`는 사용자의 행동이 정상적으로 끝났을 때 사용합니다.

예를 들어 프로필 저장, 장바구니 담기, 파일 업로드 완료가 여기에 해당합니다.

`error`는 사용자의 행동이 실패했고, 즉시 알아야 하는 문제일 때 사용합니다.

예를 들어 결제 실패, 권한 없음, 요청 실패가 여기에 해당합니다.

`warning`은 아직 완전한 실패는 아니지만 주의가 필요할 때 사용합니다.

예를 들어 세션 만료 예정, 네트워크 불안정, 자동 저장 재시도 예정이 여기에 해당합니다.

`info`는 성공이나 실패가 아니라 단순한 정보 전달에 사용합니다.

예를 들어 새 댓글 추가, 새 알림 도착 같은 메시지가 여기에 해당합니다.

`loading`은 비동기 작업이 진행 중일 때 사용합니다.

파일 업로드, 저장 요청, 결제 요청처럼 시간이 걸리는 작업에서 사용자에게 진행 중임을 알려줍니다.

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
