import { describe, it, expect } from "vitest";
import { MBTI_TYPES } from "@/data/compatibility";
import { LOVE_DESC, type LoveDescription } from "./love-descriptions";

describe("LOVE_DESC 256개 조합 완전성 검증", () => {
  it("16개 MBTI 타입 모두 최상위 키로 존재해야 한다", () => {
    const keys = Object.keys(LOVE_DESC);
    expect(keys).toHaveLength(16);
    MBTI_TYPES.forEach((type) => {
      expect(keys).toContain(type);
    });
  });

  it("각 타입마다 16개 파트너 키가 존재해야 한다 (총 256개)", () => {
    MBTI_TYPES.forEach((mine) => {
      const partners = Object.keys(LOVE_DESC[mine]);
      expect(partners).toHaveLength(16);
      MBTI_TYPES.forEach((partner) => {
        expect(partners).toContain(partner);
      });
    });
  });

  it("모든 256개 조합에 undefined가 없어야 한다", () => {
    MBTI_TYPES.forEach((mine) => {
      MBTI_TYPES.forEach((partner) => {
        expect(LOVE_DESC[mine][partner]).not.toBeUndefined();
      });
    });
  });

  it("모든 설명 객체에 preview, fightStyle, solution, detail 필드가 존재해야 한다", () => {
    MBTI_TYPES.forEach((mine) => {
      MBTI_TYPES.forEach((partner) => {
        const desc: LoveDescription = LOVE_DESC[mine][partner];
        expect(typeof desc.preview).toBe("string");
        expect(typeof desc.fightStyle).toBe("string");
        expect(typeof desc.solution).toBe("string");
        expect(typeof desc.detail).toBe("string");
      });
    });
  });

  it("모든 필드 값이 비어있지 않아야 한다", () => {
    MBTI_TYPES.forEach((mine) => {
      MBTI_TYPES.forEach((partner) => {
        const desc = LOVE_DESC[mine][partner];
        expect(desc.preview.trim().length).toBeGreaterThan(0);
        expect(desc.fightStyle.trim().length).toBeGreaterThan(0);
        expect(desc.solution.trim().length).toBeGreaterThan(0);
        expect(desc.detail.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
