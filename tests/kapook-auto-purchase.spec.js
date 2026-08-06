import { test, expect } from "@playwright/test";
import { createShooter } from "./helpers/screenshot.js";
import { registerFreshUser } from "./helpers/auth.js";

// See docs/tests/e2e/KAPOOK-01-auto-purchase-lifecycle.md for the full
// scenario spec this implements.
test.describe("kapook auto-purchase lifecycle", () => {
  test("goal reaches target, countdown expires, and the real worker buys it with no page reload", async ({ page }) => {
    // The countdown (10s) plus the worker's own tick interval (3s, see
    // fixtures.js's KAPOOK_WORKER_TICK_INTERVAL) plus a few 5s UI poll
    // cycles can add up past Playwright's 30s default test timeout.
    test.setTimeout(90_000);

    const shoot = createShooter("kapook-auto-purchase", "lifecycle");

    await registerFreshUser(page);
    await page.goto("/salak/buy");
    await page.getByTestId("buy-button").first().click();
    await page.getByTestId("mode-save-first").click();
    await page.waitForURL(/\/kapook\/open/);
    await shoot(page, "onboarding-idcard");

    // KapookOnboarding: idcard -> review -> confirm dialog -> terms -> success
    await page.getByTestId("kyc-id-input").fill("123456789012");
    await page.getByTestId("kyc-next").click();
    await shoot(page, "onboarding-review");

    await page.getByTestId("kyc-confirm-button").click();
    await page.getByTestId("confirm-dialog-confirm").click();
    await shoot(page, "onboarding-terms");

    await page.getByTestId("accept-terms").click();
    await expect(page.getByTestId("go-to-goal-setup")).toBeVisible();
    await shoot(page, "onboarding-success");

    await page.getByTestId("go-to-goal-setup").click();
    await page.waitForURL(/\/kapook\/goal\/new/);
    await shoot(page, "goal-setup");

    // ฿5,000 preset: a multiple of the product's ฿1,000 step, reachable in
    // one deposit from the ฿50,000 registration-funded savings balance.
    await page.getByTestId("goal-amount-preset").filter({ hasText: "5,000" }).click();
    await page.getByTestId("goal-confirm-button").click();
    await page.waitForURL("/kapook");
    await shoot(page, "tracker-goal-open");

    await expect(page.getByText("ยังไม่มีเป้าหมายการออม")).toHaveCount(0);

    await page.getByTestId("kapook-deposit-action").click();
    await page.waitForURL(/\/kapook\/deposit/);
    await page.getByTestId("deposit-amount-trigger").click();
    await page.getByTestId("deposit-amount-input").fill("5000");
    await page.getByTestId("deposit-amount-input").evaluate((el) => el.blur());
    await shoot(page, "deposit-amount-filled");

    await page.getByTestId("slide-to-confirm").click();
    await page.waitForURL("/kapook");
    await shoot(page, "tracker-target-reached");

    // Server-driven countdown is now live: neither the processing nor the
    // deferred copy should show yet, just the ticking Countdown component.
    await expect(page.getByTestId("auto-purchase-processing")).toHaveCount(0);
    await expect(page.getByTestId("auto-purchase-deferred")).toHaveCount(0);
    await expect(page.getByText("ระบบจะซื้อสลากให้อัตโนมัติใน")).toBeVisible();

    // Take no action from here - the countdown must expire and the real
    // cmd/worker process must pick it up on its own. First: the UI's own
    // 5s poll should flip to the "processing" copy once the countdown hits
    // zero, before the worker has necessarily committed the purchase yet.
    await expect(page.getByTestId("auto-purchase-processing")).toBeVisible({ timeout: 30_000 });
    await shoot(page, "tracker-processing");

    // Then, within a few more worker ticks, the goal should actually close
    // and the tracker should fall back to its empty state - all without a
    // page reload (Playwright's own polling `expect` re-checks the live DOM).
    await expect(page.getByText("ยังไม่มีเป้าหมายการออม")).toBeVisible({ timeout: 30_000 });
    await shoot(page, "tracker-goal-closed");

    // Salak overview: the auto-purchase-notice banner and the new holding.
    await page.goto("/salak");
    await expect(page.getByTestId("auto-purchase-banner")).toBeVisible();
    await shoot(page, "salak-auto-purchase-banner");

    const holdingRow = page.getByTestId("holding-row").first();
    await expect(holdingRow).toBeVisible();
    const holdingText = await holdingRow.textContent();
    // Ticket range renders as "<letter><7 digits> - <letter><7 digits>".
    expect(holdingText).toMatch(/[ก-ฮ]\d{7} - [ก-ฮ]\d{7}/);
    await shoot(page, "salak-holdings-list");

    // Transaction history: a debit-side ledger entry for the purchase.
    await page.getByTestId("salak-history-link").click();
    await page.waitForURL(/\/accounts\/.+\/transactions/);
    await expect(page.getByTestId("transaction-row").first()).toBeVisible();
    await shoot(page, "salak-transaction-history");
  });
});
