"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  COMPATIBILITY,
  COMPATIBILITY_DESC,
  MbtiType,
} from "@/data/compatibility";
import { getCoupleTier } from "@/data/labels";
import { MBTI_GROUPS } from "@/data/groups";

type Props = {
  myMbti: MbtiType;
  partnerMbti: MbtiType | null;
  onPartnerSelect: (mbti: MbtiType) => void;
};

// TODO(human): 카테고리별 궁합 점수 도출 함수
function getCategoryScores(
  myMbti: MbtiType,
  partnerMbti: MbtiType,
  baseScore: number,
) {
  const match = [
    myMbti[0] === partnerMbti[0], // E/I
    myMbti[1] === partnerMbti[1], // S/N
    myMbti[2] === partnerMbti[2], // T/F
    myMbti[3] === partnerMbti[3], // J/P
  ];

  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

  return [
    {
      label: "감정 교류",
      emoji: "💓",
      score: clamp(baseScore * 0.6 + (match[2] ? 25 : 0) + (match[0] ? 10 : 5)),
    },
    {
      label: "대화 궁합",
      emoji: "💬",
      score: clamp(baseScore * 0.6 + (match[0] ? 20 : 5) + (match[1] ? 15 : 0)),
    },
    {
      label: "가치관",
      emoji: "🌙",
      score: clamp(baseScore * 0.6 + (match[1] ? 20 : 5) + (match[2] ? 15 : 0)),
    },
    {
      label: "일상 호환",
      emoji: "☀️",
      score: clamp(baseScore * 0.6 + (match[3] ? 25 : 5) + (match[0] ? 10 : 0)),
    },
  ];
}

function FloatingHearts() {
  const hearts = ["💕", "💗", "💘", "♥", "💖"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map((h, i) => (
        <span
          key={i}
          className="absolute text-lg"
          style={{
            left: `${15 + i * 17}%`,
            bottom: "10%",
            animation: `heart-float ${3 + i * 0.7}s ease-out infinite`,
            animationDelay: `${i * 0.8}s`,
            opacity: 0,
          }}
        >
          {h}
        </span>
      ))}
    </div>
  );
}

