import { describe, it, expect, vi, beforeEach } from "vitest";
import { getScoreInfo, getCoupleTier, getLoveFriendLine, SCORE_META, COUPLE_TIERS } from "./labels";

// labels.ts는 모듈 레벨 캐시를 사용하므로
// 각 describe 블록에서 Math.random을 mock하여 결정론적으로 테스트한다.

describe("getScoreInfo()", () => {
  beforeEach(() => {
    // Math.random을 0으로 고정하여 labels[0]이 선택되도록 한다
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  it("score=95 → emoji '🏆'", () => {
    const result = getScoreInfo(95);
    expect(result.emoji).toBe("🏆");
  });

  it("score=100 → emoji '🏆' (95 이상 구간)", () => {
    const result = getScoreInfo(100);
    expect(result.emoji).toBe("🏆");
  });

  it("score=0 → emoji '💀'", () => {
    const result = getScoreInfo(0);
    expect(result.emoji).toBe("💀");
  });

  it("score=88 → emoji '🔥' (88~94 구간)", () => {
    const result = getScoreInfo(88);
    expect(result.emoji).toBe("🔥");
  });

  it("score=80 → emoji '✨' (80~87 구간)", () => {
    const result = getScoreInfo(80);
    expect(result.emoji).toBe("✨");
  });

  it("결과 객체에 emoji와 label 프로퍼티가 있어야 한다", () => {
    const result = getScoreInfo(75);
    expect(result).toHaveProperty("emoji");
    expect(result).toHaveProperty("label");
    expect(typeof result.emoji).toBe("string");
    expect(typeof result.label).toBe("string");
  });
});

describe("getCoupleTier()", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  it("score=90 → emoji '💘'", () => {
    const result = getCoupleTier(90);
    expect(result.emoji).toBe("💘");
  });

  it("score=75 → emoji '💕'", () => {
    const result = getCoupleTier(75);
    expect(result.emoji).toBe("💕");
  });

  it("score=0 → emoji '💀'", () => {
    const result = getCoupleTier(0);
    expect(result.emoji).toBe("💀");
  });

  it("score=60 → emoji '💗' (60~74 구간)", () => {
    const result = getCoupleTier(60);
    expect(result.emoji).toBe("💗");
  });

  it("score=45 → emoji '🫠' (45~59 구간)", () => {
    const result = getCoupleTier(45);
    expect(result.emoji).toBe("🫠");
  });

  it("score=30 → emoji '🧊' (30~44 구간)", () => {
    const result = getCoupleTier(30);
    expect(result.emoji).toBe("🧊");
  });
});

describe("getLoveFriendLine()", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  it("score=90 → '연애는 운명급' 포함", () => {
    const result = getLoveFriendLine(90);
    expect(result).toContain("연애는 운명급");
  });

  it("score=0 → '연애도 친구도' 포함", () => {
    const result = getLoveFriendLine(0);
    expect(result).toContain("연애도 친구도");
  });

  it("score=75 → '연애도 좋고' 포함", () => {
    const result = getLoveFriendLine(75);
    expect(result).toContain("연애도 좋고");
  });

  it("score=60 → '연애는 노력하면' 포함", () => {
    const result = getLoveFriendLine(60);
    expect(result).toContain("연애는 노력하면");
  });

  it("score=45 → '연애는 노력 필요' 포함", () => {
    const result = getLoveFriendLine(45);
    expect(result).toContain("연애는 노력 필요");
  });

  it("score=30 → '연애는 험난' 포함", () => {
    const result = getLoveFriendLine(30);
    expect(result).toContain("연애는 험난");
  });

  it("문자열을 반환해야 한다", () => {
    expect(typeof getLoveFriendLine(50)).toBe("string");
    expect(getLoveFriendLine(50).length).toBeGreaterThan(0);
  });
});

describe("캐시 동작", () => {
  it("같은 점수 두 번 호출 → 동일 결과 반환", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const first = getScoreInfo(77);
    // Math.random을 바꿔도 캐시 덕분에 동일 결과가 나와야 한다
    vi.spyOn(Math, "random").mockReturnValue(0.9);
    const second = getScoreInfo(77);
    expect(first.emoji).toBe(second.emoji);
    expect(first.label).toBe(second.label);
  });

  it("getLoveFriendLine — 같은 점수 두 번 호출 → 동일 결과", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const first = getLoveFriendLine(82);
    vi.spyOn(Math, "random").mockReturnValue(0.9);
    const second = getLoveFriendLine(82);
    expect(first).toBe(second);
  });
});

