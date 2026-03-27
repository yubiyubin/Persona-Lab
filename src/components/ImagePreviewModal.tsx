/**
 * ImagePreviewModal — 이미지 저장 전 미리보기 모달
 *
 * 이미지 저장 버튼 클릭 시 바로 다운로드하지 않고,
 * 미리보기를 보여준 후 "저장" 버튼으로 다운로드를 트리거한다.
 */
"use client";

import ModalOverlay from "@/components/ModalOverlay";
import CloseButton from "@/components/CloseButton";
import { COMMON } from "@/data/ui-text";

type Props = {
  /** 미리보기할 이미지 data URL. null이면 모달을 렌더링하지 않음 */
  imageDataUrl: string | null;
  /** 다운로드 파일명 */
  fileName: string;
  onClose: () => void;
};

export default function ImagePreviewModal({ imageDataUrl, fileName, onClose }: Props) {
  if (!imageDataUrl) return null;

  function handleSave() {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = imageDataUrl!;
    link.click();
  }

  return (
    <ModalOverlay
      onClose={onClose}
      blur
      rgb="168,85,247"
      cardClassName="w-full max-w-sm sm:max-w-md"
    >
      <div className="relative flex flex-col gap-4 p-5 bg-[#0f0f1a] rounded-2xl">
        <CloseButton onClick={onClose} />
        <p className="text-sm font-bold text-white/70 text-center pr-6">
          {COMMON.previewTitle}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element -- data URL은 next/image 미지원 */}
        <img
          src={imageDataUrl}
          alt="미리보기"
          className="w-full rounded-xl object-contain"
          style={{ maxHeight: "60vh" }}
        />
        <button
          data-testid="preview-save-btn"
          onClick={handleSave}
          className="neon-ghost w-full py-2.5 rounded-xl text-sm font-bold"
          style={{ "--neon": "168,85,247" } as React.CSSProperties}
        >
          {COMMON.saveBtn}
        </button>
      </div>
    </ModalOverlay>
  );
}
