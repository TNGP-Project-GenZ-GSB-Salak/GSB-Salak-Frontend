import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import type { Account, KapookBuyFromGoalResponse, KapookGoalResponse, SalakProduct } from "../lib/types";
import { formatTHB, formatDate, maskAccountNumber } from "../lib/format";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { SlideToConfirm } from "../components/SlideToConfirm";
import { useAuth } from "../context/AuthContext";
import { useKapook } from "../context/KapookContext";
import { messageForError } from "../lib/kapookErrorMessages";
import mymoLogo from "../assets/mymo-logo.png";

type Step = "amount" | "confirm" | "success";

const TAG_OPTIONS = ["ซื้อสลาก", "ซื้อสลากให้ลูก", "ออมเงิน"];

// Matches designs/…V.5.html's confirm/success screens exactly (the same
// ones BuySalak.tsx's real "ซื้อเลย" flow already builds via its own local
// PartyRow/Row — duplicated here rather than importing from that file,
// since it's the one screen this codebase must never touch): "จาก"/"ถึง"
// avatar rows for the real kapook + salak accounts (the purchase is funded
// from the kapook balance itself, not a savings account), the product
// period + unit count, and a date/time stamp.
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
  const [salakAccount, setSalakAccount] = useState<Account | null>(null);
  // The server-fed goal snapshot (GET /kapook/goals/active) - same read
  // model KapookTracker.tsx uses - is the sole source of truth for the
  // goal itself, its available_balance, and its buy_eligible flag here.
  // undefined = still loading.
  const [serverGoal, setServerGoal] = useState<KapookGoalResponse | null | undefined>(undefined);
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState(0);
  const [editingAmount, setEditingAmount] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<KapookBuyFromGoalResponse | null>(null);
  const [successAt, setSuccessAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!serverGoal) return;
    let cancelled = false;
    Promise.all([api.getSalakProduct(serverGoal.product_id), api.listAccounts()]).then(([productData, accounts]) => {
      if (cancelled) return;
      setProduct(productData);
      setSalakAccount(accounts.find((a) => a.type === "salak") ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [serverGoal?.product_id]);

  useEffect(() => {
    if (!state.account) return;
    let cancelled = false;
    api.getActiveKapookGoal(state.account.id).then((g) => {
      if (!cancelled) setServerGoal(g);
    });
    return () => {
      cancelled = true;
    };
  }, [state.account]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  if (serverGoal === undefined && step !== "success") return null;
  // A *full* purchase (amount === availableBalance) that also completes the
  // target closes the goal as soon as the next fetch would report it gone
  // — but the user still needs to see the success receipt for the purchase
  // that just happened. Only redirect away before that point.
  if (!serverGoal && step !== "success") return <Navigate to="/kapook" replace />;
  // available_balance and buy_eligible come from the server's own goal
  // snapshot (GoalSnapshot, same read model KapookTracker.tsx uses) - not
  // recomputed client-side. Coerced to Number only for display/capping, the
  // same way KapookTracker already does.
  const availableBalance = serverGoal ? Number(serverGoal.available_balance) : 0;
  // Matches designs/…V.5.html's `salakAmountNotMultipleError`: the amount is
  // NOT silently rounded down — it's validated, and "เลื่อนเพื่อส่ง" stays
  // disabled with an error message until it's an exact multiple of ฿1,000.
  const notMultipleOf1000 = amount > 0 && amount % 1000 !== 0;
  const canSend = !!serverGoal?.buy_eligible && amount > 0 && amount <= availableBalance && !notMultipleOf1000;
  const units = product ? Math.floor(amount / Number(product.unit_price)) : 0;

  // Real device keyboard instead of a custom on-screen digit grid — avoids
  // the grid's small tap targets mis-registering when the page scrolls
  // while it's open — showing exactly what was typed (capped at the saved
  // balance), not a silently-rounded value.
  function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
    const n = digits ? parseInt(digits, 10) : 0;
    setAmount(Math.min(n, availableBalance));
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
      setError(messageForError(err));
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
                <p className="gradient-card__balance mt-1">฿{formatTHB(availableBalance)}</p>
              </div>
            </div>

            <p className="transfer-label mt-3">ถึง</p>
            <div className="gradient-card gradient-card--salak">
              <div className="gradient-card__top">
                <div>
                  <p className="gradient-card__label">{salakAccount ? maskAccountNumber(salakAccount.account_number) : ""}</p>
                  <p className="gradient-card__meta mt-1">{product?.name ?? ""}</p>
                </div>
                <p className="gradient-card__balance">฿{formatTHB(salakAccount!.balance)}</p>
              </div>
            </div>

            <label
              className="transfer-amount-trigger mt-3"
              data-testid="buy-piggy-amount-trigger"
              onClick={() => !editingAmount && setEditingAmount(true)}
            >
              <span className="transfer-amount-trigger__label">จำนวนเงิน</span>
              {editingAmount ? (
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
                  data-testid="buy-piggy-amount-input"
                />
              ) : (
                <span className={`transfer-amount-trigger__value ${amount > 0 ? "" : "transfer-amount-trigger__value--muted"}`}>
                  {formatTHB(amount)}
                </span>
              )}
              <span className="transfer-amount-trigger__note">ยอดเงินจากการออมสะสม</span>
            </label>
            {notMultipleOf1000 ? (
              <p className="amount-error text-center" data-testid="buy-piggy-amount-error">
                กรุณาระบุจำนวนเป็นจำนวนเต็มพันบาท (เช่น 1,000, 2,000)
              </p>
            ) : (
              <p className="text-muted text-center">ยอดพร้อมฝากสลาก ฿{formatTHB(availableBalance)}</p>
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
            <PartyRow label="จาก" name={user?.full_name ?? ""} mask={state.account ? maskAccountNumber(state.account.accountNumber) : ""} />
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
            <PartyRow label="จาก" name={user?.full_name ?? ""} mask={state.account ? maskAccountNumber(state.account.accountNumber) : ""} />
            <PartyRow label="ถึง" name={user?.full_name ?? ""} mask={salakAccount ? maskAccountNumber(salakAccount.account_number) : ""} />
            <Row label="รหัสอ้างอิง" value={receipt.reference_id} />
            <Row label={`ฝากสลากดิจิทัล ${product?.term_months ?? ""} เดือน`} value={receipt.product_name} />
            <Row label="หมายเลขสลาก" value={`${receipt.ticket_start} – ${receipt.ticket_end}`} />
            <Row label="จำนวนหน่วย" value={String(receipt.units)} />
            <Row label="วันครบกำหนด" value={formatDate(receipt.maturity_date)} />
          </Card>
          <div className="mt-5 w-full">
            <Button onClick={() => navigate("/salak")}>เสร็จสิ้น</Button>
          </div>
        </div>
      )}
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
