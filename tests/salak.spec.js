import { test, expect } from "@playwright/test";
import { createShooter } from "./helpers/screenshot.js";
import { loginAsDemo } from "./helpers/auth.js";

test.describe("salak overview", () => {
  test("renders salak balance, both products, and the holdings list", async ({ page }) => {
    const shoot = createShooter("salak", "overview-renders");

    await loginAsDemo(page);
    await page.goto("/salak");
    await shoot(page, "salak-loaded");

    await expect(page.getByTestId("product-row")).toHaveCount(2);
    const productNames = await page.getByTestId("product-name").allTextContents();
    expect(productNames).toContain("Digital Salak 1-Year");
    expect(productNames).toContain("Digital Salak 2-Year");

    // Holdings list exists; row count isn't asserted since it depends on what
    // earlier specs in the run (e.g. buy-salak) have already purchased.
    await expect(page.getByTestId("holdings-table")).toBeVisible();

    await shoot(page, "verified");
  });
});
