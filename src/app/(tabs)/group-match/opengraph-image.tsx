import { ImageResponse } from "next/og";
import { OgTemplate } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "ChemiFit - 그룹 궁합";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const members = [
  { emoji: "😎", type: "ENTJ", x: 600, y: 280, r: 70, color: "#A855F7" },
  { emoji: "🥳", type: "ENFP", x: 420, y: 160, r: 55, color: "#EC4899" },
  { emoji: "🤓", type: "INTJ", x: 780, y: 160, r: 55, color: "#8B5CF6" },
  { emoji: "😇", type: "ISFJ", x: 420, y: 400, r: 50, color: "#2CFBFF" },
  { emoji: "🤩", type: "ESTP", x: 780, y: 400, r: 50, color: "#45DAFD" },
];

const lines = [
  { from: 0, to: 1, score: 82 },
  { from: 0, to: 2, score: 91 },
  { from: 0, to: 3, score: 65 },
  { from: 0, to: 4, score: 74 },
];

export default function OgImage() {
  return new ImageResponse(
    (
      <OgTemplate
        subtitle="👥 그룹 궁합"
        tagline="우리 그룹의 MBTI 궁합을 네트워크로 확인해보세요"
        background="linear-gradient(160deg, #0f0f1a 0%, #0a1a2e 40%, #0f0f1a 100%)"
      >
        {/* Nodes positioned absolutely - need a relative container */}
        <div style={{ position: "relative", width: 1200, height: 300, display: "flex" }}>
          <svg width="1200" height="300" style={{ position: "absolute", top: 0, left: 0 }}>
            {lines.map(({ from, to, score }) => {
              const a = members[from];
              const b = members[to];
              return (
                <line
                  key={`${from}-${to}`}
                  x1={a.x} y1={a.y - 140} x2={b.x} y2={b.y - 140}
                  stroke={`rgba(168,85,247,${(score / 100) * 0.6})`}
                  strokeWidth={2 + (score / 100) * 4}
                />
              );
            })}
          </svg>
          {members.map((m, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: m.x - m.r, top: m.y - 140 - m.r,
                width: m.r * 2, height: m.r * 2,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${m.color}30 0%, ${m.color}10 100%)`,
                border: `2px solid ${m.color}88`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 24px ${m.color}33`,
              }}
            >
              <span style={{ fontSize: i === 0 ? 32 : 24 }}>{m.emoji}</span>
              <span style={{ fontSize: i === 0 ? 20 : 16, fontWeight: 800, color: m.color, marginTop: 2 }}>{m.type}</span>
            </div>
          ))}
          {lines.map(({ from, to, score }) => {
            const a = members[from];
            const b = members[to];
            return (
              <div
                key={`label-${from}-${to}`}
                style={{
                  position: "absolute",
                  left: (a.x + b.x) / 2 - 24, top: (a.y + b.y) / 2 - 140 - 14,
                  fontSize: 16, fontWeight: 800,
                  color: score >= 80 ? "#A855F7" : "rgba(255,255,255,0.5)",
                  textShadow: score >= 80 ? "0 0 12px rgba(168,85,247,0.5)" : "none",
                  display: "flex",
                }}
              >
                {score}%
              </div>
            );
          })}
        </div>
      </OgTemplate>
    ),
    { ...size },
  );
}
