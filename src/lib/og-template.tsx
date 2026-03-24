/**
 * OG 이미지 공통 템플릿 — 배경 글로우 + 로고 + 콘텐츠 + 태그라인
 *
 * 4개 페이지(메인, 궁합맵, 연애궁합, 그룹궁합)의 opengraph-image.tsx에서 공유.
 */
import { type ReactNode } from "react";

type OgTemplateProps = {
  /** 페이지 부제 (로고 아래) */
  subtitle?: string;
  /** 하단 태그라인 */
  tagline: string;
  /** 배경 그라데이션 (기본: 보라 톤) */
  background?: string;
  /** 로고 크기 (기본: 52) */
  logoSize?: number;
  /** 페이지별 고유 콘텐츠 */
  children: ReactNode;
};

export function OgTemplate({
  subtitle,
  tagline,
  background = "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0f0f1a 100%)",
  logoSize = 52,
  children,
}: OgTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 배경 글로우 */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
          top: -100,
          right: -100,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(44,251,255,0.1) 0%, transparent 70%)",
          bottom: -150,
          left: -50,
          display: "flex",
        }}
      />

      {/* 로고 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: subtitle ? 16 : 24 }}>
        <span style={{ fontSize: logoSize, fontWeight: 900, color: "#A855F7", textShadow: "0 0 40px rgba(168,85,247,0.4)" }}>
          Chemi
        </span>
        <span style={{ fontSize: logoSize, fontWeight: 900, color: "#2CFBFF", textShadow: "0 0 40px rgba(44,251,255,0.4)" }}>
          fit
        </span>
      </div>

      {/* 부제 */}
      {subtitle && (
        <div style={{ fontSize: 36, fontWeight: 800, color: "white", marginBottom: 40, display: "flex" }}>
          {subtitle}
        </div>
      )}

      {/* 페이지별 콘텐츠 */}
      {children}

      {/* 태그라인 */}
      <div style={{ position: "absolute", bottom: 40, fontSize: 20, color: "rgba(255,255,255,0.35)", fontWeight: 500, display: "flex" }}>
        {tagline}
      </div>
    </div>
  );
}
