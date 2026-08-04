import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import type { Account } from "../lib/types";
import { formatTHB, formatDate, maskAccountNumber } from "../lib/format";
import { freeWithdrawalsRemaining as computeFreeRemaining, withdrawFee } from "../lib/kapookStore";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";
import { SlideToConfirm } from "../components/SlideToConfirm";
import { BottomSheet } from "../components/BottomSheet";
import { Keypad } from "../components/Keypad";
import { useKapook } from "../context/KapookContext";

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
  const [step, setStep] = useState<Step>("amount");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [keypadOpen, setKeypadOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [keypadInput, setKeypadInput] = useState("");
  const [amountBeforeKeypad, setAmountBeforeKeypad] = useState(0);
  const [successAt, setSuccessAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.listAccounts().then((list) => {
      if (!cancelled) setDestAccount(list.find((a) => a.type === "savings") ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const forcedFull = !!state.goal?.goalReachedAt;

  useEffect(() => {
    if (forcedFull && state.goal) setAmount(state.goal.savedAmount);
  }, [forcedFull, state.goal]);

  const fee = useMemo(() => withdrawFee(amount, state), [amount, state]);
  // Free-withdrawal count *before* this pending withdrawal — drives the
  // confirm modal's badge/warning copy (prompt/prototype-reference.html's
  // stageWithdrawAmount/pendingFreeUsed).
  const remainingBefore = useMemo(() => computeFreeRemaining(state), [state]);
  const feeApplies = remainingBefore <= 0;
  const isLastFree = !feeApplies && remainingBefore === 1;
  const showRedWarning = feeApplies || isLastFree;
  const warnText = feeApplies
    ? "ถอนเกินสิทธิ์ฟรีแล้ว หักค่าธรรมเนียม 2%"
    : "ใช้สิทธิ์ถอนฟรีหมดแล้ว ครั้งต่อไปจะเสียค่าธรรมเนียม 2%";
  const badgeText = `เหลือสิทธิ์ถอนฟรี: ${Math.max(0, remainingBefore - 1)} ครั้ง/ปี`;

  // A full withdrawal that also empties the goal closes it (state.goal
  // becomes null) as soon as the context updates — but the user still needs
  // to see the success receipt. Only redirect away before that point.
  if (!state.goal && step !== "success") return <Navigate to="/kapook" replace />;
  const goal = state.goal;
  const canWithdraw = !!goal && amount > 0 && amount <= goal.savedAmount;
  const net = amount - fee;

  function openKeypad() {
    if (forcedFull) return;
    setKeypadInput(amount ? String(amount) : "");
    setAmountBeforeKeypad(amount);
    setKeypadOpen(true);
  }

  // Every keystroke updates the amount on the page itself immediately —
  // matches a real banking-app keypad, no separate readout duplicated
  // inside the sheet. Capped live as you type, same cap as before.
  function applyKeypadValue(rawDigits: string) {
    setKeypadInput(rawDigits);
    const n = parseInt(rawDigits || "0", 10) || 0;
    setAmount(Math.min(n, goal?.savedAmount ?? 0));
  }

  function keypadCancel() {
    setAmount(amountBeforeKeypad);
    setKeypadOpen(false);
  }

  function handleFinalConfirm() {
    withdraw(amount);
    setSuccessAt(new Date().toISOString());
    setConfirmOpen(false);
    setStep("success");
  }

  return (
    <AppShell showNav={false}>
      {step === "amount" && <PageHeader title="ถอนเงิน" variant="close" onAction={() => navigate("/kapook")} />}
      {step === "success" && <PageHeader title="ถอนเงิน" variant="plain" />}

      {step === "amount" && (
        <div className="flex flex-col gap-1" style={{ minHeight: "calc(100% - 62px)" }}>
          <div className="flex flex-1 flex-col gap-1 p-4">
            <p className="transfer-label">จาก</p>
            <div className="gradient-card gradient-card--piggy">
              <div className="gradient-card__top">
                <div>
                  <p className="gradient-card__label">บัญชีกระปุกออมสลาก</p>
                  <p className="gradient-card__meta mt-1">{state.account?.accountNumber ?? ""}</p>
                </div>
                <p className="gradient-card__balance mt-1">฿{formatTHB(goal?.savedAmount ?? 0)}</p>
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

            <button
              type="button"
              onClick={openKeypad}
              disabled={forcedFull}
              className="transfer-amount-trigger mt-3"
              data-testid="withdraw-amount-trigger"
            >
              <span className="transfer-amount-trigger__label">ถอนเท่าไหร่</span>
              <span className={`transfer-amount-trigger__value ${amount > 0 ? "" : "transfer-amount-trigger__value--muted"}`}>
                {formatTHB(amount)}
              </span>
            </button>
            <p className="text-muted text-center">ถอนได้สูงสุด ฿{formatTHB(goal?.savedAmount ?? 0)}</p>
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
          <p className="receipt-summary__amount mt-2">฿{formatTHB(net)}</p>
          {fee > 0 && (
            <p className="kapook-confirm-fee-note">
              หักค่าธรรมเนียม ฿{formatTHB(fee)} จากยอดถอน ฿{formatTHB(amount)}
            </p>
          )}
          <p className="text-muted">{successAt ? formatDate(successAt) : ""}</p>
          <div className="mt-5 w-full">
            <Button onClick={() => navigate(state.goal ? "/kapook" : "/salak")}>เสร็จสิ้น</Button>
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
              <span className="kapook-confirm-highlight__amount">฿{formatTHB(net)}</span>
              <ArrowRightIcon className="h-4 w-4" />
              <span className="kapook-confirm-highlight__label">บัญชีเงินฝากเผื่อเรียก</span>
            </div>
            {fee > 0 && (
              <p className="kapook-confirm-fee-note">
                ยอดถอน ฿{formatTHB(amount)} หักค่าธรรมเนียม 2% (฿{formatTHB(fee)})
              </p>
            )}
            {showRedWarning ? <div className="kapook-confirm-warning">{warnText}</div> : <div className="kapook-confirm-badge">{badgeText}</div>}
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

      <BottomSheet open={keypadOpen} onClose={keypadCancel}>
        <Keypad
          title="กำหนดจำนวนเงินที่จะถอน"
          showDisplay={false}
          onDigit={(d) => applyKeypadValue((keypadInput + d).slice(0, 9))}
          onDelete={() => applyKeypadValue(keypadInput.slice(0, -1))}
          onCancel={keypadCancel}
          onConfirm={() => setKeypadOpen(false)}
        />
      </BottomSheet>
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
