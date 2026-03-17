import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personality Lab",
  description: "MBTI 궁합, 동물 매칭, 그리고 더 많은 성격 콘텐츠",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
