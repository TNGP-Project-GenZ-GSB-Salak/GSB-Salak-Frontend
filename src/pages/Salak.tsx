import { useCallback, useEffect, useRef, useState, type SVGProps } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import type { Account, Holding, KapookGoalResponse, SalakProduct } from "../lib/types";
import { formatTHB, maskAccountNumber, progressPct } from "../lib/format";
import { useKapook } from "../context/KapookContext";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { HoldingCard } from "../components/HoldingCard";
import { Countdown } from "../components/Countdown";

// The prototype's 4-icon quick-action row. "ซื้อสลาก" (-> the buy-list screen)
// and "ข้อมูลผลิตภัณฑ์" (-> the salakInfo screen) are wired; the rest (issue
// history / settings) have no corresponding screens built yet and stay
// decorative.
const SALAK_QUICK_ACTIONS = [
  { label: "ซื้อสลาก", icon: BuyIcon, to: "/salak/buy", testId: "salak-buy-action" },
  { label: "ข้อมูลผลิตภัณฑ์", icon: InfoIcon, to: "/salak/info", testId: "salak-info-action" },
  { label: "ประวัติการถอน", icon: ScheduleIcon, to: null, testId: undefined },
  { label: "ตั้งค่า", icon: GearIcon, to: null, testId: undefined },
] as const;

