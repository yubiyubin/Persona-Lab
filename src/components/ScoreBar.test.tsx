import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ScoreBar from "./ScoreBar";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => ({ get: vi.fn().mockReturnValue(null) }),
  usePathname: () => "/",
}));

describe("ScoreBar", () => {
  it("score만 전달(75) → 에러 없이 렌더", () => {
    const { container } = render(<ScoreBar score={75} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("emoji, label, score, comment 모두 전달 → 화면에 표시", () => {
    render(
      <ScoreBar
        score={75}
        emoji="💓"
        label="감정 교류"
        comment="잘 통하는 편이에요"
      />,
    );
    expect(screen.getByText(/감정 교류/)).toBeInTheDocument();
    expect(screen.getByText(/75%/)).toBeInTheDocument();
    expect(screen.getByText(/잘 통하는 편이에요/)).toBeInTheDocument();
  });

  it("score=0 → 에러 없이 렌더", () => {
    const { container } = render(<ScoreBar score={0} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("score=100 → 에러 없이 렌더", () => {
    const { container } = render(<ScoreBar score={100} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("emoji와 label이 없으면 라벨 행이 렌더되지 않음", () => {
    render(<ScoreBar score={50} />);
    // 점수 텍스트(50%)가 없어야 한다 — 라벨 모드에서만 점수 텍스트가 나타남
    expect(screen.queryByText(/50%/)).not.toBeInTheDocument();
  });

  it("comment 없으면 코멘트가 렌더되지 않음", () => {
    render(<ScoreBar score={50} emoji="💓" label="테스트" />);
    // comment 없으므로 <p> 코멘트 요소 없음
    expect(
      screen.queryByText("잘 통하는 편이에요"),
    ).not.toBeInTheDocument();
  });

  it("score=25 → 에러 없이 렌더", () => {
    const { container } = render(<ScoreBar score={25} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("score=50 → 에러 없이 렌더", () => {
    const { container } = render(<ScoreBar score={50} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("score=75 → 에러 없이 렌더", () => {
    const { container } = render(<ScoreBar score={75} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("게이지 바의 width 스타일이 score%로 설정된다", () => {
    const { container } = render(<ScoreBar score={60} />);
    const bar = container.querySelector(".gauge-bar");
    expect(bar).toBeTruthy();
    expect((bar as HTMLElement).style.width).toBe("60%");
  });

  it("score=0 → 게이지 바 width가 0%", () => {
    const { container } = render(<ScoreBar score={0} />);
    const bar = container.querySelector(".gauge-bar");
    expect((bar as HTMLElement).style.width).toBe("0%");
  });

  it("score=100 → 게이지 바 width가 100%", () => {
    const { container } = render(<ScoreBar score={100} />);
    const bar = container.querySelector(".gauge-bar");
    expect((bar as HTMLElement).style.width).toBe("100%");
  });

  it("animationDelay prop이 없어도 기본값(0.3s)으로 동작", () => {
    const { container } = render(<ScoreBar score={50} />);
    const bar = container.querySelector(".gauge-bar");
    expect((bar as HTMLElement).style.animationDelay).toBe("0.3s");
  });

  it("animationDelay=0.5 → 게이지 바 animationDelay가 0.5s", () => {
    const { container } = render(<ScoreBar score={50} animationDelay={0.5} />);
    const bar = container.querySelector(".gauge-bar");
    expect((bar as HTMLElement).style.animationDelay).toBe("0.5s");
  });

  it("emoji만 있고 label 없으면 라벨 행이 렌더되지 않음", () => {
    render(<ScoreBar score={50} emoji="💓" />);
    expect(screen.queryByText(/50%/)).not.toBeInTheDocument();
  });

  it("label만 있고 emoji 없으면 라벨 행이 렌더되지 않음", () => {
    render(<ScoreBar score={50} label="테스트" />);
    expect(screen.queryByText(/50%/)).not.toBeInTheDocument();
  });

  it("overrideHue prop 전달 시 에러 없이 렌더", () => {
    const { container } = render(<ScoreBar score={50} overrideHue={180} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("height prop 전달 시 에러 없이 렌더", () => {
    const { container } = render(<ScoreBar score={50} height="h-4" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("className prop 전달 시 적용됨", () => {
    const { container } = render(<ScoreBar score={50} className="my-custom-class" />);
    expect(container.firstChild).toHaveClass("my-custom-class");
  });
});
