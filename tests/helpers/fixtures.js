// Fixed IDs from GSB-Salak-Backend/cmd/seed/main.go's deterministic demo data
// (same backend/seed as GSB-Salak-Backend/testfrontend, so same values).
// Only login.spec.js/register.spec.js still use these directly - every
// other spec registers its own user (see helpers/auth.js's
// registerFreshUser) rather than sharing this account.
export const DEMO_USERNAME = "demo";
export const DEMO_PASSWORD = "demopass123";
export const SAVINGS_ACCOUNT_ID = "22222222-2222-2222-2222-222222222222";
export const SAVINGS_ACCOUNT_NUMBER = "1234009012";
export const SALAK_ACCOUNT_ID = "33333333-3333-3333-3333-333333333333";
export const SALAK_ACCOUNT_NUMBER = "4001000111";

// Passed to both the api and worker webServer entries in playwright.config.js.
// Short enough to observe within a test, long enough to assert a
// "counting down, not yet purchased" state before it expires. Mirrors
// GSB-Salak-Backend/testfrontend/tests/helpers/fixtures.js's constant of the
// same name and value.
export const KAPOOK_COUNTDOWN_DURATION = "10s";

// Funds every freshly-registered test user's savings account, so specs that
// buy Salak or deposit into a Kapook goal don't have to seed a balance
// themselves. Passed to the api webServer entry only (registration is the
// only thing that reads it).
export const REGISTRATION_SAVINGS_STARTING_BALANCE = "50000";

// Mirrors src/lib/format.ts's maskAccountNumber — the UI displays masked
// numbers (per the prototype), not raw ones, so tests assert against this.
export function maskAccountNumber(accountNumber) {
  if (accountNumber.length <= 8) return accountNumber;
  const start = accountNumber.slice(0, 4);
  const end = accountNumber.slice(-4);
  return `${start}xxxx${end}`;
}
