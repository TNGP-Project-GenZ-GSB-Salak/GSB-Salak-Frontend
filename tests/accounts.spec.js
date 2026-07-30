import { test, expect } from "@playwright/test";
import { createShooter } from "./helpers/screenshot.js";
import { loginAsDemo } from "./helpers/auth.js";
import { SAVINGS_ACCOUNT_NUMBER, SALAK_ACCOUNT_NUMBER, maskAccountNumber } from "./helpers/fixtures.js";

test.describe("accounts", () => {
  test("renders both seeded accounts with masked numbers and balances", async ({ page }) => {
    const shoot = createShooter("accounts", "accounts-render");

    await loginAsDemo(page);
    await page.goto("/accounts");
    await shoot(page, "accounts-loaded");

    await expect(page.getByTestId("account-row")).toHaveCount(2);
    const accountNumbers = await page.getByTestId("account-number").allTextContents();
    expect(accountNumbers).toContain(maskAccountNumber(SAVINGS_ACCOUNT_NUMBER));
    expect(accountNumbers).toContain(maskAccountNumber(SALAK_ACCOUNT_NUMBER));

    await shoot(page, "verified");
  });

  test("clicking the savings account navigates to its transaction history", async ({ page }) => {
    const shoot = createShooter("accounts", "savings-navigation");

    await loginAsDemo(page);
    await page.goto("/accounts");

    const savingsRow = page
      .getByTestId("account-row")
      .filter({ hasText: maskAccountNumber(SAVINGS_ACCOUNT_NUMBER) });
    await savingsRow.getByTestId("account-history-link").click();

    await page.waitForURL(/\/accounts\/.+\/transactions/);
    await shoot(page, "transactions-page-loaded");

    expect(page.url()).toContain("/transactions");
  });

  test("clicking the salak account navigates to the salak overview", async ({ page }) => {
    const shoot = createShooter("accounts", "salak-navigation");

    await loginAsDemo(page);
    await page.goto("/accounts");

    const salakRow = page
      .getByTestId("account-row")
      .filter({ hasText: maskAccountNumber(SALAK_ACCOUNT_NUMBER) });
    await salakRow.getByTestId("account-history-link").click();

    await page.waitForURL("/salak");
    await shoot(page, "salak-loaded");
  });

  test("the products segment shows the salak catalog", async ({ page }) => {
    const shoot = createShooter("accounts", "products-segment");

    await loginAsDemo(page);
    await page.goto("/accounts");
    await shoot(page, "accounts-tab");

    await page.getByTestId("segment-products").click();
    await expect(page.getByTestId("product-row")).toHaveCount(2);
    await shoot(page, "products-tab");
  });
});
