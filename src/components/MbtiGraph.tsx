/**
 * MbtiGraph — MBTI 궁합 네트워크 그래프 (NetworkGraph 래퍼)
 *
 * 중앙에 선택된 MBTI, 궤도에 16개 타입(자기 자신 포함)을 배치한다.
 * Canvas 렌더링·애니메이션·마우스 이벤트는 NetworkGraph에 위임.
 */
"use client";

import { useCallback, useState } from "react";
import { MBTI_TYPES, COMPATIBILITY, MbtiType } from "@/data/compatibility";
import { getGraphColor as getColor, hslToRgb } from "@/data/colors";
import CompatDetailModal, { type CompatDetailData } from "./CompatDetailModal";
import NetworkGraph, { type GraphNode } from "./NetworkGraph";

type Props = { selectedMbti: MbtiType };

/** 궤도 각도 지터링 오프셋 — 균일한 원형 배치를 깨뜨려 자연스러운 분포를 만든다 */
const ANGLE_OFFSETS = [
  0, 0.35, -0.28, 0.55, -0.42, 0.2, -0.5, 0.65, 0.1, -0.35, 0.45, -0.2, 0.6,
  -0.15, 0.25, -0.6,
];

/** 궤도 거리 배율 — 동일 반경 겹침 방지 */
const DIST_MULTS = [
  1.0, 1.2, 0.88, 1.35, 0.82, 1.15, 0.92, 1.28, 1.05, 0.85, 1.22, 0.9, 1.1,
  0.78, 1.3, 0.95,
];

