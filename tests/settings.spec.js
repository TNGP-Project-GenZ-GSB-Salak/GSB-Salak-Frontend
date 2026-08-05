import { test, expect } from "@playwright/test";
import { createShooter } from "./helpers/screenshot.js";
import { registerFreshUser } from "./helpers/auth.js";

test.describe("settings", () => {
  test("logout clears the session and redirects to login", async ({ page }) => {
    const shoot = createShooter("settings", "logout");

    await registerFreshUser(page);
    await page.goto("/settings");
    await shoot(page, "settings-loaded");

    await page.getByTestId("logout-button").click();
    await page.waitForURL("/login");
    await shoot(page, "redirected-to-login");

    expect(await page.evaluate(() => localStorage.getItem("token"))).toBeNull();
  });
});
