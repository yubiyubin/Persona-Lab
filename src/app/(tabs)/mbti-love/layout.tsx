import type { Metadata } from "next";
import { JsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "MBTI 연애 궁합 - 커플 궁합 테스트",
  description:
    "나와 상대의 MBTI 연애 궁합 점수, 싸움 패턴, 해결법까지 상세하게 분석합니다. 256가지 조합의 궁합을 확인하세요.",
  alternates: { canonical: "/mbti-love" },
  openGraph: {
    title: "MBTI 연애 궁합 - 커플 궁합 테스트 | ChemiFit",
    description:
      "나와 상대의 MBTI 연애 궁합 점수, 싸움 패턴, 해결법까지 상세하게.",
    url: "/mbti-love",
    type: "website",
    locale: "ko_KR",
    siteName: "ChemiFit",
  },
};

export default function MbtiLoveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "ChemiFit",
              item: "https://chemifit.vercel.app",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "연애 궁합",
              item: "https://chemifit.vercel.app/mbti-love",
            },
          ],
        }}
      />
      {children}
    </>
  );
}
