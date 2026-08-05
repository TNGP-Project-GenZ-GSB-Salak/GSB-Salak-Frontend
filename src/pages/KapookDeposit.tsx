import { useEffect, useMemo, useState } from "react";
import type { SVGProps } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import type { Account } from "../lib/types";
import { formatTHB, maskAccountNumber } from "../lib/format";
import { computeAvailableBalance, cumulativeCommitted } from "../lib/kapookStore";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { BottomSheet } from "../components/BottomSheet";
import { Keypad } from "../components/Keypad";
import { SlideToConfirm } from "../components/SlideToConfirm";
import { CELEBRATE_STICKERS } from "../components/PigMascot";
import { useKapook } from "../context/KapookContext";
import { messageForError } from "../lib/kapookErrorMessages";
import { findPrimaryAccount } from "../lib/accounts";
import type { KapookCelebrateState } from "./KapookTracker";

// Matches the prototype's goalDeposit screen (prompt/prototype-reference.html):
// "จาก" (the real savings account, clickable — opens a source-account picker
// sheet) uses the blue "saving" gradient; "ถึง" (the piggy) uses the pink
// brand gradient — they are NOT the same color. Tapping the amount goes
// *directly* to the keypad — no intermediate preset-chip sheet like
// BuySalak's. The deposit amount is capped by BOTH how much is left to reach
// the target AND the real available main-account balance (prompt/README.md
// §Balance accounting / §keypadConfirm) — you can't deposit more than you
// actually have, and the hint text explains whichever of the two is
// currently the binding constraint.
export function KapookDeposit() {
  const navigate = useNavigate();
  const { state, deposit } = useKapook();
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [sourceAccountId, setSourceAccountId] = useState<string | null>(null);
  const [sourceSheetOpen, setSourceSheetOpen] = useState(false);
  const [keypadOpen, setKeypadOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [keypadInput, setKeypadInput] = useState("");
  const [amountBeforeKeypad, setAmountBeforeKeypad] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .listAccounts()
      .then((list) => {
        if (cancelled) return;
        const savings = list.filter((a) => a.type === "savings");
        setAccounts(savings);
        // Defaults to the บัญชีคู่โอน when present, since that's the common
        // case (falls back to whichever savings account came first only if
        // none is flagged - shouldn't happen for a registered user, but this
        // picker still needs to show something).
        setSourceAccountId((prev) => prev ?? findPrimaryAccount(savings)?.id ?? savings[0]?.id ?? null);
      })
      .catch((err) => !cancelled && setLoadError(messageForError(err, "โหลดข้อมูลไม่สำเร็จ")));
    return () => {
      cancelled = true;
    };
  }, []);

  const sourceAccount = useMemo(
    () => accounts?.find((a) => a.id === sourceAccountId) ?? null,
    [accounts, sourceAccountId],
  );

  if (!state.goal) return <Navigate to="/kapook" replace />;
  const goal = state.goal;
  const remainingToTarget = Math.max(0, goal.targetAmount - cumulativeCommitted(goal));
  const availableBalance = sourceAccount ? computeAvailableBalance(Number(sourceAccount.balance), goal) : 0;
  const depositCap = Math.min(remainingToTarget, availableBalance);
  const cappedByBalance = availableBalance < remainingToTarget;
  const canSend = amount > 0 && amount <= depositCap;

  function openKeypad() {
    setKeypadInput(amount ? String(amount) : "");
    setAmountBeforeKeypad(amount);
    setKeypadOpen(true);
  }

  // Matches how a real banking-app keypad works: every keystroke updates
  // the amount shown on the page itself immediately (no separate readout
  // duplicated inside the keypad sheet) — capped live as you type, same cap
  // as before, just applied continuously instead of only on confirm.
  function applyKeypadValue(rawDigits: string) {
    setKeypadInput(rawDigits);
    const n = parseInt(rawDigits || "0", 10) || 0;
    setAmount(Math.min(n, depositCap));
  }

  function keypadCancel() {
    setAmount(amountBeforeKeypad);
    setKeypadOpen(false);
  }

  async function handleConfirm() {
    if (!canSend) return;
    setError(null);
    const savedBefore = goal.availableBalance;
    const savedAfter = savedBefore + amount;
    const justReached = cumulativeCommitted(goal) + amount >= goal.targetAmount;
    const crossedMinimum = !state.hideSalakSuggestion && !goal.salakSuggestionSeen && savedBefore < 1000 && savedAfter >= 1000;
    try {
      await deposit(amount);
      const celebrate: KapookCelebrateState = {
        celebrate: true,
        celebrateAmount: amount,
        celebrateSticker: CELEBRATE_STICKERS[Math.floor(Math.random() * CELEBRATE_STICKERS.length)],
        showSuggestion: crossedMinimum,
        pendingGoalReachedAfterSuggestion: crossedMinimum && justReached,
        justReachedGoal: !crossedMinimum && justReached,
      };
      navigate("/kapook", { replace: true, state: celebrate });
    } catch (err) {
      setError(messageForError(err));
    }
  }

  return (
    <AppShell showNav={false}>
      <PageHeader title="ออมเงิน" variant="close" onAction={() => navigate("/kapook")} />

      <div className="flex flex-col gap-1" style={{ minHeight: "calc(100% - 62px)" }}>
        <div className="flex flex-1 flex-col gap-1 p-4">
          {loadError && <p className="error-box">{loadError}</p>}
          <button type="button" onClick={() => setSourceSheetOpen(true)} className="transfer-label--clickable">
            <span>จาก</span>
            <DownChevronIcon className="h-3 w-3" />
          </button>
          <div className="gradient-card gradient-card--savings">
            <div className="gradient-card__top">
              <div>
                <p className="gradient-card__label">{sourceAccount ? maskAccountNumber(sourceAccount.account_number) : ""}</p>
                <p className="gradient-card__meta mt-1">บัญชีเงินฝากเผื่อเรียก</p>
              </div>
              <p className="gradient-card__balance mt-1">฿{formatTHB(availableBalance)}</p>
            </div>
          </div>

          <p className="transfer-label mt-3">ถึง</p>
          <div className="gradient-card gradient-card--piggy">
            <div className="gradient-card__top">
              <div>
                <p className="gradient-card__label">{state.account?.accountNumber ?? ""}</p>
                <p className="gradient-card__meta mt-1">บัญชีกระปุกออมสลาก</p>
              </div>
              <p className="gradient-card__balance">฿{formatTHB(goal.availableBalance)}</p>
            </div>
          </div>

          <button type="button" onClick={openKeypad} className="transfer-amount-trigger mt-3" data-testid="deposit-amount-trigger">
            <span className="transfer-amount-trigger__label">ออมวันนี้เท่าไหร่</span>
            <span className={`transfer-amount-trigger__value ${amount > 0 ? "" : "transfer-amount-trigger__value--muted"}`}>
              {formatTHB(amount)}
            </span>
          </button>
          <p className="text-muted text-center">
            ออมได้สูงสุด ฿{formatTHB(depositCap)}{" "}
            {cappedByBalance
              ? "(ยอดคงเหลือในบัญชีเงินฝากเผื่อเรียกมีไม่พอสำหรับเป้าหมายเต็มจำนวน)"
              : "(เท่าที่ขาดอยู่ถึงเป้าหมาย)"}
          </p>
        </div>

        <div className="p-5">
          {error && (
            <p className="message" data-testid="message">
              {error}
            </p>
          )}
          <SlideToConfirm label="เลื่อนเพื่อออมเงิน" disabled={!canSend} onConfirm={handleConfirm} />
        </div>
      </div>

      <BottomSheet open={sourceSheetOpen} onClose={() => setSourceSheetOpen(false)}>
        <div className="sheet-panel">
          <div className="sheet-panel__title">เลือกบัญชีต้นทาง</div>
          <div className="flex flex-col gap-3">
            {(accounts ?? []).map((a) => (
              <button
                key={a.id}
                type="button"
                className={`account-picker-row ${a.id === sourceAccountId ? "account-picker-row--selected" : ""}`}
                onClick={() => {
                  setSourceAccountId(a.id);
                  setSourceSheetOpen(false);
                }}
              >
                <div>
                  <p className="account-picker-row__name">บัญชีเงินฝากเผื่อเรียก</p>
                  <p className="account-picker-row__mask">{maskAccountNumber(a.account_number)}</p>
                </div>
                <p className="account-picker-row__balance">฿{formatTHB(computeAvailableBalance(Number(a.balance), goal))}</p>
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      <BottomSheet open={keypadOpen} onClose={keypadCancel}>
        <Keypad
          title="กำหนดจำนวนเงินที่จะออม"
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

function DownChevronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} {...props}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
