import type { Metadata } from "next";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL } from "@/data/metadata";

export const metadata: Metadata = {
  title: "MBTI 궁합 맵 - 16타입 궁합 순위",
  description:
    "내 MBTI와 16가지 유형의 궁합을 점수·순위로 한눈에 확인하세요. 네트워크 그래프로 시각화된 궁합 맵.",
  alternates: { canonical: "/mbti-map" },
  openGraph: {
    title: "MBTI 궁합 맵 - 16타입 궁합 순위 | ChemiFit",
    description:
      "내 MBTI와 16가지 유형의 궁합을 점수·순위로 한눈에 확인하세요.",
    url: "/mbti-map",
    type: "website",
    locale: "ko_KR",
    siteName: "ChemiFit",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
};

export default function MbtiMapLayout({
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
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "궁합 맵",
              item: `${SITE_URL}/mbti-map`,
            },
          ],
        }}
      />
      {children}
    </>
  );
}
