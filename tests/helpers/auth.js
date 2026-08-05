import { DEMO_USERNAME, DEMO_PASSWORD } from "./fixtures.js";

export async function loginAsDemo(page) {
  await page.goto("/login");
  await page.getByTestId("username-input").fill(DEMO_USERNAME);
  await page.getByTestId("password-input").fill(DEMO_PASSWORD);
  await page.getByTestId("submit-button").click();
  await page.waitForURL("/");
}

// Registers a brand-new user via the real UI and logs them in, so each test
// owns its own accounts/balances/holdings instead of contending over the
// shared demo user - registration provisions all three accounts atomically
// and funds savings from REGISTRATION_SAVINGS_STARTING_BALANCE (see
// playwright.config.js), so the returned user arrives ready to buy Salak or
// deposit into a Kapook goal. Only login.spec.js/register.spec.js still use
// the real demo user directly, since they assert against credentials that
// must already exist.
export async function registerFreshUser(page) {
  const username = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const password = "password123";

  await page.goto("/register");
  await page.getByTestId("full-name-input").fill("Test User");
  await page.getByTestId("username-input").fill(username);
  await page.getByTestId("password-input").fill(password);
  await page.getByTestId("submit-button").click();
  await page.waitForURL("/login");

  await page.getByTestId("username-input").fill(username);
  await page.getByTestId("password-input").fill(password);
  await page.getByTestId("submit-button").click();
  await page.waitForURL("/");

  return { username, password };
}
