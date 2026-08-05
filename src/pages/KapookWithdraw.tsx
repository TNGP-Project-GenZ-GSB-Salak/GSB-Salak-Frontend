import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import type { Account, KapookGoalResponse, KapookWithdrawalStatusResponse } from "../lib/types";
import { formatTHB, formatDate, maskAccountNumber } from "../lib/format";
import { findPrimaryAccount } from "../lib/accounts";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";
import { SlideToConfirm } from "../components/SlideToConfirm";
import { useKapook } from "../context/KapookContext";
import { messageForError, NO_PRIMARY_ACCOUNT_MESSAGE } from "../lib/kapookErrorMessages";

type Step = "amount" | "success";

// Matches the prototype's goalWithdraw -> withdrawSuccess screens
// (prompt/prototype-reference.html, and designs/…V.5.html): a "จาก" (piggy,
// pink) / "ถึง" (destination account, blue) two-card layout identical in
// shape to KapookDeposit's, tapping the amount goes *directly* to the
// keypad (no separate "เต็มจำนวน/ระบุจำนวนเงิน" chooser — that was this
// codebase's own invention, not in the reference), and the confirm step is
// a centered modal *over* this same screen, not a full-screen step. A
// partial, user-chosen amount is normally allowed — but prompt/README.md
// §13: while the goal-reached auto-purchase countdown is running,
// withdrawal is forced to the full saved amount and the keypad is disabled
// (this is how a user "bails out" of the countdown — there's no separate
// bail-out action; the fee/quota rules still apply uniformly here, same as
// any other withdrawal).
export function KapookWithdraw() {
  const navigate = useNavigate();
  const { state, withdraw } = useKapook();
  const [destAccount, setDestAccount] = useState<Account | null>(null);
  // Only true once the accounts fetch has come back with no account flagged
  // is_primary_account - never guessed away by falling back to a savings
  // account found by type (see lib/kapookErrorMessages.ts's
  // NO_PRIMARY_ACCOUNT_MESSAGE for why).
  const [noPrimaryAccount, setNoPrimaryAccount] = useState(false);
  const [withdrawalStatus, setWithdrawalStatus] = useState<KapookWithdrawalStatusResponse | null>(null);
  const [step, setStep] = useState<Step>("amount");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingAmount, setEditingAmount] = useState(false);
  const [amount, setAmount] = useState(0);
  const [successAt, setSuccessAt] = useState<string | null>(null);
  // Both frozen from the real POST /kapook/goals/withdraw response at
  // confirm time - the server's own numbers, never recomputed client-side.
  const [successFee, setSuccessFee] = useState(0);
  const [successNet, setSuccessNet] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  // undefined while loading, null once fetched if there's no active goal.
  const [goal, setGoal] = useState<KapookGoalResponse | null | undefined>(undefined);
  // Frozen at confirm time from the withdraw response's own goal.is_active -
  // whether the finished withdrawal also emptied and closed the goal, so
  // the success screen's "เสร็จสิ้น" button knows where to send the customer
  // without depending on `goal` (which the next fetch would set to null).
  const [goalStillActiveAfterWithdraw, setGoalStillActiveAfterWithdraw] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .listAccounts()
      .then((list) => {
        if (cancelled) return;
        const primary = findPrimaryAccount(list);
        if (!primary) {
          console.error("[KapookWithdraw] no account flagged is_primary_account for this user");
          setNoPrimaryAccount(true);
          return;
        }
        setDestAccount(primary);
      })
      .catch((err) => !cancelled && setLoadError(messageForError(err, "โหลดข้อมูลไม่สำเร็จ")));
    return () => {
      cancelled = true;
    };
  }, []);

  // Preview only (GET /kapook/goals/withdrawal-status) - whether the next
  // withdrawal would be free, straight from the server; Withdraw itself
  // re-checks under lock, so this can still be stale by the time the
  // customer confirms. No monetary fee amount is previewed here - the
  // backend has no quote endpoint that returns one for an arbitrary amount
  // without actually moving money (see the ticket notes / final report).
  useEffect(() => {
    if (!state.account) return;
    let cancelled = false;
    api
      .getKapookWithdrawalStatus(state.account.id)
      .then((status) => {
        if (!cancelled) setWithdrawalStatus(status);
      })
      .catch((err) => !cancelled && setLoadError(messageForError(err, "โหลดข้อมูลไม่สำเร็จ")));
    return () => {
      cancelled = true;
    };
  }, [state.account]);

  useEffect(() => {
    if (!state.account) return;
    let cancelled = false;
    api
      .getActiveKapookGoal(state.account.id)
      .then((g) => !cancelled && setGoal(g))
      .catch((err) => !cancelled && setLoadError(messageForError(err, "โหลดข้อมูลไม่สำเร็จ")));
    return () => {
      cancelled = true;
    };
  }, [state.account]);

  const forcedFull = !!goal?.goal_reached_at;

  useEffect(() => {
    if (forcedFull && goal) setAmount(Number(goal.available_balance));
  }, [forcedFull, goal]);

  // Free-withdrawal count *before* this pending withdrawal — drives the
  // confirm modal's badge/warning copy (prompt/prototype-reference.html's
  // stageWithdrawAmount/pendingFreeUsed). Sourced from the server preview
  // above rather than computed from local transaction history.
  const remainingBefore = withdrawalStatus?.free_withdrawals_remaining ?? null;
  const feeApplies = withdrawalStatus !== null && !withdrawalStatus.next_withdrawal_is_free;
  const isLastFree = !feeApplies && remainingBefore === 1;
  const showRedWarning = feeApplies || isLastFree;
  const warnText = feeApplies
    ? "ถอนเกินสิทธิ์ฟรีแล้ว หักค่าธรรมเนียม 2%"
    : "ใช้สิทธิ์ถอนฟรีหมดแล้ว ครั้งต่อไปจะเสียค่าธรรมเนียม 2%";
  const badgeText = remainingBefore !== null ? `เหลือสิทธิ์ถอนฟรี: ${Math.max(0, remainingBefore - 1)} ครั้ง/ปี` : "";

  if (goal === undefined && step !== "success") return null;
  // A full withdrawal that also empties the goal closes it as soon as the
  // next fetch would report it gone — but the user still needs to see the
  // success receipt. Only redirect away before that point.
  if (!goal && step !== "success") return <Navigate to="/kapook" replace />;
  const availableBalance = goal ? Number(goal.available_balance) : 0;
  const canWithdraw = !!goal && amount > 0 && amount <= availableBalance && !noPrimaryAccount;

  // Real device keyboard instead of a custom on-screen digit grid — avoids
  // the grid's small tap targets mis-registering when the page scrolls
  // while it's open. Capped live as you type, same cap as before.
  function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
    const n = digits ? parseInt(digits, 10) : 0;
    setAmount(Math.min(n, availableBalance));
  }

  async function handleFinalConfirm() {
    setError(null);
    try {
      const response = await withdraw(amount);
      // Frozen from the server's own response - the only source of truth for
      // what was actually charged, never recomputed client-side.
      setSuccessFee(Number(response.fee_amount));
      setSuccessNet(Number(response.net_credited));
      setGoalStillActiveAfterWithdraw(response.goal.is_active);
      setSuccessAt(new Date().toISOString());
      setConfirmOpen(false);
      setStep("success");
    } catch (err) {
      setError(messageForError(err));
    }
  }

  return (
    <AppShell showNav={false}>
      {step === "amount" && <PageHeader title="ถอนเงิน" variant="close" onAction={() => navigate("/kapook")} />}
      {step === "success" && <PageHeader title="ถอนเงิน" variant="plain" />}

      {step === "amount" && (
        <div className="flex flex-col gap-1" style={{ minHeight: "calc(100% - 62px)" }}>
          <div className="flex flex-1 flex-col gap-1 p-4">
            {loadError && <p className="error-box">{loadError}</p>}
            {noPrimaryAccount && <p className="error-box">{NO_PRIMARY_ACCOUNT_MESSAGE}</p>}
            <p className="transfer-label">จาก</p>
            <div className="gradient-card gradient-card--piggy">
              <div className="gradient-card__top">
                <div>
                  <p className="gradient-card__label">บัญชีกระปุกออมสลาก</p>
                  <p className="gradient-card__meta mt-1">{state.account?.accountNumber ?? ""}</p>
                </div>
                <p className="gradient-card__balance mt-1">฿{formatTHB(availableBalance)}</p>
              </div>
            </div>

            <p className="transfer-label transfer-label--static mt-3">
              <span>ถึง</span>
              <DownChevronIcon className="h-3 w-3" />
            </p>
            <div className="gradient-card gradient-card--savings">
              <div className="gradient-card__top">
                <div>
                  <p className="gradient-card__label">บัญชีเงินฝากเผื่อเรียก</p>
                  <p className="gradient-card__meta mt-1">{destAccount ? maskAccountNumber(destAccount.account_number) : ""}</p>
                </div>
              </div>
            </div>

            <label
              className="transfer-amount-trigger mt-3"
              data-testid="withdraw-amount-trigger"
              onClick={() => !forcedFull && !editingAmount && setEditingAmount(true)}
            >
              <span className="transfer-amount-trigger__label">ถอนเท่าไหร่</span>
              {editingAmount && !forcedFull ? (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  enterKeyHint="done"
                  maxLength={9}
                  autoComplete="off"
                  autoFocus
                  className="transfer-amount-trigger__value"
                  placeholder="0"
                  value={amount ? String(amount) : ""}
                  onChange={handleAmountChange}
                  onBlur={() => setEditingAmount(false)}
                  data-testid="withdraw-amount-input"
                />
              ) : (
                <span className={`transfer-amount-trigger__value ${amount > 0 ? "" : "transfer-amount-trigger__value--muted"}`}>
                  {formatTHB(amount)}
                </span>
              )}
            </label>
            <p className="text-muted text-center">ถอนได้สูงสุด ฿{formatTHB(availableBalance)}</p>
            {forcedFull && (
              <p className="text-muted text-center">ถอนเต็มจำนวนเนื่องจากอยู่ในช่วงนับถอยหลังซื้อสลากอัตโนมัติ</p>
            )}
            <p className="text-muted text-center mt-3">*ถอนก่อนครบเป้าหมายได้ปีละ 2 ครั้งฟรี ครั้งถัดไปเสียค่าธรรมเนียม 2% ของยอดถอน</p>
          </div>

          <div className="p-5">
            <SlideToConfirm label="เลื่อนเพื่อถอนเงิน" disabled={!canWithdraw} onConfirm={() => setConfirmOpen(true)} />
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="flex flex-col items-center gap-1 px-5 pb-6 pt-6">
          <div className="withdraw-success-hero">
            <span className="withdraw-success-hero__circle" style={{ width: 180, height: 180, background: "var(--mymo-pastel-pink)", opacity: 0.6 }} />
            <span className="withdraw-success-hero__circle" style={{ top: 8, right: 64, width: 52, height: 52, background: "var(--mymo-pink-landing)" }} />
            <span className="withdraw-success-hero__circle" style={{ bottom: 44, left: 60, width: 46, height: 46, background: "var(--mymo-pink-landing)", opacity: 0.9 }} />
            <span className="withdraw-success-hero__circle" style={{ bottom: 58, right: 52, width: 20, height: 20, background: "var(--mymo-pink)" }} />
            <div className="withdraw-success-hero__check">
              <CheckIcon />
            </div>
          </div>
          <p className="text-muted">ถอนเงินสำเร็จ</p>
          <p className="receipt-summary__amount mt-2">฿{formatTHB(successNet)}</p>
          {successFee > 0 && (
            <p className="kapook-confirm-fee-note">
              หักค่าธรรมเนียม ฿{formatTHB(successFee)} จากยอดถอน ฿{formatTHB(amount)}
            </p>
          )}
          <p className="text-muted">{successAt ? formatDate(successAt) : ""}</p>
          <div className="mt-5 w-full">
            <Button onClick={() => navigate(goalStillActiveAfterWithdraw ? "/kapook" : "/salak")}>เสร็จสิ้น</Button>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="confirm-dialog-backdrop" onClick={() => setConfirmOpen(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="kapook-confirm-icon">
              <InfoIcon />
            </div>
            <p className="sheet-panel__title">ยืนยันการถอนเงิน</p>
            <div className="kapook-confirm-highlight">
              <span className="kapook-confirm-highlight__amount">฿{formatTHB(amount)}</span>
              <ArrowRightIcon className="h-4 w-4" />
              <span className="kapook-confirm-highlight__label">บัญชีเงินฝากเผื่อเรียก</span>
            </div>
            {/* No exact fee amount is shown here - the backend now has a
                quote param (GET .../withdrawal-status?amount=...) that
                could supply one, but showing it was declined for this
                screen; the badge/warning below still tells the customer,
                server-sourced, whether a fee applies at all. */}
            {showRedWarning ? <div className="kapook-confirm-warning">{warnText}</div> : <div className="kapook-confirm-badge">{badgeText}</div>}
            {error && (
              <p className="message" data-testid="message">
                {error}
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <div className="flex-1">
                <Button variant="secondary" onClick={() => setConfirmOpen(false)} data-testid="withdraw-confirm-cancel">
                  ยกเลิก
                </Button>
              </div>
              <div className="flex-1">
                <Button onClick={handleFinalConfirm} data-testid="withdraw-confirm-button">
                  ยืนยัน
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} className="h-[54px] w-[54px]">
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownChevronIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} {...props}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
