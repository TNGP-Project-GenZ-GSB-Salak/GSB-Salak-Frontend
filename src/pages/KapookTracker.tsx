import { Navigate, useNavigate } from "react-router-dom";
import { formatTHB, formatDate } from "../lib/format";
import { cumulativeCommitted, isGoalTargetReached } from "../lib/kapookStore";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { Countdown } from "../components/Countdown";
import { PigMascot, TipCloud, TipGround } from "../components/PigMascot";
import { useKapook } from "../context/KapookContext";

// Matches the prototype's goalTracker screen (prompt/prototype-reference.html):
// a sky/pig hero, a summary card (product + cumulative-committed/target +
// progress + start date + account number, with the auto-purchase countdown
// shown *inside* the card once reached), a two-column "พร้อมฝากสลาก" /
// "ซื้อสลากแล้ว" breakdown, and an ออมเงิน/ถอนเงิน/ซื้อสลาก action row.
// "ซื้อสลาก" routes to an amount-entry screen (capped + rounded to ฿1,000,
// prompt/README.md §15) rather than instantly spending the whole balance;
// the same "ถอนเงิน" screen doubles as the countdown bail-out (forced to the
// full balance there, prompt/README.md §13) — there's no separate action.
export function KapookTracker() {
  const navigate = useNavigate();
  const { state, freeWithdrawalsRemaining } = useKapook();

  if (!state.account) return <Navigate to="/kapook/open" replace />;
  if (!state.goal) return <Navigate to="/kapook/goal/new" replace />;

  const { goal } = state;
  const reached = isGoalTargetReached(goal);
  const totalCommitted = cumulativeCommitted(goal);

  return (
    <AppShell showNav={false}>
      <PageHeader title="ออมก่อนซื้อสลาก" variant="close" onAction={() => navigate("/")} />

      <div className="flex flex-col px-4 pb-4">
        <div className="kapook-hero-card">
          <span className="home-tip-card__sun" />
          <TipCloud className="home-tip-card__cloud" />
          <TipGround className="home-tip-card__ground" />
          <PigMascot width={120} height={112} animation="none" className="kapook-hero-card__mascot" />
        </div>

        <Card className="kapook-summary-card">
          <div className="kapook-summary-card__product-row">
            <span className="kapook-summary-card__product">สลากดิจิทัล</span>
            <span className="kapook-summary-card__info">i</span>
          </div>
          <p className="kapook-summary-card__saved" data-testid="kapook-saved">
            ฿{formatTHB(totalCommitted)}
          </p>
          <p className="kapook-summary-card__target">จากเป้าหมาย ฿{formatTHB(goal.targetAmount)}</p>
          <ProgressBar value={totalCommitted} max={goal.targetAmount} />

          {reached && goal.goalReachedAt && (
            <div className="kapook-countdown-box">
              <p className="kapook-countdown-box__label">ระบบจะซื้อสลากให้อัตโนมัติใน</p>
              <p className="kapook-countdown-box__value">
                <Countdown deadline={new Date(new Date(goal.goalReachedAt).getTime() + 24 * 60 * 60 * 1000).toISOString()} />
              </p>
              <p className="kapook-countdown-box__hint">กดปุ่ม "ซื้อสลาก" ด้านล่างเพื่อเลือกเอง</p>
            </div>
          )}

          <p className="kapook-summary-card__started">เริ่มออมเมื่อ {formatDate(goal.createdAt)}</p>

          <div className="kapook-account-row">
            <span className="kapook-account-row__label">บัญชีกระปุกออมสลาก</span>
            <span className="kapook-account-row__value">{state.account.accountNumber}</span>
          </div>
        </Card>

        <div className="kapook-split-card">
          <div className="kapook-split-card__col">
            <span className="kapook-split-card__label">
              <span className="kapook-split-card__dot" style={{ backgroundColor: "var(--color-brand)" }} />
              พร้อมฝากสลาก
            </span>
            <p className="kapook-split-card__amount" style={{ color: "var(--color-brand)" }}>
              ฿{formatTHB(goal.savedAmount)}
            </p>
            <p className="kapook-split-card__meta">ยอดออมที่ใช้ซื้อสลากได้</p>
          </div>
          <div className="kapook-split-card__col">
            <span className="kapook-split-card__label">
              <span className="kapook-split-card__dot" style={{ backgroundColor: "var(--mymo-cat-salak)" }} />
              ซื้อสลากแล้ว
            </span>
            <p className="kapook-split-card__amount" style={{ color: "var(--mymo-cat-salak)" }}>
              ฿{formatTHB(goal.purchasedAmount)}
            </p>
            <p className="kapook-split-card__meta">
              {goal.purchasedUnits} หน่วย · {goal.purchasedCount} รายการ
            </p>
          </div>
        </div>

        <div className="kapook-actions">
          <button type="button" className="kapook-actions__item" onClick={() => navigate("/kapook/deposit")} data-testid="kapook-deposit-action">
            <span className="kapook-actions__icon">
              <SaveIcon className="h-5 w-5" />
            </span>
            ออมเงิน
          </button>
          <button
            type="button"
            className="kapook-actions__item"
            disabled={goal.savedAmount <= 0}
            onClick={() => navigate("/kapook/withdraw")}
            data-testid="kapook-withdraw-action"
          >
            <span className="kapook-actions__icon">
              <WithdrawIcon className="h-5 w-5" />
            </span>
            ถอนเงิน
          </button>
          <button
            type="button"
            className="kapook-actions__item"
            disabled={goal.savedAmount < 1000}
            onClick={() => navigate("/kapook/buy")}
            data-testid="kapook-redeem-action"
          >
            <span className="kapook-actions__icon">
              <BuyIcon className="h-5 w-5" />
            </span>
            ซื้อสลาก
          </button>
        </div>

        <p className="text-muted mt-3">เหลือสิทธิ์ถอนฟรี: {freeWithdrawalsRemaining} ครั้ง</p>

        <section className="mt-2">
          <p className="field-label">ประวัติการออม</p>
          <div className="flex flex-col gap-3 mt-2" data-testid="kapook-history">
            {state.transactions.length === 0 && <p className="empty-state">ยังไม่มีประวัติการออม</p>}
            {state.transactions.map((txn) => (
              <Card key={txn.id} data-testid="kapook-transaction-row" className="transaction-row">
                <div>
                  <p className="transaction-row__desc">{txn.description}</p>
                  <p className="transaction-row__date">{formatDate(txn.createdAt)}</p>
                </div>
                <p
                  className={`transaction-row__amount ${
                    txn.type === "deposit" ? "transaction-row__amount--credit" : "transaction-row__amount--debit"
                  }`}
                >
                  {txn.type === "deposit" ? "+" : "-"}฿{formatTHB(txn.amount)}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function SaveIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M12 4v11" strokeLinecap="round" />
      <path d="M16.5 11.5 12 16l-4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" strokeLinecap="round" />
    </svg>
  );
}

function WithdrawIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M12 4v11" strokeLinecap="round" />
      <path d="M7.5 11.5 12 16l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" strokeLinecap="round" />
    </svg>
  );
}

function BuyIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path
        d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1.5 1.5 0 0 0 0 3v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1.5 1.5 0 0 0 0-3Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
