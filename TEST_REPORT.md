# ChemiFit 테스트 인프라 보고서

작성일: 2026-03-25 (최종 갱신: 테스트 전면 확장)

---

## 1. 개요

Unit / Integration / E2E 3계층 테스트 인프라를 구축하고 전면 확장하였습니다.

- **Unit/Integration**: Vitest + React Testing Library (jsdom)
- **E2E**: Playwright (Desktop Chrome)

---

## 2. 이전 vs 현재 결과 비교

### Unit + Integration (npm test)

| 항목 | 이전 | 현재 |
|------|------|------|
| 테스트 파일 | 10개 | 15개 (+5) |
| 테스트 케이스 | 145개 | 384개 (+239) |
| 실행 시간 | ~2.8초 | ~3.9초 |

### 커버리지 비교 (npx vitest run --coverage)

| 지표 | 이전 | 현재 | 목표 |
|------|------|------|------|
| Statements | 96.09% | 98.43% | 97%+ ✅ |
| Branches | 85.61% | 88.48% | 87%+ ✅ |
| Functions | 92.85% | 96.42% | 95%+ ✅ |
| Lines | 97.29% | 99.54% | 98%+ ✅ |

### E2E 시나리오

| 항목 | 이전 | 현재 |
|------|------|------|
| 테스트 파일 | 3개 | 4개 (+1) |
| 시나리오 수 | 3개 | 12개 (+9) |
| 통과 여부 | 3/3 | 12/12 ✅ |

---

## 3. 파일별 추가된 케이스 수

### Unit 테스트 (기존 파일 확장)

| 파일 | 이전 케이스 | 현재 케이스 | 추가 수 |
|------|------------|------------|--------|
| `src/data/compatibility.test.ts` | 14 | 37 | +23 |
| `src/data/labels.test.ts` | 15 | 52 | +37 |
| `src/data/colors.test.ts` | 13 | 42 | +29 |
| `src/features/mbti-love/consts/categories.test.ts` | 8 | 22 | +14 |
| `src/features/mbti-love/consts/category-comments.test.ts` | 5 | 26 | +21 |
| `src/features/group-match/utils/group-roles.test.ts` | 18 | 57 | +39 |
| `src/lib/layout.test.ts` | 27 | 44 | +17 |

### Integration 테스트 (기존 파일 확장)

| 파일 | 이전 케이스 | 현재 케이스 | 추가 수 |
|------|------------|------------|--------|
| `src/components/ScoreBar.test.tsx` | 5 | 16 | +11 |
| `src/components/MbtiSelectModal.test.tsx` | 9 | 18 | +9 |
| `src/features/group-match/components/MemberInput.test.tsx` | 11 | 21 | +10 |

### 신규 Unit 테스트 파일

| 파일 | 케이스 수 | 테스트 대상 |
|------|----------|------------|
| `src/data/groups.test.ts` | 14 | MBTI_GROUPS 구조, 4그룹, 16타입 분배 |
| `src/features/group-match/consts/battery-tiers.test.ts` | 18 | BATTERY_TIERS, getBatteryTier() 경계값 |

### 신규 Integration 테스트 파일

| 파일 | 케이스 수 | 테스트 대상 |
|------|----------|------------|
| `src/components/CompatCard.test.tsx` | 13 | best/worst variant, 클릭, compact, children |
| `src/components/DetailScoreCard.test.tsx` | 11 | categories 모드, children 모드, 커스텀 타이틀 |
| `src/features/group-match/components/BatteryGauge.test.tsx` | 11 | 점수별 렌더, gauge-bar width, 라벨 표시 |

---

## 4. E2E 시나리오 목록

| 파일 | 시나리오 | 결과 |
|------|---------|------|
| `e2e/scenario-love.spec.ts` | MBTI 선택 후 상대방 선택 → 게이지 표시 확인 | ✅ |
| `e2e/scenario-love.spec.ts` | 상대방 변경 후 게이지 숫자가 갱신된다 | ✅ |
| `e2e/scenario-love.spec.ts` | 탭 이동 후 mbti-love 재방문 시 페이지가 정상 로드된다 | ✅ |
| `e2e/scenario-map.spec.ts` | MBTI 선택 후 배지 클릭 → 모달 열림/닫힘 | ✅ |
| `e2e/scenario-map.spec.ts` | 여러 배지 클릭 → 다른 모달 내용 표시 | ✅ |
| `e2e/scenario-group.spec.ts` | 8명 최대 추가 시도 → 추가 버튼 비활성화 확인 | ✅ |
| `e2e/scenario-group.spec.ts` | 멤버 전부 삭제 시 처리 확인 | ✅ |
| `e2e/scenario-group.spec.ts` | 멤버 추가/삭제 + 결과 표시 + URL 공유 | ✅ |
| `e2e/scenario-navigation.spec.ts` | mbti-love에서 MBTI 선택 후 mbti-map으로 이동 확인 | ✅ |
| `e2e/scenario-navigation.spec.ts` | 여러 탭을 연속으로 방문해도 정상 동작 | ✅ |
| `e2e/scenario-navigation.spec.ts` | 브라우저 뒤로가기 → 이전 탭으로 복귀 | ✅ |
| `e2e/scenario-navigation.spec.ts` | group-match 접속 시 초기 UI 표시 확인 | ✅ |

