import { ImageResponse } from "next/og";
import { OgTemplate } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "ChemiFit - MBTI 궁합 테스트";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <OgTemplate tagline="재미로 보는 MBTI 궁합 · 과학적 근거 없음" logoSize={96}>
        <div style={{ fontSize: 32, color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 40, display: "flex" }}>
          MBTI 궁합 맵
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 800 }}>
          {["INTJ", "ENFP", "ISTJ", "INFJ", "ENTP", "ESFP"].map((type) => (
            <div
              key={type}
              style={{
                padding: "12px 28px",
                borderRadius: 16,
                fontSize: 24,
                fontWeight: 800,
                color: "white",
                background: "rgba(168,85,247,0.2)",
                border: "1px solid rgba(168,85,247,0.4)",
                boxShadow: "0 0 20px rgba(168,85,247,0.15)",
                display: "flex",
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
