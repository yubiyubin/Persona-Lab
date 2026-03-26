import { describe, it, expect } from "vitest";
import { MBTI_GROUPS } from "./groups";
import { MBTI_TYPES } from "./compatibility";

describe("MBTI_GROUPS 구조 검증", () => {
  it("정확히 4개 그룹이 존재해야 한다", () => {
    expect(MBTI_GROUPS).toHaveLength(4);
  });

  it("각 그룹에 label과 types가 있어야 한다", () => {
    MBTI_GROUPS.forEach((group) => {
      expect(group).toHaveProperty("label");
      expect(group).toHaveProperty("types");
      expect(typeof group.label).toBe("string");
      expect(Array.isArray(group.types)).toBe(true);
    });
  });

  it("각 그룹에 정확히 4개 타입이 있어야 한다", () => {
    MBTI_GROUPS.forEach((group) => {
      expect(group.types).toHaveLength(4);
    });
  });

  it("전체 16개 MBTI가 4개 그룹에 분배되어야 한다 (합계 16개)", () => {
    const allTypes = MBTI_GROUPS.flatMap((g) => g.types);
    expect(allTypes).toHaveLength(16);
  });

  it("중복 없이 모든 타입이 고유해야 한다", () => {
    const allTypes = MBTI_GROUPS.flatMap((g) => g.types);
    const unique = new Set(allTypes);
    expect(unique.size).toBe(16);
  });

  it("16개 MBTI_TYPES가 모두 그룹 안에 존재해야 한다", () => {
    const allTypes = MBTI_GROUPS.flatMap((g) => g.types);
    MBTI_TYPES.forEach((t) => {
      expect(allTypes).toContain(t);
    });
  });

  it("그룹 라벨에 '분석형'이 존재해야 한다", () => {
    const labels = MBTI_GROUPS.map((g) => g.label);
    expect(labels).toContain("분석형");
  });

  it("그룹 라벨에 '외교형'이 존재해야 한다", () => {
    const labels = MBTI_GROUPS.map((g) => g.label);
    expect(labels).toContain("외교형");
  });

  it("그룹 라벨에 '관리형'이 존재해야 한다", () => {
    const labels = MBTI_GROUPS.map((g) => g.label);
    expect(labels).toContain("관리형");
  });

  it("그룹 라벨에 '탐험형'이 존재해야 한다", () => {
    const labels = MBTI_GROUPS.map((g) => g.label);
    expect(labels).toContain("탐험형");
  });

  it("분석형 그룹은 INTJ, INTP, ENTJ, ENTP를 포함해야 한다", () => {
    const group = MBTI_GROUPS.find((g) => g.label === "분석형")!;
    expect(group.types).toContain("INTJ");
    expect(group.types).toContain("INTP");
    expect(group.types).toContain("ENTJ");
    expect(group.types).toContain("ENTP");
  });

  it("외교형 그룹은 INFJ, INFP, ENFJ, ENFP를 포함해야 한다", () => {
    const group = MBTI_GROUPS.find((g) => g.label === "외교형")!;
    expect(group.types).toContain("INFJ");
    expect(group.types).toContain("INFP");
    expect(group.types).toContain("ENFJ");
    expect(group.types).toContain("ENFP");
  });

  it("관리형 그룹은 ISTJ, ISFJ, ESTJ, ESFJ를 포함해야 한다", () => {
    const group = MBTI_GROUPS.find((g) => g.label === "관리형")!;
    expect(group.types).toContain("ISTJ");
    expect(group.types).toContain("ISFJ");
    expect(group.types).toContain("ESTJ");
    expect(group.types).toContain("ESFJ");
  });

  it("탐험형 그룹은 ISTP, ISFP, ESTP, ESFP를 포함해야 한다", () => {
    const group = MBTI_GROUPS.find((g) => g.label === "탐험형")!;
    expect(group.types).toContain("ISTP");
    expect(group.types).toContain("ISFP");
    expect(group.types).toContain("ESTP");
    expect(group.types).toContain("ESFP");
  });
});
