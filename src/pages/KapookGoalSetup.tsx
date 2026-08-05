import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import type { SalakProduct } from "../lib/types";
import { formatTHB } from "../lib/format";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { BottomSheet } from "../components/BottomSheet";
import { Keypad } from "../components/Keypad";
import { Button } from "../components/Button";
import { useKapook } from "../context/KapookContext";
import { messageForError } from "../lib/kapookErrorMessages";

const PRESET_AMOUNTS = [1000, 5000, 10000, 50000, 100000, 500000];

// Matches the prototype's goalSetup screen exactly (extracted by driving
// designs/…V.4.html): a subtitle naming the product + flow, a big heading,
// and the presets as a plain inline list of rows — not a trigger + bottom
// sheet like BuySalak's amount picker, and no T&C gate on this screen at
// all (the 24h auto-purchase disclosure — docs/GAPS.md §2.6 — is a business
// requirement newer than this prototype; it's surfaced instead in the
// tracker's countdown banner once the goal is reached).
export function KapookGoalSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: kapookState, createGoal } = useKapook();
  const [products, setProducts] = useState<SalakProduct[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [keypadOpen, setKeypadOpen] = useState(false);
  const [keypadInput, setKeypadInput] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .listSalakProducts()
      .then((list) => !cancelled && setProducts(list))
      .catch((err) => !cancelled && setLoadError(messageForError(err, "โหลดข้อมูลไม่สำเร็จ")));
    return () => {
      cancelled = true;
    };
  }, []);

  const requestedProductId = (location.state as { productId?: string } | null)?.productId;
  const product = useMemo(() => {
    if (!products || products.length === 0) return null;
    return products.find((p) => p.id === requestedProductId) ?? products[0];
  }, [products, requestedProductId]);

  // termsAccepted is fetched fresh from the server (GET /kapook/terms) - null
  // only while that request is still in flight, so it's checked separately
  // from the false case rather than folded into one falsy check.
  if (kapookState.termsAccepted === null) return null;
  if (!kapookState.termsAccepted) {
    return <Navigate to="/kapook/open" state={{ productId: requestedProductId }} replace />;
  }

  async function handleConfirm() {
    if (!amount || !product) return;
    setError(null);
    try {
      await createGoal(amount, product.id);
      navigate("/kapook", { replace: true });
    } catch (err) {
      setError(messageForError(err));
    }
  }

  const confirmDisabled = !amount || !product;

  function keypadConfirm() {
    setAmount(parseInt(keypadInput || "0", 10) || null);
    setKeypadInput("");
    setKeypadOpen(false);
  }

  return (
    <AppShell showNav={false}>
      <PageHeader title="ตั้งเป้าหมายเก็บเงิน" variant="close" onAction={() => navigate("/salak/buy")} />

      <div className="flex flex-col p-4">
        {loadError && <p className="error-box">{loadError}</p>}
        {!loadError && !product && <p className="text-muted">กำลังโหลด...</p>}
        {product && <p className="goal-subtitle">{product.name} · ออมก่อนแล้วค่อยซื้อสลาก</p>}
        <p className="goal-amount-heading">
          {amount !== null ? `฿${formatTHB(amount)}` : "เลือกจำนวนเงินเป้าหมาย"}
        </p>

        <div className="goal-list">
          {PRESET_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              className={`goal-list__item ${amount === value ? "goal-list__item--selected" : ""}`}
              onClick={() => setAmount(value)}
              data-testid="goal-amount-preset"
            >
              {value.toLocaleString("en-US")} บาท
            </button>
          ))}
          <button
            type="button"
            className={`goal-list__item ${amount !== null && !PRESET_AMOUNTS.includes(amount) ? "goal-list__item--selected" : ""}`}
            onClick={() => setKeypadOpen(true)}
            data-testid="goal-amount-custom"
          >
            กำหนดเอง
          </button>
        </div>

        <div className="mt-4">
          {error && (
            <p className="message" data-testid="message">
              {error}
            </p>
          )}
          <Button disabled={confirmDisabled} onClick={handleConfirm} data-testid="goal-confirm-button">
            ยืนยัน
          </Button>
        </div>
      </div>

      <BottomSheet open={keypadOpen} onClose={() => setKeypadOpen(false)}>
        <Keypad
          title="กำหนดจำนวนเงินเป้าหมาย"
          subText="ต้องเป็นจำนวนที่หารด้วย 1,000 บาทลงตัว"
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
