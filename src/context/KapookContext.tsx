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
import type { BuySalakResponse } from "../lib/types";
import {
  freeWithdrawalsRemaining,
  generateAccountNumber,
  generateId,
  isGoalTargetReached,
  loadState,
  msUntilAutoPurchase,
  saveState,
  withdrawFee,
} from "../lib/kapookStore";
import type { KapookGoal, KapookState, KapookTransaction, KycInfo } from "../lib/kapookTypes";
import { emptyKapookState } from "../lib/kapookTypes";
import { useAuth } from "./AuthContext";

interface KapookContextValue {
  state: KapookState;
  freeWithdrawalsRemaining: number;
  msUntilAutoPurchase: number | null;
  openAccount: (kyc: KycInfo) => void;
  createGoal: (targetAmount: number, productId: string) => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  /** Buys Salak using `amount` from the piggy (defaults to the entire saved
   * balance, for the system-triggered auto-purchase path). */
  confirmGoalPurchase: (amount?: number) => Promise<BuySalakResponse>;
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

// prompt/README.md §Piggy closing conditions: a goal closes only when its
// saved balance hits zero AND the goal has *ever* genuinely reached its
// target (goalReachedAt is set — the same sticky marker the countdown/party
// mode use, prompt/README.md's "must persist across navigation"). If saved
// hits zero for any other reason (goalReachedAt still null), the goal stays
// open at saved=0, ready for more deposits.
//
// This deliberately does NOT re-derive "reached" from the live
// cumulativeCommitted total: a forced full withdrawal during the
// auto-purchase countdown (the only way to bail out — KapookWithdraw.tsx)
// drains savedAmount to 0 while purchasedAmount is still 0, which would
// make a *live* isGoalTargetReached check go false again (cumulative drops
// back under target) and wrongly leave the goal open forever with the
// countdown still ticking. Purchases never hit this — moving money from
// saved to purchased never changes the cumulative sum — so goalReachedAt
// is the only case that can diverge from a live check, and it's the one
// prompt/README.md §14's "withdrawing to 0 during the countdown closes the
// piggy immediately, because the target has been reached" is describing.
function applyClosingRule(goal: KapookGoal): KapookGoal | null {
  if (goal.savedAmount <= 0 && goal.goalReachedAt !== null) return null;
  return goal;
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
  const loadedForUserId = useRef(userId);
  const purchaseInFlight = useRef(false);

  useEffect(() => {
    if (userId === loadedForUserId.current) return;
    loadedForUserId.current = userId;
    setState(userId ? loadState(userId) : emptyKapookState());
  }, [userId]);

  const persist = useCallback(
    (next: KapookState) => {
      setState(next);
      if (userId) saveState(userId, next);
    },
    [userId],
  );

  const openAccount = useCallback(
    (kyc: KycInfo) => {
      persist({
        ...state,
        account: {
          accountNumber: generateAccountNumber(),
          openedAt: new Date().toISOString(),
          kyc,
          termsAcceptedAt: new Date().toISOString(),
        },
      });
    },
    [state, persist],
  );

  const createGoal = useCallback(
    (targetAmount: number, productId: string) => {
      persist({
        ...state,
        goal: {
          id: generateId(),
          productId,
          targetAmount,
          savedAmount: 0,
          purchasedAmount: 0,
          purchasedUnits: 0,
          purchasedCount: 0,
          createdAt: new Date().toISOString(),
          goalReachedAt: null,
          salakSuggestionSeen: false,
        },
      });
    },
    [state, persist],
  );

  const deposit = useCallback(
    (amount: number) => {
      if (!state.goal || amount <= 0) return;
      const savedBefore = state.goal.savedAmount;
      const goal: KapookGoal = { ...state.goal, savedAmount: savedBefore + amount };
      if (!goal.goalReachedAt && isGoalTargetReached(goal)) {
        goal.goalReachedAt = new Date().toISOString();
      }
      // Marked atomically here (rather than via a separate action called
      // right after deposit()) — a second persist() call from the page
      // component would read this same stale `state` closure and clobber
      // the deposit it just wrote, since React hasn't re-rendered yet.
      if (!goal.salakSuggestionSeen && savedBefore < 1000 && goal.savedAmount >= 1000) {
        goal.salakSuggestionSeen = true;
      }
      let next: KapookState = { ...state, goal };
      next = pushTransaction(next, goal.id, "deposit", amount, 0);
      persist(next);
    },
    [state, persist],
  );

  // prompt/README.md: fee/quota apply uniformly to every withdrawal — there is
  // no fee/quota-exempt "bail-out" type. During an active countdown the UI
  // forces `amount` to the full saved balance (see KapookWithdraw.tsx); this
  // action doesn't need to know that's why the number is what it is.
  const withdraw = useCallback(
    (amount: number) => {
      if (!state.goal || amount <= 0) return;
      const fee = withdrawFee(amount, state);
      const withdrawn: KapookGoal = { ...state.goal, savedAmount: Math.max(0, state.goal.savedAmount - amount) };
      const closed = applyClosingRule(withdrawn) === null;
      const goal = closed ? { ...withdrawn, goalReachedAt: null } : withdrawn;
      let next: KapookState = { ...state, goal: closed ? null : goal };
      next = pushTransaction(next, state.goal.id, fee > 0 ? "withdraw_with_fee" : "withdraw", amount, fee);
      persist(next);
    },
    [state, persist],
  );

  const confirmGoalPurchase = useCallback(
    async (amount?: number): Promise<BuySalakResponse> => {
      if (!state.goal) throw new Error("ไม่พบเป้าหมายการออม");
      const spendAmount = amount ?? state.goal.savedAmount;
      if (spendAmount <= 0 || spendAmount > state.goal.savedAmount) {
        throw new Error("จำนวนเงินไม่ถูกต้อง");
      }
      if (purchaseInFlight.current) throw new Error("กำลังทำรายการอยู่");
      purchaseInFlight.current = true;
      try {
        const accounts = await api.listAccounts();
        const fundingAccount = accounts.find((a) => a.type === "savings");
        const salakAccount = accounts.find((a) => a.type === "salak");
        if (!fundingAccount || !salakAccount) {
          throw new Error("ไม่พบบัญชีเงินฝากหรือบัญชีสลากดิจิทัล");
        }
        const receipt = await api.buySalak({
          funding_account_id: fundingAccount.id,
          salak_account_id: salakAccount.id,
          product_id: state.goal.productId,
          amount: String(spendAmount),
        });
        const purchased: KapookGoal = {
          ...state.goal,
          savedAmount: state.goal.savedAmount - spendAmount,
          purchasedAmount: state.goal.purchasedAmount + spendAmount,
          purchasedUnits: state.goal.purchasedUnits + receipt.units,
          purchasedCount: state.goal.purchasedCount + 1,
        };
        const closed = applyClosingRule(purchased) === null;
        const goal = closed ? { ...purchased, goalReachedAt: null } : purchased;
        let next: KapookState = { ...state, goal: closed ? null : goal };
        next = pushTransaction(next, state.goal.id, "buy_salak", spendAmount, 0);
        persist(next);
        return receipt;
      } finally {
        purchaseInFlight.current = false;
      }
    },
    [state, persist],
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
        const spent = state.goal!.savedAmount;
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
      state,
      freeWithdrawalsRemaining: freeWithdrawalsRemaining(state),
      msUntilAutoPurchase: state.goal?.goalReachedAt ? msUntilAutoPurchase(state.goal.goalReachedAt) : null,
      openAccount,
      createGoal,
      deposit,
      withdraw,
      confirmGoalPurchase,
      dismissAutoPurchaseNotice,
      hideSalakSuggestionForever,
    }),
    [
      state,
      openAccount,
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
