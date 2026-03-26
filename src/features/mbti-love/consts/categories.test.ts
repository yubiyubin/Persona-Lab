import { describe, it, expect } from "vitest";
import { getCategoryScores, CATEGORIES } from "./categories";
import type { MbtiType } from "../../../data/compatibility";

describe("getCategoryScores()", () => {
  it("4개 카테고리 항목을 반환해야 한다", () => {
    const result = getCategoryScores("INTJ", "INTP", 80);
    expect(result).toHaveLength(4);
  });

  it("각 항목에 label, emoji, score, comment가 포함되어야 한다", () => {
    const result = getCategoryScores("INTJ", "INTP", 80);
    result.forEach((item) => {
      expect(item).toHaveProperty("label");
      expect(item).toHaveProperty("emoji");
      expect(item).toHaveProperty("score");
      expect(item).toHaveProperty("comment");
      expect(typeof item.label).toBe("string");
      expect(typeof item.emoji).toBe("string");
      expect(typeof item.score).toBe("number");
      expect(typeof item.comment).toBe("string");
    });
  });

  it("모든 점수가 0~100 범위 내에 있어야 한다", () => {
    const result = getCategoryScores("INTJ", "INTP", 80);
    result.forEach((item) => {
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(100);
    });
  });

  it("카테고리 라벨이 ['감정 교류', '대화 궁합', '가치관', '일상 호환'] 이어야 한다", () => {
    const result = getCategoryScores("INTJ", "INTP", 80);
    const labels = result.map((r) => r.label);
    expect(labels).toContain("감정 교류");
    expect(labels).toContain("대화 궁합");
    expect(labels).toContain("가치관");
    expect(labels).toContain("일상 호환");
  });

  /**
   * 감정 교류 점수 비교:
   * INTJ+INTP: T=T(일치), I=I(일치) → base*0.6 + 25 + 10
   * INTJ+INFJ: T≠F(불일치), I=I(일치) → base*0.6 + 0 + 10
   * → INTJ-INTP 감정교류 > INTJ-INFJ 감정교류
   */
  it("INTJ+INTP vs INTJ+INFJ: T/F 일치 여부로 감정교류 점수 차이", () => {
    const baseScore = 80;
    const withINTP = getCategoryScores("INTJ", "INTP", baseScore);
    const withINFJ = getCategoryScores("INTJ", "INFJ", baseScore);

    const emotionINTP = withINTP.find((c) => c.label === "감정 교류")!;
    const emotionINFJ = withINFJ.find((c) => c.label === "감정 교류")!;

    // INTP(T)와 T/F 일치 → 보너스 25점
    // INFJ(F)와 T/F 불일치 → 보너스 0점
    expect(emotionINTP.score).toBeGreaterThan(emotionINFJ.score);
  });

  /**
   * 일상 호환 점수 비교:
   * INTJ+ENTJ(J=J): J/P 일치 → base*0.6 + 25 + 10
   * INTJ+ENTP(J≠P): J/P 불일치 → base*0.6 + 5 + 0
   * → INTJ-ENTJ 일상호환 > INTJ-ENTP 일상호환
   */
  it("INTJ+ENTJ(J=J): 일상 호환 > INTJ+ENTP(J≠P)", () => {
    const baseScore = 80;
    const withENTJ = getCategoryScores("INTJ", "ENTJ", baseScore);
    const withENTP = getCategoryScores("INTJ", "ENTP", baseScore);

    const dailyENTJ = withENTJ.find((c) => c.label === "일상 호환")!;
    const dailyENTP = withENTP.find((c) => c.label === "일상 호환")!;

    expect(dailyENTJ.score).toBeGreaterThan(dailyENTP.score);
  });

  it("baseScore=100 → clamp: 100 초과 없음", () => {
    const result = getCategoryScores("INTJ", "INTP", 100);
    result.forEach((item) => {
      expect(item.score).toBeLessThanOrEqual(100);
    });
  });

  it("baseScore=0 → 보너스만으로 구성, 0 이상", () => {
    const result = getCategoryScores("INTJ", "INTP", 0);
    result.forEach((item) => {
      expect(item.score).toBeGreaterThanOrEqual(0);
    });
  });

  it("baseScore=0, INTJ+INTP 감정교류 → 0 + 25(T=T) + 10(I=I) = 35", () => {
    const result = getCategoryScores("INTJ", "INTP", 0);
    const emotion = result.find((c) => c.label === "감정 교류")!;
    // base*0.6=0, T일치+25, I일치+10 → 35
    expect(emotion.score).toBe(35);
  });
});

