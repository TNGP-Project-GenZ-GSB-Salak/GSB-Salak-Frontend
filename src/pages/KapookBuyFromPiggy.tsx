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
import { useAuth } from "../context/AuthContext";
import { useKapook } from "../context/KapookContext";
import mymoLogo from "../assets/mymo-logo.png";

type Step = "amount" | "confirm" | "success";

const TAG_OPTIONS = ["ซื้อสลาก", "ซื้อสลากให้ลูก", "ออมเงิน"];

// Matches designs/…V.5.html's confirm/success screens exactly (the same
// ones BuySalak.tsx's real "ซื้อเลย" flow already builds via its own local
// PartyRow/Row — duplicated here rather than importing from that file,
// since it's the one screen this codebase must never touch): "จาก"/"ถึง"
// avatar rows for the real savings + salak accounts (money still visibly
// moves through the user's real accounts even though it was staged in the
// piggy first), the product period + unit count, and a date/time stamp.
function formatDateTime(date: Date): string {
  const dateStr = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", { day: "2-digit", month: "short", year: "numeric" }).format(date);
  const timeStr = new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  return `${dateStr} ${timeStr}`;
}

function PartyRow({ label, name, mask }: { label: string; name: string; mask: string }) {
  return (
    <div className="party-row">
      <img src={mymoLogo} alt="" className="party-row__avatar-img" />
      <div className="flex-1">
        <p className="party-row__label">{label}</p>
        <p className="party-row__name">{name}</p>
        <p className="party-row__mask">{mask} · ธนาคารออมสิน</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="kv-row">
      <span className="kv-row__label">{label}</span>
      <span className="kv-row__value">{value}</span>
    </div>
  );
}

// Matches the prototype's transfer screen in its "amountLocked" mode
// (prompt/README.md §15, designs/…V.5.html): the same "จาก"/"ถึง" two-card +
// tags layout as BuySalak.tsx's real "ซื้อเลย" flow (this screen is shared
// between both in the prototype) — buying Salak from the piggy is its own
// amount-entry step, capped at the piggy's saved balance and rounded down to
// the nearest ฿1,000, not an instant one-tap spend of the whole balance.
export function KapookBuyFromPiggy() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, confirmGoalPurchase } = useKapook();
  const [product, setProduct] = useState<SalakProduct | null>(null);
  const [fundingAccount, setFundingAccount] = useState<Account | null>(null);
  const [salakAccount, setSalakAccount] = useState<Account | null>(null);
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState(0);
  const [keypadOpen, setKeypadOpen] = useState(false);
  const [keypadInput, setKeypadInput] = useState("");
  const [amountBeforeKeypad, setAmountBeforeKeypad] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<BuySalakResponse | null>(null);
  const [successAt, setSuccessAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!state.goal) return;
    let cancelled = false;
    Promise.all([api.getSalakProduct(state.goal.productId), api.listAccounts()]).then(([productData, accounts]) => {
      if (cancelled) return;
      setProduct(productData);
      setFundingAccount(accounts.find((a) => a.type === "savings") ?? null);
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
  // Matches designs/…V.5.html's `salakAmountNotMultipleError`: the amount is
  // NOT silently rounded down — it's validated, and "เลื่อนเพื่อส่ง" stays
  // disabled with an error message until it's an exact multiple of ฿1,000.
  const notMultipleOf1000 = amount > 0 && amount % 1000 !== 0;
  const canSend = !!goal && amount > 0 && amount <= goal.savedAmount && !notMultipleOf1000;
  const units = product ? Math.floor(amount / Number(product.unit_price)) : 0;

  function openKeypad() {
    setKeypadInput(amount ? String(amount) : "");
    setAmountBeforeKeypad(amount);
    setKeypadOpen(true);
  }

  // Every keystroke updates the amount on the page itself immediately —
  // matches a real banking-app keypad, no separate readout duplicated
  // inside the sheet — showing exactly what was typed (capped at the saved
  // balance), not a silently-rounded value.
  function applyKeypadValue(rawDigits: string) {
    setKeypadInput(rawDigits);
    const n = parseInt(rawDigits || "0", 10) || 0;
    setAmount(Math.min(n, goal?.savedAmount ?? 0));
  }

  function keypadCancel() {
    setAmount(amountBeforeKeypad);
    setKeypadOpen(false);
  }

  async function handleFinalConfirm() {
    setSubmitting(true);
    setError(null);
    try {
      const result = await confirmGoalPurchase(amount);
      setReceipt(result);
      setSuccessAt(new Date());
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
            {notMultipleOf1000 ? (
              <p className="amount-error text-center" data-testid="buy-piggy-amount-error">
                กรุณาระบุจำนวนเป็นจำนวนเต็มพันบาท (เช่น 1,000, 2,000)
              </p>
            ) : (
              <p className="text-muted text-center">ยอดพร้อมฝากสลาก ฿{formatTHB(goal?.savedAmount ?? 0)}</p>
            )}

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
            <p className="text-muted">{formatDateTime(new Date())}</p>
            <span className="chip chip--selected mt-2 inline-block">ฝากผ่านกระปุกออมก่อนซื้อสลาก</span>
          </div>

          <Card>
            <PartyRow label="จาก" name={user?.full_name ?? ""} mask={fundingAccount ? maskAccountNumber(fundingAccount.account_number) : ""} />
            <PartyRow label="ถึง" name={user?.full_name ?? ""} mask={salakAccount ? maskAccountNumber(salakAccount.account_number) : ""} />
            <Row label={`ฝากสลากดิจิทัล ${product?.term_months ?? ""} เดือน`} value={product?.name ?? ""} />
            <Row label="จำนวนหน่วย" value={units.toLocaleString("en-US")} />
          </Card>

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
          <p className="text-muted mt-2">{successAt ? formatDateTime(successAt) : ""}</p>
          <p className="receipt-summary__amount">฿{formatTHB(receipt.amount)}</p>
          <span className="chip chip--selected inline-block">ฝากผ่านกระปุกออมก่อนซื้อสลาก</span>
          <Card className="mt-3 w-full">
            <PartyRow label="จาก" name={user?.full_name ?? ""} mask={fundingAccount ? maskAccountNumber(fundingAccount.account_number) : ""} />
            <PartyRow label="ถึง" name={user?.full_name ?? ""} mask={salakAccount ? maskAccountNumber(salakAccount.account_number) : ""} />
            <Row label="รหัสอ้างอิง" value={receipt.reference_id} />
            <Row label={`ฝากสลากดิจิทัล ${product?.term_months ?? ""} เดือน`} value={receipt.product_name} />
            <Row label="หมายเลขสลาก" value={`${receipt.ticket_start} – ${receipt.ticket_end}`} />
            <Row label="จำนวนหน่วย" value={String(receipt.units)} />
          </Card>
          <div className="mt-5 w-full">
            <Button onClick={() => navigate("/salak")}>เสร็จสิ้น</Button>
          </div>
        </div>
      )}

      <BottomSheet open={keypadOpen} onClose={keypadCancel}>
        <Keypad
          title="กำหนดจำนวนเงินที่จะซื้อ"
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

function CheckIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} {...props}>
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
