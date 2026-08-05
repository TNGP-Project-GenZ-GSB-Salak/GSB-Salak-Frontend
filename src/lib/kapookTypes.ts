// Local-only types for the Kapook (กระปุกออม) goal-saving mock.
//
// GSB-Salak-Backend has no `internal/kapook/` domain, no `kapook`-type account, and no
// endpoints for any of this (see docs/GAPS.md §1.2/§2.4) — everything here is a
// client-side fiction persisted to localStorage, kept deliberately separate from
// ./types.ts and ./api.ts, which hand-mirror the real backend DTOs. Do not add a
// "kapook" member to AccountType or a fake endpoint to api.ts for this feature.

// The kapook account itself is real (registration opens it - see
// GSB-Salak-Backend's account-provisioning ticket), so this is derived from
// the real Account (lib/types.ts) fetched via api.listAccounts(), not
// invented client-side. Kept as its own small shape rather than reusing
// Account directly so consumers don't depend on the backend's snake_case
// field names.
export interface KapookAccountInfo {
  id: string;
  accountNumber: string;
  openedAt: string;
}

export interface KapookGoal {
  id: string;
  productId: string;
  targetAmount: number;
  availableBalance: number;
  // Matches the prototype's tracker screen, which lets a purchase happen with
  // whatever is currently saved at any time — not gated on reaching the full
  // target — and separately tallies what's already been converted to Salak
  // ("พร้อมฝากสลาก" vs "ซื้อสลากแล้ว").
  purchasedAmount: number;
  purchasedUnits: number;
  purchasedCount: number;
  createdAt: string;
  goalReachedAt: string | null;
  // Whether the goalDeposit "ยินดีด้วย ยอดออมของคุณถึงขั้นต่ำสำหรับซื้อสลากแล้ว"
  // sheet (prompt/CLAUDE_CODE_PROMPT_TH.md screen 11) has already been shown
  // for this goal — it only ever fires once, the first time availableBalance
  // crosses ฿1,000.
  salakSuggestionSeen: boolean;
}

export type KapookTransactionType = "deposit" | "withdraw" | "withdraw_with_fee" | "buy_salak";

export interface KapookTransaction {
  id: string;
  goalId: string;
  type: KapookTransactionType;
  amount: number;
  feeAmount: number;
  createdAt: string;
}

// Persisted to localStorage (see lib/kapookStore.ts) - the still-fictional
// half of Kapook (goals, deposits, withdrawals, history), pending later
// tickets that move each onto the real backend. The account itself and
// terms acceptance are NOT here: both are real and server-backed already,
// so KapookContext fetches them fresh each session instead of persisting a
// local copy - see KapookContextValue's own `account`/`termsAccepted`.
export interface KapookState {
  goal: KapookGoal | null;
  transactions: KapookTransaction[];
  // Set when the 24h countdown fires the system-triggered auto-purchase
  // (prompt/prototype-reference.html's `autoPurchaseLotAmount`) — shown as a
  // dismissible banner on the Salak overview (prompt/README.md screen 2).
  // Not set by a manual purchase.
  autoPurchaseNotice: number | null;
  // Set when the user checks "ไม่ต้องแสดงคำแนะนำนี้อีก" on the salak-suggestion
  // sheet and dismisses it — unlike KapookGoal.salakSuggestionSeen (which is
  // per-goal and only stops the sheet firing twice for the *same* goal),
  // this is permanent across every future goal the user ever opens.
  hideSalakSuggestion: boolean;
}

export function emptyKapookState(): KapookState {
  return { goal: null, transactions: [], autoPurchaseNotice: null, hideSalakSuggestion: false };
}
