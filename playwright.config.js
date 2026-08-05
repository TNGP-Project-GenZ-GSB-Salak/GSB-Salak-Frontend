import { defineConfig, devices } from "@playwright/test";
import { KAPOOK_COUNTDOWN_DURATION, REGISTRATION_SAVINGS_STARTING_BALANCE } from "./tests/helpers/fixtures.js";

// Every spec now registers its own user (see tests/helpers/auth.js's
// registerFreshUser), so specs no longer contend over shared demo-account
// state - the one exception would be a draw-day spec, which would still
// need to run serially, since salak.draw_dates/salak.products stay globally
// shared. No such spec exists in this suite yet, so full parallelism is
// safe today (verified: no spec here asserts an absolute ticket number).
export default defineConfig({
  testDir: "./tests",
  retries: 0,
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:5174",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "npm run dev",
      port: 5174,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "go run ./cmd/api",
      cwd: "../GSB-Salak-Backend",
      port: 8080,
      env: { ...process.env, KAPOOK_COUNTDOWN_DURATION, REGISTRATION_SAVINGS_STARTING_BALANCE },
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      // The Kapook auto-purchase worker. It has no HTTP port of its own, so
      // there is no port/url for Playwright to wait on - omitting both is
      // deliberate, not an oversight; Playwright just spawns it and moves
      // on. Omitting this entry entirely is the exact silent failure the
      // worker package's own docs warn about: a countdown spec's goal would
      // simply never get bought, with every assertion up to that point
      // passing - or, worse, hang until timeout with the countdown stuck at
      // "pending" (see GSB-Salak-Backend/testfrontend/tests/countdown.spec.js).
      command: "go run ./cmd/worker",
      cwd: "../GSB-Salak-Backend",
      env: { ...process.env, KAPOOK_COUNTDOWN_DURATION },
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
