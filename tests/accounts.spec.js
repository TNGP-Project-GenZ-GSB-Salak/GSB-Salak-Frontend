import { test, expect } from "@playwright/test";
import { createShooter } from "./helpers/screenshot.js";
import { registerFreshUser } from "./helpers/auth.js";

test.describe("accounts", () => {
  test("renders both provisioned accounts with masked numbers and balances", async ({ page }) => {
    const shoot = createShooter("accounts", "accounts-render");

    await registerFreshUser(page);
    await page.goto("/accounts");
    await shoot(page, "accounts-loaded");

    await expect(page.getByTestId("account-row")).toHaveCount(2);
    const accountNumbers = await page.getByTestId("account-number").allTextContents();
    expect(accountNumbers).toHaveLength(2);
    for (const masked of accountNumbers) {
      expect(masked).toMatch(/^\d{4}xxxx\d{4}$/);
    }

    await shoot(page, "verified");
  });

  test("clicking the savings account navigates to its transaction history", async ({ page }) => {
    const shoot = createShooter("accounts", "savings-navigation");

    await registerFreshUser(page);
    await page.goto("/accounts");

    // Registration provisions savings before salak
    // (GSB-Salak-Backend/internal/user/service/auth_service.go), and the
    // list is ordered by created_at, so the first row is always savings.
    const savingsRow = page.getByTestId("account-row").nth(0);
    await savingsRow.getByTestId("account-history-link").click();

    await page.waitForURL(/\/accounts\/.+\/transactions/);
    await shoot(page, "transactions-page-loaded");

    expect(page.url()).toContain("/transactions");
  });

  test("clicking the salak account navigates to the salak overview", async ({ page }) => {
    const shoot = createShooter("accounts", "salak-navigation");

    await registerFreshUser(page);
    await page.goto("/accounts");

    const salakRow = page.getByTestId("account-row").nth(1);
    await salakRow.getByTestId("account-history-link").click();

    await page.waitForURL("/salak");
    await shoot(page, "salak-loaded");
  });

  test("the products segment shows the salak catalog", async ({ page }) => {
    const shoot = createShooter("accounts", "products-segment");

    await registerFreshUser(page);
    await page.goto("/accounts");
    await shoot(page, "accounts-tab");

    await page.getByTestId("segment-products").click();
    await expect(page.getByTestId("product-row")).toHaveCount(2);
    await shoot(page, "products-tab");
  });
});
