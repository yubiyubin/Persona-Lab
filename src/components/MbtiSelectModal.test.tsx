import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MbtiSelectModal from "./MbtiSelectModal";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => ({ get: vi.fn().mockReturnValue(null) }),
  usePathname: () => "/",
}));

describe("MbtiSelectModal", () => {
  it("16개 MBTI 버튼이 렌더되어야 한다", () => {
    render(<MbtiSelectModal onSelect={vi.fn()} />);
    const mbtiTypes = [
      "INTJ", "INTP", "ENTJ", "ENTP",
      "INFJ", "INFP", "ENFJ", "ENFP",
      "ISTJ", "ISFJ", "ESTJ", "ESFJ",
      "ISTP", "ISFP", "ESTP", "ESFP",
    ];
    mbtiTypes.forEach((type) => {
      expect(screen.getByTestId(`mbti-btn-${type}`)).toBeInTheDocument();
    });
  });

  it("INTJ 버튼 클릭 → onSelect('INTJ') 호출", () => {
    const onSelect = vi.fn();
    render(<MbtiSelectModal onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId("mbti-btn-INTJ"));
    expect(onSelect).toHaveBeenCalledWith("INTJ");
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("ENFP 버튼 클릭 → onSelect('ENFP') 호출", () => {
    const onSelect = vi.fn();
    render(<MbtiSelectModal onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId("mbti-btn-ENFP"));
    expect(onSelect).toHaveBeenCalledWith("ENFP");
  });

  it("onClose 있을 때 닫기 버튼(modal-close-btn)이 표시됨", () => {
    const onClose = vi.fn();
    render(<MbtiSelectModal onSelect={vi.fn()} onClose={onClose} />);
    expect(screen.getByTestId("modal-close-btn")).toBeInTheDocument();
  });

  it("onClose 없을 때 닫기 버튼이 없음", () => {
    render(<MbtiSelectModal onSelect={vi.fn()} />);
    expect(screen.queryByTestId("modal-close-btn")).not.toBeInTheDocument();
  });

  it("닫기 버튼 클릭 → onClose 호출", () => {
    const onClose = vi.fn();
    render(<MbtiSelectModal onSelect={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByTestId("modal-close-btn"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("MBTI 버튼 클릭 시 onClose도 함께 호출됨", () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<MbtiSelectModal onSelect={onSelect} onClose={onClose} />);
    fireEvent.click(screen.getByTestId("mbti-btn-INTJ"));
    expect(onSelect).toHaveBeenCalledWith("INTJ");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("theme='pink' → 핑크 테마로 렌더됨", () => {
    render(<MbtiSelectModal onSelect={vi.fn()} theme="pink" />);
    expect(screen.getByTestId("mbti-btn-INTJ")).toBeInTheDocument();
  });

  it("inline=true → 콘텐츠가 인라인으로 렌더됨", () => {
    const { container } = render(<MbtiSelectModal onSelect={vi.fn()} inline />);
    // inline 모드에서는 ModalOverlay 없이 콘텐츠만 렌더됨
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByTestId("mbti-btn-INTJ")).toBeInTheDocument();
  });

  it("커스텀 title, subtitle, emoji가 렌더됨", () => {
    render(
      <MbtiSelectModal
        onSelect={vi.fn()}
        title="커스텀 타이틀"
        subtitle="커스텀 서브타이틀"
        emoji="🎯"
      />,
    );
    expect(screen.getByText("커스텀 타이틀")).toBeInTheDocument();
    expect(screen.getByText("커스텀 서브타이틀")).toBeInTheDocument();
  });

  it("ENTP 버튼 클릭 → onSelect('ENTP') 호출", () => {
    const onSelect = vi.fn();
    render(<MbtiSelectModal onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId("mbti-btn-ENTP"));
    expect(onSelect).toHaveBeenCalledWith("ENTP");
  });

  it("ESFP 버튼 클릭 → onSelect('ESFP') 호출", () => {
    const onSelect = vi.fn();
    render(<MbtiSelectModal onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId("mbti-btn-ESFP"));
    expect(onSelect).toHaveBeenCalledWith("ESFP");
  });

  it("ISTJ 버튼 클릭 → onSelect('ISTJ') 호출", () => {
    const onSelect = vi.fn();
    render(<MbtiSelectModal onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId("mbti-btn-ISTJ"));
    expect(onSelect).toHaveBeenCalledWith("ISTJ");
  });

  it("여러 번 클릭 시 매번 onSelect가 호출된다", () => {
    const onSelect = vi.fn();
    render(<MbtiSelectModal onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId("mbti-btn-INTJ"));
    fireEvent.click(screen.getByTestId("mbti-btn-ENFP"));
    fireEvent.click(screen.getByTestId("mbti-btn-ISTP"));
    expect(onSelect).toHaveBeenCalledTimes(3);
    expect(onSelect).toHaveBeenNthCalledWith(1, "INTJ");
    expect(onSelect).toHaveBeenNthCalledWith(2, "ENFP");
    expect(onSelect).toHaveBeenNthCalledWith(3, "ISTP");
  });

  it("모든 16개 버튼의 텍스트가 MBTI 타입명이어야 한다", () => {
    render(<MbtiSelectModal onSelect={vi.fn()} />);
    const types = [
      "INTJ", "INTP", "ENTJ", "ENTP",
      "INFJ", "INFP", "ENFJ", "ENFP",
      "ISTJ", "ISFJ", "ESTJ", "ESFJ",
      "ISTP", "ISFP", "ESTP", "ESFP",
    ];
    types.forEach((type) => {
      const btn = screen.getByTestId(`mbti-btn-${type}`);
      expect(btn.textContent).toBe(type);
    });
  });

  it("inline=false (기본) → 모달 오버레이 컨테이너 내에 렌더됨", () => {
    const { container } = render(<MbtiSelectModal onSelect={vi.fn()} />);
    // inline=false일 때 max-w-md rounded-3xl을 가진 래퍼가 존재
    expect(container.querySelector(".rounded-3xl")).toBeTruthy();
  });

  it("inline=true → rounded-3xl 클래스 없음 (오버레이 없음)", () => {
    const { container } = render(<MbtiSelectModal onSelect={vi.fn()} inline />);
    expect(container.querySelector(".rounded-3xl")).toBeNull();
  });

  it("theme='purple' (기본) → 에러 없이 렌더됨", () => {
    render(<MbtiSelectModal onSelect={vi.fn()} theme="purple" />);
    expect(screen.getByTestId("mbti-btn-INTJ")).toBeInTheDocument();
  });
});
