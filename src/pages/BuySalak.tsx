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
        <div className="space-y-4 p-4">
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

      <div className="space-y-4 p-4">
        {!product && !error && <p className="text-sm text-neutral">กำลังโหลด...</p>}
        {error && <p className="text-sm text-error" data-testid="message">{error}</p>}

        {product && salakAccount === null && (
          <p className="rounded-xl bg-white p-4 text-sm text-error">
            ไม่พบบัญชีสลากดิจิทัลสำหรับผู้ใช้นี้ ไม่สามารถซื้อสลากได้
          </p>
        )}

        {product && salakAccount && step === "form" && (
          <>
            <Card>
              <p className="text-sm text-neutral">ผลิตภัณฑ์</p>
              <p className="font-semibold text-ink">{product.name}</p>
              <p className="mt-1 text-xs text-neutral">
                ฝากขั้นต่ำ ฿{formatTHB(product.min_purchase)} สูงสุด ฿{formatTHB(product.max_purchase)} ·
                ทวีคูณละ ฿{formatTHB(product.step_amount)}
              </p>
            </Card>

            <Card>
              <label className="mb-1 block text-sm font-medium text-ink">บัญชีที่ใช้ซื้อ</label>
              {!savingsAccounts?.length ? (
                <p className="text-sm text-error">ไม่พบบัญชีเงินฝากที่ใช้ซื้อได้</p>
              ) : (
                <select
                  value={fundingAccountId}
                  onChange={(event) => setFundingAccountId(event.target.value)}
                  className="w-full rounded-xl border border-neutral-lighter px-3 py-2 text-sm"
                >
                  {savingsAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {maskAccountNumber(account.account_number)} — ฿{formatTHB(account.balance)}
                    </option>
                  ))}
                </select>
              )}
            </Card>

            <Card className="text-center">
              <p className="text-[12px] font-semibold tracking-wider text-neutral">จำนวนเงิน</p>
              <input
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                data-testid="amount-input"
                className="mt-1.5 w-full border-none text-center font-bold text-ink tabular-nums outline-none"
                style={{ fontSize: 38 }}
              />
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className="rounded-full bg-pastel-pink px-3 py-1 text-xs font-medium text-primary-dark"
                  >
                    ฿{formatTHB(preset)}
                  </button>
                ))}
              </div>
              {amountError && (
                <p className="mt-2 text-xs text-error" data-testid="amount-error">
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
            <div className="pb-2 pt-1 text-center">
              <p className="text-[13px] font-semibold text-neutral">จำนวนเงิน</p>
              <p className="mt-1.5 font-bold text-primary tabular-nums" style={{ fontSize: 36 }}>
                ฿{formatTHB(amount)}
              </p>
              <p className="mt-1 text-xs text-neutral">0.00 ค่าธรรมเนียม</p>
            </div>
            <Card className="divide-y divide-[color:var(--color-hairline)] text-sm [&>*]:py-3">
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
              <p className="text-sm text-error" data-testid="message">
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
    <div className="flex justify-between">
      <span className="text-neutral">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
