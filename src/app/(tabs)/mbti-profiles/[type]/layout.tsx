/**
 * MBTI 유형 상세 페이지 레이아웃 — 타입별 동적 SEO
 *
 * generateMetadata로 각 타입에 맞는 title/description 생성.
 * 예: "INTJ 성격 - 계획 없으면 불안한 두뇌 풀가동 전략가 | ChemiFit"
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/data/metadata";
import { MBTI_TYPES } from "@/data/compatibility";
import type { MbtiType } from "@/data/compatibility";
import { TYPE_PROFILES } from "@/data/type-profiles";

type Props = {
  params: Promise<{ type: string }>;
  children: ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const mbtiType = type.toUpperCase() as MbtiType;

  if (!MBTI_TYPES.includes(mbtiType)) return {};

  const profile = TYPE_PROFILES[mbtiType];
  const title = `${mbtiType} 성격 - ${profile.nickname}`;
  const description = `${mbtiType} 유형의 성격 특징, 장단점, 연애 스타일, 궁합을 알아보세요. ${profile.tags.slice(0, 3).join(" ")}`;
  const canonical = `/mbti-profiles/${type.toLowerCase()}`;

  return {
    title,
    description,
    keywords: [
      `${mbtiType} 성격`,
      `${mbtiType} 특징`,
      `${mbtiType} 유형`,
      `${mbtiType} 장단점`,
      `${mbtiType} 연애`,
      `${mbtiType} 궁합`,
      "MBTI 유형 설명",
    ],
    alternates: { canonical },
    openGraph: {
      title: `${title} | ChemiFit`,
      description,
      url: canonical,
      type: "article",
      locale: "ko_KR",
      siteName: SITE_NAME,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ChemiFit`,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function MbtiProfileTypeLayout({ params, children }: Props) {
  const { type } = await params;
  const mbtiType = type.toUpperCase() as MbtiType;

  if (!MBTI_TYPES.includes(mbtiType)) notFound();

  const profile = TYPE_PROFILES[mbtiType];
  const pageUrl = `${SITE_URL}/mbti-profiles/${type.toLowerCase()}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "ChemiFit", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "유형 설명", item: `${SITE_URL}/mbti-profiles` },
            { "@type": "ListItem", position: 3, name: mbtiType, item: pageUrl },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${mbtiType} 성격 특징 - ${profile.nickname}`,
          description: `${mbtiType} 유형의 성격 특징, 장단점, 연애 스타일을 알아보세요.`,
          url: pageUrl,
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }}
      />
      {children}
    </>
  );
}
