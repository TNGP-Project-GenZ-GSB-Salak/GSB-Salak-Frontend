import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { formatTHB } from "../lib/format";
import { withdrawFee } from "../lib/kapookStore";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { BottomSheet } from "../components/BottomSheet";
import { Keypad } from "../components/Keypad";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { SlideToConfirm } from "../components/SlideToConfirm";
import { useKapook } from "../context/KapookContext";

type Step = "amount" | "confirm" | "success";
type Sheet = "amount" | "keypad" | null;

// Matches the prototype's goalWithdraw -> withdrawConfirm -> withdrawSuccess
// screens (prompt/prototype-reference.html). A partial, user-chosen amount
// is normally allowed, with a "withdraw everything" shortcut — but
// prompt/README.md §13: while the goal-reached auto-purchase countdown is
// running, withdrawal is forced to the full saved amount and the custom
// keypad is disabled (this is how a user "bails out" of the countdown —
// there's no separate bail-out action; the fee/quota rules still apply
// uniformly here, same as any other withdrawal).
export function KapookWithdraw() {
  const navigate = useNavigate();
  const { state, freeWithdrawalsRemaining, withdraw } = useKapook();
  const [step, setStep] = useState<Step>("amount");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [amount, setAmount] = useState(0);
  const [keypadInput, setKeypadInput] = useState("");

  const forcedFull = !!state.goal?.goalReachedAt;

  useEffect(() => {
    if (forcedFull && state.goal) setAmount(state.goal.savedAmount);
  }, [forcedFull, state.goal]);

  const fee = useMemo(() => withdrawFee(amount, state), [amount, state]);

  // A full withdrawal that also empties the goal closes it (state.goal
  // becomes null) as soon as the context updates — but the user still needs
  // to see the success receipt. Only redirect away before that point.
  if (!state.goal && step !== "success") return <Navigate to="/kapook" replace />;
  const goal = state.goal;
  const canWithdraw = !!goal && amount > 0 && amount <= goal.savedAmount;

  function closeSheet() {
    setSheet(null);
  }

  function pickAmount(value: number) {
    setAmount(value);
    setSheet(null);
  }

  function openKeypad() {
    setKeypadInput(amount ? String(amount) : "");
    setSheet("keypad");
  }

  function keypadConfirm() {
    setAmount(Math.min(parseInt(keypadInput || "0", 10) || 0, (goal?.savedAmount ?? 0)));
    setKeypadInput("");
    setSheet(null);
  }

  function handleFinalConfirm() {
    withdraw(amount);
    setStep("success");
  }

  return (
    <AppShell showNav={false}>
      {step === "amount" && <PageHeader title="ถอนเงิน" variant="close" onAction={() => navigate("/kapook")} />}
      {step === "confirm" && <PageHeader title="ยืนยันการถอนเงิน" variant="back" onAction={() => setStep("amount")} />}
      {step === "success" && <PageHeader title="ถอนเงินสำเร็จ" variant="plain" />}

      {step === "amount" && (
        <div className="flex flex-col gap-1" style={{ minHeight: "calc(100% - 62px)" }}>
          <div className="flex flex-1 flex-col gap-3 p-4">
            <p className="text-muted">จากยอดออมที่มี ฿{formatTHB((goal?.savedAmount ?? 0))}</p>
            <button
              type="button"
              onClick={() => !forcedFull && setSheet("amount")}
              disabled={forcedFull}
              className="transfer-amount-trigger"
              data-testid="withdraw-amount-trigger"
            >
              <span className="transfer-amount-trigger__label">ถอนเท่าไหร่</span>
              <span className={`transfer-amount-trigger__value ${amount > 0 ? "" : "transfer-amount-trigger__value--muted"}`}>
                {formatTHB(amount)}
              </span>
            </button>
            {forcedFull && (
              <p className="text-muted text-center">ถอนเต็มจำนวนเนื่องจากอยู่ในช่วงนับถอยหลังซื้อสลากอัตโนมัติ</p>
            )}
            <p className="text-muted">เหลือสิทธิ์ถอนฟรี: {freeWithdrawalsRemaining} ครั้ง</p>
          </div>
          <div className="p-5">
            <SlideToConfirm label="เลื่อนเพื่อถอนเงิน" disabled={!canWithdraw} onConfirm={() => setStep("confirm")} />
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="flex flex-col gap-4 p-4">
          <div className="confirm-amount-block">
            <p className="confirm-amount-label">ยอดถอน</p>
            <p className="confirm-amount-value">฿{formatTHB(amount)}</p>
            <p className="confirm-amount-fee">
              {fee > 0 ? `หักค่าธรรมเนียม 2% (฿${formatTHB(fee)})` : "ไม่มีค่าธรรมเนียม (ใช้สิทธิ์ถอนฟรี)"}
            </p>
          </div>
          <Card>
            <div className="kv-row">
              <span className="kv-row__label">โอนเงินไปที่</span>
              <span className="kv-row__value">บัญชีเงินฝากเผื่อเรียก (บัญชีหลัก)</span>
            </div>
            <div className="kv-row">
              <span className="kv-row__label">ได้รับสุทธิ</span>
              <span className="kv-row__value">฿{formatTHB(amount - fee)}</span>
            </div>
          </Card>
          <Button onClick={handleFinalConfirm} data-testid="withdraw-confirm-button">
            ยืนยัน
          </Button>
        </div>
      )}

      {step === "success" && (
        <div className="flex flex-col items-center gap-1 px-5 pb-6 pt-6">
          <div className="receipt-summary__check">
            <CheckIcon />
          </div>
          <p className="receipt-summary__amount mt-2">฿{formatTHB(amount - fee)}</p>
          <p className="text-muted">ถอนเงินคืนบัญชีหลักเรียบร้อยแล้ว</p>
          <div className="mt-5 w-full">
            <Button onClick={() => navigate(state.goal ? "/kapook" : "/salak")}>เสร็จสิ้น</Button>
          </div>
        </div>
      )}

      <BottomSheet open={sheet === "amount"} onClose={closeSheet}>
        <div className="action-sheet">
          <div className="action-sheet__title">กำหนดจำนวนเงินที่จะถอน</div>
          <button
            type="button"
            onClick={() => pickAmount((goal?.savedAmount ?? 0))}
            className="action-sheet__action"
            data-testid="withdraw-amount-full"
          >
            ถอนเต็ม ฿{(goal?.savedAmount ?? 0).toLocaleString("en-US")}
          </button>
          <button type="button" onClick={openKeypad} className="action-sheet__action action-sheet__action--strong" data-testid="withdraw-amount-custom">
            ระบุจำนวนเงิน
          </button>
        </div>
        <div className="action-sheet">
          <button type="button" onClick={closeSheet} className="action-sheet__action action-sheet__action--strong">
            ยกเลิก
          </button>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "keypad"} onClose={closeSheet}>
        <Keypad
          title="กำหนดจำนวนเงินที่จะถอน"
          subText={`ถอนได้สูงสุด ฿${formatTHB((goal?.savedAmount ?? 0))}`}
          display={keypadInput ? Number(keypadInput).toLocaleString("en-US") : "0"}
          onDigit={(d) => setKeypadInput((prev) => (prev + d).slice(0, 9))}
          onDelete={() => setKeypadInput((prev) => prev.slice(0, -1))}
          onCancel={closeSheet}
          onConfirm={keypadConfirm}
        />
      </BottomSheet>
    </AppShell>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} className="h-[38px] w-[38px]">
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
