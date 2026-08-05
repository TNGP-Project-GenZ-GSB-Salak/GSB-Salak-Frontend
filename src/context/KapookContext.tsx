import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as api from "../lib/api";
import type { KapookBuyFromGoalResponse, KapookGoalResponse, KapookWithdrawResponse } from "../lib/types";
import { findPrimaryAccount } from "../lib/accounts";
import { NO_PRIMARY_ACCOUNT_MESSAGE } from "../lib/kapookErrorMessages";
import { hasAtMostTwoDecimals } from "../lib/moneyValidation";
import { emptyPreferences, loadPreferences, savePreferences, type KapookPreferences } from "../lib/kapookPreferences";
import { useAuth } from "./AuthContext";

export interface KapookAccountInfo {
  id: string;
  accountNumber: string;
  openedAt: string;
}

// Everything Kapook-related is now server-backed except the small
// browser-only preferences in kapookPreferences.ts - the goal, its
// balances, and its transaction history are always fetched fresh from the
// API by whichever screen needs them, never cached in this context.
interface KapookContextState {
  account: KapookAccountInfo | null;
  // null only while the initial fetch is in flight.
  termsAccepted: boolean | null;
  autoPurchaseNotice: number | null;
  hideSalakSuggestion: boolean;
}

interface KapookContextValue {
  state: KapookContextState;
  // Records the customer's acceptance with the bank (POST
  // /kapook/terms/accept). Takes no KYC data - the wizard's identity steps
  // are review-only theatre; nothing they display is ever transmitted.
  acceptTerms: () => Promise<void>;
  // Persists the goal server-side (POST /kapook/goals).
  createGoal: (targetAmount: number, productId: string) => Promise<void>;
  // POST /kapook/goals/deposit - debits savingsAccountId and credits the
  // kapook account atomically. Returns whether this specific deposit just
  // reached the target and/or should surface the once-per-goal "buy Salak
  // now" suggestion, so the caller can drive its own celebrate/sheet state
  // without re-deriving either from raw balances.
  deposit: (
    savingsAccountId: string,
    amount: number,
  ) => Promise<{ justReachedGoal: boolean; showSalakSuggestion: boolean }>;
  /** Withdraws from the goal via the real backend (POST
   * /kapook/goals/withdraw): debits the kapook account and credits the
   * caller's own primary account (บัญชีคู่โอน), resolved here - never a
   * customer-chosen destination. Throws NO_PRIMARY_ACCOUNT_MESSAGE (and logs
   * loudly) rather than guessing a destination when no account is flagged
   * primary. Returns the server's response so the caller can display the
   * server-computed fee/net-credited without any client-side money math. */
  withdraw: (amount: number) => Promise<KapookWithdrawResponse>;
  /** Buys Salak using `amount` from the piggy. Funded from the kapook
   * account itself via POST /kapook/goals/buy - NOT the public buy-Salak
   * endpoint. */
  confirmGoalPurchase: (amount: number) => Promise<KapookBuyFromGoalResponse>;
  /** Feeds the auto-purchase-notice reconciliation a just-fetched real goal
   * (or null) - called both by this context's own once-per-account check
   * and by KapookTracker's live polling, so either whichever screen is
   * open when a countdown resolves, or the next screen to check at all,
   * ends up discovering the outcome. A non-null goal just remembers its id;
   * null checks whether the previously-remembered goal's history shows the
   * system bought it unattended, and sets autoPurchaseNotice only then -
   * never after a manual purchase, since that goal's last buy_salak row
   * carries is_automatic_purchase: false. */
  reportGoalObservation: (goal: KapookGoalResponse | null) => void;
  dismissAutoPurchaseNotice: () => void;
  /** Permanently stops the salak-suggestion sheet from ever firing again,
   * for every future goal — set when the user checks "ไม่ต้องแสดงคำแนะนำนี้อีก"
   * and dismisses the sheet. */
  hideSalakSuggestionForever: () => void;
}

const KapookContext = createContext<KapookContextValue | undefined>(undefined);

