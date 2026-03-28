/**
 * @file useCopyLink.ts
 * @description 현재 URL을 클립보드에 복사하고 2초간 copied 상태를 true로 유지하는 훅.
 *
 * GroupGrid, MbtiGrid 등 링크 복사 버튼이 있는 곳에서 공통으로 사용.
 */
import { useState, useCallback } from "react";

export function useCopyLink() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return { copied, copy };
}
