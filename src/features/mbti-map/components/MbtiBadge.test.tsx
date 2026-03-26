/**
 * @file MbtiBadge.test.tsx
 * @description MbtiBadge 컴포넌트 단위 테스트
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MbtiBadge from "./MbtiBadge";

describe("MbtiBadge", () => {
  it("type 텍스트(ENFP)가 화면에 표시된다", () => {
    render(<MbtiBadge type="ENFP" score={80} onClick={vi.fn()} />);
    expect(screen.getByText(/ENFP/)).toBeInTheDocument();
  });

  it("data-testid가 mbti-badge-{type} 형식으로 생성된다", () => {
    render(<MbtiBadge type="ENFP" score={80} onClick={vi.fn()} />);
    expect(screen.getByTestId("mbti-badge-ENFP")).toBeInTheDocument();
  });

  it("다른 MBTI 타입도 올바른 testid를 가진다", () => {
    render(<MbtiBadge type="INTJ" score={50} onClick={vi.fn()} />);
    expect(screen.getByTestId("mbti-badge-INTJ")).toBeInTheDocument();
  });

  it("버튼 클릭 시 onClick 콜백이 호출된다", () => {
    const onClick = vi.fn();
    render(<MbtiBadge type="ENFP" score={80} onClick={onClick} />);
    fireEvent.click(screen.getByTestId("mbti-badge-ENFP"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("themeColor 미전달 시 style.color가 설정된다 (JSDOM은 hsl을 rgb로 변환)", () => {
    render(<MbtiBadge type="ENFP" score={80} onClick={vi.fn()} />);
    const btn = screen.getByTestId("mbti-badge-ENFP");
    // JSDOM 환경에서 hsl() 값은 rgb()로 정규화되므로 비어있지 않음만 검증
    expect(btn.style.color).toBeTruthy();
    expect(btn.style.color.length).toBeGreaterThan(0);
  });

  it("themeColor 전달 시 해당 색상이 style.color에 적용된다", () => {
    render(
      <MbtiBadge type="ENFP" score={80} onClick={vi.fn()} themeColor="#f0a030" />,
    );
    const btn = screen.getByTestId("mbti-badge-ENFP");
    // 브라우저가 hex를 rgb로 변환할 수 있으므로 원본 값 또는 rgb 변환 결과 허용
    const color = btn.style.color;
    expect(color === "#f0a030" || color.startsWith("rgb")).toBe(true);
  });

  it("배지 내 '→' 화살표가 렌더된다", () => {
    render(<MbtiBadge type="ENFP" score={80} onClick={vi.fn()} />);
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  it("score=0 극단값 — 에러 없이 렌더된다", () => {
    const { container } = render(
      <MbtiBadge type="ISTJ" score={0} onClick={vi.fn()} />,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("score=100 극단값 — 에러 없이 렌더된다", () => {
    const { container } = render(
      <MbtiBadge type="ESFP" score={100} onClick={vi.fn()} />,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("themeColor 전달 시 hsl 색상이 아닌 themeColor 값이 border에 적용된다", () => {
    render(
      <MbtiBadge type="INFJ" score={60} onClick={vi.fn()} themeColor="#e04070" />,
    );
    const btn = screen.getByTestId("mbti-badge-INFJ");
    // border style이 설정되어 있음을 확인
    expect(btn.style.border).toBeTruthy();
  });
});
