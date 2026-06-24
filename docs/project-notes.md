# Project Notes

이 문서는 `frontend-learning-lab` 저장소를 계속 관리하기 위한 간단한 기록 규칙입니다.

## 프로젝트 추가 방식

새로운 학습 프로젝트는 `projects/` 아래에 추가합니다.

```text
projects/
└── new-project-name/
```

프로젝트를 추가할 때 권장하는 구성:

- `README.md`: 프로젝트 목적, 실행 방법, 배운 점
- `package.json`: 실행 스크립트
- `src/`: 실제 구현 코드
- 필요한 경우 `docs/`: 프로젝트별 상세 문서

## README에 적으면 좋은 내용

- 무엇을 만든 프로젝트인지
- 사용한 기술 스택
- 주요 기능
- 실행 방법
- 구현하면서 배운 점
- 아쉬운 점이나 다음에 개선할 점

## Commit Message Example

```bash
git add .
git commit -m "Add toast notification system"
git push
```

## 현재 학습 기록

### Toast Notification System

React 기본 기능만으로 toast 시스템을 구현했습니다.

정리한 내용:

- `Context + useReducer`
- custom hook API 설계
- local UI state 관리
- timer cleanup
- 접근성 속성 적용
- CSS animation
