import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import type { Account, BuySalakResponse, SalakProduct } from "../lib/types";
import { formatTHB, maskAccountNumber } from "../lib/format";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { BottomSheet } from "../components/BottomSheet";
import { Keypad } from "../components/Keypad";
import { SlideToConfirm } from "../components/SlideToConfirm";
import { useKapook } from "../context/KapookContext";

type Step = "amount" | "confirm" | "success";

const TAG_OPTIONS = ["ซื้อสลาก", "ซื้อสลากให้ลูก", "ออมเงิน"];

// Matches the prototype's transfer screen in its "amountLocked" mode
// (prompt/README.md §15, designs/…V.5.html): the same "จาก"/"ถึง" two-card +
// tags layout as BuySalak.tsx's real "ซื้อเลย" flow (this screen is shared
// between both in the prototype) — buying Salak from the piggy is its own
// amount-entry step, capped at the piggy's saved balance and rounded down to
// the nearest ฿1,000, not an instant one-tap spend of the whole balance.
export function KapookBuyFromPiggy() {
  const navigate = useNavigate();
  const { state, confirmGoalPurchase } = useKapook();
  const [product, setProduct] = useState<SalakProduct | null>(null);
  const [salakAccount, setSalakAccount] = useState<Account | null>(null);
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState(0);
  const [keypadOpen, setKeypadOpen] = useState(false);
  const [keypadInput, setKeypadInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<BuySalakResponse | null>(null);

  useEffect(() => {
    if (!state.goal) return;
    let cancelled = false;
    Promise.all([api.getSalakProduct(state.goal.productId), api.listAccounts()]).then(([productData, accounts]) => {
      if (cancelled) return;
      setProduct(productData);
      setSalakAccount(accounts.find((a) => a.type === "salak") ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [state.goal?.productId]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  // A *full* purchase (amount === savedAmount) that also completes the
  // target closes the goal (state.goal becomes null) as soon as the context
  // updates — but the user still needs to see the success receipt for the
  // purchase that just happened. Only redirect away before that point.
  if (!state.goal && step !== "success") return <Navigate to="/kapook" replace />;
  const goal = state.goal;
  const canSend = !!goal && amount > 0 && amount <= goal.savedAmount;

  function openKeypad() {
    setKeypadInput(amount ? String(amount) : "");
    setKeypadOpen(true);
  }

  function keypadConfirm() {
    const n = parseInt(keypadInput || "0", 10) || 0;
    setAmount(Math.min(Math.floor(n / 1000) * 1000, Math.floor((goal?.savedAmount ?? 0) / 1000) * 1000));
    setKeypadInput("");
    setKeypadOpen(false);
  }

  async function handleFinalConfirm() {
    setSubmitting(true);
    setError(null);
    try {
      const result = await confirmGoalPurchase(amount);
      setReceipt(result);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ทำรายการไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell showNav={false}>
      {step === "amount" && <PageHeader title="ซื้อสลากจากกระปุกออม" variant="close" onAction={() => navigate("/kapook")} />}
      {step === "confirm" && <PageHeader title="ยืนยันข้อมูลการทำรายการ" variant="back" onAction={() => setStep("amount")} />}
      {step === "success" && <PageHeader title="ทำรายการสำเร็จ" variant="plain" />}

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
                <p className="gradient-card__balance mt-1">฿{formatTHB((goal?.savedAmount ?? 0))}</p>
              </div>
            </div>

            <p className="transfer-label mt-3">ถึง</p>
            <div className="gradient-card gradient-card--salak">
              <div className="gradient-card__top">
                <div>
                  <p className="gradient-card__label">{salakAccount ? maskAccountNumber(salakAccount.account_number) : ""}</p>
                  <p className="gradient-card__meta mt-1">{product?.name ?? ""}</p>
                </div>
                <p className="gradient-card__balance">฿0.00</p>
              </div>
            </div>

            <button type="button" onClick={openKeypad} className="transfer-amount-trigger mt-3" data-testid="buy-piggy-amount-trigger">
              <span className="transfer-amount-trigger__label">จำนวนเงิน</span>
              <span className={`transfer-amount-trigger__value ${amount > 0 ? "" : "transfer-amount-trigger__value--muted"}`}>
                {formatTHB(amount)}
              </span>
              <span className="transfer-amount-trigger__note">ยอดเงินจากการออมสะสม</span>
            </button>

            <div className="transfer-tags">
              <p className="field-label">แท็ก</p>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`chip ${selectedTags.includes(tag) ? "chip--selected" : ""}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5">
            <SlideToConfirm label="เลื่อนเพื่อส่ง" disabled={!canSend} onConfirm={() => setStep("confirm")} />
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="flex flex-col gap-4 p-4">
          <div className="confirm-amount-block">
            <p className="confirm-amount-label">จำนวนเงิน</p>
            <p className="confirm-amount-value">{formatTHB(amount)}</p>
            <p className="confirm-amount-fee">0.00 ค่าธรรมเนียม</p>
            <span className="chip chip--selected mt-2 inline-block">ฝากผ่านกระปุกออมก่อนซื้อสลาก</span>
          </div>

          {error && <p className="message">{error}</p>}

          <Button disabled={submitting} onClick={handleFinalConfirm} data-testid="buy-piggy-confirm-button">
            {submitting ? "กำลังทำรายการ..." : "ยืนยัน"}
          </Button>
        </div>
      )}

      {step === "success" && receipt && (
        <div className="flex flex-col items-center gap-1 px-5 pb-6">
          <div className="receipt-summary__check">
            <CheckIcon className="h-[38px] w-[38px]" />
          </div>
          <p className="receipt-summary__amount mt-2">฿{formatTHB(receipt.amount)}</p>
          <Card className="mt-3 w-full">
            <div className="kv-row">
              <span className="kv-row__label">รหัสอ้างอิง</span>
              <span className="kv-row__value">{receipt.reference_id}</span>
            </div>
            <div className="kv-row">
              <span className="kv-row__label">หมายเลขสลาก</span>
              <span className="kv-row__value">
                {receipt.ticket_start} – {receipt.ticket_end}
              </span>
            </div>
            <div className="kv-row">
              <span className="kv-row__label">จำนวนหน่วย</span>
              <span className="kv-row__value">{receipt.units}</span>
            </div>
          </Card>
          <div className="mt-5 w-full">
            <Button onClick={() => navigate("/salak")}>เสร็จสิ้น</Button>
          </div>
        </div>
      )}

      <BottomSheet open={keypadOpen} onClose={() => setKeypadOpen(false)}>
        <Keypad
          title="กำหนดจำนวนเงินที่จะซื้อ"
          subText={`ยอดพร้อมฝากสลาก ฿${formatTHB((goal?.savedAmount ?? 0))}`}
          footerText="*ปัดเศษลงเป็นจำนวนที่หารด้วย 1,000 บาทลงตัว"
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

function CheckIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} {...props}>
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
