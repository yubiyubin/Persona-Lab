/**
 * @file DetailScoreCard.test.tsx
 * @description DetailScoreCard 컴포넌트 테스트
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DetailScoreCard, { type CategoryItem } from "./DetailScoreCard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => ({ get: vi.fn().mockReturnValue(null) }),
  usePathname: () => "/",
}));

const SAMPLE_CATEGORIES: CategoryItem[] = [
  { label: "감정 교류", emoji: "💓", score: 75, comment: "눈빛만 봐도 통하는 사이 ✨" },
  { label: "대화 궁합", emoji: "💬", score: 80, comment: "대화하다 밤새는 조합 🌙" },
  { label: "가치관", emoji: "🌙", score: 65, comment: "큰 틀에선 방향이 비슷함 🧭" },
  { label: "일상 호환", emoji: "☀️", score: 70, comment: "생활 리듬 꽤 맞는 편 ☕" },
];

describe("DetailScoreCard — categories 모드", () => {
  it("에러 없이 렌더된다", () => {
    const { container } = render(<DetailScoreCard categories={SAMPLE_CATEGORIES} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("4개 카테고리 라벨이 모두 표시된다", () => {
    render(<DetailScoreCard categories={SAMPLE_CATEGORIES} />);
    expect(screen.getByText(/감정 교류/)).toBeInTheDocument();
    expect(screen.getByText(/대화 궁합/)).toBeInTheDocument();
    expect(screen.getByText(/가치관/)).toBeInTheDocument();
    expect(screen.getByText(/일상 호환/)).toBeInTheDocument();
  });

  it("각 카테고리의 점수 퍼센트가 표시된다", () => {
    render(<DetailScoreCard categories={SAMPLE_CATEGORIES} />);
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("65%")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  it("각 카테고리의 코멘트가 표시된다", () => {
    render(<DetailScoreCard categories={SAMPLE_CATEGORIES} />);
    expect(screen.getByText(/눈빛만 봐도/)).toBeInTheDocument();
    expect(screen.getByText(/대화하다 밤새는/)).toBeInTheDocument();
  });

  it("기본 타이틀 '💞 세부 궁합'이 표시된다", () => {
    render(<DetailScoreCard categories={SAMPLE_CATEGORIES} />);
    expect(screen.getByText("💞 세부 궁합")).toBeInTheDocument();
  });

  it("커스텀 타이틀 전달 시 표시된다", () => {
    render(<DetailScoreCard categories={SAMPLE_CATEGORIES} title="🎯 커스텀 타이틀" />);
    expect(screen.getByText("🎯 커스텀 타이틀")).toBeInTheDocument();
  });

  it("score=0인 카테고리도 에러 없이 렌더", () => {
    const zeroCategories: CategoryItem[] = [
      { label: "감정 교류", emoji: "💓", score: 0, comment: "감정은 각자 알아서 처리 중 🧊" },
    ];
    const { container } = render(<DetailScoreCard categories={zeroCategories} />);
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("score=100인 카테고리도 에러 없이 렌더", () => {
    const maxCategories: CategoryItem[] = [
      { label: "대화 궁합", emoji: "💬", score: 100, comment: "대화하다 밤새는 조합 🌙" },
    ];
    render(<DetailScoreCard categories={maxCategories} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("themeRgb prop 전달 시 에러 없이 렌더", () => {
    const { container } = render(
      <DetailScoreCard categories={SAMPLE_CATEGORIES} themeRgb="168,85,247" />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});

describe("DetailScoreCard — children 모드", () => {
  it("categories 없이 children 전달 시 렌더된다", () => {
    render(
      <DetailScoreCard>
        <div data-testid="custom-content">커스텀 콘텐츠</div>
      </DetailScoreCard>,
    );
    expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    expect(screen.getByText("커스텀 콘텐츠")).toBeInTheDocument();
  });

  it("children 모드에서도 타이틀이 표시된다", () => {
    render(
      <DetailScoreCard>
        <span>내용</span>
      </DetailScoreCard>,
    );
    expect(screen.getByText("💞 세부 궁합")).toBeInTheDocument();
  });
});
