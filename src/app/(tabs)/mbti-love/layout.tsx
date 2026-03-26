import type { Metadata } from "next";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL, SITE_NAME, META, OG_IMAGE } from "@/data/metadata";

export const metadata: Metadata = {
  title: META.mbtiLove.title,
  description: META.mbtiLove.description,
  keywords: META.mbtiLove.keywords,
  alternates: { canonical: META.mbtiLove.canonical },
  openGraph: {
    title: META.mbtiLove.og.title,
    description: META.mbtiLove.og.description,
    url: META.mbtiLove.canonical,
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: META.mbtiLove.twitter.title,
    description: META.mbtiLove.twitter.description,
    images: [OG_IMAGE.url],
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
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "연애 궁합",
              item: `${SITE_URL}/mbti-love`,
            },
          ],
        }}
      />
      {children}
    </>
  );
}
