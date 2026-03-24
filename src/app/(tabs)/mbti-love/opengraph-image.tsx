import { ImageResponse } from "next/og";
import { OgTemplate } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "ChemiFit - MBTI 연애 궁합";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <OgTemplate
        subtitle="💕 연애 궁합 테스트"
        tagline="나와 상대의 MBTI 연애 궁합을 확인해보세요"
        background="linear-gradient(160deg, #0f0f1a 0%, #2d0a2e 40%, #1a0520 100%)"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{
            width: 160, height: 160, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0.05) 100%)",
            border: "2px solid rgba(168,85,247,0.5)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 30px rgba(168,85,247,0.2)",
          }}>
            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>나</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: "#A855F7" }}>ENFP</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 56 }}>💗</span>
            <span style={{ fontSize: 48, fontWeight: 900, color: "#EC4899", textShadow: "0 0 30px rgba(236,72,153,0.5)" }}>95%</span>
          </div>
          <div style={{
            width: 160, height: 160, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(44,251,255,0.2) 0%, rgba(44,251,255,0.05) 100%)",
            border: "2px solid rgba(44,251,255,0.4)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 30px rgba(44,251,255,0.15)",
          }}>
            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>상대</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: "#2CFBFF" }}>INFJ</span>
          </div>
        </div>
      </OgTemplate>
    ),
    { ...size },
  );
}
