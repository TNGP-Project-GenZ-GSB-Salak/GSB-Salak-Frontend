import { DEMO_USERNAME, DEMO_PASSWORD } from "./fixtures.js";

export async function loginAsDemo(page) {
  await page.goto("/login");
  await page.getByTestId("username-input").fill(DEMO_USERNAME);
  await page.getByTestId("password-input").fill(DEMO_PASSWORD);
  await page.getByTestId("submit-button").click();
  await page.waitForURL("/");
}
