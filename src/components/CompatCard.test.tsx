/**
 * @file CompatCard.test.tsx
 * @description CompatCard 컴포넌트 테스트
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CompatCard from "./CompatCard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => ({ get: vi.fn().mockReturnValue(null) }),
  usePathname: () => "/",
}));

// getScoreInfo는 Math.random에 의존하므로 mock으로 고정
vi.spyOn(Math, "random").mockReturnValue(0);

describe("CompatCard — variant='best'", () => {
  it("에러 없이 렌더된다", () => {
    const { container } = render(<CompatCard score={90} variant="best" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("점수(90%)가 화면에 표시된다", () => {
    render(<CompatCard score={90} variant="best" />);
    expect(screen.getByText("90%")).toBeInTheDocument();
  });

  it("'최고의 궁합' 타이틀이 표시된다", () => {
    render(<CompatCard score={90} variant="best" />);
    expect(screen.getByText("최고의 궁합")).toBeInTheDocument();
  });

  it("children이 렌더된다", () => {
    render(
      <CompatCard score={80} variant="best">
        <span data-testid="child-content">INTJ</span>
      </CompatCard>,
    );
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("INTJ")).toBeInTheDocument();
  });

  it("score=0 → 에러 없이 렌더", () => {
    const { container } = render(<CompatCard score={0} variant="best" />);
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("score=100 → 에러 없이 렌더", () => {
    const { container } = render(<CompatCard score={100} variant="best" />);
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("onClick이 있을 때 클릭하면 콜백이 호출된다", () => {
    const onClick = vi.fn();
    render(<CompatCard score={70} variant="best" onClick={onClick} />);
    // 카드 자체를 클릭 (container.firstChild)
    const { container } = render(<CompatCard score={70} variant="best" onClick={onClick} />);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClick).toHaveBeenCalled();
  });

  it("compact=true → 에러 없이 렌더", () => {
    const { container } = render(<CompatCard score={80} variant="best" compact />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe("CompatCard — variant='worst'", () => {
  it("에러 없이 렌더된다", () => {
    const { container } = render(<CompatCard score={10} variant="worst" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("점수(10%)가 화면에 표시된다", () => {
    render(<CompatCard score={10} variant="worst" />);
    expect(screen.getByText("10%")).toBeInTheDocument();
  });

  it("'최악의 궁합' 타이틀이 표시된다", () => {
    render(<CompatCard score={10} variant="worst" />);
    expect(screen.getByText("최악의 궁합")).toBeInTheDocument();
  });

  it("score=0 → '최악의 궁합' 타이틀과 0% 표시", () => {
    render(<CompatCard score={0} variant="worst" />);
    expect(screen.getByText("최악의 궁합")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("compact=false (기본) → 에러 없이 렌더", () => {
    const { container } = render(<CompatCard score={50} variant="worst" compact={false} />);
    expect(container.firstChild).toBeTruthy();
  });
});
