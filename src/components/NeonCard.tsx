import React from "react";

interface NeonCardProps {
  /** "R,G,B" 형식의 색상값 (예: "236,72,153") */
  rgb: string;
  className?: string;
  children: React.ReactNode;
  /** 배경 투명도. 기본값: 0.06 */
  bgAlpha?: number;
  /** 테두리 투명도 (기준값). 기본값: 0.53 */
  borderAlpha?: number;
  /** computed style 뒤에 spread되어 override 가능 */
  style?: React.CSSProperties;
}

/**
 * 네온 글로우 효과가 적용된 공통 카드 컴포넌트.
 *
 * alpha 비율 (borderAlpha 기준):
 * - ring  = borderAlpha × 0.28
 * - near  = borderAlpha × 0.75
 * - far   = borderAlpha × 0.28
 */
export default function NeonCard({
  rgb,
  className = "",
  children,
  bgAlpha = 0.06,
  borderAlpha = 0.53,
  style,
}: NeonCardProps) {
  const ringAlpha = Math.round(borderAlpha * 0.28 * 100) / 100;
  const nearAlpha = Math.round(borderAlpha * 0.75 * 100) / 100;
  const farAlpha = Math.round(borderAlpha * 0.28 * 100) / 100;

  const computedStyle: React.CSSProperties = {
    background: `rgba(${rgb},${bgAlpha})`,
    border: `1.5px solid rgba(${rgb},${borderAlpha})`,
    boxShadow: `0 0 0 1px rgba(${rgb},${ringAlpha}), 0 0 18px rgba(${rgb},${nearAlpha}), 0 0 50px rgba(${rgb},${farAlpha})`,
  };

  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ ...computedStyle, ...style }}
    >
      {children}
    </div>
  );
}