export function KapookProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [preferences, setPreferences] = useState<KapookPreferences>(() =>
    userId ? loadPreferences(userId) : emptyPreferences(),
  );
  const [account, setAccount] = useState<KapookAccountInfo | null>(null);
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null);
  const loadedForUserId = useRef(userId);
  const purchaseInFlight = useRef(false);
  // Always the latest preferences, readable from inside a callback without
  // being one of its dependencies.
  const preferencesRef = useRef(preferences);
  preferencesRef.current = preferences;

  useEffect(() => {
    if (userId === loadedForUserId.current) return;
    loadedForUserId.current = userId;
    setPreferences(userId ? loadPreferences(userId) : emptyPreferences());
  }, [userId]);

  // The kapook account and terms acceptance are real - fetched from the
  // server every time the signed-in user changes, never read from or
  // written to localStorage.
  useEffect(() => {
    if (!userId) {
      setAccount(null);
      setTermsAccepted(null);
      return;
    }
    let cancelled = false;
    api.listAccounts().then((accounts) => {
      if (cancelled) return;
      const kapookAccount = accounts.find((a) => a.type === "kapook");
      setAccount(
        kapookAccount
          ? { id: kapookAccount.id, accountNumber: kapookAccount.account_number, openedAt: kapookAccount.created_at }
          : null,
      );
    });
    api.getKapookTermsStatus().then((status) => {
      if (!cancelled) setTermsAccepted(status.accepted);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const persist = useCallback(
    (next: KapookPreferences) => {
      setPreferences(next);
      if (userId) savePreferences(userId, next);
    },
    [userId],
  );

  const acceptTerms = useCallback(async () => {
    await api.acceptKapookTerms();
    setTermsAccepted(true);
  }, []);

  const createGoal = useCallback(
    async (targetAmount: number, productId: string) => {
      if (!account) throw new Error("ไม่พบบัญชีกระปุกออมสลาก");
      await api.createKapookGoal({
        account_id: account.id,
        product_id: productId,
        goal_amount: String(targetAmount),
      });
    },
    [account],
  );

  const deposit = useCallback(
    async (savingsAccountId: string, amount: number) => {
      if (!account) throw new Error("ไม่พบบัญชีกระปุกออมสลาก");
      if (amount <= 0) throw new Error("จำนวนเงินไม่ถูกต้อง");
      // Client-side only - the backend has no equivalent check (its decimal
      // fields accept any precision) - so this must reject before the
      // network call, not rely on a server error code.
      const amountStr = String(amount);
      if (!hasAtMostTwoDecimals(amountStr)) {
        throw new Error("จำนวนเงินต้องมีทศนิยมไม่เกิน 2 ตำแหน่ง");
      }
      const response: KapookGoalResponse = await api.depositToKapookGoal({
        kapook_account_id: account.id,
        savings_account_id: savingsAccountId,
        amount: amountStr,
      });

      // buy_eligible is the server's own flag (real product min-purchase
      // comparison, not a client-guessed threshold); seenSuggestionGoalIds
      // guarantees this only ever fires once per goal, regardless of how
      // many deposits later re-cross the same line.
      const current = preferencesRef.current;
      const alreadySeen = current.seenSuggestionGoalIds.includes(response.id);
      const showSalakSuggestion = !current.hideSalakSuggestion && !alreadySeen && response.buy_eligible;
      if (showSalakSuggestion) {
        persist({ ...current, seenSuggestionGoalIds: [...current.seenSuggestionGoalIds, response.id] });
      }

      return { justReachedGoal: response.target_reached, showSalakSuggestion };
    },
    [account, persist],
  );

  // prompt/README.md: fee/quota apply uniformly to every withdrawal — there is
  // no fee/quota-exempt "bail-out" type. During an active countdown the UI
  // forces `amount` to the full saved balance (see KapookWithdraw.tsx); this
  // action doesn't need to know that's why the number is what it is.
  //
  // The destination is always the caller's own primary account (บัญชีคู่โอน),
  // resolved server-side - the backend dropped savings_account_id from the
  // request entirely, so there's nothing to pass even if something upstream
  // wanted to. The primary-account lookup below exists only to fail loudly
  // client-side before making the request at all (console.error + a
  // support-contact message) instead of guessing the sole savings account,
  // even though that guess is unambiguous today; the backend enforces the
  // same check independently.
  const withdraw = useCallback(
    async (amount: number): Promise<KapookWithdrawResponse> => {
      if (!account) throw new Error("ไม่พบบัญชีกระปุกออมสลาก");
      if (amount <= 0) throw new Error("จำนวนเงินไม่ถูกต้อง");

      const accounts = await api.listAccounts();
      const primaryAccount = findPrimaryAccount(accounts);
      if (!primaryAccount) {
        console.error(
          "[Kapook] withdraw blocked: no account flagged is_primary_account for this user",
          { userId, kapookAccountId: account.id },
        );
        throw new Error(NO_PRIMARY_ACCOUNT_MESSAGE);
      }

      return api.withdrawFromKapook({ kapook_account_id: account.id, amount: String(amount) });
    },
    [account, userId],
  );

  // Funds the purchase from the kapook account's own real balance (POST
  // /kapook/goals/buy) - deliberately NOT api.buySalak, which stays closed
  // to kapook-type accounts (that endpoint's savings-account path is a
  // different, separate defect this action does not touch).
  const confirmGoalPurchase = useCallback(
    async (amount: number): Promise<KapookBuyFromGoalResponse> => {
      if (!account) throw new Error("ไม่พบบัญชีกระปุกออมสลาก");
      if (amount <= 0) throw new Error("จำนวนเงินไม่ถูกต้อง");
      if (purchaseInFlight.current) throw new Error("กำลังทำรายการอยู่");
      purchaseInFlight.current = true;
      try {
        const accounts = await api.listAccounts();
        const salakAccount = accounts.find((a) => a.type === "salak");
        if (!salakAccount) {
          throw new Error("ไม่พบบัญชีสลากดิจิทัล");
        }
        return await api.buyFromKapookGoal({
          kapook_account_id: account.id,
          salak_account_id: salakAccount.id,
          amount: String(amount),
        });
      } finally {
        purchaseInFlight.current = false;
      }
    },
    [account],
  );

  const dismissAutoPurchaseNotice = useCallback(() => {
    persist({ ...preferencesRef.current, autoPurchaseNotice: null });
  }, [persist]);

  const hideSalakSuggestionForever = useCallback(() => {
    persist({ ...preferencesRef.current, hideSalakSuggestion: true });
  }, [persist]);

  // The browser no longer performs the purchase itself - the real one only
  // ever happens server-side (the worker), so this is discovery, not
  // action. A non-null goal just remembers its id for next time; null means
  // the previously-remembered goal is gone, so its history is checked once
  // to see whether the system bought it unattended - the only case that
  // sets autoPurchaseNotice. Safe to call repeatedly with the same goal (or
  // repeatedly with null): the id comparison and the state guard inside the
  // async branch make every call after the first a no-op.
  const reportGoalObservation = useCallback(
    (observedGoal: KapookGoalResponse | null) => {
      if (observedGoal) {
        if (preferencesRef.current.lastKnownGoalId === observedGoal.id) return;
        persist({ ...preferencesRef.current, lastKnownGoalId: observedGoal.id });
        return;
      }

      const closedGoalId = preferencesRef.current.lastKnownGoalId;
      if (!closedGoalId) return;
      void api
        .listKapookGoalHistory(closedGoalId, { limit: 5 })
        .then((history) => {
          const lastPurchase = history.find((t) => t.type === "buy_salak");
          if (preferencesRef.current.lastKnownGoalId !== closedGoalId) return; // already reconciled elsewhere
          const next: KapookPreferences = { ...preferencesRef.current, lastKnownGoalId: null };
          if (lastPurchase?.is_automatic_purchase) {
            next.autoPurchaseNotice = Number(lastPurchase.amount);
          }
          persist(next);
        })
        .catch(() => {
          // Best-effort - lastKnownGoalId stays set, so the next observation
          // (this session's next poll, or the next login) retries the check.
        });
    },
    [persist],
  );

  // Once per signed-in account (not on every render/poll): if there's
  // currently no active goal but a previous session left a goal id behind,
  // reconcile it now - this is what lets a screen other than the Tracker
  // discover "bought for you automatically" even if nothing was open live
  // to watch the countdown resolve.
  const reconciledForAccountId = useRef<string | null>(null);
  useEffect(() => {
    if (!account) return;
    if (reconciledForAccountId.current === account.id) return;
    reconciledForAccountId.current = account.id;
    let cancelled = false;
    api
      .getActiveKapookGoal(account.id)
      .then((g) => {
        if (!cancelled) reportGoalObservation(g);
      })
      .catch(() => {
        // Best-effort; leaves reconciledForAccountId set rather than
        // retrying immediately - a real fetch failure here shouldn't spin.
      });
    return () => {
      cancelled = true;
    };
  }, [account, reportGoalObservation]);

  const value = useMemo<KapookContextValue>(
    () => ({
      state: {
        account,
        termsAccepted,
        autoPurchaseNotice: preferences.autoPurchaseNotice,
        hideSalakSuggestion: preferences.hideSalakSuggestion,
      },
      acceptTerms,
      createGoal,
      deposit,
      withdraw,
      confirmGoalPurchase,
      reportGoalObservation,
      dismissAutoPurchaseNotice,
      hideSalakSuggestionForever,
    }),
    [
      account,
      termsAccepted,
      preferences,
      acceptTerms,
      createGoal,
      deposit,
      withdraw,
      reportGoalObservation,
      confirmGoalPurchase,
      dismissAutoPurchaseNotice,
      hideSalakSuggestionForever,
    ],
  );

  return <KapookContext.Provider value={value}>{children}</KapookContext.Provider>;
}

export function useKapook(): KapookContextValue {
  const ctx = useContext(KapookContext);
  if (!ctx) {
    throw new Error("useKapook must be used within a KapookProvider");
  }
  return ctx;
}
