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
import {
  freeWithdrawalsRemaining,
  generateId,
  loadState,
  msUntilAutoPurchase,
  saveState,
} from "../lib/kapookStore";
import type { KapookAccountInfo, KapookGoal, KapookState, KapookTransaction } from "../lib/kapookTypes";
import { emptyKapookState } from "../lib/kapookTypes";
import { useAuth } from "./AuthContext";

// The persisted fiction (goal/transactions/etc.) plus the two facts that are
// already real and server-backed - the kapook account itself and terms
// acceptance - neither of which is ever written to localStorage; both are
// fetched fresh each session so acceptance survives a reload and shows up on
// another device.
interface KapookContextState extends KapookState {
  account: KapookAccountInfo | null;
  // null only while the initial fetch is in flight - never persisted, and
  // never assumed true just because an account exists (every registered
  // user has a kapook account; not every one has accepted the terms).
  termsAccepted: boolean | null;
}

interface KapookContextValue {
  state: KapookContextState;
  freeWithdrawalsRemaining: number;
  msUntilAutoPurchase: number | null;
  // Records the customer's acceptance with the bank (POST
  // /kapook/terms/accept). Takes no KYC data - the wizard's identity steps
  // are review-only theatre; nothing they display is ever transmitted.
  acceptTerms: () => Promise<void>;
  // Persists the goal server-side (POST /kapook/goals) - the goal itself is
  // now real and survives a reload. Also still writes the local fiction
  // goal deposit/buy-from-piggy read (withdraw is real now too - see its own
  // doc comment below), until their own tickets move them onto the real
  // backend too; expect the two to disagree in the meantime (a deliberate,
  // temporary inconsistency - see the goal-creation ticket's own notes).
  createGoal: (targetAmount: number, productId: string) => Promise<void>;
  // Real, server-backed (POST /kapook/goals/deposit) - debits savingsAccountId
  // and credits the kapook account atomically, then folds the server's own
  // read-model snapshot (available_balance, salak_amount, target_reached,
  // buy_eligible, ...) into the local goal rather than recomputing any of it
  // client-side. Returns whether this specific deposit just reached the
  // target and/or should surface the once-per-goal "buy Salak now"
  // suggestion, so the caller can drive its own celebrate/sheet state without
  // re-deriving either from raw balances.
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
  /** Buys Salak using `amount` from the piggy (defaults to the entire saved
   * balance, for the system-triggered auto-purchase path). Funded from the
   * kapook account itself via POST /kapook/goals/buy - NOT the public
   * buy-Salak endpoint. */
  confirmGoalPurchase: (amount?: number) => Promise<KapookBuyFromGoalResponse>;
  dismissAutoPurchaseNotice: () => void;
  /** Permanently stops the salak-suggestion sheet from ever firing again,
   * for every future goal — set when the user checks "ไม่ต้องแสดงคำแนะนำนี้อีก"
   * and dismisses the sheet. */
  hideSalakSuggestionForever: () => void;
}

const KapookContext = createContext<KapookContextValue | undefined>(undefined);

function pushTransaction(
  state: KapookState,
  goalId: string,
  type: KapookTransaction["type"],
  amount: number,
  feeAmount: number,
): KapookState {
  const txn: KapookTransaction = {
    id: generateId(),
    goalId,
    type,
    amount,
    feeAmount,
    createdAt: new Date().toISOString(),
  };
  return { ...state, transactions: [txn, ...state.transactions] };
}

