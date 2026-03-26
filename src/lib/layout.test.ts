/**
 * @file layout.test.ts
 * @description 그룹 궁합 노드 배치 충돌(겹침) 검증 테스트
 *
 * 모든 MBTI 조합, 2~8명, 다양한 캔버스 크기에서
 * 어떤 원도 겹치지 않는지 검증한다.
 */

import { describe, it, expect } from "vitest";
import { computeGroupLayout, findOverlaps, resolveCollisions, type LayoutNode } from "./layout";
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

describe("resolveCollisions() 직접 테스트", () => {
  it("충돌하는 두 non-center 노드가 분리된다", () => {
    const nodes = [
      { x: 100, y: 100, r: 30, isCenter: true },
      { x: 105, y: 100, r: 30, isCenter: false }, // a와 가까이
      { x: 110, y: 100, r: 30, isCenter: false }, // b와 가까이
    ];
    const W = 560, H = 560;
    resolveCollisions(nodes, W, H);
    // 충돌 해소 후 두 non-center 노드 간 거리가 충분해야 함
    const dx = nodes[2].x - nodes[1].x;
    const dy = nodes[2].y - nodes[1].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // minDist = 30 + 30 + 12(gap) = 72 이상이어야 함
    expect(dist).toBeGreaterThanOrEqual(72);
  });

  it("충돌 해소 시 클램핑으로 경계 밖으로 나가지 않는다", () => {
    // 두 non-center 노드를 캔버스 왼쪽 끝 근처에 겹치게 배치
    const nodes = [
      { x: 280, y: 280, r: 50, isCenter: true },
      { x: 15, y: 15, r: 30, isCenter: false },
      { x: 20, y: 15, r: 30, isCenter: false }, // 위와 겹침 → 충돌 해소 시 경계로 클램핑
    ];
    const W = 560, H = 560;
    resolveCollisions(nodes, W, H, 12, 10);
    // 충돌 해소 후 모든 non-center 노드가 경계 안에 있어야 함
    for (let i = 1; i < nodes.length; i++) {
      expect(nodes[i].x - nodes[i].r).toBeGreaterThanOrEqual(-1);
      expect(nodes[i].y - nodes[i].r).toBeGreaterThanOrEqual(-1);
    }
  });
});

describe("findOverlaps() 직접 테스트", () => {
  it("겹치는 노드 쌍이 있을 때 해당 쌍을 반환한다", () => {
    const nodes: LayoutNode[] = [
      { x: 0, y: 0, r: 30, id: "a", mbti: "INTJ", score: 80, isCenter: false },
      { x: 10, y: 0, r: 30, id: "b", mbti: "ENFP", score: 60, isCenter: false },
    ];
    // dist=10, minDist=60 → 겹침 50px
    const overlaps = findOverlaps(nodes);
    expect(overlaps).toHaveLength(1);
    expect(overlaps[0].i).toBe(0);
    expect(overlaps[0].j).toBe(1);
    expect(overlaps[0].overlap).toBeCloseTo(50, 1);
  });

  it("겹치지 않는 노드 쌍 → 빈 배열", () => {
    const nodes: LayoutNode[] = [
      { x: 0, y: 0, r: 20, id: "a", mbti: "INTJ", score: 80, isCenter: false },
      { x: 100, y: 0, r: 20, id: "b", mbti: "ENFP", score: 60, isCenter: false },
    ];
    // dist=100, minDist=40 → 겹침 없음
    const overlaps = findOverlaps(nodes);
    expect(overlaps).toHaveLength(0);
  });

  it("gap 파라미터 적용: gap=10이면 더 넓은 조건으로 겹침 판단", () => {
    const nodes: LayoutNode[] = [
      { x: 0, y: 0, r: 20, id: "a", mbti: "INTJ", score: 80, isCenter: false },
      { x: 50, y: 0, r: 20, id: "b", mbti: "ENFP", score: 60, isCenter: false },
    ];
    // dist=50, gap=0: minDist=40 → 겹침 없음
    expect(findOverlaps(nodes, 0)).toHaveLength(0);
    // gap=15: minDist=55 > dist=50 → 겹침 있음
    expect(findOverlaps(nodes, 15)).toHaveLength(1);
  });

  it("노드가 1개일 때 빈 배열", () => {
    const nodes: LayoutNode[] = [
      { x: 0, y: 0, r: 20, id: "a", mbti: "INTJ", score: 80, isCenter: true },
    ];
    expect(findOverlaps(nodes)).toHaveLength(0);
  });

  it("노드가 0개일 때 빈 배열", () => {
    expect(findOverlaps([])).toHaveLength(0);
  });
});

