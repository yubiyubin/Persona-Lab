/**
 * @file CoupleResult.test.tsx
 * @description CoupleResult 네비게이션 CTA 버튼 렌더링 테스트
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CoupleResult from "./CoupleResult";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
  useSearchParams: () => ({ get: vi.fn().mockReturnValue(null) }),
  usePathname: () => "/mbti-love",
}));

// Math.random 고정 → pool[0] 선택
vi.spyOn(Math, "random").mockReturnValue(0);

beforeEach(() => {
  pushMock.mockClear();
});

describe("CoupleResult — rank-cta 버튼", () => {
  it("partnerMbti가 있을 때 rank-cta 버튼이 렌더된다", () => {
    render(
      <CoupleResult
        myMbti="ENFP"
        partnerMbti="INTJ"
        onPartnerSelect={vi.fn()}
      />,
    );
    expect(screen.getByTestId("rank-cta")).toBeInTheDocument();
  });

  it("partnerMbti가 null일 때 rank-cta 버튼이 렌더되지 않는다", () => {
    render(
      <CoupleResult
        myMbti="ENFP"
        partnerMbti={null}
        onPartnerSelect={vi.fn()}
      />,
    );
    expect(screen.queryByTestId("rank-cta")).not.toBeInTheDocument();
  });
});
