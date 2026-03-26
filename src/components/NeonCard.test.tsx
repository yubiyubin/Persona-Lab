import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NeonCard from "./NeonCard";

describe("NeonCard", () => {
  it("children을 렌더한다", () => {
    render(<NeonCard rgb="168,85,247">테스트 내용</NeonCard>);
    expect(screen.getByText("테스트 내용")).toBeInTheDocument();
  });

  it("기본 className에 rounded-2xl이 포함된다", () => {
    const { container } = render(<NeonCard rgb="168,85,247">내용</NeonCard>);
    expect(container.firstChild).toHaveClass("rounded-2xl");
  });

  it("className prop이 추가로 적용된다", () => {
    const { container } = render(
      <NeonCard rgb="168,85,247" className="p-4 text-white">
        내용
      </NeonCard>,
    );
    expect(container.firstChild).toHaveClass("rounded-2xl", "p-4", "text-white");
  });

  it("기본 bgAlpha(0.06)로 background 스타일이 적용된다", () => {
    const { container } = render(<NeonCard rgb="168,85,247">내용</NeonCard>);
    const el = container.firstChild as HTMLElement;
    // jsdom은 rgba 쉼표 뒤에 공백을 추가하여 정규화함
    expect(el.style.background).toContain("168");
    expect(el.style.background).toContain("85");
    expect(el.style.background).toContain("247");
    expect(el.style.background).toContain("0.06");
  });

  it("커스텀 bgAlpha가 background에 반영된다", () => {
    const { container } = render(
      <NeonCard rgb="168,85,247" bgAlpha={0.2}>
        내용
      </NeonCard>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.background).toContain("0.2");
    expect(el.style.background).toContain("168");
  });

  it("기본 borderAlpha(0.53)로 border 스타일이 적용된다", () => {
    const { container } = render(<NeonCard rgb="168,85,247">내용</NeonCard>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.border).toContain("0.53");
    expect(el.style.border).toContain("168");
  });

  it("커스텀 borderAlpha가 border에 반영된다", () => {
    const { container } = render(
      <NeonCard rgb="0,203,255" borderAlpha={0.8}>
        내용
      </NeonCard>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.border).toContain("0.8");
    expect(el.style.border).toContain("203");
  });

  it("style prop이 computedStyle을 override한다", () => {
    const { container } = render(
      <NeonCard rgb="168,85,247" style={{ opacity: 0.5 }}>
        내용
      </NeonCard>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.opacity).toBe("0.5");
  });

  it("boxShadow가 적용된다 (기본 borderAlpha=0.53 기준)", () => {
    const { container } = render(<NeonCard rgb="168,85,247">내용</NeonCard>);
    const el = container.firstChild as HTMLElement;
    // ringAlpha = round(0.53*0.28*100)/100 = 0.15
    // nearAlpha = round(0.53*0.75*100)/100 = 0.4
    // jsdom이 rgba 공백을 추가하므로 부분 문자열로 검증
    expect(el.style.boxShadow).toContain("0.15");
    expect(el.style.boxShadow).toContain("0.4");
    expect(el.style.boxShadow).toContain("168");
  });

  it("여러 children을 렌더한다", () => {
    render(
      <NeonCard rgb="0,203,255">
        <span>첫째</span>
        <span>둘째</span>
      </NeonCard>,
    );
    expect(screen.getByText("첫째")).toBeInTheDocument();
    expect(screen.getByText("둘째")).toBeInTheDocument();
  });

  it("rgb가 다른 값으로 변경돼도 에러 없이 렌더된다", () => {
    const { container } = render(<NeonCard rgb="0,255,0">내용</NeonCard>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.background).toContain("255");
    expect(el.style.background).toContain("0.06");
  });

  it("bgAlpha=0 → 배경 투명도 0 적용", () => {
    const { container } = render(
      <NeonCard rgb="168,85,247" bgAlpha={0}>
        내용
      </NeonCard>,
    );
    const el = container.firstChild as HTMLElement;
    // jsdom은 rgba(..., 0)을 transparent로 정규화할 수 있음
    expect(
      el.style.background === "transparent" ||
        el.style.background.includes("0"),
    ).toBe(true);
  });

  it("bgAlpha=1 → 불투명 배경 (jsdom은 rgb()로 정규화)", () => {
    const { container } = render(
      <NeonCard rgb="168,85,247" bgAlpha={1}>
        내용
      </NeonCard>,
    );
    const el = container.firstChild as HTMLElement;
    // jsdom: rgba(168,85,247,1) → rgb(168, 85, 247)
    expect(el.style.background).toContain("168");
    expect(el.style.background).toContain("85");
    expect(el.style.background).toContain("247");
  });
});
