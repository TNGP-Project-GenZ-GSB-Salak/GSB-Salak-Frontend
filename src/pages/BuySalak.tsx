import { useEffect, useMemo, useState, type SVGProps } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../lib/api";
import type { Account, BuySalakResponse, SalakProduct } from "../lib/types";
import { formatTHB, maskAccountNumber } from "../lib/format";
import { findPrimaryAccount } from "../lib/accounts";
import { useAuth } from "../context/AuthContext";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { BottomSheet } from "../components/BottomSheet";
import { Keypad } from "../components/Keypad";
import { SlideToConfirm } from "../components/SlideToConfirm";

type Step = "transfer" | "confirm" | "success";
type Sheet = "amount" | "keypad" | null;

const PRESET_AMOUNTS = [1000, 5000, 10000, 50000, 100000, 500000];
const TAG_OPTIONS = ["ซื้อสลาก", "ซื้อสลากให้ลูก", "ออมเงิน"];

// Matches the prototype's transfer -> confirm -> success screens: a
// "จาก"/"ถึง" bank-transfer-style layout, a tap-to-open amount sheet (presets
// + numeric keypad), decorative tags, and a slide-to-send control. One route
// (/salak/buy/:productId) with internal step state, same pattern the rest of
// this app already uses for multi-step flows.
export function BuySalak() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState<SalakProduct | null>(null);
  const [fundingAccount, setFundingAccount] = useState<Account | null>(null);
  const [salakAccount, setSalakAccount] = useState<Account | null>(null);
  const [step, setStep] = useState<Step>("transfer");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [amount, setAmount] = useState(0);
  const [keypadInput, setKeypadInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [receipt, setReceipt] = useState<BuySalakResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    Promise.all([api.getSalakProduct(productId), api.listAccounts()])
      .then(([productData, accounts]) => {
        if (cancelled) return;
        setProduct(productData);
        setFundingAccount(findPrimaryAccount(accounts) ?? null);
        setSalakAccount(accounts.find((a) => a.type === "salak") ?? null);
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"));

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const amountError = useMemo(() => {
    if (!product || amount <= 0) return null;
    const min = Number(product.min_purchase);
    const max = Number(product.max_purchase);
    const stepAmount = Number(product.step_amount);
    if (amount < min) return `ฝากขั้นต่ำ ฿${formatTHB(min)}`;
    if (amount > max) return `ฝากได้สูงสุด ฿${formatTHB(max)}`;
    if (stepAmount > 0) {
      const steps = (amount - min) / stepAmount;
      if (Math.abs(steps - Math.round(steps)) > 1e-6) {
        return `จำนวนเงินต้องเพิ่มขึ้นทีละ ฿${formatTHB(stepAmount)}`;
      }
    }
    return null;
  }, [product, amount]);

  const units = product ? Math.floor(amount / Number(product.unit_price)) : 0;
  const canSend = amount > 0 && !amountError;

  function closeSheet() {
    setSheet(null);
  }

  function pickPreset(value: number) {
    setAmount(value);
    setSheet(null);
  }

  function openKeypad() {
    setKeypadInput(amount ? String(amount) : "");
    setSheet("keypad");
  }

  function keypadDigit(digit: string) {
    setKeypadInput((prev) => (prev + digit).slice(0, 9));
  }

  function keypadDelete() {
    setKeypadInput((prev) => prev.slice(0, -1));
  }

  function keypadConfirm() {
    setAmount(parseInt(keypadInput || "0", 10) || 0);
    setKeypadInput("");
    setSheet(null);
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function handleFinalConfirm() {
    if (!product || !fundingAccount || !salakAccount) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await api.buySalak({
        funding_account_id: fundingAccount.id,
        salak_account_id: salakAccount.id,
        product_id: product.id,
        amount: String(amount),
      });
      setReceipt(result);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ทำรายการไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  }

  const ready = product && fundingAccount && salakAccount;

  return (
    <AppShell showNav={false}>
      {step === "transfer" && (
        <PageHeader title="โอนเงิน" variant="close" onAction={() => navigate("/salak/buy")} />
      )}
      {step === "confirm" && (
        <PageHeader title="ยืนยันข้อมูลการทำรายการ" variant="back" onAction={() => setStep("transfer")} />
      )}
      {step === "success" && <PageHeader title="ทำรายการสำเร็จ" variant="plain" />}

      {!ready && !error && <p className="text-muted p-4">กำลังโหลด...</p>}
      {error && step !== "confirm" && (
        <p className="message p-4" data-testid="message">
          {error}
        </p>
      )}

      {ready && step === "transfer" && (
        <div className="flex flex-col gap-1" style={{ minHeight: "calc(100% - 62px)" }}>
          <div className="flex flex-1 flex-col gap-1 p-4">
            <p className="transfer-label">จาก</p>
            <div className="gradient-card gradient-card--savings">
              <div className="gradient-card__top">
                <div>
                  <p className="gradient-card__label">{maskAccountNumber(fundingAccount!.account_number)}</p>
                  <p className="gradient-card__meta mt-1">บัญชีเงินฝากเผื่อเรียก</p>
                </div>
                <div className="text-right">
                  <span className="transfer-card__badge">บัญชีหลัก</span>
                  <p className="gradient-card__balance mt-1">฿{formatTHB(fundingAccount!.balance)}</p>
                </div>
              </div>
            </div>

            <p className="transfer-label mt-3">ถึง</p>
            <div className="gradient-card gradient-card--salak">
              <div className="gradient-card__top">
                <div>
                  <p className="gradient-card__label">{maskAccountNumber(salakAccount!.account_number)}</p>
                  <p className="gradient-card__meta mt-1">{product!.name}</p>
                </div>
                <p className="gradient-card__balance">฿0.00</p>
              </div>
            </div>

            <button type="button" onClick={() => setSheet("amount")} className="transfer-amount-trigger" data-testid="amount-trigger">
              <span className="transfer-amount-trigger__label">จำนวนเงิน</span>
              <span className={`transfer-amount-trigger__value ${amount > 0 ? "" : "transfer-amount-trigger__value--muted"}`}>
                {formatTHB(amount)}
              </span>
            </button>
            {amountError && (
              <p className="amount-error text-center" data-testid="amount-error">
                {amountError}
              </p>
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
            <SlideToConfirm disabled={!canSend} onConfirm={() => setStep("confirm")} />
          </div>
        </div>
      )}

      {ready && step === "confirm" && (
        <div className="flex flex-col gap-4 p-4">
          <div className="confirm-amount-block">
            <p className="confirm-amount-label">จำนวนเงิน</p>
            <p className="confirm-amount-value">{formatTHB(amount)}</p>
            <p className="confirm-amount-fee">0.00 ค่าธรรมเนียม</p>
          </div>

          <Card>
            <PartyRow label="จาก" name={user?.full_name ?? ""} mask={maskAccountNumber(fundingAccount!.account_number)} />
            <PartyRow label="ถึง" name={user?.full_name ?? ""} mask={maskAccountNumber(salakAccount!.account_number)} />
            <Row label={`ฝากสลากดิจิทัล ${product!.term_months} เดือน`} value={product!.name} />
            <Row label="จำนวนหน่วย" value={units.toLocaleString("en-US")} />
          </Card>

          {error && (
            <p className="message" data-testid="message">
              {error}
            </p>
          )}

          <Button disabled={submitting} onClick={handleFinalConfirm} data-testid="confirm-button">
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
            <PartyRow label="จาก" name={user?.full_name ?? ""} mask={maskAccountNumber(fundingAccount?.account_number ?? "")} />
            <PartyRow label="ถึง" name={user?.full_name ?? ""} mask={maskAccountNumber(salakAccount?.account_number ?? "")} />
            <Row label="รหัสอ้างอิง" value={receipt.reference_id} testId="receipt-ref" />
            <Row label={`ฝากสลากดิจิทัล ${product?.term_months ?? ""} เดือน`} value={receipt.product_name} />
            <Row
              label="หมายเลขสลาก"
              value={`${receipt.ticket_start} – ${receipt.ticket_end}`}
              testId="receipt-ticket-range"
            />
            <Row label="จำนวนหน่วย" value={String(receipt.units)} />
          </Card>

          <div className="mt-5 w-full">
            <Button onClick={() => navigate("/salak")}>เสร็จสิ้น</Button>
          </div>
        </div>
      )}

      <BottomSheet open={sheet === "amount"} onClose={closeSheet}>
        <div className="action-sheet">
          <div className="action-sheet__title">เลือกจำนวนเงิน</div>
          {PRESET_AMOUNTS.map((value) => (
            <button key={value} type="button" onClick={() => pickPreset(value)} className="action-sheet__action" data-testid="amount-preset">
              {value.toLocaleString("en-US")}
            </button>
          ))}
          <button type="button" onClick={openKeypad} className="action-sheet__action action-sheet__action--strong" data-testid="amount-custom">
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
          title="กำหนดจำนวนเงิน"
          subText={product ? `ฝากขั้นต่ำ ฿${formatTHB(product.min_purchase)} สูงสุด ฿${formatTHB(product.max_purchase)}` : ""}
          footerText={product ? `*ระบุจำนวนที่หารด้วย ฿${formatTHB(product.step_amount)} ลงตัว` : ""}
          display={keypadInput ? Number(keypadInput).toLocaleString("en-US") : "0"}
          onDigit={keypadDigit}
          onDelete={keypadDelete}
          onCancel={closeSheet}
          onConfirm={keypadConfirm}
        />
      </BottomSheet>
    </AppShell>
  );
}

function PartyRow({ label, name, mask }: { label: string; name: string; mask: string }) {
  return (
    <div className="party-row">
      <span className="party-row__avatar">
        <BankIcon className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <p className="party-row__label">{label}</p>
        <p className="party-row__name">{name}</p>
        <p className="party-row__mask">{mask} · ธนาคารออมสิน</p>
      </div>
    </div>
  );
}

function Row({ label, value, testId }: { label: string; value: string; testId?: string }) {
  return (
    <div className="kv-row">
      <span className="kv-row__label">{label}</span>
      <span className="kv-row__value" data-testid={testId}>
        {value}
      </span>
    </div>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} {...props}>
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BankIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M3 10h18M5 10v9M19 10v9M9 10v9M15 10v9M2 10l10-6 10 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 19h18" strokeLinecap="round" />
    </svg>
  );
}
