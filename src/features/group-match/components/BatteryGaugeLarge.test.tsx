import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import BatteryGaugeLarge from "./BatteryGaugeLarge";

describe("BatteryGaugeLarge", () => {
  beforeEach(() => {
    // RAF를 즉시 실행되는 동기 mock으로 교체 (애니메이션 즉시 완료)
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(performance.now() + 3000); // duration=2200 → t≥1 → 즉시 완료
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── 기본 렌더 ────────────────────────────────────────────────
  it("기본 props로 에러 없이 렌더된다", () => {
    const { container } = render(<BatteryGaugeLarge animated={false} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("showPercent=true(기본값) → 퍼센트 텍스트가 표시된다", () => {
    render(<BatteryGaugeLarge value={72} maxValue={100} animated={false} />);
    expect(screen.getByText("72%")).toBeInTheDocument();
  });

  it("showPercent=false → 퍼센트 텍스트가 없다", () => {
    render(
      <BatteryGaugeLarge
        value={72}
        maxValue={100}
        animated={false}
        showPercent={false}
      />,
    );
    expect(screen.queryByText("72%")).not.toBeInTheDocument();
  });

  it("label prop이 있으면 하단 라벨이 표시된다", () => {
    render(
      <BatteryGaugeLarge
        value={50}
        animated={false}
        label="💀 같이 있으면 소모됨"
      />,
    );
    expect(screen.getByText("💀 같이 있으면 소모됨")).toBeInTheDocument();
  });

  it("label prop이 없으면 하단 라벨이 없다", () => {
    render(<BatteryGaugeLarge value={50} animated={false} />);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  // ── 퍼센트 계산 ─────────────────────────────────────────────
  it("value=0 → 0% 표시", () => {
    render(<BatteryGaugeLarge value={0} maxValue={100} animated={false} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("value=100 → 100% 표시", () => {
    render(<BatteryGaugeLarge value={100} maxValue={100} animated={false} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("value=50, maxValue=100 → 50% 표시", () => {
    render(<BatteryGaugeLarge value={50} maxValue={100} animated={false} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("value가 maxValue를 초과하면 100%로 클램핑", () => {
    render(<BatteryGaugeLarge value={150} maxValue={100} animated={false} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("value=0보다 낮으면 0%로 클램핑", () => {
    render(<BatteryGaugeLarge value={-10} maxValue={100} animated={false} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("maxValue=200, value=100 → 50% 표시", () => {
    render(<BatteryGaugeLarge value={100} maxValue={200} animated={false} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  // ── 세그먼트 수 ─────────────────────────────────────────────
  it("segments=4(기본값) → div 셀이 4개 렌더된다", () => {
    const { container } = render(
      <BatteryGaugeLarge value={72} animated={false} segments={4} />,
    );
    // 셀 컨테이너의 직접 자식 div 개수 = segments
    // 셀들은 flex row 컨테이너(position:absolute, inset)의 자식
    const cells = container.querySelectorAll(
      "div[style*='flex: 1']",
    );
    expect(cells.length).toBe(4);
  });

  it("segments=6 → div 셀이 6개 렌더된다", () => {
    const { container } = render(
      <BatteryGaugeLarge value={72} animated={false} segments={6} />,
    );
    const cells = container.querySelectorAll("div[style*='flex: 1']");
    expect(cells.length).toBe(6);
  });

  // ── 애니메이션 ───────────────────────────────────────────────
  it("animated=false → 즉시 value 반영 (useEffect 후 표시)", () => {
    render(<BatteryGaugeLarge value={55} maxValue={100} animated={false} />);
    expect(screen.getByText("55%")).toBeInTheDocument();
  });

  it("animated=true → RAF 완료 후 최종 value 표시", async () => {
    await act(async () => {
      render(<BatteryGaugeLarge value={80} maxValue={100} animated={true} />);
    });
    // mock RAF가 즉시 t≥1로 완료하므로 최종값 80%가 표시돼야 함
    expect(screen.getByText("80%")).toBeInTheDocument();
  });
});
