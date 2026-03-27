/**
 * MBTI 유형 상세 페이지 — 동적 라우트
 *
 * URL: /mbti-profiles/intj → params.type = "intj" → "INTJ" 변환 후 데이터 조회.
 * generateStaticParams로 16개 타입 정적 생성.
 */
import { notFound } from "next/navigation";
import { MBTI_TYPES } from "@/data/compatibility";
import type { MbtiType } from "@/data/compatibility";
import { TYPE_PROFILES } from "@/data/type-profiles";
import ProfileDetail from "@/features/mbti-profiles/components/ProfileDetail";

export function generateStaticParams() {
  return MBTI_TYPES.map((type) => ({ type: type.toLowerCase() }));
}

type Props = {
  params: Promise<{ type: string }>;
};

export default async function MbtiProfileTypePage({ params }: Props) {
  const { type } = await params;
  const mbtiType = type.toUpperCase() as MbtiType;

  if (!MBTI_TYPES.includes(mbtiType)) {
    notFound();
  }

  const profile = TYPE_PROFILES[mbtiType];

  return (
    <div>
      <ProfileDetail profile={profile} />
    </div>
  );
}
