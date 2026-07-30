import { test, expect } from "@playwright/test";
import { createShooter } from "./helpers/screenshot.js";
import { DEMO_USERNAME, DEMO_PASSWORD } from "./helpers/fixtures.js";

test.describe("register", () => {
  test("success: a new user registers and is sent to login", async ({ page }) => {
    const shoot = createShooter("register", "success");
    const uniqueUsername = `newuser-${Date.now()}`;

    await page.goto("/register");
    await shoot(page, "form-empty");

    await page.getByTestId("full-name-input").fill("Test Newuser");
    await page.getByTestId("username-input").fill(uniqueUsername);
    await page.getByTestId("password-input").fill("a-valid-password");
    await shoot(page, "form-filled");

    await page.getByTestId("submit-button").click();
    await page.waitForURL("/login");
    await shoot(page, "redirected-to-login");
  });

  test("duplicate username is rejected", async ({ page }) => {
    const shoot = createShooter("register", "duplicate-username");

    await page.goto("/register");
    await page.getByTestId("full-name-input").fill("Duplicate Demo");
    await page.getByTestId("username-input").fill(DEMO_USERNAME);
    await page.getByTestId("password-input").fill(DEMO_PASSWORD);
    await shoot(page, "form-filled");

    await page.getByTestId("submit-button").click();

    const message = page.getByTestId("message");
    await expect(message).toHaveText(/username already taken/i);
    await shoot(page, "error-message");

    expect(page.url()).toContain("/register");
  });
});
