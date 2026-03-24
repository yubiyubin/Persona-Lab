/**
 * 조건이 참일 때 ref 요소로 smooth scroll — 궁합맵·그룹궁합 페이지에서 공유
 */
import { useEffect, type RefObject } from "react";

export function useAutoScroll(
  ref: RefObject<HTMLElement | null>,
  trigger: unknown,
  opts?: { delay?: number },
) {
  useEffect(() => {
    if (!trigger) return;
    const scroll = () =>
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (opts?.delay) {
      const t = setTimeout(scroll, opts.delay);
      return () => clearTimeout(t);
    }
    requestAnimationFrame(scroll);
  }, [trigger, ref, opts?.delay]);
}
