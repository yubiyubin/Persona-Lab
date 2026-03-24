import { ImageResponse } from "next/og";
import { OgTemplate } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "ChemiFit - MBTI 궁합 맵";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TYPES = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP"];
const COLORS = ["#A855F7", "#8B5CF6", "#7C3AED", "#6D28D9", "#EC4899", "#F472B6", "#A78BFA", "#C084FC"];

export default function OgImage() {
  return new ImageResponse(
    (
      <OgTemplate
        subtitle="🗺️ MBTI 궁합 맵"
        tagline="16가지 MBTI 유형 간 궁합을 한눈에"
        background="linear-gradient(160deg, #0f0f1a 0%, #1a0a2e 40%, #0d1117 100%)"
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
          {TYPES.map((type, i) => (
            <div
              key={type}
              style={{
                width: 100, height: 100, borderRadius: "50%",
                background: `radial-gradient(circle, ${COLORS[i]}33 0%, ${COLORS[i]}11 100%)`,
                border: `2px solid ${COLORS[i]}66`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 800, color: COLORS[i],
                boxShadow: `0 0 20px ${COLORS[i]}22`,
              }}
            >
              {type}
            </div>
          ))}
        </div>
      </OgTemplate>
    ),
    { ...size },
  );
}
