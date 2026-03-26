/**
 * 네트워크 그래프 노드의 호버 이벤트 스타일 유틸리티
 *
 * MbtiGraph와 GroupGrid의 applyNodeStyles에서 공유.
 */

type HoverConfig = {
  /** 호버 시 스케일 (기본 1.25) */
  scale?: number;
  /** 호버 시 글로우 반지름 배율 (기본 1.5) */
  glowMult?: number;
};

/**
 * 노드 DOM에 호버 글로우 + 스케일 이벤트를 바인딩한다.
 * enter 시 확대 + 글로우 강화, leave 시 원복.
 */
export function applyNodeHover(
  el: HTMLDivElement,
  rgb: string,
  r: number,
  baseGlow: { size: number; opacity: number; innerOpacity: number },
  baseBorderOpacity: number,
  config?: HoverConfig,
): void {
  const { scale = 1.25, glowMult = 1.5 } = config ?? {};
  el.onmouseenter = () => {
    const hg = Math.max(r * glowMult, 14);
    el.style.boxShadow = `0 0 ${hg}px rgba(${rgb},0.85),0 0 ${hg * 2}px rgba(${rgb},0.4),inset 0 0 ${r * 0.6}px rgba(${rgb},0.28)`;
    el.style.transform = `translate(-50%,-50%) scale(${scale})`;
    el.style.borderColor = `rgba(${rgb},1)`;
  };
  el.onmouseleave = () => {
    el.style.boxShadow = `0 0 ${baseGlow.size}px rgba(${rgb},${baseGlow.opacity}),inset 0 0 ${baseGlow.size * 0.4}px rgba(${rgb},${baseGlow.innerOpacity})`;
    el.style.transform = "translate(-50%,-50%) scale(1)";
    el.style.borderColor = `rgba(${rgb},${baseBorderOpacity})`;
  };
}
