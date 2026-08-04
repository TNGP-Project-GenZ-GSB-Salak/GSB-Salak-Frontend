import { test, expect } from "@playwright/test";
import { createShooter } from "./helpers/screenshot.js";
import { loginAsDemo } from "./helpers/auth.js";

test.describe("home", () => {
  test("renders the main balance and the salak promo banner", async ({ page }) => {
    const shoot = createShooter("home", "renders");

    await loginAsDemo(page);
    await shoot(page, "home-loaded");

    await expect(page.getByTestId("main-balance")).toBeVisible();
    await expect(page.getByTestId("salak-promo-banner")).toBeVisible();

    await shoot(page, "verified");
  });

  test("the salak promo banner navigates to the product info screen", async ({ page }) => {
    const shoot = createShooter("home", "promo-navigation");

    await loginAsDemo(page);
    await page.getByTestId("salak-promo-banner").click();
    await page.waitForURL("/salak/info");
    await shoot(page, "salak-info-loaded");
  });

  test("unauthenticated visitor is redirected to login", async ({ page }) => {
    const shoot = createShooter("home", "unauthenticated-redirect");

    await page.goto("/");
    await page.waitForURL("/login");
    await shoot(page, "redirected-to-login");
  });
});
