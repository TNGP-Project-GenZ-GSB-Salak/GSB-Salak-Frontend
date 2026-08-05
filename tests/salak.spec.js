import { test, expect } from "@playwright/test";
import { createShooter } from "./helpers/screenshot.js";
import { registerFreshUser } from "./helpers/auth.js";

test.describe("salak overview", () => {
  test("renders the salak balance and holdings list, and links to the buy-list screen", async ({ page }) => {
    const shoot = createShooter("salak", "overview-renders");

    await registerFreshUser(page);
    await page.goto("/salak");
    await shoot(page, "salak-loaded");

    // Products live on the buy-list screen now, not inline on the overview.
    await expect(page.getByTestId("product-row")).toHaveCount(0);

    // Holdings list exists; row count isn't asserted since it depends on what
    // earlier specs in the run (e.g. buy-salak) have already purchased.
    await expect(page.getByTestId("holdings-table")).toBeVisible();

    await page.getByTestId("salak-buy-action").click();
    await page.waitForURL("/salak/buy");
    await shoot(page, "buy-list-loaded");

    await expect(page.getByTestId("product-row")).toHaveCount(2);
    const productNames = await page.getByTestId("product-name").allTextContents();
    expect(productNames).toContain("Digital Salak 1-Year");
    expect(productNames).toContain("Digital Salak 2-Year");

    await shoot(page, "verified");
  });

  test("the account-history link navigates to the salak account's transactions", async ({ page }) => {
    const shoot = createShooter("salak", "history-link");

    await registerFreshUser(page);
    await page.goto("/salak");
    await shoot(page, "salak-loaded");

    await page.getByTestId("salak-history-link").click();
    await page.waitForURL(/\/accounts\/.+\/transactions/);
    await shoot(page, "transactions-page-loaded");
  });
});