describe("SCORE_META 구조 검증", () => {
  it("11개 구간이 존재해야 한다", () => {
    expect(SCORE_META).toHaveLength(11);
  });

  it("각 구간에 min, emoji, labels가 있어야 한다", () => {
    SCORE_META.forEach((entry) => {
      expect(entry).toHaveProperty("min");
      expect(entry).toHaveProperty("emoji");
      expect(entry).toHaveProperty("labels");
      expect(typeof entry.min).toBe("number");
      expect(typeof entry.emoji).toBe("string");
      expect(Array.isArray(entry.labels)).toBe(true);
      expect(entry.labels.length).toBeGreaterThanOrEqual(10);
    });
  });

  it("첫 번째 구간의 min이 95여야 한다", () => {
    expect(SCORE_META[0].min).toBe(95);
  });

  it("마지막 구간의 min이 0이어야 한다", () => {
    expect(SCORE_META[SCORE_META.length - 1].min).toBe(0);
  });

  it("score=95 → emoji '🏆'", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getScoreInfo(95).emoji).toBe("🏆");
  });

  it("score=88 → emoji '🔥'", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getScoreInfo(88).emoji).toBe("🔥");
  });

  it("score=80 → emoji '✨'", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getScoreInfo(80).emoji).toBe("✨");
  });

  it("score=73 → emoji '💫'", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getScoreInfo(73).emoji).toBe("💫");
  });

  it("score=65 → emoji '🎯'", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getScoreInfo(65).emoji).toBe("🎯");
  });

  it("score=58 → emoji '🌿'", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getScoreInfo(58).emoji).toBe("🌿");
  });

  it("score=50 → emoji '🤝'", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getScoreInfo(50).emoji).toBe("🤝");
  });

  it("score=42 → emoji '🌧️'", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getScoreInfo(42).emoji).toBe("🌧️");
  });

  it("score=35 → emoji '⚠️'", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getScoreInfo(35).emoji).toBe("⚠️");
  });

  it("score=25 → emoji '🌊'", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getScoreInfo(25).emoji).toBe("🌊");
  });

  it("score=0 → emoji '💀'", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getScoreInfo(0).emoji).toBe("💀");
  });

  it("score=94 → emoji '🔥' (95 미만)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getScoreInfo(94).emoji).toBe("🔥");
  });

  it("score=87 → emoji '✨' (88 미만)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getScoreInfo(87).emoji).toBe("✨");
  });
});

describe("COUPLE_TIERS 구조 검증", () => {
  it("6개 구간이 존재해야 한다", () => {
    expect(COUPLE_TIERS).toHaveLength(6);
  });

  it("각 구간에 min, emoji, labels가 있어야 한다", () => {
    COUPLE_TIERS.forEach((entry) => {
      expect(entry).toHaveProperty("min");
      expect(entry).toHaveProperty("emoji");
      expect(entry).toHaveProperty("labels");
      expect(Array.isArray(entry.labels)).toBe(true);
      expect(entry.labels.length).toBeGreaterThanOrEqual(8);
    });
  });

  it("score=89 → emoji '💕' (90 미만)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getCoupleTier(89).emoji).toBe("💕");
  });

  it("score=74 → emoji '💗' (75 미만)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getCoupleTier(74).emoji).toBe("💗");
  });

  it("score=59 → emoji '🫠' (60 미만)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getCoupleTier(59).emoji).toBe("🫠");
  });

  it("score=44 → emoji '🧊' (45 미만)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getCoupleTier(44).emoji).toBe("🧊");
  });

  it("score=29 → emoji '💀' (30 미만)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getCoupleTier(29).emoji).toBe("💀");
  });

  it("getCoupleTier 반환값에 emoji와 label 필드가 있어야 한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = getCoupleTier(50);
    expect(result).toHaveProperty("emoji");
    expect(result).toHaveProperty("label");
    expect(typeof result.emoji).toBe("string");
    expect(typeof result.label).toBe("string");
  });
});

describe("getLoveFriendLine() 추가 경계값", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  it("score=89 → '연애도 좋고' 포함", () => {
    expect(getLoveFriendLine(89)).toContain("연애도 좋고");
  });

  it("score=74 → '연애는 노력하면' 포함", () => {
    expect(getLoveFriendLine(74)).toContain("연애는 노력하면");
  });

  it("score=59 → '연애는 노력 필요' 포함", () => {
    expect(getLoveFriendLine(59)).toContain("연애는 노력 필요");
  });

  it("score=44 → '연애는 험난' 포함", () => {
    expect(getLoveFriendLine(44)).toContain("연애는 험난");
  });

  it("score=29 → '연애도 친구도' 포함", () => {
    expect(getLoveFriendLine(29)).toContain("연애도 친구도");
  });

  it("score=1 → '연애도 친구도' 포함 (최저 구간)", () => {
    expect(getLoveFriendLine(1)).toContain("연애도 친구도");
  });

  it("비어있지 않은 문자열을 반환해야 한다 (0~100 전체)", () => {
    [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].forEach((score) => {
      const result = getLoveFriendLine(score);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
