/**
 * @file layout.test.ts
 * @description 그룹 궁합 노드 배치 충돌(겹침) 검증 테스트
 *
 * 모든 MBTI 조합, 2~8명, 다양한 캔버스 크기에서
 * 어떤 원도 겹치지 않는지 검증한다.
 */

import { describe, it, expect } from "vitest";
import { computeGroupLayout, findOverlaps, type LayoutNode } from "./layout";
import { MBTI_TYPES, type MbtiType, type Member } from "@/data/compatibility";

// ─────────────────────────────────────────────
// 헬퍼
// ─────────────────────────────────────────────

const EMOJIS = ["😀", "😎", "🤩", "🥳", "😇", "🤓", "🧐", "🤗"];

/** 테스트용 멤버 배열 생성 */
function makeMembers(mbtis: MbtiType[]): Member[] {
  return mbtis.map((mbti, i) => ({
    name: `멤버${i}`,
    mbti,
    emoji: EMOJIS[i % EMOJIS.length],
  }));
}

/** 노드가 캔버스 경계 안에 있는지 확인 */
function assertWithinBounds(nodes: LayoutNode[], W: number, H: number) {
  for (const n of nodes) {
    if (n.isCenter) continue;
    expect(n.x - n.r).toBeGreaterThanOrEqual(-1); // 부동소수점 오차 허용
    expect(n.y - n.r).toBeGreaterThanOrEqual(-1);
    expect(n.x + n.r).toBeLessThanOrEqual(W + 1);
    expect(n.y + n.r).toBeLessThanOrEqual(H + 1);
  }
}

/** 겹침이 없는지 확인하고, 있으면 상세 정보 출력 */
function assertNoOverlaps(nodes: LayoutNode[]) {
  const overlaps = findOverlaps(nodes);
  if (overlaps.length > 0) {
    const details = overlaps.map(({ i, j, overlap }) =>
      `  노드[${i}](${nodes[i].id}, r=${nodes[i].r.toFixed(1)}) ↔ ` +
      `노드[${j}](${nodes[j].id}, r=${nodes[j].r.toFixed(1)}): ` +
      `겹침 ${overlap.toFixed(2)}px`
    ).join("\n");
    expect.fail(`${overlaps.length}쌍 겹침 발견:\n${details}`);
  }
}

// ─────────────────────────────────────────────
// 테스트 케이스
// ─────────────────────────────────────────────

const CANVAS_SIZES = [
  { W: 320, H: 320 },  // 모바일 소형
  { W: 375, H: 375 },  // 모바일
  { W: 560, H: 560 },  // 기본
  { W: 768, H: 580 },  // 태블릿
];

describe("computeGroupLayout — 노드 겹침 없음", () => {
  // 2명 (최소)
  it("2명: 겹침 없음", () => {
    for (const { W, H } of CANVAS_SIZES) {
      const members = makeMembers(["INTJ", "ENFP"]);
      const nodes = computeGroupLayout(members, W, H);
      assertNoOverlaps(nodes);
      assertWithinBounds(nodes, W, H);
    }
  });

  // 3명
  it("3명: 겹침 없음", () => {
    for (const { W, H } of CANVAS_SIZES) {
      const members = makeMembers(["ENTJ", "INFP", "ISFJ"]);
      const nodes = computeGroupLayout(members, W, H);
      assertNoOverlaps(nodes);
      assertWithinBounds(nodes, W, H);
    }
  });

  // 4명
  it("4명: 겹침 없음", () => {
    for (const { W, H } of CANVAS_SIZES) {
      const members = makeMembers(["INFJ", "ENTP", "ESTJ", "ISFP"]);
      const nodes = computeGroupLayout(members, W, H);
      assertNoOverlaps(nodes);
      assertWithinBounds(nodes, W, H);
    }
  });

  // 5명
  it("5명: 겹침 없음", () => {
    for (const { W, H } of CANVAS_SIZES) {
      const members = makeMembers(["INTJ", "ENFP", "ISTJ", "ESFP", "INFJ"]);
      const nodes = computeGroupLayout(members, W, H);
      assertNoOverlaps(nodes);
      assertWithinBounds(nodes, W, H);
    }
  });

  // 6명
  it("6명: 겹침 없음", () => {
    for (const { W, H } of CANVAS_SIZES) {
      const members = makeMembers(["INTJ", "ENFP", "ISTJ", "ESFP", "INFJ", "ENTP"]);
      const nodes = computeGroupLayout(members, W, H);
      assertNoOverlaps(nodes);
      assertWithinBounds(nodes, W, H);
    }
  });

  // 7명
  it("7명: 겹침 없음", () => {
    for (const { W, H } of CANVAS_SIZES) {
      const members = makeMembers(["INTJ", "ENFP", "ISTJ", "ESFP", "INFJ", "ENTP", "ISFJ"]);
      const nodes = computeGroupLayout(members, W, H);
      assertNoOverlaps(nodes);
      assertWithinBounds(nodes, W, H);
    }
  });

  // 8명 (최대)
  it("8명: 겹침 없음", () => {
    for (const { W, H } of CANVAS_SIZES) {
      const members = makeMembers([
        "INTJ", "ENFP", "ISTJ", "ESFP", "INFJ", "ENTP", "ISFJ", "ENTJ",
      ]);
      const nodes = computeGroupLayout(members, W, H);
      assertNoOverlaps(nodes);
      assertWithinBounds(nodes, W, H);
    }
  });

  // 동일 MBTI 전원 — 같은 점수로 노드 크기가 같아서 겹치기 쉬움
  it("8명 전원 동일 MBTI: 겹침 없음", () => {
    for (const { W, H } of CANVAS_SIZES) {
      const members = makeMembers([
        "ENFP", "ENFP", "ENFP", "ENFP", "ENFP", "ENFP", "ENFP", "ENFP",
      ]);
      const nodes = computeGroupLayout(members, W, H);
      assertNoOverlaps(nodes);
      assertWithinBounds(nodes, W, H);
    }
  });

  // 최악 궁합 조합 — 극과 극 점수로 노드가 작아지는 케이스
  it("8명 최저 궁합 조합: 겹침 없음", () => {
    for (const { W, H } of CANVAS_SIZES) {
      const members = makeMembers([
        "ESTJ", "INFP", "ESTJ", "INFP", "ESTJ", "INFP", "ESTJ", "INFP",
      ]);
      const nodes = computeGroupLayout(members, W, H);
      assertNoOverlaps(nodes);
      assertWithinBounds(nodes, W, H);
    }
  });

  // 모든 16개 MBTI를 중앙으로 × 7명 그룹 브루트포스
  describe("전체 MBTI 중앙 노드 × 7명 조합", () => {
    const otherPool: MbtiType[] = [
      "ENFP", "ISTJ", "ESFP", "INFJ", "ENTP", "ISFJ", "ENTJ",
    ];
    for (const center of MBTI_TYPES) {
      it(`중앙=${center}, 7명 주변: 겹침 없음`, () => {
        for (const { W, H } of CANVAS_SIZES) {
          const members = makeMembers([center as MbtiType, ...otherPool]);
          const nodes = computeGroupLayout(members, W, H);
          assertNoOverlaps(nodes);
          assertWithinBounds(nodes, W, H);
        }
      });
    }
  });
});
