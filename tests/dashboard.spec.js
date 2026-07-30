import { test, expect } from "@playwright/test";
import { createShooter } from "./helpers/screenshot.js";
import { loginAsDemo } from "./helpers/auth.js";
import { SAVINGS_ACCOUNT_NUMBER, SALAK_ACCOUNT_NUMBER, maskAccountNumber } from "./helpers/fixtures.js";

test.describe("dashboard", () => {
  test("renders both seeded accounts with masked numbers and balances", async ({ page }) => {
    const shoot = createShooter("dashboard", "accounts-render");

    await loginAsDemo(page);
    await shoot(page, "dashboard-loaded");

    await expect(page.getByTestId("account-row")).toHaveCount(2);
    const accountNumbers = await page.getByTestId("account-number").allTextContents();
    expect(accountNumbers).toContain(maskAccountNumber(SAVINGS_ACCOUNT_NUMBER));
    expect(accountNumbers).toContain(maskAccountNumber(SALAK_ACCOUNT_NUMBER));

    await shoot(page, "verified");
  });

  test("clicking an account navigates to its transaction history", async ({ page }) => {
    const shoot = createShooter("dashboard", "account-navigation");

    await loginAsDemo(page);
    await shoot(page, "dashboard-loaded");

    const savingsRow = page
      .getByTestId("account-row")
      .filter({ hasText: maskAccountNumber(SAVINGS_ACCOUNT_NUMBER) });
    await savingsRow.getByTestId("account-history-link").click();

    await page.waitForURL(/\/accounts\/.+\/transactions/);
    await shoot(page, "transactions-page-loaded");

    expect(page.url()).toContain("/transactions");
  });

  test("unauthenticated visitor is redirected to login", async ({ page }) => {
    const shoot = createShooter("dashboard", "unauthenticated-redirect");

    await page.goto("/");
    await page.waitForURL("/login");
    await shoot(page, "redirected-to-login");
  });

  test("logout clears the session and redirects to login", async ({ page }) => {
    const shoot = createShooter("dashboard", "logout");

    await loginAsDemo(page);
    await shoot(page, "dashboard-loaded");

    await page.getByTestId("logout-button").click();
    await page.waitForURL("/login");
    await shoot(page, "redirected-to-login");

    expect(await page.evaluate(() => localStorage.getItem("token"))).toBeNull();
  });
});
