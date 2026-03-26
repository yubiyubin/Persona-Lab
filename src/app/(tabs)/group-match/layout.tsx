import type { Metadata } from "next";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL, SITE_NAME, META, OG_IMAGE } from "@/data/metadata";

export const metadata: Metadata = {
  title: META.groupMatch.title,
  description: META.groupMatch.description,
  keywords: META.groupMatch.keywords,
  alternates: { canonical: META.groupMatch.canonical },
  openGraph: {
    title: META.groupMatch.og.title,
    description: META.groupMatch.og.description,
    url: META.groupMatch.canonical,
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: META.groupMatch.twitter.title,
    description: META.groupMatch.twitter.description,
    images: [OG_IMAGE.url],
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
