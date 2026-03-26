import { test, expect } from "@playwright/test";

test.describe("그룹 궁합 분석 + URL 공유", () => {
  test("8명 최대 추가 시도 → 추가 버튼 비활성화 확인", async ({ page }) => {
    await page.goto("/group-match");

    // MBTI 선택
    await expect(page.getByTestId("mbti-btn-INTJ")).toBeVisible({ timeout: 10000 });
    await page.getByTestId("mbti-btn-INTJ").click();

    const memberCount = page.getByTestId("member-count");
    await expect(memberCount).toBeVisible({ timeout: 10000 });

    const nameInput = page.getByTestId("member-name-input");
    const addBtn = page.getByTestId("member-add-btn");

    // 8명 추가
    for (let i = 1; i <= 8; i++) {
      await nameInput.fill(`멤버${i}`);
      await addBtn.click();
    }

    // 8명 상태 확인
    await expect(memberCount).toContainText("8/8", { timeout: 5000 });

    // 추가 버튼이 비활성화되어야 함
    await expect(addBtn).toBeDisabled();
  });

  test("멤버 전부 삭제 시 처리 확인", async ({ page }) => {
    await page.goto("/group-match");

    // MBTI 선택
    await expect(page.getByTestId("mbti-btn-ENFP")).toBeVisible({ timeout: 10000 });
    await page.getByTestId("mbti-btn-ENFP").click();

    const memberCount = page.getByTestId("member-count");
    await expect(memberCount).toBeVisible({ timeout: 10000 });

    const nameInput = page.getByTestId("member-name-input");

    // 3명 추가
    for (let i = 1; i <= 3; i++) {
      await nameInput.fill(`멤버${i}`);
      await page.getByTestId("member-add-btn").click();
    }
    await expect(memberCount).toContainText("3/8", { timeout: 5000 });

    // 모두 삭제 (역순으로)
    for (let i = 2; i >= 0; i--) {
      const removeBtn = page.getByTestId(`member-remove-${i}`);
      await expect(removeBtn).toBeVisible({ timeout: 3000 });
      await removeBtn.click();
    }

    // 0명 상태 확인
    await expect(memberCount).toContainText("0/8", { timeout: 5000 });

    // 추가 버튼이 활성화되어야 함
    await expect(page.getByTestId("member-add-btn")).not.toBeDisabled();
  });

  test("멤버 추가/삭제 + 결과 표시 + URL 공유", async ({ page }) => {
    // 1. /group-match 접속, MBTI 모달에서 INTJ 선택
    await page.goto("/group-match");

    // MBTI 선택 모달에서 INTJ 클릭
    const intjBtn = page.getByTestId("mbti-btn-INTJ");
    await expect(intjBtn).toBeVisible({ timeout: 10000 });
    await intjBtn.click();

    // member-count가 나타날 때까지 대기
    const memberCount = page.getByTestId("member-count");
    await expect(memberCount).toBeVisible({ timeout: 10000 });

    // 2. 첫 번째 멤버 추가 (INFP)
    const nameInput = page.getByTestId("member-name-input");
    await nameInput.fill("멤버1");
    await page.locator("select").selectOption("INFP");
    await page.getByTestId("member-add-btn").click();

    // 1명이 되었는지 확인
    await expect(memberCount).toContainText("1/8", { timeout: 5000 });

    // 3. 두 번째 멤버 추가 (ENFP)
    await nameInput.fill("멤버2");
    await page.locator("select").selectOption("ENFP");
    await page.getByTestId("member-add-btn").click();

    // 4. member-count 확인 (2/8 → 나중에 나 추가 고려 없이 2/8)
    await expect(memberCount).toContainText("2/8", { timeout: 5000 });

    // 5. 세 번째 멤버 추가 (INTJ)
    await nameInput.fill("멤버3");
    await page.locator("select").selectOption("INTJ");
    await page.getByTestId("member-add-btn").click();

    // 3/8 확인
    await expect(memberCount).toContainText("3/8", { timeout: 5000 });

    // 6. group-avg-score 숫자 표시 확인 (애니메이션 완료 대기)
    const avgScore = page.getByTestId("group-avg-score");
    await expect(avgScore).toBeVisible({ timeout: 10000 });

    // 7. group-roles 역할 분석 표시 확인
    const groupRoles = page.getByTestId("group-roles");
    await expect(groupRoles).toBeVisible({ timeout: 10000 });

    // 8. member-remove-1 클릭 → count 감소 확인
    const removeBtn = page.getByTestId("member-remove-1");
    await expect(removeBtn).toBeVisible({ timeout: 5000 });
    await removeBtn.click();

    // 멤버 수가 2로 감소해야 함
    await expect(memberCount).toContainText("2/8", { timeout: 5000 });

    // 9. URL에 ?group= 파라미터 포함 확인
    // 멤버 2명으로 URL이 업데이트될 때까지 대기 (group= 파라미터에 2명 데이터)
    // member-count가 2/8임을 확인 후 URL 캡처
    await expect(memberCount).toContainText("2/8", { timeout: 5000 });
    // URL 업데이트 대기 (router.replace는 비동기)
    await page.waitForTimeout(500);
    const url = page.url();
    expect(url).toContain("group=");

    // 10. 새 페이지에서 동일 URL 접속 → 동일 멤버 수(2명) 확인
    const newPage = await page.context().newPage();
    await newPage.goto(url);
    await expect(newPage.getByTestId("member-count")).toContainText("2/8", {
      timeout: 10000,
    });
    await newPage.close();
  });
});
