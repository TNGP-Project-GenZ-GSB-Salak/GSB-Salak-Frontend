import { test, expect } from "@playwright/test";
import { createShooter } from "./helpers/screenshot.js";
import { loginAsDemo } from "./helpers/auth.js";
import { SAVINGS_ACCOUNT_ID, maskAccountNumber, SAVINGS_ACCOUNT_NUMBER } from "./helpers/fixtures.js";

test.describe("transaction history", () => {
  test("shows a debit entry for the savings account after a purchase", async ({ page }) => {
    const shoot = createShooter("transactions", "savings-account-history");

    await loginAsDemo(page);
    await page.goto(`/accounts/${SAVINGS_ACCOUNT_ID}/transactions`);
    await shoot(page, "transactions-loaded");

    await expect(page.getByText(maskAccountNumber(SAVINGS_ACCOUNT_NUMBER))).toBeVisible();

    const rows = page.getByTestId("transaction-row");
    await expect(rows.first()).toBeVisible();
    const descriptions = await rows.allTextContents();
    expect(descriptions.some((text) => /buy digital salak/i.test(text))).toBe(true);

    await shoot(page, "verified");
  });
});