export function KapookProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  // Lazy-initialize from localStorage synchronously on first render (mirroring
  // AuthContext's own pattern) rather than starting empty and loading in a
  // useEffect — a direct navigation/refresh straight to a Kapook sub-route
  // (e.g. /kapook/withdraw) would otherwise see one render with `goal: null`
  // before the effect populates it, tripping that page's own
  // `if (!state.goal) return <Navigate ... />` guard and bouncing away
  // permanently before the real state ever loads.
  const [state, setState] = useState<KapookState>(() => (userId ? loadState(userId) : emptyKapookState()));
  const [account, setAccount] = useState<KapookAccountInfo | null>(null);
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null);
  const loadedForUserId = useRef(userId);
  const purchaseInFlight = useRef(false);

  useEffect(() => {
    if (userId === loadedForUserId.current) return;
    loadedForUserId.current = userId;
    setState(userId ? loadState(userId) : emptyKapookState());
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
    (next: KapookState) => {
      setState(next);
      if (userId) saveState(userId, next);
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
      persist({
        ...state,
        goal: {
          id: generateId(),
          productId,
          targetAmount,
          availableBalance: 0,
          purchasedAmount: 0,
          purchasedUnits: 0,
          purchasedCount: 0,
          createdAt: new Date().toISOString(),
          goalReachedAt: null,
          salakSuggestionSeen: false,
        },
      });
    },
    [state, persist, account],
  );

  const deposit = useCallback(
    async (savingsAccountId: string, amount: number) => {
      if (!state.goal) throw new Error("ไม่พบเป้าหมายการออม");
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
      // Folded straight from the server's own read-model snapshot - no
      // client-side recomputation of available_balance/salak_amount/etc.
      const goal: KapookGoal = {
        ...state.goal,
        targetAmount: Number(response.goal_amount),
        availableBalance: Number(response.available_balance),
        purchasedAmount: Number(response.salak_amount),
        purchasedUnits: response.purchased_units,
        purchasedCount: response.purchased_count,
        goalReachedAt: response.goal_reached_at ?? null,
      };
      // buy_eligible is the server's own flag (real product min-purchase
      // comparison, not a client-guessed threshold) - salakSuggestionSeen
      // already guarantees this only ever flips once per goal, regardless
      // of how many deposits later re-cross the same line.
      const showSalakSuggestion = !state.hideSalakSuggestion && !goal.salakSuggestionSeen && response.buy_eligible;
      if (showSalakSuggestion) {
        goal.salakSuggestionSeen = true;
      }
      let next: KapookState = { ...state, goal };
      next = pushTransaction(next, goal.id, "deposit", amount, 0);
      persist(next);
      return { justReachedGoal: response.target_reached, showSalakSuggestion };
    },
    [state, persist, account],
  );

  // prompt/README.md: fee/quota apply uniformly to every withdrawal — there is
  // no fee/quota-exempt "bail-out" type. During an active countdown the UI
  // forces `amount` to the full saved balance (see KapookWithdraw.tsx); this
  // action doesn't need to know that's why the number is what it is.
  //
  // Real backend call (POST /kapook/goals/withdraw) — unlike deposit, this
  // is no longer local fiction. The destination is always the caller's own
  // primary account (บัญชีคู่โอน), resolved server-side now - the backend
  // dropped savings_account_id from the request entirely, so there's
  // nothing to pass even if something upstream wanted to. The primary-
  // account lookup below exists only to fail loudly client-side before
  // making the request at all (console.error + a support-contact message)
  // instead of guessing the sole savings account, even though that guess is
  // unambiguous today; the backend enforces the same check independently.
  const withdraw = useCallback(
    async (amount: number): Promise<KapookWithdrawResponse> => {
      if (!state.goal) throw new Error("ไม่พบเป้าหมายการออม");
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

      const response = await api.withdrawFromKapook({
        kapook_account_id: account.id,
        amount: String(amount),
      });

      const closesGoal = !response.goal.is_active;
      const withdrawnGoal: KapookGoal = {
        ...state.goal,
        availableBalance: Number(response.goal.available_balance),
      };
      let next: KapookState = { ...state, goal: closesGoal ? null : withdrawnGoal };
      next = pushTransaction(
        next,
        state.goal.id,
        response.fee_charged ? "withdraw_with_fee" : "withdraw",
        amount,
        Number(response.fee_amount),
      );
      persist(next);
      return response;
    },
    [state, persist, account, userId],
  );

  // Funds the purchase from the kapook account's own real balance (POST
  // /kapook/goals/buy) - deliberately NOT api.buySalak, which stays closed
  // to kapook-type accounts (that endpoint's savings-account path is a
  // different, separate defect this action does not touch). The goal's
  // post-purchase shape (availableBalance, purchasedAmount/Units/Count,
  // goalReachedAt) is copied straight from the server's response - the read
  // model ticket 05 already built - rather than accumulated from the
  // pre-purchase local values, and the goal closes only when the server's
  // own goal_completed flag says so.
  const confirmGoalPurchase = useCallback(
    async (amount?: number): Promise<KapookBuyFromGoalResponse> => {
      if (!state.goal) throw new Error("ไม่พบเป้าหมายการออม");
      if (!account) throw new Error("ไม่พบบัญชีกระปุกออมสลาก");
      const spendAmount = amount ?? state.goal.availableBalance;
      if (spendAmount <= 0) {
        throw new Error("จำนวนเงินไม่ถูกต้อง");
      }
      if (purchaseInFlight.current) throw new Error("กำลังทำรายการอยู่");
      purchaseInFlight.current = true;
      try {
        const accounts = await api.listAccounts();
        const salakAccount = accounts.find((a) => a.type === "salak");
        if (!salakAccount) {
          throw new Error("ไม่พบบัญชีสลากดิจิทัล");
        }
        const receipt = await api.buyFromKapookGoal({
          kapook_account_id: account.id,
          salak_account_id: salakAccount.id,
          amount: String(spendAmount),
        });
        const g = receipt.goal;
        const purchased: KapookGoal = {
          ...state.goal,
          availableBalance: Number(g.available_balance),
          purchasedAmount: Number(g.salak_amount),
          purchasedUnits: g.purchased_units,
          purchasedCount: g.purchased_count,
          goalReachedAt: g.goal_reached_at ?? null,
        };
        const goal = receipt.goal_completed ? null : purchased;
        let next: KapookState = { ...state, goal };
        next = pushTransaction(next, state.goal.id, "buy_salak", spendAmount, 0);
        persist(next);
        return receipt;
      } finally {
        purchaseInFlight.current = false;
      }
    },
    [state, persist, account],
  );

  const dismissAutoPurchaseNotice = useCallback(() => {
    persist({ ...state, autoPurchaseNotice: null });
  }, [state, persist]);

  const hideSalakSuggestionForever = useCallback(() => {
    persist({ ...state, hideSalakSuggestion: true });
  }, [state, persist]);

  // Fires the goal-reached auto-purchase once the 24h window elapses, regardless of
  // which screen the user is on — docs/GAPS.md §2.6's "system buys automatically" is
  // meant to happen unattended, not only while KapookTracker happens to be mounted.
  // Sets `autoPurchaseNotice` (prompt/prototype-reference.html's
  // `autoPurchaseLotAmount`) so the Salak overview can show a dismissible
  // "bought for you automatically" banner — a manual purchase never sets this.
  useEffect(() => {
    if (!state.goal || !state.goal.goalReachedAt) return;
    const id = window.setInterval(() => {
      const remaining = msUntilAutoPurchase(state.goal!.goalReachedAt);
      if (remaining !== null && remaining <= 0 && !purchaseInFlight.current) {
        const spent = state.goal!.availableBalance;
        confirmGoalPurchase()
          .then(() => {
            setState((prev) => {
              const next = { ...prev, autoPurchaseNotice: spent };
              if (userId) saveState(userId, next);
              return next;
            });
          })
          .catch(() => {
            // Unattended failure (short funding balance, inactive product, etc.) — leave
            // the goal active so the user can retry manually; docs/GAPS.md D12/D13 leave
            // this unspecified for the real backend too.
          });
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [state.goal, confirmGoalPurchase, userId]);

  const value = useMemo<KapookContextValue>(
    () => ({
      state: { ...state, account, termsAccepted },
      freeWithdrawalsRemaining: freeWithdrawalsRemaining(state),
      msUntilAutoPurchase: state.goal?.goalReachedAt ? msUntilAutoPurchase(state.goal.goalReachedAt) : null,
      acceptTerms,
      createGoal,
      deposit,
      withdraw,
      confirmGoalPurchase,
      dismissAutoPurchaseNotice,
      hideSalakSuggestionForever,
    }),
    [
      state,
      account,
      termsAccepted,
      acceptTerms,
      createGoal,
      deposit,
      withdraw,
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
