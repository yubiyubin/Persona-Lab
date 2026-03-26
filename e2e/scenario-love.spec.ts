import { test, expect } from "@playwright/test";

test.describe("연인 궁합 확인", () => {
  test("MBTI 선택 후 상대방 선택 → 게이지 표시 확인", async ({ page }) => {
    // 1. /mbti-love 접속 — 먼저 메인에서 MBTI 선택 후 이동하거나 직접 URL 접근
    await page.goto("/mbti-love");

    // 2. MBTI 선택 모달에서 INTJ 클릭 (전역 MbtiContext 설정)
    const intjBtn = page.getByTestId("mbti-btn-INTJ");
    await expect(intjBtn).toBeVisible({ timeout: 10000 });
    await intjBtn.click();

    // MbtiSelectModal이 닫히고 CoupleResult가 렌더될 때까지 대기
    // CoupleResult의 inline MbtiSelectModal이 표시됨
    // 상대방 MBTI 선택 모달의 INTP 버튼 (mbti-btn-INTP)
    await expect(page.getByTestId("mbti-btn-INTP")).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId("mbti-btn-INTP").click();

    // 3. partner-btn이 나타날 때까지 대기 (상대 MBTI가 선택된 후 가로 스크롤 버튼들)
    await expect(page.getByTestId("partner-btn-INTP")).toBeVisible({
      timeout: 10000,
    });

    // 4. gauge-counter가 표시되는지 확인
    const gaugeCounter = page.getByTestId("gauge-counter");
    await expect(gaugeCounter).toBeVisible({ timeout: 10000 });
    await expect(gaugeCounter).toContainText(/\d+%/, { timeout: 8000 });

    // 5. 다른 상대방 MBTI(ENFP)로 변경 → 게이지가 여전히 표시됨
    const enfpPartnerBtn = page.getByTestId("partner-btn-ENFP");
    await expect(enfpPartnerBtn).toBeVisible({ timeout: 5000 });
    await enfpPartnerBtn.click();

    // 게이지가 여전히 렌더됨
    await expect(gaugeCounter).toBeVisible({ timeout: 5000 });
    await expect(gaugeCounter).toContainText(/\d+%/, { timeout: 8000 });
  });

  test("상대방 변경 후 게이지 숫자가 갱신된다", async ({ page }) => {
    await page.goto("/mbti-love");

    // INTJ 선택
    await expect(page.getByTestId("mbti-btn-INTJ")).toBeVisible({ timeout: 10000 });
    await page.getByTestId("mbti-btn-INTJ").click();

    // INTP 선택
    await expect(page.getByTestId("mbti-btn-INTP")).toBeVisible({ timeout: 10000 });
    await page.getByTestId("mbti-btn-INTP").click();

    // gauge-counter 확인
    const gaugeCounter = page.getByTestId("gauge-counter");
    await expect(gaugeCounter).toBeVisible({ timeout: 10000 });
    const firstText = await gaugeCounter.textContent();

    // ESFP로 변경 (INTJ-ESFP는 점수 0 → 다른 숫자)
    const esfpBtn = page.getByTestId("partner-btn-ESFP");
    await expect(esfpBtn).toBeVisible({ timeout: 5000 });
    await esfpBtn.click();

    // 게이지 여전히 표시됨
    await expect(gaugeCounter).toBeVisible({ timeout: 5000 });
    await expect(gaugeCounter).toContainText(/\d+%/, { timeout: 5000 });
    // INTP(98%)와 ESFP(0%)는 다른 점수이므로 텍스트가 변해야 함
    const secondText = await gaugeCounter.textContent();
    expect(firstText).not.toBe(secondText);
  });

  test("탭 이동 후 mbti-love 재방문 시 페이지가 정상 로드된다", async ({ page }) => {
    await page.goto("/mbti-love");

    // INTJ 선택
    await expect(page.getByTestId("mbti-btn-INTJ")).toBeVisible({ timeout: 10000 });
    await page.getByTestId("mbti-btn-INTJ").click();

    // INTP 선택
    await expect(page.getByTestId("mbti-btn-INTP")).toBeVisible({ timeout: 10000 });
    await page.getByTestId("mbti-btn-INTP").click();

    // partner-btn-INTP가 표시될 때까지 대기 (상태 확인)
    await expect(page.getByTestId("partner-btn-INTP")).toBeVisible({ timeout: 10000 });

    // /mbti-map 탭으로 이동 후 돌아오기
    await page.goto("/mbti-map");
    await page.goto("/mbti-love");
    await page.waitForLoadState("networkidle");

    // mbti-love 페이지가 정상 로드되어야 함 (모달이 뜨거나 결과가 보여야 함)
    const hasMbtiModal = await page.getByTestId("mbti-btn-INTJ").isVisible().catch(() => false);
    const hasPartnerBtns = await page.locator("[data-testid^='partner-btn-']").first().isVisible().catch(() => false);

    expect(hasMbtiModal || hasPartnerBtns).toBe(true);
  });
});
