// Mirrors the DTOs returned by GSB-Salak-Backend (internal/*/http/dto.go).
// Money fields are typed as `string` because the backend serializes
// shopspring/decimal values as JSON strings, not numbers.

export interface User {
  id: string;
  username: string;
  full_name: string;
  created_at: string;
}

export interface LoginResult {
  user: User;
  token: string;
}

export type AccountType = "savings" | "salak" | "kapook";

export interface Account {
  id: string;
  account_number: string;
  type: AccountType;
  balance: string;
  currency: string;
  // The บัญชีคู่โอน - at most one per user, only ever true for a
  // "savings"-type account. Resolve it via lib/accounts.ts's
  // findPrimaryAccount rather than filtering by type.
  is_primary_account: boolean;
  created_at: string;
}

export interface SalakProduct {
  id: string;
  code: string;
  name: string;
  term_months: number;
  unit_price: string;
  min_purchase: string;
  max_purchase: string;
  step_amount: string;
}

export interface Holding {
  id: string;
  account_id: string;
  product_id: string;
  product_name: string;
  units: number;
  ticket_start: string;
  ticket_end: string;
  purchase_amount: string;
  purchase_date: string;
  maturity_date: string;
}

export interface BuySalakResponse {
  reference_id: string;
  product_name: string;
  units: number;
  ticket_start: string;
  ticket_end: string;
  amount: string;
  funding_account_balance_after: string;
  salak_account_balance_after: string;
  purchase_date: string;
  maturity_date: string;
}

export interface KapookTermsStatus {
  accepted: boolean;
}

// Hand-mirrors internal/kapook/http/dto.go's goalResponse verbatim -
// including available_balance vs. saving_amount, which name DIFFERENT
// things: saving_amount is cumulative net contribution (never shrinks on a
// purchase), available_balance is what's actually spendable. Never alias
// saving_amount as a client-side "savedAmount"/"available" field - that
// exact mistake already broke two button gates once (see the goal-read
// model ticket). purchased_units/purchased_count are derived server-side
// from history, not stored - always reflect worker-driven purchases
// correctly, whoever bought.
export interface KapookGoalResponse {
  id: string;
  account_id: string;
  product_id: string;
  goal_amount: string;
  saving_amount: string;
  salak_amount: string;
  is_active: boolean;
  goal_reached_at?: string;
  // Set only once the worker has actually hit a draw-day rejection for this
  // goal - absent on the very first tick after the countdown expires,
  // before anything knows which case this is.
  auto_purchase_deferred_until?: string;
  created_at: string;
  available_balance: string;
  target_reached: boolean;
  countdown_remaining_seconds?: number;
  purchased_units: number;
  purchased_count: number;
  buy_eligible: boolean;
  // Absent unless the worker has failed to auto-purchase this goal at
  // least once since its last success - see KapookTracker's "delayed"
  // message, shown once auto_purchase_attempts crosses a threshold.
  auto_purchase_attempts?: number;
  auto_purchase_last_error?: string;
}

// Hand-mirrors internal/kapook/http/dto.go's withdrawalStatusResponse - a
// read-time preview of the goal's free-withdrawal allowance, not a lock
// (Withdraw itself re-checks under lock and can still land on a different
// outcome for a concurrent request). quoted_fee_amount/quoted_net_amount are
// only present when the request carried an amount query param - the exact
// fee/net that amount would incur right now, computed by the same logic
// Withdraw itself uses, so it can never disagree with what gets charged.
export interface KapookWithdrawalStatusResponse {
  window_start: string;
  window_end: string;
  free_withdrawals_used: number;
  free_withdrawals_remaining: number;
  next_withdrawal_is_free: boolean;
  quoted_fee_amount?: string;
  quoted_net_amount?: string;
}

// Hand-mirrors internal/kapook/http/dto.go's withdrawResponse verbatim.
// fee_amount is "0" when fee_charged is false. net_credited is what the
// destination account actually received (amount minus fee_amount) - the
// only server-computed truth for what a withdrawal cost; never recompute
// this client-side.
export interface KapookWithdrawResponse {
  goal: KapookGoalResponse;
  amount: string;
  fee_charged: boolean;
  fee_amount: string;
  net_credited: string;
}

// Hand-mirrors internal/kapook/http/dto.go's buyFromGoalResponse verbatim -
// the Kapook-funded counterpart to BuySalakResponse above. reference_id
// through maturity_date match BuySalakResponse's own field names 1:1 since
// both wrap the same transaction.BuySalakReceipt server-side; goal and
// goal_completed are what this response adds on top, so a caller can read
// the post-purchase goal state (available_balance, purchased_units/count,
// is_active) and the completed flag straight from the response instead of
// re-deriving either client-side.
export interface KapookBuyFromGoalResponse {
  goal: KapookGoalResponse;
  goal_completed: boolean;
  reference_id: string;
  product_name: string;
  units: number;
  ticket_start: string;
  ticket_end: string;
  amount: string;
  purchase_date: string;
  maturity_date: string;
}

// Hand-mirrors internal/kapook/http/dto.go's kapookTransactionResponse
// verbatim - the five real database values, matching
// internal/kapook/domain/transaction.go's TransactionType. fee_amount/
// net_amount are server-computed, never recomputed client-side.
export type KapookTransactionKind = "deposit" | "withdraw" | "withdraw_with_fee" | "buy_salak" | "salak_expiration";

export interface KapookTransactionResponse {
  id: string;
  type: KapookTransactionKind;
  amount: string;
  fee_amount: string;
  net_amount: string;
  is_automatic_purchase?: boolean;
  created_at: string;
}

export type LedgerEntryType = "debit" | "credit";

export interface Transaction {
  id: string;
  account_id: string;
  holding_id?: string;
  type: LedgerEntryType;
  amount: string;
  balance_after: string;
  reference_id: string;
  description: string;
  created_at: string;
}
