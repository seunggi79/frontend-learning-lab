# frontend-learning-lab

프론트엔드 공부와 실습 프로젝트를 모아두는 학습 저장소입니다.

작게 구현해본 UI, React 패턴, TypeScript 연습, 상태 관리 실험 등을 `projects/` 아래에 프로젝트 단위로 계속 추가할 예정입니다.

## Repository Structure

```text
frontend-learning-lab/
└── projects/
    └── toast-notification-system/
        └── docs/
```

## Projects

| Project | Stack | Description |
| --- | --- | --- |
| `toast-notification-system` | Vite, React, TypeScript | 외부 toast 라이브러리 없이 직접 구현한 Toast Notification System |

## Current Project: Toast Notification System

위치: `projects/toast-notification-system`

주요 구현 내용:

- `Context + useReducer` 기반 local state 관리
- `success`, `error`, `warning`, `info`, `loading` toast 지원
- `top-right`, `top-center`, `bottom-right`, `bottom-center` 위치 지원
- 기본 duration, 중복 방지, 최대 3개 표시, dismiss 애니메이션 처리
- loading toast update 흐름 구현
- timer cleanup 처리
- 접근성 role과 `aria-live` 적용
- 과제 확인용 demo UI 작성

자세한 설명은 [projects/toast-notification-system/docs/toast-notification-system.md](projects/toast-notification-system/docs/toast-notification-system.md)를 참고하면 됩니다.

## Run

```bash
cd projects/toast-notification-system
npm install
npm run dev
```

## Check

```bash
cd projects/toast-notification-system
npm run lint
npm run build
```

## Project Rules

- 새 실습은 `projects/프로젝트명/` 아래에 추가합니다.
- 각 프로젝트에는 가능한 한 `README.md`를 작성합니다.
- 프로젝트별 개인 문서나 설계 설명은 해당 프로젝트 내부 `docs/`에 정리합니다.
- `node_modules`, `dist`, 환경 변수 파일은 커밋하지 않습니다.
