import { test, expect } from "@playwright/test";
import { createShooter } from "./helpers/screenshot.js";
import { registerFreshUser } from "./helpers/auth.js";

async function enterAmountViaKeypad(page, digits) {
  await page.getByTestId("amount-trigger").click();
  await page.getByTestId("amount-custom").click();
  await page.getByTestId("amount-input").fill(digits.join(""));
  await page.getByTestId("amount-input").evaluate((el) => el.blur());
}

test.describe("buy salak", () => {
  test("mode-choose sheet offers buy-now and a save-first option into the Kapook goal-setup flow", async ({ page }) => {
    const shoot = createShooter("buy-salak", "mode-choose");

    await registerFreshUser(page);
    await page.goto("/salak/buy");
    await page.getByTestId("buy-button").first().click();
    await shoot(page, "mode-choose-sheet");

    await expect(page.getByTestId("mode-buy-now")).toBeEnabled();
    await expect(page.getByTestId("mode-save-first")).toBeEnabled();

    await page.getByTestId("mode-save-first").click();
    await page.waitForURL(/\/kapook\/(open|goal\/new)/);
    await shoot(page, "save-first-entry");
  });

  test("below-minimum amount is rejected and blocks the slide-to-send control", async ({ page }) => {
    const shoot = createShooter("buy-salak", "below-minimum");

    await registerFreshUser(page);
    await page.goto("/salak/buy");
    await page.getByTestId("buy-button").first().click();
    await page.getByTestId("mode-buy-now").click();
    await page.waitForURL(/\/salak\/buy\/.+/);
    await shoot(page, "transfer-screen");

    await enterAmountViaKeypad(page, ["5", "0", "0"]);
    await shoot(page, "amount-below-minimum");

    await expect(page.getByTestId("amount-error")).toHaveText(/ฝากขั้นต่ำ/);

    // The slide control ignores clicks while the amount is invalid, so it
    // never advances past the transfer screen.
    await page.getByTestId("slide-to-confirm").click();
    await page.waitForTimeout(300);
    await expect(page.getByText("โอนเงิน")).toBeVisible();
    await shoot(page, "still-on-transfer");
  });

  test("happy path: buy a product and see it appear back on the salak overview", async ({ page }) => {
    const shoot = createShooter("buy-salak", "success");

    await registerFreshUser(page);
    await page.goto("/salak/buy");
    await page.getByTestId("buy-button").first().click();
    await shoot(page, "mode-choose-sheet");

    await page.getByTestId("mode-buy-now").click();
    await page.waitForURL(/\/salak\/buy\/.+/);
    await shoot(page, "transfer-screen");

    await enterAmountViaKeypad(page, ["2", "0", "0", "0"]);
    await expect(page.getByTestId("amount-trigger")).toContainText("2,000.00");
    await shoot(page, "amount-filled");

    await page.getByTestId("slide-to-confirm").click();
    await expect(page.getByText("ยืนยันข้อมูลการทำรายการ")).toBeVisible();
    await shoot(page, "confirm-screen");

    await page.getByTestId("confirm-button").click();
    await expect(page.getByTestId("receipt-ticket-range")).toBeVisible();
    await shoot(page, "success-screen");

    await page.getByRole("button", { name: "เสร็จสิ้น" }).click();
    await page.waitForURL("/salak");
    await shoot(page, "back-to-salak");

    await expect(page.getByTestId("holdings-table")).toContainText("Digital Salak 1-Year");
  });
});
