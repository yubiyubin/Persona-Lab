"use client";

import { useState } from "react";
import { MBTI_TYPES, COMPATIBILITY, MbtiType } from "@/data/compatibility";
import { SCORE_EMOJI, getScoreInfo } from "@/data/labels";
import CompatCard from "@/components/CompatCard";

type ScoreInfo = (typeof SCORE_EMOJI)[number];

type PanelData = {
  my: MbtiType;
  other: MbtiType;
  score: number;
} | null;

type GroupedPair = {
  score: number;
  types: MbtiType[];
};

function getColor(score: number): string {
  if (score >= 85) return "#a855f7";
  if (score >= 70) return "#3b82f6";
  if (score >= 50) return "#22c55e";
  if (score >= 35) return "#f97316";
  return "#ef4444";
}

function getBg(score: number): string {
  if (score >= 85) return "#a855f715";
  if (score >= 70) return "#3b82f615";
  if (score >= 50) return "#22c55e15";
  if (score >= 35) return "#f9731615";
  return "#ef444415";
}

function Badge({
  type,
  score,
  onClick,
}: {
  type: MbtiType;
  score: number;
  onClick: () => void;
}) {
  const color = getColor(score);
  const bg = getBg(score);

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 hover:-translate-y-1 hover:scale-105"
      style={{
        color,
        backgroundColor: bg,
        border: `0.5px solid ${color}50`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 6px 16px ${color}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {type} <span className="opacity-70">→</span>
    </button>
  );
}

function RankRow({
  rank,
  group,
  score,
  onClickType,
}: {
  rank: number;
  group: MbtiType[];
  score: number;
  onClickType: (type: MbtiType) => void;
}) {
  const color = getColor(score);
  const bg = getBg(score);
  const info = getScoreInfo(score);
  const rankLabel =
    group.length > 1 ? `${rank}~${rank + group.length - 1}위` : `${rank}위`;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2"
      style={{ backgroundColor: bg, border: `0.5px solid ${color}30` }}
    >
      <div className="min-w-[36px] text-center">
        <div className="text-[10px] text-white/40">{rankLabel}</div>
        <div className="text-xl">{info.emoji}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-1 mb-2">
          {group.map((type) => (
            <Badge
              key={type}
              type={type}
              score={score}
              onClick={() => onClickType(type)}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
            <div
              className="h-full rounded-full gauge-bar"
              style={{ width: `${score}%`, backgroundColor: color }}
            />
          </div>
          <span
            className="text-xs font-bold min-w-[32px] text-right"
            style={{ color }}
          >
            {score}%
          </span>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({
  data,
  onClose,
}: {
  data: PanelData;
  onClose: () => void;
}) {
  if (!data) return null;
  const { my, other, score } = data;
  const color = getColor(score);
  const bg = getBg(score);
  const info = getScoreInfo(score);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] z-50 rounded-2xl p-6 bg-[#0f0f1a] border border-white/10">
        <div className="text-center">
          <div className="text-4xl mb-2">{info.emoji}</div>
          <div className="text-2xl font-black mb-1" style={{ color }}>
            {score}%
          </div>
          <div className="text-sm font-bold text-white mb-1">
            {my} × {other}
          </div>
          <div
            className="inline-block text-xs px-3 py-1 rounded-full mb-4"
            style={{ color, backgroundColor: bg }}
          >
            {info.label}
          </div>
          <div className="h-1.5 rounded-full overflow-hidden bg-white/10 mb-4">
            <div
              className="h-full rounded-full gauge-bar"
              style={{ width: `${score}%`, backgroundColor: color }}
            />
          </div>
          <div className="h-px bg-white/10 mb-4" />
          <p className="text-sm text-white/60 leading-relaxed text-left">
            {my}와 {other}의 궁합이에요. 서로를 이해하고 배려하면 좋은 관계가 될
            수 있어요.
          </p>
          <button
            onClick={onClose}
            className="mt-4 w-full py-2 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all text-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}

type Props = {
  selectedMbti: MbtiType;
  onSelect?: (mbti: MbtiType) => void;
  children?: React.ReactNode;
};

export default function MbtiGrid({ selectedMbti, onSelect, children }: Props) {
  const setSelectedMbti = onSelect ?? (() => {});
  const [panel, setPanel] = useState<PanelData>(null);

  const scores = MBTI_TYPES.map((type) => ({
    type,
    score: COMPATIBILITY[selectedMbti][type],
  }))
    .filter((p) => p.type !== selectedMbti)
    .sort((a, b) => b.score - a.score);

  const best = scores[0];
  const worst = scores[scores.length - 1];
  const bestGroup = scores
    .filter((p) => p.score === best.score)
    .map((p) => p.type);
  const worstGroup = scores
    .filter((p) => p.score === worst.score)
    .map((p) => p.type);

  const grouped: GroupedPair[] = [];
  let i = 0;
  while (i < scores.length) {
    const s = scores[i].score;
    const group = scores.filter((p) => p.score === s).map((p) => p.type);
    grouped.push({ score: s, types: group });
    i += group.length;
  }

  function handleClickType(other: MbtiType) {
    setPanel({
      my: selectedMbti,
      other,
      score: COMPATIBILITY[selectedMbti][other],
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-white/50">내 MBTI 선택</p>
        <div className="flex flex-wrap gap-2">
          {MBTI_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedMbti(type)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
              style={{
                backgroundColor:
                  selectedMbti === type ? "#a855f7" : "#ffffff10",
                color: selectedMbti === type ? "white" : "#ffffff60",
                border:
                  selectedMbti === type
                    ? "0.5px solid #a855f7"
                    : "0.5px solid transparent",
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CompatCard title="🏆 최고의 궁합" score={best.score} variant="best">
          <div className="flex flex-wrap gap-1 justify-center">
            {bestGroup.map((type) => (
              <Badge
                key={type}
                type={type}
                score={best.score}
                onClick={() => handleClickType(type)}
              />
            ))}
          </div>
        </CompatCard>
        <CompatCard title="💀 최악의 궁합" score={worst.score} variant="worst">
          <div className="flex flex-wrap gap-1 justify-center">
            {worstGroup.map((type) => (
              <Badge
                key={type}
                type={type}
                score={worst.score}
                onClick={() => handleClickType(type)}
              />
            ))}
          </div>
        </CompatCard>
      </div>

      {children}

      <div className="flex flex-col gap-1">
        <p className="text-xs text-white/50 mb-2">궁합 순위</p>
        {(() => {
          let rank = 1;
          return grouped.map((g) => {
            const currentRank = rank;
            rank += g.types.length;
            return (
              <RankRow
                key={g.score}
                rank={currentRank}
                group={g.types}
                score={g.score}
                onClickType={handleClickType}
              />
            );
          });
        })()}
      </div>

      <DetailPanel data={panel} onClose={() => setPanel(null)} />
    </div>
  );
}
