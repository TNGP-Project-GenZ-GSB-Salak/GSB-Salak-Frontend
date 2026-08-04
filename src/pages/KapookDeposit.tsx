import { useEffect, useMemo, useState } from "react";
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
import type { KapookCelebrateState } from "./KapookTracker";

// Matches the prototype's goalDeposit screen (prompt/prototype-reference.html):
// "จาก"/"ถึง" cards both use the same pink/red brand gradient (there is no
// separate "gold" Kapook account color), and tapping the amount goes
// *directly* to the keypad — no intermediate preset-chip sheet like
// BuySalak's. The deposit amount is capped by BOTH how much is left to reach
// the target AND the real available main-account balance (prompt/README.md
// §Balance accounting / §keypadConfirm) — you can't deposit more than you
// actually have.
export function KapookDeposit() {
  const navigate = useNavigate();
  const { state, deposit } = useKapook();
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [sourceAccountId, setSourceAccountId] = useState<string | null>(null);
  const [keypadOpen, setKeypadOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [keypadInput, setKeypadInput] = useState("");

  useEffect(() => {
    let cancelled = false;
    api.listAccounts().then((list) => {
      if (cancelled) return;
      const savings = list.filter((a) => a.type === "savings");
      setAccounts(savings);
      setSourceAccountId((prev) => prev ?? savings[0]?.id ?? null);
    });
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
  const canSend = amount > 0 && amount <= depositCap;

  function openKeypad() {
    setKeypadInput(amount ? String(amount) : "");
    setKeypadOpen(true);
  }

  function keypadConfirm() {
    const n = parseInt(keypadInput || "0", 10) || 0;
    setAmount(Math.min(n, depositCap));
    setKeypadInput("");
    setKeypadOpen(false);
  }

  function handleConfirm() {
    if (!canSend) return;
    deposit(amount);
    const justReached = cumulativeCommitted(goal) + amount >= goal.targetAmount;
    const celebrate: KapookCelebrateState = {
      celebrate: true,
      celebrateAmount: amount,
      celebrateSticker: CELEBRATE_STICKERS[Math.floor(Math.random() * CELEBRATE_STICKERS.length)],
      justReachedGoal: justReached,
    };
    navigate("/kapook", { replace: true, state: celebrate });
  }

  return (
    <AppShell showNav={false}>
      <PageHeader title="ออมเงิน" variant="close" onAction={() => navigate("/kapook")} />

      <div className="flex flex-col gap-1" style={{ minHeight: "calc(100% - 62px)" }}>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <p className="transfer-label">จาก</p>
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
          <div className="gradient-card gradient-card--savings">
            <div className="gradient-card__top">
              <div>
                <p className="gradient-card__label">{state.account?.accountNumber ?? ""}</p>
                <p className="gradient-card__meta mt-1">บัญชีกระปุกออมสลาก</p>
              </div>
              <p className="gradient-card__balance">฿{formatTHB(goal.savedAmount)}</p>
            </div>
          </div>

          <button type="button" onClick={openKeypad} className="transfer-amount-trigger mt-3" data-testid="deposit-amount-trigger">
            <span className="transfer-amount-trigger__label">ออมวันนี้เท่าไหร่</span>
            <span className={`transfer-amount-trigger__value ${amount > 0 ? "" : "transfer-amount-trigger__value--muted"}`}>
              {formatTHB(amount)}
            </span>
          </button>
          <p className="text-muted text-center">ออมได้สูงสุด ฿{formatTHB(depositCap)}</p>
        </div>

        <div className="p-5">
          <SlideToConfirm label="เลื่อนเพื่อออมเงิน" disabled={!canSend} onConfirm={handleConfirm} />
        </div>
      </div>

      <BottomSheet open={keypadOpen} onClose={() => setKeypadOpen(false)}>
        <Keypad
          title="กำหนดจำนวนเงินที่จะออม"
          subText={`โอนได้สูงสุด ${formatTHB(depositCap)} บาท`}
          footerText="*ระบุได้ไม่เกินยอดที่ขาดอยู่ถึงเป้าหมาย และยอดเงินคงเหลือในบัญชี"
          display={keypadInput ? Number(keypadInput).toLocaleString("en-US") : "0"}
          onDigit={(d) => setKeypadInput((prev) => (prev + d).slice(0, 9))}
          onDelete={() => setKeypadInput((prev) => prev.slice(0, -1))}
          onCancel={() => setKeypadOpen(false)}
          onConfirm={keypadConfirm}
        />
      </BottomSheet>
    </AppShell>
  );
}
