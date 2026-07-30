import { test, expect } from "@playwright/test";
import { createShooter } from "./helpers/screenshot.js";
import { loginAsDemo } from "./helpers/auth.js";

test.describe("buy salak", () => {
  test("below-minimum amount is rejected client-side", async ({ page }) => {
    const shoot = createShooter("buy-salak", "below-minimum");

    await loginAsDemo(page);
    await page.goto("/salak");
    await page.getByTestId("buy-button").first().click();
    await shoot(page, "buy-form");

    await page.getByTestId("amount-input").fill("500");
    await shoot(page, "amount-below-minimum");

    await expect(page.getByTestId("amount-error")).toHaveText(/ฝากขั้นต่ำ/);
    await expect(page.getByRole("button", { name: "ถัดไป" })).toBeDisabled();
    await shoot(page, "validation-error-shown");
  });

  test("happy path: buy a product and see the receipt", async ({ page }) => {
    const shoot = createShooter("buy-salak", "success");

    await loginAsDemo(page);
    await page.goto("/salak");
    await page.getByTestId("buy-button").first().click();
    await shoot(page, "buy-form");

    await page.getByTestId("amount-input").fill("2000");
    await shoot(page, "amount-filled");

    await page.getByRole("button", { name: "ถัดไป" }).click();
    await shoot(page, "confirm-screen");

    await page.getByTestId("confirm-button").click();
    await expect(page.getByTestId("receipt-ticket-range")).toBeVisible();
    await shoot(page, "success-screen");

    await page.getByRole("button", { name: "เสร็จสิ้น" }).click();
    await page.waitForURL("/salak");
    await shoot(page, "back-to-salak");
  });
});
