# Frontend Lab

프론트엔드 공부 내용을 모아두는 개인 학습 저장소입니다.

## 구조

```text
frontend-lab/
└── projects/
    └── toast-notification-system/
```

`projects/` 아래에 학습하거나 실습한 프로젝트를 계속 추가하는 방식으로 관리합니다.

## Projects

### Toast Notification System

위치: `projects/toast-notification-system`

Vite + React + TypeScript로 만든 Toast Notification System입니다.

주요 내용:

- 외부 toast 라이브러리 없이 React 기본 기능으로 구현
- `Context + useReducer` 기반 local state 관리
- `success`, `error`, `warning`, `info`, `loading` toast 지원
- `top-right`, `top-center`, `bottom-right`, `bottom-center` 위치 지원
- 중복 toast 방지, 최대 3개 표시, dismiss 애니메이션, timer cleanup 처리
- 접근성 role과 `aria-live` 적용
- 과제 확인용 demo UI 포함

실행:

```bash
cd projects/toast-notification-system
npm install
npm run dev
```

검증:

```bash
npm run lint
npm run build
```
