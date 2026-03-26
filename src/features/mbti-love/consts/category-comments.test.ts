import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCategoryComment, CATEGORY_COMMENTS } from "./category-comments";

describe("getCategoryComment()", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  it("알 수 없는 label → 빈 문자열 반환", () => {
    expect(getCategoryComment("없는카테고리", 80)).toBe("");
  });

  it("score>=75 → comments[0] 배열 중 하나 반환 (최고 구간)", () => {
    expect(CATEGORY_COMMENTS["감정 교류"][0]).toContain(getCategoryComment("감정 교류", 75));
    expect(CATEGORY_COMMENTS["감정 교류"][0]).toContain(getCategoryComment("감정 교류", 100));
    expect(CATEGORY_COMMENTS["대화 궁합"][0]).toContain(getCategoryComment("대화 궁합", 80));
    expect(CATEGORY_COMMENTS["가치관"][0]).toContain(getCategoryComment("가치관", 90));
    expect(CATEGORY_COMMENTS["일상 호환"][0]).toContain(getCategoryComment("일상 호환", 75));
  });

  it("score>=55 → comments[1] 배열 중 하나 반환", () => {
    expect(CATEGORY_COMMENTS["감정 교류"][1]).toContain(getCategoryComment("감정 교류", 55));
    expect(CATEGORY_COMMENTS["감정 교류"][1]).toContain(getCategoryComment("감정 교류", 74));
    expect(CATEGORY_COMMENTS["대화 궁합"][1]).toContain(getCategoryComment("대화 궁합", 60));
  });

  it("score>=35 → comments[2] 배열 중 하나 반환", () => {
    expect(CATEGORY_COMMENTS["감정 교류"][2]).toContain(getCategoryComment("감정 교류", 35));
    expect(CATEGORY_COMMENTS["감정 교류"][2]).toContain(getCategoryComment("감정 교류", 54));
    expect(CATEGORY_COMMENTS["가치관"][2]).toContain(getCategoryComment("가치관", 40));
  });

  it("score<35 → comments[3] 배열 중 하나 반환 (최저 구간)", () => {
    expect(CATEGORY_COMMENTS["감정 교류"][3]).toContain(getCategoryComment("감정 교류", 34));
    expect(CATEGORY_COMMENTS["감정 교류"][3]).toContain(getCategoryComment("감정 교류", 0));
    expect(CATEGORY_COMMENTS["일상 호환"][3]).toContain(getCategoryComment("일상 호환", 10));
  });

  it("4개 카테고리 모두 score=0에서 정상 동작", () => {
    const labels = ["감정 교류", "대화 궁합", "가치관", "일상 호환"];
    labels.forEach((label) => {
      const result = getCategoryComment(label, 0);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe("CATEGORY_COMMENTS 구조 검증", () => {
  it("4개 카테고리 키가 모두 존재해야 한다", () => {
    const keys = Object.keys(CATEGORY_COMMENTS);
    expect(keys).toContain("감정 교류");
    expect(keys).toContain("대화 궁합");
    expect(keys).toContain("가치관");
    expect(keys).toContain("일상 호환");
  });

  it("각 카테고리에 4단계가 있어야 한다", () => {
    Object.values(CATEGORY_COMMENTS).forEach((tiers) => {
      expect(tiers).toHaveLength(4);
    });
  });

  it("각 단계에 3개 이상의 코멘트가 있어야 한다", () => {
    Object.values(CATEGORY_COMMENTS).forEach((tiers) => {
      tiers.forEach((comments) => {
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it("모든 코멘트가 비어있지 않아야 한다", () => {
    Object.values(CATEGORY_COMMENTS).forEach((tiers) => {
      tiers.forEach((comments) => {
        comments.forEach((comment) => {
          expect(typeof comment).toBe("string");
          expect(comment.length).toBeGreaterThan(0);
        });
      });
    });
  });

  it("감정 교류 첫 번째 단계에 '눈빛만 봐도' 포함 코멘트 존재", () => {
    expect(CATEGORY_COMMENTS["감정 교류"][0].some((c) => c.includes("눈빛만 봐도"))).toBe(true);
  });

  it("대화 궁합 첫 번째 단계에 '대화' 포함 코멘트 존재", () => {
    expect(CATEGORY_COMMENTS["대화 궁합"][0].some((c) => c.includes("대화"))).toBe(true);
  });

  it("가치관 첫 번째 단계에 '인생관' 포함 코멘트 존재", () => {
    expect(CATEGORY_COMMENTS["가치관"][0].some((c) => c.includes("인생관"))).toBe(true);
  });

  it("일상 호환 첫 번째 단계에 '스트레스' 포함 코멘트 존재", () => {
    expect(CATEGORY_COMMENTS["일상 호환"][0].some((c) => c.includes("스트레스"))).toBe(true);
  });
});

describe("getCategoryComment() — 경계값 추가 케이스", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  it("score=75 정확히 경계에서 comments[0] 배열 중 하나 반환", () => {
    const labels = ["감정 교류", "대화 궁합", "가치관", "일상 호환"];
    labels.forEach((label) => {
      expect(CATEGORY_COMMENTS[label][0]).toContain(getCategoryComment(label, 75));
    });
  });

  it("score=74 → comments[1] 배열 중 하나 (75 미만)", () => {
    const labels = ["감정 교류", "대화 궁합", "가치관", "일상 호환"];
    labels.forEach((label) => {
      expect(CATEGORY_COMMENTS[label][1]).toContain(getCategoryComment(label, 74));
    });
  });

  it("score=55 정확히 경계에서 comments[1] 배열 중 하나 반환", () => {
    const labels = ["감정 교류", "대화 궁합", "가치관", "일상 호환"];
    labels.forEach((label) => {
      expect(CATEGORY_COMMENTS[label][1]).toContain(getCategoryComment(label, 55));
    });
  });

  it("score=54 → comments[2] 배열 중 하나 (55 미만)", () => {
    const labels = ["감정 교류", "대화 궁합", "가치관", "일상 호환"];
    labels.forEach((label) => {
      expect(CATEGORY_COMMENTS[label][2]).toContain(getCategoryComment(label, 54));
    });
  });

  it("score=35 정확히 경계에서 comments[2] 배열 중 하나 반환", () => {
    const labels = ["감정 교류", "대화 궁합", "가치관", "일상 호환"];
    labels.forEach((label) => {
      expect(CATEGORY_COMMENTS[label][2]).toContain(getCategoryComment(label, 35));
    });
  });

  it("score=34 → comments[3] 배열 중 하나 (35 미만)", () => {
    const labels = ["감정 교류", "대화 궁합", "가치관", "일상 호환"];
    labels.forEach((label) => {
      expect(CATEGORY_COMMENTS[label][3]).toContain(getCategoryComment(label, 34));
    });
  });

  it("score=100 → comments[0] 배열 중 하나", () => {
    const labels = ["감정 교류", "대화 궁합", "가치관", "일상 호환"];
    labels.forEach((label) => {
      expect(CATEGORY_COMMENTS[label][0]).toContain(getCategoryComment(label, 100));
    });
  });
});

describe("캐시 동작", () => {
  it("같은 (label, score) 두 번 호출 → 동일 결과 반환", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const first = getCategoryComment("감정 교류", 80);
    vi.spyOn(Math, "random").mockReturnValue(0.9);
    const second = getCategoryComment("감정 교류", 80);
    expect(first).toBe(second);
  });
});
