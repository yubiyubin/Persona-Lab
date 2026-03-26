import type { Metadata } from "next";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL, SITE_NAME, META, OG_IMAGE } from "@/data/metadata";

export const metadata: Metadata = {
  title: META.mbtiMap.title,
  description: META.mbtiMap.description,
  keywords: META.mbtiMap.keywords,
  alternates: { canonical: META.mbtiMap.canonical },
  openGraph: {
    title: META.mbtiMap.og.title,
    description: META.mbtiMap.og.description,
    url: META.mbtiMap.canonical,
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: META.mbtiMap.twitter.title,
    description: META.mbtiMap.twitter.description,
    images: [OG_IMAGE.url],
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
