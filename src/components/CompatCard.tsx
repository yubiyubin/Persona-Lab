"use client";

import { ReactNode } from "react";
import { getScoreInfo } from "@/data/labels";

type Props = {
  title: string;
  score: number;
  variant: "best" | "worst";
  children?: ReactNode;
  onClick?: () => void;
};

export default function CompatCard({ title, score, variant, children, onClick }: Props) {
  const color = variant === "best" ? "#e5a50a" : "#dc2626";
  const bg = variant === "best" ? "rgba(229,165,10,0.08)" : "rgba(220,38,38,0.08)";
  const info = getScoreInfo(score);

  return (
    <div
      className={`rounded-2xl p-4 text-center${onClick ? " cursor-pointer" : ""}`}
      style={{ backgroundColor: bg, border: `0.5px solid ${color}50` }}
      onClick={onClick}
    >
      <p className="text-xs font-bold mb-2" style={{ color }}>
        {title}
      </p>
      <div className="text-3xl mb-1">{info.emoji}</div>
      <div className="text-xl font-bold mb-1" style={{ color }}>
        {score}%
      </div>
      <div className="text-xs text-white/50 mb-3">{info.label}</div>
      {children}
      <div className="mt-2 h-1 rounded-full overflow-hidden bg-white/10">
        <div
          className="h-full rounded-full gauge-bar"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