export function Salak() {
  const navigate = useNavigate();
  const { state: kapookState, dismissAutoPurchaseNotice, reportGoalObservation } = useKapook();
  const [salakAccount, setSalakAccount] = useState<Account | null | undefined>(undefined);
  const [holdings, setHoldings] = useState<Holding[] | null>(null);
  const [products, setProducts] = useState<SalakProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [goal, setGoal] = useState<KapookGoalResponse | null>(null);
  // Tracks whether the last loadGoal() saw an active goal, so refreshHoldings
  // fires exactly once at the active-to-closed transition (a purchase could
  // have just happened) - never on a plain mount with no goal at all, and
  // never again on every subsequent poll tick while already closed.
  const hadActiveGoalRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [accounts, productList] = await Promise.all([api.listAccounts(), api.listSalakProducts()]);
        if (cancelled) return;
        const account = accounts.find((a) => a.type === "salak") ?? null;
        setSalakAccount(account);
        setProducts(productList);

        if (account) {
          const holdingList = await api.listHoldings(account.id);
          if (!cancelled) setHoldings(holdingList);
        } else {
          setHoldings([]);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Re-fetches the salak account + its holdings - called once at the
  // active-to-closed goal transition below, since that's the only moment a
  // new holding could have just been minted by the worker's auto-purchase.
  const refreshHoldings = useCallback(() => {
    api
      .listAccounts()
      .then((accounts) => {
        const account = accounts.find((a) => a.type === "salak") ?? null;
        setSalakAccount(account);
        return account ? api.listHoldings(account.id) : Promise.resolve([]);
      })
      .then(setHoldings)
      .catch((err) => setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"));
  }, []);

  // Mirrors KapookTracker.tsx's loadGoal - the single source of truth for the
  // goal, reused on mount, on the Countdown's own onExpire, and by the poll
  // below, so the goal card (and the auto-purchase-notice banner it feeds via
  // reportGoalObservation) updates in real time instead of only on remount.
  const loadGoal = useCallback(() => {
    if (!kapookState.account) return;
    api
      .getActiveKapookGoal(kapookState.account.id)
      .then((g) => {
        setGoal(g);
        reportGoalObservation(g);
        if (g) {
          hadActiveGoalRef.current = true;
        } else if (hadActiveGoalRef.current) {
          hadActiveGoalRef.current = false;
          refreshHoldings();
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"));
  }, [kapookState.account, reportGoalObservation, refreshHoldings]);

  useEffect(() => {
    loadGoal();
  }, [loadGoal]);

  // Mirrors KapookTracker.tsx's GOAL_POLL_INTERVAL_MS - only while a
  // countdown is actually live, never otherwise.
  useEffect(() => {
    if (!goal?.target_reached) return;
    const id = window.setInterval(loadGoal, 5000);
    return () => window.clearInterval(id);
  }, [goal?.target_reached, loadGoal]);

  const goalProduct = goal ? products?.find((p) => p.id === goal.product_id) : null;
  const goalSaved = goal ? Number(goal.saving_amount) : 0;
  const goalTarget = goal ? Number(goal.goal_amount) : 0;
  const goalProgressPct = progressPct(goalSaved, goalTarget);

  return (
    <AppShell>
      <PageHeader title="สลากดิจิทัล" variant="close" onAction={() => navigate("/")} />

      <div className="salak-balance-card">
        <div className="salak-balance-card__top">
          <span>{salakAccount ? maskAccountNumber(salakAccount.account_number) : ""}</span>
          <span>สลากออมสินดิจิทัล</span>
        </div>
        <p className="salak-balance-card__amount">
          ฿{salakAccount ? formatTHB(salakAccount.balance) : "0.00"}
        </p>
        <p className="salak-balance-card__label">ยอดฝากสลากทั้งหมด</p>
      </div>

      {kapookState.autoPurchaseNotice != null && (
        <div className="salak-auto-purchase-banner" data-testid="auto-purchase-banner">
          <span className="salak-auto-purchase-banner__icon">
            <BuyIcon className="h-[18px] w-[18px]" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="salak-auto-purchase-banner__title">ระบบซื้อสลากให้คุณอัตโนมัติแล้ว :)</p>
            <p className="salak-auto-purchase-banner__body">
              ครบกำหนด 24 ชั่วโมง ได้รับสลาก ฿{formatTHB(kapookState.autoPurchaseNotice)} เรียบร้อย
            </p>
          </div>
          <button
            type="button"
            className="salak-auto-purchase-banner__dismiss"
            onClick={dismissAutoPurchaseNotice}
            aria-label="ปิด"
            data-testid="auto-purchase-banner-dismiss"
          >
            <CloseIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      )}

      {goal && (
        <div className="px-4 pt-3">
          <button
            type="button"
            onClick={() => navigate("/kapook", { state: { from: "/salak" } })}
            className="salak-goal-card"
            data-testid="salak-goal-card"
          >
            <span className="salak-goal-card__icon">
              <BuyIcon className="h-[22px] w-[22px]" />
            </span>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-baseline justify-between gap-2">
                <span className="salak-goal-card__title">กำลังออมเพื่อซื้อ {goalProduct?.name ?? ""}</span>
                <span className="salak-goal-card__pct">{goalProgressPct}%</span>
              </div>
              <div className="salak-goal-card__bar">
                <div className="salak-goal-card__bar-fill" style={{ width: `${goalProgressPct}%` }} />
              </div>
              <p className="salak-goal-card__meta">
                ฿{formatTHB(goalSaved)} จาก ฿{formatTHB(goalTarget)}
              </p>
              {goal.target_reached && goal.countdown_remaining_seconds !== undefined && (
                <p className="salak-goal-card__countdown">
                  ระบบจะซื้อสลากให้อัตโนมัติใน{" "}
                  <Countdown remainingSeconds={goal.countdown_remaining_seconds} onExpire={loadGoal} />
                </p>
              )}
            </div>
            <ChevronIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      )}

      <div className="salak-quick-actions">
        {SALAK_QUICK_ACTIONS.map((action) =>
          action.to ? (
            <Link to={action.to} className="salak-quick-actions__item" key={action.label} data-testid={action.testId}>
              <span className="salak-quick-actions__icon">
                <action.icon className="h-[22px] w-[22px]" />
              </span>
              <span className="salak-quick-actions__label">{action.label}</span>
            </Link>
          ) : (
            <div className="salak-quick-actions__item salak-quick-actions__item--inert" key={action.label}>
              <span className="salak-quick-actions__icon">
                <action.icon className="h-[22px] w-[22px]" />
              </span>
              <span className="salak-quick-actions__label">{action.label}</span>
            </div>
          ),
        )}
      </div>

      <div className="flex flex-col gap-6 px-4 pt-2">
        {error && <p className="error-box">{error}</p>}

        <section>
          <div className="tab-row">
            <span className="tab-row__tab tab-row__tab--active">สลาก ({holdings?.length ?? 0})</span>
            {salakAccount && (
              <Link
                to={`/accounts/${salakAccount.id}/transactions`}
                data-testid="salak-history-link"
                className="tab-row__tab"
              >
                รายการเดินบัญชี
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-3" data-testid="holdings-table">
            {holdings === null && <p className="text-muted">กำลังโหลด...</p>}
            {holdings?.length === 0 && <p className="empty-state">คุณยังไม่มีรายการสลาก</p>}
            {holdings?.map((holding) => (
              <HoldingCard
                key={holding.id}
                holding={holding}
                product={products?.find((p) => p.id === holding.product_id)}
              />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function BuyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path
        d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1.5 1.5 0 0 0 0 3v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1.5 1.5 0 0 0 0-3Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}

function ScheduleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 2h6" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path
        d="M19.4 13a7.97 7.97 0 0 0 0-2l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L15 3h-4l-.3 2a8 8 0 0 0-1.7 1l-2.4-1-2 3.5L6.6 11a7.97 7.97 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 1.7 1L11 21h4l.3-2a8 8 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
