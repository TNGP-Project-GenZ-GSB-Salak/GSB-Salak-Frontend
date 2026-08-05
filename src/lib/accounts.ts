import type { Account } from "./types";

// The single place that resolves a user's primary account (บัญชีคู่โอน),
// replacing every ad-hoc `find(a => a.type === "savings")` guess - those
// were only ever accidentally correct, since nothing creates a second
// savings account today. Returns undefined if none is flagged (the backend
// guarantees one per registered user, but never assume it away - see
// account.Service.GetPrimaryAccount's own NotFound path).
export function findPrimaryAccount(accounts: Account[]): Account | undefined {
  return accounts.find((a) => a.is_primary_account);
}
