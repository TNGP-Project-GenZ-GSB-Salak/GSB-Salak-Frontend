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
import { Button } from "../components/Button";
import { SlideToConfirm } from "../components/SlideToConfirm";
import { useKapook } from "../context/KapookContext";

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
  const [goalReachedSheet, setGoalReachedSheet] = useState(false);

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
    if (cumulativeCommitted(goal) + amount >= goal.targetAmount) {
      setGoalReachedSheet(true);
    } else {
      navigate("/kapook", { replace: true });
    }
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

      <BottomSheet open={goalReachedSheet} onClose={() => navigate("/kapook", { replace: true })} data-testid="goal-reached-sheet">
        <div className="sheet-panel flex flex-col items-center text-center">
          <div className="sheet-panel__title">ยินดีด้วย ยอดออมของคุณถึงขั้นต่ำสำหรับซื้อสลากแล้ว</div>
          <p className="text-muted">แล้วต้องการซื้อสลากดิจิทัลด้วยยอดที่ออมได้เลยตอนนี้หรือไม่ หากยังไม่พร้อม ระบบจะซื้อสลากให้อัตโนมัติภายใน 24 ชั่วโมง</p>
          <div className="mt-5 w-full flex flex-col gap-2">
            <Button onClick={() => navigate("/kapook/buy", { replace: true })} data-testid="goal-reached-buy-now">
              ซื้อสลากตอนนี้
            </Button>
            <Button variant="secondary" onClick={() => navigate("/kapook", { replace: true })} data-testid="goal-reached-later">
              ไว้ก่อน
            </Button>
          </div>
        </div>
      </BottomSheet>
    </AppShell>
  );
}
