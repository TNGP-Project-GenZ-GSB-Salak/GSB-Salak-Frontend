// Fixed IDs from GSB-Salak-Backend/cmd/seed/main.go's deterministic demo data
// (same backend/seed as GSB-Salak-Backend/testfrontend, so same values).
export const DEMO_USERNAME = "demo";
export const DEMO_PASSWORD = "demopass123";
export const SAVINGS_ACCOUNT_ID = "22222222-2222-2222-2222-222222222222";
export const SAVINGS_ACCOUNT_NUMBER = "1234009012";
export const SALAK_ACCOUNT_ID = "33333333-3333-3333-3333-333333333333";
export const SALAK_ACCOUNT_NUMBER = "4001000111";

// Mirrors src/lib/format.ts's maskAccountNumber — the UI displays masked
// numbers (per the prototype), not raw ones, so tests assert against this.
export function maskAccountNumber(accountNumber) {
  if (accountNumber.length <= 8) return accountNumber;
  const start = accountNumber.slice(0, 4);
  const end = accountNumber.slice(-4);
  return `${start}xxxx${end}`;
}