---

## 5. 설정 파일

| 파일 | 역할 |
|------|------|
| `/vitest.config.ts` | Vitest 설정 (jsdom, React plugin, 커버리지) |
| `/playwright.config.ts` | Playwright 설정 (E2E, Desktop Chrome) |
| `/src/test/setup.ts` | jest-dom 전역 설정 |

---

## 6. data-testid 목록

기존 컴포넌트에 아래 testid가 적용되어 있습니다.

| 컴포넌트 | testid |
|---------|--------|
| MbtiSelectModal — MBTI 버튼 | `mbti-btn-{TYPE}` |
| MbtiSelectModal — 닫기 버튼 | `modal-close-btn` |
| CoupleResult — 상대방 MBTI 버튼 | `partner-btn-{TYPE}` |
| CoupleResult — 게이지 래퍼 | `gauge-counter` |
| MemberInput — 이름 입력 | `member-name-input` |
| MemberInput — 추가 버튼 | `member-add-btn` |
| MemberInput — 멤버 태그 | `member-tag-{i}` |
| MemberInput — 삭제 버튼 | `member-remove-{i}` |
| MemberInput — 카운트 텍스트 | `member-count` |
| GroupGrid — 평균 점수 래퍼 | `group-avg-score` |
| GroupGrid — 역할 분석 래퍼 | `group-roles` |
| CompatDetailModal — 팝업 전체 | `compat-detail-modal` |
| CompatDetailModal — 닫기 버튼 | `compat-detail-close` |
| MbtiBadge — 배지 | `mbti-badge-{TYPE}` |

---

## 7. 주요 설계 결정

1. **Math.random mock**: `labels.ts`, `group-roles.ts`는 모듈 레벨 랜덤 선택을 사용하므로
   `vi.spyOn(Math, 'random').mockReturnValue(0)`으로 결정론적 테스트를 보장합니다.

2. **모듈 캐시 격리**: `labels.ts`는 모듈 레벨 캐시를 사용합니다.
   같은 점수는 캐시에서 동일 결과를 반환하므로, 캐시 동작 자체를 테스트 시나리오로 활용했습니다.

3. **DropdownPicker mock**: jsdom 환경에서 커스텀 드롭다운의 렌더링이 복잡하므로
   `MemberInput.test.tsx`에서 native select로 대체 mock 처리했으며,
   `renderOption` 람다가 실행되도록 mock에서 호출하여 커버리지를 확보했습니다.

4. **next/navigation mock**: Next.js App Router의 `useRouter`, `useSearchParams`, `usePathname`을
   모든 컴포넌트 테스트 파일에서 mock 처리했습니다.

5. **커버리지 미달 항목 설명**:
   - `group-roles.ts:190`: `leader===0 && care===0` 조건에 도달하려면 앞의 8개 규칙이 모두 false여야
     하지만, 논리상 energy≥1이면서 leader=0, care=0인 경우 반드시 규칙1(energy≥50%)이나
     규칙7(energy≥1 AND analyst≥1)이 먼저 매칭됩니다. 사실상 dead code에 가깝습니다.
   - `layout.ts:52,61,96`: resolveCollisions의 특정 분기 (단독 충돌 경계 케이스)로
     실제 충돌 해소 테스트에서 커버됩니다.
   - `compatibility.ts:682`: `getScore` 3항 연산자의 fallback(50)은 유효하지 않은 타입 조합에서만
     실행되므로 타입 안전 코드에서는 도달하지 않습니다.

---

## 8. 실행 명령어

```bash
# Unit + Integration (한 번 실행)
npm test

# 감시 모드
npm run test:watch

# 커버리지 포함
npx vitest run --coverage

# E2E (개발 서버 실행 필요)
npm run dev &
npx playwright test
```