describe("computeGroupLayout — 노드 속성 및 반환값 검증", () => {
  it("반환된 노드 수는 멤버 수와 같다 (첫 번째 멤버가 중앙 노드)", () => {
    // computeGroupLayout: members[0] = 중앙, members[1..] = 주변
    // 3명 → 중앙 1개 + 주변 2개 = 총 3개
    const members = makeMembers(["INTJ", "ENFP", "ISTJ"]);
    const nodes = computeGroupLayout(members, 560, 560);
    expect(nodes).toHaveLength(3);
  });

  it("중앙 노드(isCenter=true)가 정확히 1개여야 한다", () => {
    const members = makeMembers(["INTJ", "ENFP"]);
    const nodes = computeGroupLayout(members, 560, 560);
    const centerNodes = nodes.filter((n) => n.isCenter);
    expect(centerNodes).toHaveLength(1);
  });

  it("각 노드에 x, y, r, id 속성이 있어야 한다", () => {
    const members = makeMembers(["INTJ", "ENFP"]);
    const nodes = computeGroupLayout(members, 560, 560);
    nodes.forEach((node) => {
      expect(node).toHaveProperty("x");
      expect(node).toHaveProperty("y");
      expect(node).toHaveProperty("r");
      expect(node).toHaveProperty("id");
      expect(typeof node.x).toBe("number");
      expect(typeof node.y).toBe("number");
      expect(typeof node.r).toBe("number");
    });
  });

  it("모든 노드의 반지름(r)이 양수여야 한다", () => {
    const members = makeMembers(["INTJ", "ENFP", "ISTJ", "ESFP"]);
    const nodes = computeGroupLayout(members, 560, 560);
    nodes.forEach((node) => {
      expect(node.r).toBeGreaterThan(0);
    });
  });

  it("2명 입력: 노드 수가 2개 (중앙1 + 주변1)", () => {
    // members[0] = 중앙, members[1] = 주변 → 총 2개
    const members = makeMembers(["INTJ", "ENFP"]);
    const nodes = computeGroupLayout(members, 560, 560);
    expect(nodes).toHaveLength(2);
  });

  it("8명 입력: 노드 수가 8개 (중앙1 + 주변7)", () => {
    // members[0] = 중앙, members[1..7] = 주변 → 총 8개
    const members = makeMembers([
      "INTJ", "ENFP", "ISTJ", "ESFP", "INFJ", "ENTP", "ISFJ", "ENTJ",
    ]);
    const nodes = computeGroupLayout(members, 560, 560);
    expect(nodes).toHaveLength(8);
  });

  it("2명 × 초소형 캔버스(200×200): 겹침 없음", () => {
    const members = makeMembers(["INTJ", "ENFP"]);
    const nodes = computeGroupLayout(members, 200, 200);
    assertNoOverlaps(nodes);
  });

  it("3명 × 직사각형 캔버스(800×400): 겹침 없음", () => {
    const members = makeMembers(["ENTJ", "INFP", "ISFJ"]);
    const nodes = computeGroupLayout(members, 800, 400);
    assertNoOverlaps(nodes);
    assertWithinBounds(nodes, 800, 400);
  });

  it("모든 care 타입(ENFJ, ESFJ, ISFJ) 8명: 겹침 없음", () => {
    const members = makeMembers([
      "ENFJ", "ESFJ", "ISFJ", "ENFJ", "ESFJ", "ISFJ", "ENFJ", "ESFJ",
    ]);
    for (const { W, H } of CANVAS_SIZES) {
      const nodes = computeGroupLayout(members, W, H);
      assertNoOverlaps(nodes);
      assertWithinBounds(nodes, W, H);
    }
  });

  it("모든 leader 타입(ENTJ, ESTJ) 반복 8명: 겹침 없음", () => {
    const members = makeMembers([
      "ENTJ", "ESTJ", "ENTJ", "ESTJ", "ENTJ", "ESTJ", "ENTJ", "ESTJ",
    ]);
    for (const { W, H } of CANVAS_SIZES) {
      const nodes = computeGroupLayout(members, W, H);
      assertNoOverlaps(nodes);
      assertWithinBounds(nodes, W, H);
    }
  });
});
