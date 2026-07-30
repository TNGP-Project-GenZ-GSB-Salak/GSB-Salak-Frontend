import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../lib/api";
import type { Account, BuySalakResponse, SalakProduct } from "../lib/types";
import { formatTHB, maskAccountNumber } from "../lib/format";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ReceiptSummary } from "../components/ReceiptSummary";

type Step = "form" | "confirm" | "success";

const PRESET_AMOUNTS = [1000, 5000, 10000, 50000];

export function BuySalak() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<SalakProduct | null>(null);
  const [savingsAccounts, setSavingsAccounts] = useState<Account[] | null>(null);
  const [salakAccount, setSalakAccount] = useState<Account | null>(null);
  const [fundingAccountId, setFundingAccountId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<Step>("form");
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
        const savings = accounts.filter((a) => a.type === "savings");
        setSavingsAccounts(savings);
        setFundingAccountId(savings[0]?.id ?? "");
        setSalakAccount(accounts.find((a) => a.type === "salak") ?? null);
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"));

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const amountError = useMemo(() => {
    if (!product || amount === "") return null;
    const value = Number(amount);
    const min = Number(product.min_purchase);
    const max = Number(product.max_purchase);
    const step = Number(product.step_amount);
    if (Number.isNaN(value) || value <= 0) return "กรุณาระบุจำนวนเงินที่ถูกต้อง";
    if (value < min) return `ฝากขั้นต่ำ ฿${formatTHB(min)}`;
    if (value > max) return `ฝากได้สูงสุด ฿${formatTHB(max)}`;
    if (step > 0) {
      const steps = (value - min) / step;
      if (Math.abs(steps - Math.round(steps)) > 1e-6) {
        return `จำนวนเงินต้องเพิ่มขึ้นทีละ ฿${formatTHB(step)}`;
      }
    }
    return null;
  }, [product, amount]);

  const canProceed = Boolean(product && fundingAccountId && amount && !amountError);

  async function handleConfirmSubmit() {
    if (!product || !salakAccount) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await api.buySalak({
        funding_account_id: fundingAccountId,
        salak_account_id: salakAccount.id,
        product_id: product.id,
        amount,
      });
      setReceipt(result);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ทำรายการไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "success" && receipt) {
    return (
      <AppShell showNav={false}>
        <PageHeader title="ทำรายการสำเร็จ" variant="plain" />
        <div className="flex flex-col gap-4 p-4">
          <ReceiptSummary receipt={receipt} />
          <Button onClick={() => navigate("/salak")}>เสร็จสิ้น</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showNav={false}>
      {step === "confirm" ? (
        <PageHeader
          title="ยืนยันข้อมูลการทำรายการ"
          variant="back"
          onAction={() => setStep("form")}
        />
      ) : (
        <PageHeader title="ซื้อสลากดิจิทัล" variant="close" onAction={() => navigate("/salak")} />
      )}

      <div className="flex flex-col gap-4 p-4">
        {!product && !error && <p className="text-muted">กำลังโหลด...</p>}
        {error && <p className="message" data-testid="message">{error}</p>}

        {product && salakAccount === null && (
          <p className="error-box">ไม่พบบัญชีสลากดิจิทัลสำหรับผู้ใช้นี้ ไม่สามารถซื้อสลากได้</p>
        )}

        {product && salakAccount && step === "form" && (
          <>
            <Card>
              <p className="text-muted">ผลิตภัณฑ์</p>
              <p className="text-strong">{product.name}</p>
              <p className="mt-1 text-muted">
                ฝากขั้นต่ำ ฿{formatTHB(product.min_purchase)} สูงสุด ฿{formatTHB(product.max_purchase)} ·
                ทวีคูณละ ฿{formatTHB(product.step_amount)}
              </p>
            </Card>

            <Card>
              <label className="field-label">บัญชีที่ใช้ซื้อ</label>
              {!savingsAccounts?.length ? (
                <p className="message">ไม่พบบัญชีเงินฝากที่ใช้ซื้อได้</p>
              ) : (
                <select
                  value={fundingAccountId}
                  onChange={(event) => setFundingAccountId(event.target.value)}
                  className="select-input"
                >
                  {savingsAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {maskAccountNumber(account.account_number)} — ฿{formatTHB(account.balance)}
                    </option>
                  ))}
                </select>
              )}
            </Card>

            <Card className="amount-card">
              <p className="amount-card__label">จำนวนเงิน</p>
              <input
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                data-testid="amount-input"
                className="amount-input"
              />
              <div className="preset-amounts">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className="preset-amounts__btn"
                  >
                    ฿{formatTHB(preset)}
                  </button>
                ))}
              </div>
              {amountError && (
                <p className="amount-error" data-testid="amount-error">
                  {amountError}
                </p>
              )}
            </Card>

            <Button disabled={!canProceed} onClick={() => setStep("confirm")}>
              ถัดไป
            </Button>
          </>
        )}

        {product && salakAccount && step === "confirm" && (
          <>
            <div className="confirm-amount-block">
              <p className="confirm-amount-label">จำนวนเงิน</p>
              <p className="confirm-amount-value">฿{formatTHB(amount)}</p>
              <p className="confirm-amount-fee">0.00 ค่าธรรมเนียม</p>
            </div>
            <Card className="kv-list">
              <Row label="ผลิตภัณฑ์" value={product.name} />
              <Row
                label="จาก"
                value={maskAccountNumber(
                  savingsAccounts?.find((a) => a.id === fundingAccountId)?.account_number ?? "",
                )}
              />
              <Row label="ไปยัง" value="บัญชีสลากดิจิทัล" />
            </Card>
            {error && (
              <p className="message" data-testid="message">
                {error}
              </p>
            )}
            <Button disabled={submitting} onClick={handleConfirmSubmit} data-testid="confirm-button">
              {submitting ? "กำลังทำรายการ..." : "ยืนยัน"}
            </Button>
            <Button variant="secondary" onClick={() => setStep("form")} disabled={submitting}>
              แก้ไข
            </Button>
          </>
        )}
      </div>
    </AppShell>
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
