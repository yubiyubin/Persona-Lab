# ChemiFit — Project Context

## 프로젝트 개요

Next.js 16 (App Router) 기반 프론트엔드 전용 MBTI 궁합 웹앱.
백엔드 서버 없음 — 모든 데이터는 `src/data/`의 정적 TypeScript 파일로 관리.

**Tech Stack**: Next.js 16, React 19, TypeScript (strict), TailwindCSS 4, Vitest, Playwright

---

## 디렉토리 구조

```
src/
  app/(tabs)/          ← Next.js 페이지 (group-match, mbti-love, mbti-map)
  components/          ← 공용 UI 컴포넌트 (MbtiSelectModal, ScoreBar, NetworkGraph…)
  context/             ← React Context (MbtiContext — 전역 MBTI 상태)
  data/                ← 정적 데이터·로직 (compatibility, colors, labels, ui-text…)
  features/            ← 피처 모듈 (각각 components/, consts/, hooks/, utils/ 포함)
    group-match/       ← 그룹 궁합
    mbti-love/         ← 연애 궁합
    mbti-map/          ← MBTI 궁합 맵
  hooks/               ← 전역 커스텀 훅
  styles/              ← 테마 토큰 (card-themes, score-bar, titles, globals.css)
  types/               ← 전역 TypeScript 선언
  test/                ← 테스트 setup
e2e/                   ← Playwright E2E 스펙
```

---

## 팀원별 소유 영역

### data-logic-engineer
- `src/data/`, `src/types/`, `src/hooks/`, `src/context/`
- 각 feature의 `consts/`, `hooks/`, `utils/`

### ui-developer
- `src/app/`, `src/components/`, `src/styles/`
- 각 feature의 `components/`

### qa-engineer
- `src/**/*.test.{ts,tsx}`, `e2e/`
- `vitest.config.ts`, `playwright.config.ts`

---

## 공유 컨벤션

| 항목 | 규칙 |
|------|------|
| Import alias | `@/` → `src/` (예: `import { X } from "@/data/compatibility"`) |
| 컴포넌트 | PascalCase |
| 훅 | useCamelCase |
| 데이터·유틸 | camelCase |
| 한국어 문자열 | `src/data/ui-text.ts`에 named export — 컴포넌트에 하드코딩 금지 |
| 스타일 상수 | `src/styles/` 사용 — 인라인 금지 |
| 타입 | `src/types/` 또는 모듈 내 co-locate 후 re-export |
| TypeScript | strict mode + ESLint 통과 필수 |
| 테스트 위치 | 소스 파일 옆 `*.test.ts(x)` 또는 `e2e/` |

---

## 테스트 커버리지 기준

- lines ≥ 90%, functions ≥ 90%, branches ≥ 85%
- 테스트 명령: `npm run test`, `npm run test -- --coverage`, `npx playwright test`
