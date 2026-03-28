/**
 * @file CompatDetailModal.tsx
 * @description 궁합 상세 팝업 모달 (궁합 맵 전용)
 *
 * 궁합 맵(MbtiGrid)의 배지 클릭, 그래프(MbtiGraph)의 노드/선 클릭 시 공유하는 모달.
 * 공용 껍데기는 ScoreDetailPopup을 사용한다.
 *
 * data가 null이면 렌더링하지 않는다.
 */
"use client";

import { useRouter } from "next/navigation";
import { COMPAT_DETAIL, CTA_TEXTS } from "@/data/ui-text";
import CtaButton from "@/components/CtaButton";
import { scoreTierHue } from "@/data/colors";
import { LOVE_DESC } from "@/features/mbti-love/consts/love-descriptions";
import { getScorePercentile } from "@/data/compatibility";
import type { MbtiType } from "@/data/compatibility";
import ScoreBar from "@/components/ScoreBar";
import ScoreDetailPopup from "@/components/ScoreDetailPopup";
import { CYAN_RGB, PINK_RGB, PURPLE_RGB } from "@/styles/card-themes";

export type CompatDetailData = {
  my: string;
  other: string;
  score: number;
} | null;

type Props = {
  data: CompatDetailData;
  onClose: () => void;
};

export default function CompatDetailModal({ data, onClose }: Props) {
  const router = useRouter();
  if (!data) return null;

  const { my, other, score } = data;
  const hue = scoreTierHue(score);
  const preview = LOVE_DESC[my as MbtiType]?.[other as MbtiType]?.preview;
  const percentile = getScorePercentile(score);

  return (
    <ScoreDetailPopup
      onClose={onClose}
      rgb={PURPLE_RGB}
      score={score}
      testId="compat-detail-modal"
      metaSlot={
        <>
          <p
            className="text-xs font-semibold mb-1"
            style={{ color: `hsl(${hue},70%,65%)` }}
          >
            {COMPAT_DETAIL.percentileLabel} {percentile}%
          </p>
          <div className="text-sm font-bold text-white/80 mb-1">
            {my} × {other}
          </div>
        </>
      }
      gauge={<ScoreBar score={score} height="h-1.5" />}
      extraSlot={
        <>
          <div className="h-px bg-white/10 mb-4" />
          {preview && (
            <p
              className="text-xs font-bold mb-2 italic"
              style={{ color: `hsl(${hue},70%,70%)` }}
            >
              &ldquo;{preview}&rdquo;
            </p>
          )}
        </>
      }
    >
      {/* 연인 궁합 바로가기 */}
      <CtaButton
        data-testid="love-cta"
        title={CTA_TEXTS.map.toLove.modal}
        rgb={PINK_RGB}
        onClick={() => {
          onClose();
          router.push(`/mbti-love?mbti=${my}&partner=${other}`);
        }}
      />
      {/* 그룹 케미 CTA */}
      <CtaButton
        title={CTA_TEXTS.map.toGroup.modal}
        rgb={CYAN_RGB}
        className="mt-2"
        onClick={() => {
          onClose();
          router.push("/group-match");
        }}
      />
    </ScoreDetailPopup>
  );
}
