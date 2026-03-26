import type { Metadata } from "next";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL } from "@/data/metadata";

export const metadata: Metadata = {
  title: "그룹 MBTI 궁합 - 팀 케미 분석",
  description:
    "2~8명의 MBTI로 그룹 궁합을 네트워크 그래프로 시각화. 평균·최고·최저 궁합과 팀 역할까지 분석합니다.",
  alternates: { canonical: "/group-match" },
  openGraph: {
    title: "그룹 MBTI 궁합 - 팀 케미 분석 | ChemiFit",
    description:
      "2~8명의 MBTI로 그룹 궁합을 네트워크 그래프로 시각화합니다.",
    url: "/group-match",
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

export default function GroupMatchLayout({
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
              name: "그룹 궁합",
              item: `${SITE_URL}/group-match`,
            },
          ],
        }}
      />
      {children}
    </>
  );
}
