import { emptyKapookState, type KapookGoal, type KapookState } from "./kapookTypes";

// 24h goal-reached auto-purchase window (docs/GAPS.md §2.6; prompt/README.md
// §Auto-purchase countdown). Deliberately a single named constant — lower it
// locally while manually testing the countdown/auto-purchase path instead of
// waiting a real day.
export const GOAL_WINDOW_MS = 24 * 60 * 60 * 1000;

export const FREE_WITHDRAWALS_PER_YEAR = 2;
export const WITHDRAW_FEE_RATE = 0.02;

function storageKey(userId: string): string {
  return `kapook:${userId}`;
}

export function loadState(userId: string): KapookState {
  const raw = localStorage.getItem(storageKey(userId));
  if (!raw) return emptyKapookState();
  try {
    return JSON.parse(raw) as KapookState;
  } catch {
    return emptyKapookState();
  }
}

export function saveState(userId: string, state: KapookState): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(state));
}

// crypto.randomUUID() is only exposed in secure contexts (https, or the exact
// hostname "localhost") — testing over a LAN IP (http://192.168.x.x:5174, the
// common way to open this on a real phone) or in some older mobile browsers
// throws "crypto.randomUUID is not a function". These are local-only mock
// IDs, not security-sensitive, so a Math.random fallback is fine.
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// prompt/README.md: "Each savings goal gets 2 free withdrawals per calendar
// year, tracked per goal/piggy... closing a piggy and opening a new one
// resets the quota." So this counts only transactions tagged with the
// *current* goal's id — a past, already-closed goal's withdrawals don't
// carry over. Per the reference implementation, every withdrawal counts
// toward the quota uniformly (including ones that already paid the fee) —
// there is no fee/quota-exempt withdrawal type.
export function freeWithdrawalsRemaining(state: KapookState): number {
  if (!state.goal) return FREE_WITHDRAWALS_PER_YEAR;
  const year = new Date().getFullYear();
  const used = state.transactions.filter(
    (t) =>
      (t.type === "withdraw" || t.type === "withdraw_with_fee") &&
      t.goalId === state.goal!.id &&
      new Date(t.createdAt).getFullYear() === year,
  ).length;
  return Math.max(0, FREE_WITHDRAWALS_PER_YEAR - used);
}

export function withdrawFee(amount: number, state: KapookState): number {
  return freeWithdrawalsRemaining(state) > 0 ? 0 : Math.round(amount * WITHDRAW_FEE_RATE * 100) / 100;
}

export function msUntilAutoPurchase(goalReachedAt: string | null): number | null {
  if (!goalReachedAt) return null;
  return new Date(goalReachedAt).getTime() + GOAL_WINDOW_MS - Date.now();
}

// prompt/README.md: the goal's progress/percent/"has it been reached" is
// based on the cumulative amount ever committed to the goal — what's
// currently saved *plus* what's already been converted to Salak from it —
// not the current saved balance alone (which drops back to 0 after every
// purchase). This is what makes the goal-reached countdown persist through a
// partial purchase instead of resetting.
export function cumulativeCommitted(goal: KapookGoal): number {
  return goal.savedAmount + goal.purchasedAmount;
}

export function goalProgressPct(goal: KapookGoal): number {
  if (goal.targetAmount <= 0) return 0;
  return Math.min(100, Math.round((cumulativeCommitted(goal) / goal.targetAmount) * 100));
}

export function isGoalTargetReached(goal: KapookGoal): boolean {
  return cumulativeCommitted(goal) >= goal.targetAmount;
}

// prompt/README.md §Balance accounting: "Main account available balance =
// fromBalance − purchasedAmount(direct salak buys) − reservedForGoal(open
// piggy's saved amount)." Direct Salak purchases already reduce the real
// backend balance (a real debit), so only the piggy's still-saved amount
// needs subtracting here on top of whatever the backend reports.
export function computeAvailableBalance(realBalance: number, goal: KapookGoal | null): number {
  const reservedForGoal = goal ? goal.savedAmount : 0;
  return Math.max(0, realBalance - reservedForGoal);
}