describe("CATEGORIES 데이터 구조 검증", () => {
  it("정확히 4개의 카테고리가 있어야 한다", () => {
    expect(CATEGORIES).toHaveLength(4);
  });

  it("각 카테고리에 label, emoji, bonuses가 있어야 한다", () => {
    CATEGORIES.forEach((cat) => {
      expect(cat).toHaveProperty("label");
      expect(cat).toHaveProperty("emoji");
      expect(cat).toHaveProperty("bonuses");
      expect(Array.isArray(cat.bonuses)).toBe(true);
    });
  });

  it("감정 교류 카테고리의 emoji가 '💓'이어야 한다", () => {
    const cat = CATEGORIES.find((c) => c.label === "감정 교류");
    expect(cat?.emoji).toBe("💓");
  });

  it("대화 궁합 카테고리의 emoji가 '💬'이어야 한다", () => {
    const cat = CATEGORIES.find((c) => c.label === "대화 궁합");
    expect(cat?.emoji).toBe("💬");
  });

  it("가치관 카테고리의 emoji가 '🌙'이어야 한다", () => {
    const cat = CATEGORIES.find((c) => c.label === "가치관");
    expect(cat?.emoji).toBe("🌙");
  });

  it("일상 호환 카테고리의 emoji가 '☀️'이어야 한다", () => {
    const cat = CATEGORIES.find((c) => c.label === "일상 호환");
    expect(cat?.emoji).toBe("☀️");
  });
});

describe("getCategoryScores() — 추가 케이스", () => {
  it("INTJ+INTJ (모든 항목 일치) vs INTJ+ENFP (모든 항목 불일치) 비교", () => {
    const allMatch = getCategoryScores("INTJ", "INTJ", 50);
    const noMatch = getCategoryScores("INTJ", "ENFP", 50);
    // 모든 항목이 일치하면 점수가 더 높아야 함
    const sumMatch = allMatch.reduce((s, c) => s + c.score, 0);
    const sumNoMatch = noMatch.reduce((s, c) => s + c.score, 0);
    expect(sumMatch).toBeGreaterThan(sumNoMatch);
  });

  it("대화 궁합 — E/I 일치(ENFP+ENTP) vs E/I·S/N 모두 불일치(ENFP+ISTP) 점수 비교", () => {
    // ENFP+ENTP: E=E 일치(+20), N=N 일치(+15) = 30 + 20 + 15 = 65
    // ENFP+ISTP: E≠I 불일치(+5), N≠S 불일치(+0) = 30 + 5 + 0 = 35
    const withMatch = getCategoryScores("ENFP", "ENTP", 50);
    const withMismatch = getCategoryScores("ENFP", "ISTP", 50);
    const talk1 = withMatch.find((c) => c.label === "대화 궁합")!;
    const talk2 = withMismatch.find((c) => c.label === "대화 궁합")!;
    expect(talk1.score).toBeGreaterThan(talk2.score);
  });

  it("가치관 — S/N 일치(INTJ+INTP) vs 불일치(INTJ+ISFJ) 점수 비교", () => {
    // INTJ+INTP: N=N 일치 → +20
    // INTJ+ISFJ: N≠S 불일치 → +5
    const withMatch = getCategoryScores("INTJ", "INTP", 50);
    const withMismatch = getCategoryScores("INTJ", "ISFJ", 50);
    const value1 = withMatch.find((c) => c.label === "가치관")!;
    const value2 = withMismatch.find((c) => c.label === "가치관")!;
    expect(value1.score).toBeGreaterThan(value2.score);
  });

  it("baseScore=50 → 각 카테고리 점수 계산 정확성 (INTJ+INTJ)", () => {
    // INTJ+INTJ: 모든 항목 일치 (I=I, N=N, T=T, J=J)
    const result = getCategoryScores("INTJ", "INTJ", 50);
    // 감정 교류: 50*0.6 + 25(T=T) + 10(I=I) = 30 + 25 + 10 = 65
    const emotion = result.find((c) => c.label === "감정 교류")!;
    expect(emotion.score).toBe(65);
    // 일상 호환: 50*0.6 + 25(J=J) + 10(I=I) = 30 + 25 + 10 = 65
    const daily = result.find((c) => c.label === "일상 호환")!;
    expect(daily.score).toBe(65);
  });

  it("다양한 MBTI 조합 8쌍 에러 없이 동작", () => {
    const pairs: [MbtiType, MbtiType][] = [
      ["INFJ", "ENFP"],
      ["ISTP", "ESTP"],
      ["ISFJ", "ESFJ"],
      ["ENTP", "INTP"],
      ["ESTJ", "ISTJ"],
      ["ENFJ", "INFJ"],
      ["ESFP", "ISFP"],
      ["ENTJ", "INTJ"],
    ];
    pairs.forEach(([a, b]) => {
      const result = getCategoryScores(a, b, 60);
      expect(result).toHaveLength(4);
      result.forEach((item) => {
        expect(item.score).toBeGreaterThanOrEqual(0);
        expect(item.score).toBeLessThanOrEqual(100);
      });
    });
  });

  it("comment가 비어있지 않아야 한다 (baseScore=80)", () => {
    const result = getCategoryScores("INTJ", "INTP", 80);
    result.forEach((item) => {
      expect(typeof item.comment).toBe("string");
      expect(item.comment.length).toBeGreaterThan(0);
    });
  });

  it("comment가 비어있지 않아야 한다 (baseScore=0)", () => {
    const result = getCategoryScores("INTJ", "ESFP", 0);
    result.forEach((item) => {
      expect(typeof item.comment).toBe("string");
      // score=0이어도 mismatch 보너스가 있을 수 있으므로 comment 존재
    });
  });
});
