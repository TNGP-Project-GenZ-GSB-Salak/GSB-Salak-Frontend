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
import type { KapookBuyFromGoalResponse } from "../lib/types";
import {
  freeWithdrawalsRemaining,
  generateId,
  isGoalTargetReached,
  loadState,
  msUntilAutoPurchase,
  saveState,
  withdrawFee,
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
  // goal deposit/withdraw/buy-from-piggy read, until their own tickets move
  // them onto the real backend too; expect the two to disagree in the
  // meantime (a deliberate, temporary inconsistency - see the goal-creation
  // ticket's own notes).
  createGoal: (targetAmount: number, productId: string) => Promise<void>;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
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
// drains availableBalance to 0 while purchasedAmount is still 0, which would
// make a *live* isGoalTargetReached check go false again (cumulative drops
// back under target) and wrongly leave the goal open forever with the
// countdown still ticking. Purchases never hit this — moving money from
// saved to purchased never changes the cumulative sum — so goalReachedAt
// is the only case that can diverge from a live check, and it's the one
// prompt/README.md §14's "withdrawing to 0 during the countdown closes the
// piggy immediately, because the target has been reached" is describing.
function applyClosingRule(goal: KapookGoal): KapookGoal | null {
  if (goal.availableBalance <= 0 && goal.goalReachedAt !== null) return null;
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
    (amount: number) => {
      if (!state.goal || amount <= 0) return;
      const savedBefore = state.goal.availableBalance;
      const goal: KapookGoal = { ...state.goal, availableBalance: savedBefore + amount };
      if (!goal.goalReachedAt && isGoalTargetReached(goal)) {
        goal.goalReachedAt = new Date().toISOString();
      }
      // Marked atomically here (rather than via a separate action called
      // right after deposit()) — a second persist() call from the page
      // component would read this same stale `state` closure and clobber
      // the deposit it just wrote, since React hasn't re-rendered yet.
      if (!goal.salakSuggestionSeen && savedBefore < 1000 && goal.availableBalance >= 1000) {
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
      const withdrawn: KapookGoal = { ...state.goal, availableBalance: Math.max(0, state.goal.availableBalance - amount) };
      const closed = applyClosingRule(withdrawn) === null;
      const goal = closed ? { ...withdrawn, goalReachedAt: null } : withdrawn;
      let next: KapookState = { ...state, goal: closed ? null : goal };
      next = pushTransaction(next, state.goal.id, fee > 0 ? "withdraw_with_fee" : "withdraw", amount, fee);
      persist(next);
    },
    [state, persist],
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
