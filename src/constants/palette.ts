/**
 * 앱 전역 색상 팔레트 — 단일 진실 공급원(Single Source of Truth)
 *
 * 모든 컴포넌트에서 하드코딩된 색상값 대신 이 파일의 상수를 참조한다.
 */

export const PALETTE = {
  purple: { hex: "#A855F7", rgb: "168,85,247", hsl: "270,93%,67%" },
  cyan: { hex: "#2CFBFF", rgb: "44,251,255", hsl: "181,100%,59%" },
  pink: { hex: "#EC4899", rgb: "236,72,153", hsl: "330,82%,60%" },
  red: { hex: "#EF4444", rgb: "239,68,68", hsl: "0,86%,60%" },
  gold: { hex: "#F0A030", rgb: "240,160,48", hsl: "35,87%,56%" },
  rose: { hex: "#E04070", rgb: "224,64,112", hsl: "342,73%,56%" },
} as const;

/** 기본 --neon CSS 변수 값 */
export const DEFAULT_NEON = PALETTE.purple.rgb;
