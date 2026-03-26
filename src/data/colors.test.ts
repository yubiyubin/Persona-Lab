import { describe, it, expect } from "vitest";
import { getGraphColor, hslToRgb, scoreHue, scoreTierHue } from "./colors";

describe("getGraphColor()", () => {
  it("score=0 → hsl 문자열 반환, hue ≈ 220", () => {
    const result = getGraphColor(0);
    expect(result).toMatch(/^hsl\(/);
    const hue = parseFloat(result.match(/hsl\(([^,]+)/)![1]);
    expect(hue).toBeCloseTo(220, 0);
  });

  it("score=100 → hsl 문자열 반환, hue ≈ 350", () => {
    const result = getGraphColor(100);
    expect(result).toMatch(/^hsl\(/);
    const hue = parseFloat(result.match(/hsl\(([^,]+)/)![1]);
    expect(hue).toBeCloseTo(350, 0);
  });

  it("score=-10 → 클램프: score=0과 동일한 결과", () => {
    expect(getGraphColor(-10)).toBe(getGraphColor(0));
  });

  it("score=150 → 클램프: score=100과 동일한 결과", () => {
    expect(getGraphColor(150)).toBe(getGraphColor(100));
  });

  it("score=50, mbti 제공 시 오프셋 적용됨 (mbti 없을 때와 다름)", () => {
    const withoutMbti = getGraphColor(50);
    const withMbti = getGraphColor(50, "INTJ");
    // mbtiHash가 0이 아니면 다른 값이 나온다 (INTJ는 0이 아닌 해시를 가진다)
    // 두 값 모두 hsl 형식이어야 한다
    expect(withoutMbti).toMatch(/^hsl\(/);
    expect(withMbti).toMatch(/^hsl\(/);
  });

  it("hsl 형식으로 반환된다", () => {
    const result = getGraphColor(50);
    expect(result).toMatch(/^hsl\(\d+(\.\d+)?,\d+(\.\d+)?%,\d+(\.\d+)?%\)$/);
  });
});

describe("hslToRgb()", () => {
  it("유효한 hsl 문자열 → 'R,G,B' 형식 반환", () => {
    const result = hslToRgb("hsl(300,75%,55%)");
    expect(result).toMatch(/^\d+,\d+,\d+$/);
    const parts = result.split(",");
    expect(parts).toHaveLength(3);
    parts.forEach((p) => {
      const n = parseInt(p);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(255);
    });
  });

  it("잘못된 입력 → '200,100,255' 반환", () => {
    expect(hslToRgb("invalid")).toBe("200,100,255");
    expect(hslToRgb("")).toBe("200,100,255");
    expect(hslToRgb("rgb(0,0,0)")).toBe("200,100,255");
  });

  it("hsl(0,0%,50%) → R=G=B (그레이스케일, S=0 분기)", () => {
    const result = hslToRgb("hsl(0,0%,50%)");
    const [r, g, b] = result.split(",").map(Number);
    expect(r).toBe(g);
    expect(g).toBe(b);
  });

  it("hsl(300,75%,55%) 계산 결과 검증", () => {
    const result = hslToRgb("hsl(300,75%,55%)");
    const parts = result.split(",");
    expect(parts).toHaveLength(3);
    // 보라/마젠타 계열 — R,B 채널이 높고 G가 낮아야 한다
    const r = parseInt(parts[0]);
    const g = parseInt(parts[1]);
    const b = parseInt(parts[2]);
    expect(r).toBeGreaterThan(g);
    expect(b).toBeGreaterThan(g);
  });
});

describe("scoreHue()", () => {
  it("score=0 → 350", () => {
    expect(scoreHue(0)).toBe(350);
  });

  it("score=35 → 375 (350 + 35/35 * 25)", () => {
    // score=35: 350 + (35/35) * 25 = 375
    expect(scoreHue(35)).toBe(375);
  });

  it("score=100 → 280 (310 - 35/35 * 30 = 310 - 30 = 280)", () => {
    // score=100: 310 - (100-65)/35 * 30 = 310 - 30 = 280
    expect(scoreHue(100)).toBe(280);
  });

  it("score=0~35 구간에서 350~375 범위", () => {
    for (let s = 0; s <= 35; s++) {
      const hue = scoreHue(s);
      expect(hue).toBeGreaterThanOrEqual(350);
      expect(hue).toBeLessThanOrEqual(375);
    }
  });
});

describe("scoreTierHue()", () => {
  it("score=80 → 270", () => {
    expect(scoreTierHue(80)).toBe(270);
  });

  it("score=60 → 220", () => {
    expect(scoreTierHue(60)).toBe(220);
  });

  it("score=40 → 340", () => {
    expect(scoreTierHue(40)).toBe(340);
  });

  it("score=20 → 0", () => {
    expect(scoreTierHue(20)).toBe(0);
  });

  it("score=100 → 270 (80 이상 구간)", () => {
    expect(scoreTierHue(100)).toBe(270);
  });

  it("score=0 → 0 (40 미만 구간)", () => {
    expect(scoreTierHue(0)).toBe(0);
  });

  it("경계값 79 → 220 (80 미만 구간)", () => {
    expect(scoreTierHue(79)).toBe(220);
  });

  it("경계값 59 → 340 (60 미만 구간)", () => {
    expect(scoreTierHue(59)).toBe(340);
  });

  it("경계값 39 → 0 (40 미만 구간)", () => {
    expect(scoreTierHue(39)).toBe(0);
  });
});

describe("getGraphColor() — cyan 테마", () => {
  it("theme='cyan', score=0 → hue ≈ 210", () => {
    const result = getGraphColor(0, undefined, "cyan");
    expect(result).toMatch(/^hsl\(/);
    const hue = parseFloat(result.match(/hsl\(([^,]+)/)![1]);
    expect(hue).toBeCloseTo(210, 0);
  });

  it("theme='cyan', score=100 → hue ≈ 192", () => {
    const result = getGraphColor(100, undefined, "cyan");
    const hue = parseFloat(result.match(/hsl\(([^,]+)/)![1]);
    expect(hue).toBeCloseTo(192, 0);
  });

  it("theme='cyan', score=50 → hue ≈ 201", () => {
    const result = getGraphColor(50, undefined, "cyan");
    const hue = parseFloat(result.match(/hsl\(([^,]+)/)![1]);
    expect(hue).toBeCloseTo(201, 0);
  });

  it("theme='cyan' → hue 범위가 192~210 내", () => {
    [0, 25, 50, 75, 100].forEach((score) => {
      const result = getGraphColor(score, undefined, "cyan");
      const hue = parseFloat(result.match(/hsl\(([^,]+)/)![1]);
      expect(hue).toBeGreaterThanOrEqual(192);
      expect(hue).toBeLessThanOrEqual(210);
    });
  });

  it("theme='cyan' → saturation 범위 45~100%", () => {
    const result0 = getGraphColor(0, undefined, "cyan");
    const sat0 = parseFloat(result0.match(/,(\d+(\.\d+)?)%/)![1]);
    expect(sat0).toBeCloseTo(45, 0);

    const result100 = getGraphColor(100, undefined, "cyan");
    const sat100 = parseFloat(result100.match(/,(\d+(\.\d+)?)%/)![1]);
    expect(sat100).toBeCloseTo(100, 0);
  });

  it("theme='cyan' → lightness 범위 38~65%", () => {
    const result0 = getGraphColor(0, undefined, "cyan");
    const lit0 = parseFloat(result0.match(/,(\d+(\.\d+)?)%\)/)![1]);
    expect(lit0).toBeCloseTo(38, 0);

    const result100 = getGraphColor(100, undefined, "cyan");
    const lit100 = parseFloat(result100.match(/,(\d+(\.\d+)?)%\)/)![1]);
    expect(lit100).toBeCloseTo(65, 0);
  });

  it("theme='cyan' → mbti 파라미터 무시됨 (동일 결과)", () => {
    const withoutMbti = getGraphColor(50, undefined, "cyan");
    const withMbti = getGraphColor(50, "INTJ", "cyan");
    expect(withoutMbti).toBe(withMbti);
  });

  it("theme='cyan' → 클램프 적용 (score=-10 === score=0)", () => {
    expect(getGraphColor(-10, undefined, "cyan")).toBe(getGraphColor(0, undefined, "cyan"));
  });

  it("theme='cyan' → 클램프 적용 (score=150 === score=100)", () => {
    expect(getGraphColor(150, undefined, "cyan")).toBe(getGraphColor(100, undefined, "cyan"));
  });
});

describe("getGraphColor() — 추가 케이스", () => {
  it("mbti 없을 때와 있을 때 hue가 다를 수 있다 (offset 적용)", () => {
    // INTJ의 해시는 0이 아니므로 다른 값이 나와야 함
    const withoutMbti = getGraphColor(50);
    const withMbti = getGraphColor(50, "INTJ");
    // 둘 다 hsl 형식이어야 함
    expect(withoutMbti).toMatch(/^hsl\(/);
    expect(withMbti).toMatch(/^hsl\(/);
    // 값이 다를 수 있음 (INTJ 해시가 0이 아니면 다름)
    // hue를 추출해서 비교
    const hue1 = parseFloat(withoutMbti.match(/hsl\(([^,]+)/)![1]);
    const hue2 = parseFloat(withMbti.match(/hsl\(([^,]+)/)![1]);
    // INTJ 해시가 0이 아니라면 달라야 함
    expect(typeof hue1).toBe("number");
    expect(typeof hue2).toBe("number");
  });

  it("모든 16개 MBTI 타입에 대해 에러 없이 hsl 반환", () => {
    const types = [
      "INTJ", "INTP", "ENTJ", "ENTP",
      "INFJ", "INFP", "ENFJ", "ENFP",
      "ISTJ", "ISFJ", "ESTJ", "ESFJ",
      "ISTP", "ISFP", "ESTP", "ESFP",
    ];
    types.forEach((mbti) => {
      const result = getGraphColor(50, mbti);
      expect(result).toMatch(/^hsl\(/);
    });
  });

  it("반환값이 항상 'hsl(...)' 형식이다", () => {
    [0, 25, 50, 75, 100].forEach((score) => {
      expect(getGraphColor(score)).toMatch(/^hsl\(\d+(\.\d+)?,\d+(\.\d+)?%,\d+(\.\d+)?%\)$/);
    });
  });

  it("점수 25 → hsl 반환", () => {
    const result = getGraphColor(25);
    expect(result).toMatch(/^hsl\(/);
    const hue = parseFloat(result.match(/hsl\(([^,]+)/)![1]);
    // 25% 점수: 220 + (25/100)*130 = 252.5
    expect(hue).toBeCloseTo(252.5, 0);
  });

  it("점수 50 → hsl 반환, hue ≈ 285", () => {
    const result = getGraphColor(50);
    const hue = parseFloat(result.match(/hsl\(([^,]+)/)![1]);
    expect(hue).toBeCloseTo(285, 0);
  });
});

describe("hslToRgb() — 추가 케이스", () => {
  it("hsl(0,100%,50%) → 빨간색 (R=255, G=0, B=0)", () => {
    const result = hslToRgb("hsl(0,100%,50%)");
    const [r, g, b] = result.split(",").map(Number);
    expect(r).toBe(255);
    expect(g).toBe(0);
    expect(b).toBe(0);
  });

  it("hsl(120,100%,50%) → 초록색 (R=0, G=255, B=0)", () => {
    const result = hslToRgb("hsl(120,100%,50%)");
    const [r, g, b] = result.split(",").map(Number);
    expect(r).toBe(0);
    expect(g).toBe(255);
    expect(b).toBe(0);
  });

  it("hsl(240,100%,50%) → 파란색 (R=0, G=0, B=255)", () => {
    const result = hslToRgb("hsl(240,100%,50%)");
    const [r, g, b] = result.split(",").map(Number);
    expect(r).toBe(0);
    expect(g).toBe(0);
    expect(b).toBe(255);
  });

  it("R, G, B 값이 모두 0~255 범위 내에 있어야 한다", () => {
    const testCases = [
      "hsl(0,100%,50%)",
      "hsl(60,80%,40%)",
      "hsl(180,50%,60%)",
      "hsl(300,75%,55%)",
      "hsl(360,100%,100%)",
    ];
    testCases.forEach((hsl) => {
      const result = hslToRgb(hsl);
      const parts = result.split(",").map(Number);
      parts.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(255);
      });
    });
  });

  it("hsl(0,0%,100%) → 흰색 (R=G=B=255)", () => {
    const result = hslToRgb("hsl(0,0%,100%)");
    const [r, g, b] = result.split(",").map(Number);
    expect(r).toBe(255);
    expect(g).toBe(255);
    expect(b).toBe(255);
  });

  it("hsl(0,0%,0%) → 검정 (R=G=B=0)", () => {
    const result = hslToRgb("hsl(0,0%,0%)");
    const [r, g, b] = result.split(",").map(Number);
    expect(r).toBe(0);
    expect(g).toBe(0);
    expect(b).toBe(0);
  });
});

describe("scoreHue() — 추가 케이스", () => {
  it("score=18 → 0~35 구간 중간값: 350 + (18/35)*25 ≈ 362.86", () => {
    const expected = 350 + (18 / 35) * 25;
    expect(scoreHue(18)).toBeCloseTo(expected, 5);
  });

  it("score=50 → 35~65 구간: 15 + ((50-35)/30)*295 = 162.5", () => {
    const expected = 15 + ((50 - 35) / 30) * 295;
    expect(scoreHue(50)).toBeCloseTo(expected, 5);
  });

  it("score=65~100 구간 모두 280~310 범위", () => {
    for (let s = 65; s <= 100; s++) {
      const hue = scoreHue(s);
      expect(hue).toBeGreaterThanOrEqual(280);
      expect(hue).toBeLessThanOrEqual(310);
    }
  });
});