function CircularGauge({ score }: { score: number }) {
  const r = 70;
  const circumference = 2 * Math.PI * r;
  const target = circumference - (circumference * score) / 100;
  const [counter, setCounter] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const dur = 2000;
    const step = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setCounter(Math.round(score * ease));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [score]);

  const hue = score > 60 ? 340 : score > 30 ? 20 : 0;
  const sat = 80 + score * 0.15;
  const color = `hsl(${hue},${sat}%,${55 + score * 0.1}%)`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[180px] h-[180px]">
        <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
          <circle
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          <circle
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={target}
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
              transition: "stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-black"
            style={{
              color,
              animation: "score-pulse 2.5s ease-in-out infinite",
              animationDelay: "2s",
            }}
          >
            {counter}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CoupleResult({
  myMbti,
  partnerMbti,
  onPartnerSelect,
}: Props) {
  const resultRef = useRef<HTMLDivElement>(null);

  const handlePartnerSelect = useCallback(
    (mbti: MbtiType) => {
      onPartnerSelect(mbti);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    },
    [onPartnerSelect],
  );

  const score = partnerMbti ? COMPATIBILITY[myMbti][partnerMbti] : null;
  const tier = score !== null ? getCoupleTier(score) : null;
  const desc = partnerMbti
    ? COMPATIBILITY_DESC[myMbti]?.[partnerMbti] ??
      COMPATIBILITY_DESC[partnerMbti]?.[myMbti] ??
      null
    : null;
  const categories =
    partnerMbti && score !== null
      ? getCategoryScores(myMbti, partnerMbti, score)
      : null;

  return (
    <div className="flex flex-col gap-8">
      {/* 상대방 MBTI 선택 */}
      <div
        className="rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: "rgba(236,72,153,0.04)",
          border: "1px solid rgba(236,72,153,0.15)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">💘</span>
          <h2
            className="text-lg font-bold"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            상대방의 MBTI는?
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {MBTI_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-1.5">
              <p className="text-[11px] text-white/30 font-medium pl-1">
                {group.label}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {group.types.map((type) => {
                  const selected = partnerMbti === type;
                  return (
                    <button
                      key={type}
                      onClick={() => handlePartnerSelect(type)}
                      className="py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:scale-105"
                      style={{
                        background: selected
                          ? "rgba(236,72,153,0.25)"
                          : "rgba(236,72,153,0.06)",
                        border: selected
                          ? "1.5px solid rgba(236,72,153,0.6)"
                          : "0.5px solid rgba(236,72,153,0.15)",
                        color: selected ? "#fff" : "rgba(255,255,255,0.7)",
                        boxShadow: selected
                          ? "0 0 16px rgba(236,72,153,0.35)"
                          : "none",
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 결과 */}
      {partnerMbti && score !== null && tier && (
        <div ref={resultRef} className="fade-in-up flex flex-col gap-6">
          {/* 히어로 카드 */}
          <div
            className="relative rounded-2xl p-8 flex flex-col items-center gap-4 overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(236,72,153,0.12) 0%, rgba(15,15,26,0.95) 70%)",
              border: "1px solid rgba(236,72,153,0.2)",
              boxShadow: "0 0 40px rgba(236,72,153,0.08)",
            }}
          >
            <FloatingHearts />

            <div className="flex items-center gap-4 z-10">
              <div
                className="px-4 py-2 rounded-xl text-lg font-black"
                style={{
                  background: "rgba(168,85,247,0.15)",
                  border: "1px solid rgba(168,85,247,0.3)",
                  color: "#c084fc",
                }}
              >
                {myMbti}
              </div>
              <span className="text-3xl">💕</span>
              <div
                className="px-4 py-2 rounded-xl text-lg font-black"
                style={{
                  background: "rgba(236,72,153,0.15)",
                  border: "1px solid rgba(236,72,153,0.3)",
                  color: "#f472b6",
                }}
              >
                {partnerMbti}
              </div>
            </div>

            <CircularGauge score={score} />

            <div className="flex flex-col items-center gap-1 z-10">
              <span className="text-3xl">{tier.emoji}</span>
              <span
                className="text-base font-bold"
                style={{ color: "rgba(236,72,153,0.9)" }}
              >
                {tier.label}
              </span>
            </div>
          </div>

          {/* 설명 카드 */}
          {desc && (
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(236,72,153,0.04)",
                border: "1px solid rgba(236,72,153,0.12)",
                borderLeft: "3px solid rgba(236,72,153,0.5)",
              }}
            >
              <p className="text-sm font-bold mb-2" style={{ color: "#f472b6" }}>
                💌 궁합 이야기
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {desc}
              </p>
            </div>
          )}

          {/* 카테고리별 점수 */}
          {categories && (
            <div
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{
                background: "rgba(236,72,153,0.04)",
                border: "1px solid rgba(236,72,153,0.12)",
              }}
            >
              <p className="text-sm font-bold" style={{ color: "#f472b6" }}>
                💞 세부 궁합
              </p>
              {categories.map((cat, i) => (
                <div key={cat.label} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">
                      {cat.emoji} {cat.label}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: `hsl(${cat.score > 60 ? 340 : cat.score > 30 ? 20 : 0},80%,60%)`,
                      }}
                    >
                      {cat.score}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="h-full rounded-full gauge-bar"
                      style={{
                        width: `${cat.score}%`,
                        background: `hsl(${cat.score > 60 ? 340 : cat.score > 30 ? 20 : 0},80%,55%)`,
                        boxShadow: `0 0 6px hsla(${cat.score > 60 ? 340 : cat.score > 30 ? 20 : 0},80%,55%,0.6)`,
                        animationDelay: `${0.3 + i * 0.2}s`,
                        transform: "scaleX(0)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
