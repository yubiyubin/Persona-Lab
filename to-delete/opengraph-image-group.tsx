import { ImageResponse } from "next/og";
import { OgTemplate } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "ChemiFit - 그룹 궁합";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <OgTemplate logoOnly />,
    { ...size },
  );
}
