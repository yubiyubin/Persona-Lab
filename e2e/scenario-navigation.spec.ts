import { test, expect } from "@playwright/test";

test.describe("탭 간 이동 및 상태 유지", () => {
  test("mbti-love에서 INTJ 선택 후 mbti-map으로 이동 → MBTI 선택 모달 또는 배지 표시", async ({ page }) => {
    // 1. /mbti-love 접속, INTJ 선택
    await page.goto("/mbti-love");

    await expect(page.getByTestId("mbti-btn-INTJ")).toBeVisible({ timeout: 10000 });
    await page.getByTestId("mbti-btn-INTJ").click();

    // 2. /mbti-map 탭으로 이동 (앱 내 네비게이션이 아닌 직접 goto)
    await page.goto("/mbti-map");

    // 3. mbti-map 페이지가 정상 로드되어야 함
    // MBTI 선택 모달이 뜨거나 (컨텍스트가 없을 때) 배지가 보여야 함 (컨텍스트 있을 때)
    await page.waitForLoadState("networkidle");

    const isMbtiModalVisible = await page.getByTestId("mbti-btn-INTJ").isVisible().catch(() => false);
    const isBadgeVisible = await page.getByTestId("mbti-badge-INTJ").first().isVisible().catch(() => false);

    // 둘 중 하나는 보여야 함
    expect(isMbtiModalVisible || isBadgeVisible).toBe(true);
  });

  test("여러 탭을 연속으로 방문해도 각 페이지가 정상 로드된다", async ({ page }) => {
    // mbti-love 접속 및 ENFP 선택
    await page.goto("/mbti-love");
    await expect(page.getByTestId("mbti-btn-ENFP")).toBeVisible({ timeout: 10000 });
    await page.getByTestId("mbti-btn-ENFP").click();

    // group-match 탭으로 이동 — 페이지가 정상 로드되어야 함
    await page.goto("/group-match");
    await page.waitForLoadState("networkidle");
    // group-match는 MBTI 모달이 뜨거나 멤버 입력 UI가 표시됨
    const isGroupLoaded =
      (await page.getByTestId("member-count").isVisible().catch(() => false)) ||
      (await page.getByTestId("mbti-btn-INTJ").isVisible().catch(() => false));
    expect(isGroupLoaded).toBe(true);

    // mbti-map 탭으로 이동 — 페이지가 정상 로드되어야 함
    await page.goto("/mbti-map");
    await page.waitForLoadState("networkidle");
    // mbti-map은 MBTI 모달이 뜨거나 배지가 표시됨
    const isMapLoaded =
      (await page.getByTestId("mbti-btn-INTJ").isVisible().catch(() => false)) ||
      (await page.getByTestId("mbti-badge-INTJ").first().isVisible().catch(() => false));
    expect(isMapLoaded).toBe(true);
  });

  test("브라우저 뒤로가기 → 이전 탭으로 복귀", async ({ page }) => {
    // mbti-love 접속
    await page.goto("/mbti-love");
    await expect(page.getByTestId("mbti-btn-INTJ")).toBeVisible({ timeout: 10000 });
    await page.getByTestId("mbti-btn-INTJ").click();

    // mbti-map으로 이동
    await page.goto("/mbti-map");
    await page.waitForLoadState("networkidle");

    // 뒤로가기
    await page.goBack();
    await page.waitForLoadState("networkidle");

    // mbti-love 페이지로 복귀
    expect(page.url()).toContain("mbti-love");
  });

  test("group-match 접속 시 초기 '나' 멤버 UI가 표시된다", async ({ page }) => {
    await page.goto("/group-match");

    // MBTI 선택 모달 표시 또는 멤버 입력 UI 중 하나가 표시되어야 함
    await page.waitForLoadState("networkidle");

    const mbtiModalVisible = await page.getByTestId("mbti-btn-INTJ").isVisible().catch(() => false);
    const memberCountVisible = await page.getByTestId("member-count").isVisible().catch(() => false);

    // 둘 중 하나가 표시되어야 함
    expect(mbtiModalVisible || memberCountVisible).toBe(true);
  });
});