export default function MbtiGraph({ selectedMbti }: Props) {
  const [popup, setPopup] = useState<CompatDetailData>(null);

  // ─────────────────────────────────────────────
  // buildPositions: 중앙 1 + 궤도 16 노드 위치·크기 계산
  // ─────────────────────────────────────────────

  const buildPositions = useCallback(
    (W: number, H: number): GraphNode[] => {
      const others = [...MBTI_TYPES];
      const scores = others.map((t) => ({
        mbti: t,
        score: COMPATIBILITY[selectedMbti][t],
      }));
      const maxScore = Math.max(...scores.map((s) => s.score));
      const minScore = Math.min(...scores.map((s) => s.score));
      const bestSet = new Set(
        scores.filter((s) => s.score === maxScore).map((s) => s.mbti),
      );
      const worstSet = new Set(
        scores.filter((s) => s.score === minScore).map((s) => s.mbti),
      );
      const highlights = new Set([...bestSet, ...worstSet]);

      const cx = W / 2,
        cy = H / 2;
      const isMobile = W < 640;
      // 겹치지 않는 선에서 최대 크기
      const centerR = W * (isMobile ? 0.10 : 0.11);
      const normalR = W * (isMobile ? 0.08 : 0.085);
      const halfR = W * (isMobile ? 0.06 : 0.065);
      const orbit = Math.min(W, H) * (isMobile ? 0.38 : 0.40);

      const positions: GraphNode[] = [
        {
          x: cx,
          y: cy,
          r: centerR,
          id: selectedMbti,
          mbti: selectedMbti,
          score: 100,
          isCenter: true,
          isHighlight: false,
          highlightType: null,
        },
      ];

      const n = others.length;
      others.forEach((mbti, i) => {
        const score = COMPATIBILITY[selectedMbti][mbti];
        const isHighlight = highlights.has(mbti);
        const r = isHighlight ? normalR : halfR;
        const baseAngle = (2 * Math.PI * i) / n - Math.PI / 2;
        const jitter =
          ANGLE_OFFSETS[i % ANGLE_OFFSETS.length] * (0.5 / Math.max(n, 3));
        const angle = baseAngle + jitter;
        const d = orbit * DIST_MULTS[i % DIST_MULTS.length];
        const mgX = r + 10;
        const mgY = r + 10;
        positions.push({
          x: Math.max(mgX, Math.min(W - mgX, cx + d * Math.cos(angle))),
          y: Math.max(mgY, Math.min(H - mgY, cy + d * Math.sin(angle))),
          r,
          id: mbti === selectedMbti ? `${mbti}_self` : mbti,
          mbti,
          score,
          isCenter: false,
          isHighlight,
          highlightType: bestSet.has(mbti)
            ? "best"
            : worstSet.has(mbti)
              ? "worst"
              : null,
        });
      });

      // 충돌 해소: 반복적 밀어내기로 겹침 제거
      for (let iter = 0; iter < 200; iter++) {
        let moved = false;
        for (let i = 0; i < positions.length; i++) {
          for (let j = i + 1; j < positions.length; j++) {
            const a = positions[i],
              b = positions[j];
            const minDist = a.r + b.r + 12;
            const dx = b.x - a.x,
              dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
            if (dist < minDist) {
              const overlap = (minDist - dist) / 1.2;
              const nx = dx / dist,
                ny = dy / dist;
              if (!a.isCenter) {
                a.x -= nx * overlap;
                a.y -= ny * overlap;
              }
              if (!b.isCenter) {
                b.x += nx * overlap;
                b.y += ny * overlap;
              }
              [a, b].forEach((p) => {
                if (!p.isCenter) {
                  const padX = p.r + 10;
                  const padY = p.r + 10;
                  p.x = Math.max(padX, Math.min(W - padX, p.x));
                  p.y = Math.max(padY, Math.min(H - padY, p.y));
                }
              });
              moved = true;
            }
          }
        }
        if (!moved) break;
      }

      return positions;
    },
    [selectedMbti],
  );

  // ─────────────────────────────────────────────
  // applyNodeStyles: 노드 DOM에 색상·글로우·텍스트·이벤트 적용
  // ─────────────────────────────────────────────

  const applyNodeStyles = useCallback(
    (nodes: GraphNode[], els: HTMLDivElement[]) => {
      nodes.forEach((pos, idx) => {
        const el = els[idx];
        if (!el) return;
        const { r, mbti, isCenter, isHighlight, score, highlightType } = pos;
        const isBest = highlightType === "best";
        const isWorst = highlightType === "worst";

        const baseColor = isCenter
          ? "hsl(270,77%,58%)"
          : isBest
            ? "hsl(36,88%,56%)"
            : isWorst
              ? "hsl(340,75%,56%)"
              : getColor(score, mbti);
        const rgb = hslToRgb(baseColor);

        const glowSz = isCenter
          ? 26
          : isHighlight
            ? Math.max(r * 0.7, 7)
            : Math.max(r * 0.5, 5);
        const glowOp = isCenter
          ? 0.48
          : isHighlight
            ? 0.3 + (score / 100) * 0.2
            : 0.22 + (score / 100) * 0.1;

        el.style.border = `${isCenter ? "2.5px" : isHighlight ? "2px" : "1px"} solid rgba(${rgb},${isCenter ? 0.85 : isHighlight ? 0.8 : 0.45})`;
        el.style.boxShadow = `0 0 ${glowSz}px rgba(${rgb},${glowOp}),inset 0 0 ${glowSz * 0.4}px rgba(${rgb},${isCenter ? 0.14 : isHighlight ? 0.1 : 0.08})`;
        el.style.background = `radial-gradient(circle at 35% 35%,rgba(${rgb},${isCenter ? 0.26 : isHighlight ? 0.2 : 0.15}) 0%,rgba(${rgb},0.06) 65%,transparent 100%),#07070f`;
        el.style.zIndex = isCenter ? "4" : isHighlight ? "3" : "2";

        // 노드 내부 텍스트
        const ns = Math.max(r * 0.26, 5);
        const es = Math.max(r * 0.38, 7);
        const ms = Math.max(r * 0.28, 6);
        const badge = isBest ? "🏆" : isWorst ? "💀" : "";
        el.innerHTML = `
          ${badge ? `<span class="mbti-badge" style="font-size:${es}px;line-height:1;opacity:0;transition:opacity 2s ease;">${badge}</span>` : ""}
          <span style="font-size:${ns}px;font-weight:700;color:rgba(${rgb},${isHighlight || isCenter ? 0.85 : 0.7});text-shadow:0 0 6px rgba(${rgb},0.6);line-height:1.2;">${mbti}</span>
          <span style="font-size:${ms}px;font-weight:800;color:rgba(${rgb},1);text-shadow:0 0 8px rgba(${rgb},${isHighlight ? 0.9 : 0.6});line-height:1.2;">${isCenter ? "" : score + "%"}</span>
        `;

        if (!isCenter) {
          el.onmouseenter = () => {
            const hg = Math.max(r * 1.5, 14);
            el.style.boxShadow = `0 0 ${hg}px rgba(${rgb},0.85),0 0 ${hg * 2}px rgba(${rgb},0.4),inset 0 0 ${r * 0.6}px rgba(${rgb},0.28)`;
            el.style.transform = "translate(-50%,-50%) scale(1.25)";
            el.style.borderColor = `rgba(${rgb},1)`;
          };
          el.onmouseleave = () => {
            el.style.boxShadow = `0 0 ${glowSz}px rgba(${rgb},${glowOp}),inset 0 0 ${glowSz * 0.4}px rgba(${rgb},${isHighlight ? 0.1 : 0.05})`;
            el.style.transform = "translate(-50%,-50%) scale(1)";
            el.style.borderColor = `rgba(${rgb},${isCenter ? 0.85 : isHighlight ? 0.65 : 0.35})`;
          };
          el.onclick = (e) => {
            e.stopPropagation();
            setPopup({ my: selectedMbti, other: mbti, score });
          };
        }
      });
    },
    [selectedMbti],
  );

  // ─────────────────────────────────────────────
  // 이벤트 콜백
  // ─────────────────────────────────────────────

  /** 연결선 클릭 → 궁합 상세 팝업 */
  const onLineClick = useCallback(
    (a: GraphNode, b: GraphNode, score: number) => {
      const my = a.isCenter ? a.mbti : b.mbti;
      const other = a.isCenter ? b.mbti : a.mbti;
      setPopup({ my, other, score });
    },
    [],
  );

  /** 애니메이션 완료 후 배지(🏆💀) 페이드인 */
  const onAnimComplete = useCallback(
    (_nodes: GraphNode[], container: HTMLDivElement) => {
      requestAnimationFrame(() => {
        container
          .querySelectorAll<HTMLElement>(".mbti-badge")
          .forEach((el) => {
            el.style.opacity = "1";
          });
      });
    },
    [],
  );

  /** 선 색상 키 — 동일 쌍에 일관된 색상 보장 */
  const getLineColorKey = useCallback(
    (a: GraphNode, b: GraphNode) =>
      a.isCenter ? b.mbti : `${a.mbti}${b.mbti}`,
    [],
  );

  return (
    <>
      <NetworkGraph
        buildPositions={buildPositions}
        applyNodeStyles={applyNodeStyles}
        onLineClick={onLineClick}
        onAnimComplete={onAnimComplete}
        getLineColorKey={getLineColorKey}
        heightRatio={1.0}
        maxHeight={580}
        animDuration={2500}
        fadeIn={true}
      />
      <CompatDetailModal data={popup} onClose={() => setPopup(null)} />
    </>
  );
}
