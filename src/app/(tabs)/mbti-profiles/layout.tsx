import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL, SITE_NAME, META, OG_IMAGE } from "@/data/metadata";

export const metadata: Metadata = {
  title: META.mbtiProfiles.title,
  description: META.mbtiProfiles.description,
  keywords: META.mbtiProfiles.keywords,
  alternates: { canonical: META.mbtiProfiles.canonical },
  openGraph: {
    title: META.mbtiProfiles.og.title,
    description: META.mbtiProfiles.og.description,
    url: META.mbtiProfiles.canonical,
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: META.mbtiProfiles.twitter.title,
    description: META.mbtiProfiles.twitter.description,
    images: [OG_IMAGE.url],
  },
};

export default function MbtiProfilesLayout({ children }: { children: ReactNode }) {
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
              name: "유형 설명",
              item: `${SITE_URL}/mbti-profiles`,
            },
          ],
        }}
      />
      {children}
    </>
  );
}
