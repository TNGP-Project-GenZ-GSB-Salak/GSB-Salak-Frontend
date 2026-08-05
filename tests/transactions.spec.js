import { test, expect } from "@playwright/test";
import { createShooter } from "./helpers/screenshot.js";
import { registerFreshUser } from "./helpers/auth.js";

async function enterAmountViaKeypad(page, digits) {
  await page.getByTestId("amount-trigger").click();
  await page.getByTestId("amount-custom").click();
  for (const digit of digits) {
    await page.getByTestId(`keypad-key-${digit}`).click();
  }
  await page.getByTestId("keypad-confirm").click();
}

test.describe("transaction history", () => {
  test("shows a debit entry for the savings account after a purchase", async ({ page }) => {
    const shoot = createShooter("transactions", "savings-account-history");

    await registerFreshUser(page);

    // This spec needs a real debit on ITS OWN savings account, so it buys
    // Salak itself rather than depending on buy-salak.spec.js having already
    // run against a shared demo account.
    await page.goto("/salak/buy");
    await page.getByTestId("buy-button").first().click();
    await page.getByTestId("mode-buy-now").click();
    await page.waitForURL(/\/salak\/buy\/.+/);
    await enterAmountViaKeypad(page, ["2", "0", "0", "0"]);
    await page.getByTestId("slide-to-confirm").click();
    await page.getByTestId("confirm-button").click();
    await expect(page.getByTestId("receipt-ticket-range")).toBeVisible();

    await page.goto("/accounts");
    await page.getByTestId("account-row").nth(0).getByTestId("account-history-link").click();
    await page.waitForURL(/\/accounts\/.+\/transactions/);
    await shoot(page, "transactions-loaded");

    const rows = page.getByTestId("transaction-row");
    await expect(rows.first()).toBeVisible();
    const descriptions = await rows.allTextContents();
    expect(descriptions.some((text) => /buy digital salak/i.test(text))).toBe(true);

    await shoot(page, "verified");
  });
});
