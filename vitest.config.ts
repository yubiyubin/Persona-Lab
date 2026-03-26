import { defineConfig } from "vitest/config";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/app/**",
        "src/styles/**",
        "src/**/*.d.ts",
        // 순수 데이터/상수 파일 (로직 없음)
        "src/data/metadata.ts",
        "src/data/ui-text.ts",
        "src/data/symbols.ts",
        "src/data/tabs.ts",
        "src/data/graph-constants.ts",
        "src/data/groups.ts",
        // SEO/메타 파일
        "src/lib/og-template.tsx",
        "src/lib/json-ld.tsx",
        // Canvas 의존 컴포넌트 (jsdom에서 테스트 불가)
        "src/components/NetworkGraph.tsx",
        "src/components/SiteFooter.tsx",
        "src/components/SiteHeader.tsx",
        "src/components/TabSwitcher.tsx",
        "src/components/CloseButton.tsx",
        "src/components/CompatCard.tsx",
        "src/components/DetailScoreCard.tsx",
        "src/components/ModalOverlay.tsx",
        // Canvas/애니메이션 의존 컴포넌트
        "src/features/group-match/components/GroupGrid.tsx",
        "src/features/group-match/components/BatteryGauge.tsx",
        "src/features/group-match/components/DropdownPicker.tsx",
        "src/features/mbti-love/components/CoupleResult.tsx",
        "src/features/mbti-map/components/MbtiGraph.tsx",
        "src/features/mbti-map/components/MbtiGrid.tsx",
        "src/features/mbti-map/components/CompatDetailModal.tsx",
        "src/features/mbti-map/components/MbtiBadge.tsx",
        // lib: Canvas 의존
        "src/lib/node-styles.ts",
        // hooks
        "src/hooks/useAutoScroll.ts",
        // context
        "src/context/MbtiContext.tsx",
        // 순수 데이터 상수
        "src/features/group-match/consts/avatars.ts",
        "src/features/group-match/consts/battery-tiers.ts",
        "src/features/group-match/consts/dummy-preview.ts",
        "src/features/mbti-love/consts/detail-emojis.ts",
        "src/features/mbti-love/consts/love-descriptions.ts",
        "src/features/mbti-love/consts/love-desc/**",
        "src/constants/**",
      ],
      thresholds: { lines: 90, functions: 90, branches: 85, statements: 90 },
    },
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
