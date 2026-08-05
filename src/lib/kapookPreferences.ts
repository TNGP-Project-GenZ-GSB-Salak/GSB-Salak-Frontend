// The only Kapook UI state that still lives in the browser (ticket 13's
// contract step deleted everything else - the goal, its balances, its
// transaction history, all now fetched from the real API on demand). The
// dividing line: the customer never told the bank anything by letting a
// tip or banner repeat, so losing any of this on a cleared browser costs
// one repeated tip, not a broken promise.
export interface KapookPreferences {
  // Set when the customer checks "ไม่ต้องแสดงคำแนะนำนี้อีก" - permanent,
  // across every future goal. Originally speced as a per-user backend
  // table (ticket 12); changed to localStorage-only to save build time -
  // see that ticket's own Comments for the tradeoff accepted.
  hideSalakSuggestion: boolean;
  // Real (server-issued) goal ids the buy-Salak suggestion sheet has
  // already fired for - stops it firing twice for the *same* goal,
  // independent of hideSalakSuggestion above (see KapookContext.deposit).
  seenSuggestionGoalIds: string[];
  // The amount the worker bought unattended, discovered by checking a
  // just-closed goal's history (see KapookContext.reportGoalObservation) -
  // shown as a dismissible banner on the Salak overview. Never set after a
  // manual purchase.
  autoPurchaseNotice: number | null;
  // The most recent real active goal id KapookContext has observed - lets
  // a later reconciliation ("the goal I knew about is gone - did the
  // system just buy it?") work even if no screen was open live to watch
  // the transition happen. Cleared back to null once that check has run.
  lastKnownGoalId: string | null;
}

export function emptyPreferences(): KapookPreferences {
  return { hideSalakSuggestion: false, seenSuggestionGoalIds: [], autoPurchaseNotice: null, lastKnownGoalId: null };
}

function storageKey(userId: string): string {
  return `kapook-preferences:${userId}`;
}

export function loadPreferences(userId: string): KapookPreferences {
  const raw = localStorage.getItem(storageKey(userId));
  if (!raw) return emptyPreferences();
  try {
    return { ...emptyPreferences(), ...(JSON.parse(raw) as Partial<KapookPreferences>) };
  } catch {
    return emptyPreferences();
  }
}

export function savePreferences(userId: string, prefs: KapookPreferences): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(prefs));
}
