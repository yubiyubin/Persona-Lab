/**
 * @file ScoreDetailPopup.tsx
 * @description 점수 기반 궁합 상세 팝업의 공용 껍데기 컴포넌트
 *
 * GroupGrid 인라인 팝업과 CompatDetailModal이 공유한다.
 *
 * ### 고정 레이아웃 (위 → 아래)
 * 1. CloseButton (우측 상단 ✕)
 * 2. 등급 이모지
 * 3. 점수% — 동적 HSL 색상
 * 4. metaSlot — 점수 아래 커스텀 영역 (MBTI 쌍, 멤버 이름, 백분위 등)
 * 5. 등급 라벨 뱃지 — 동적 HSL 색상
 * 6. gauge — 게이지 바 (mb-4 래퍼 포함)
 * 7. extraSlot — 게이지 뒤 선택적 영역 (구분선, 미리보기 등)
 * 8. getLoveFriendLine 텍스트
 * 9. children — CTA 버튼들
 */
"use client";

import type { ReactNode } from "react";
import CloseButton from "@/components/CloseButton";
import ModalOverlay from "@/components/ModalOverlay";
import { getScoreInfo, getLoveFriendLine } from "@/data/labels";
import { scoreTierHue } from "@/data/colors";

type Props = {
  onClose: () => void;
  /** ModalOverlay 네온 테마 RGB (보더·글로우 색상) */
  rgb: string;
  score: number;
  /** 점수% 아래 ~ 등급 라벨 뱃지 위 슬롯 */
  metaSlot: ReactNode;
  /** 게이지 바 구현체 (ScoreBar 또는 인라인 div) */
  gauge: ReactNode;
  /** 게이지 ~ getLoveFriendLine 사이 선택적 슬롯 */
  extraSlot?: ReactNode;
  /** 하단 CTA 버튼들 */
  children: ReactNode;
  /** 루트 div의 data-testid */
  testId?: string;
};

export default function ScoreDetailPopup({
  onClose,
  rgb,
  score,
  metaSlot,
  gauge,
  extraSlot,
  children,
  testId,
}: Props) {
  const info = getScoreInfo(score);
  const hue = scoreTierHue(score);

  return (
    <ModalOverlay onClose={onClose} align="transform" rgb={rgb}>
      <div
        data-testid={testId}
        className="rounded-2xl p-6 text-center"
        style={{ background: "#0d0d1a" }}
      >
        <CloseButton onClick={onClose} />

        {/* 등급 이모지 */}
        <div className="text-4xl mb-2">{info.emoji}</div>

        {/* 점수% */}
        <div
          className="text-2xl font-black mb-1"
          style={{
            color: `hsl(${hue},70%,65%)`,
            textShadow: `0 0 12px hsla(${hue},70%,55%,0.6)`,
          }}
        >
          {score}%
        </div>

        {/* 메타 슬롯 */}
        {metaSlot}

        {/* 등급 라벨 뱃지 */}
        <div
          className="inline-block text-xs px-3 py-1 rounded-full mb-4"
          style={{
            color: `hsl(${hue},70%,65%)`,
            background: `hsla(${hue},60%,40%,0.12)`,
            border: `0.5px solid hsla(${hue},60%,50%,0.25)`,
          }}
        >
          {info.label}
        </div>

        {/* 게이지 바 */}
        <div className="mb-4">{gauge}</div>

        {/* 추가 슬롯 */}
        {extraSlot}

        {/* 궁합 설명 */}
        <p
          className="text-xs sm:text-sm font-medium leading-relaxed mb-4"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {getLoveFriendLine(score)}
        </p>

        {/* CTA 버튼들 */}
        {children}
      </div>
    </ModalOverlay>
  );
}
