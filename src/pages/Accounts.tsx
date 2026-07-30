import { useEffect, useState } from "react";
import * as api from "../lib/api";
import type { Account, SalakProduct } from "../lib/types";
import { AppShell } from "../components/AppShell";
import { AccountCard } from "../components/AccountCard";
import { ProductCard } from "../components/ProductCard";

type Segment = "accounts" | "products";

// The prototype's Accounts screen: a gradient header with a segmented
// control — "บัญชีของฉัน" (accounts) is the functional tab; the prototype's
// "ผลิตภัณฑ์และบริการ" tab is repurposed here to show the Salak product
// catalog (a real in-scope "product"), rather than left as a dead tab.
export function Accounts() {
  const [segment, setSegment] = useState<Segment>("accounts");
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [products, setProducts] = useState<SalakProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .listAccounts()
      .then((data) => !cancelled && setAccounts(data))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (segment !== "products" || products !== null) return;
    let cancelled = false;
    api
      .listSalakProducts()
      .then((data) => !cancelled && setProducts(data))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"));
    return () => {
      cancelled = true;
    };
  }, [segment, products]);

  return (
    <AppShell>
      <div
        className="rounded-b-[32px] px-5 pb-5 pt-8 text-white"
        style={{ backgroundImage: "var(--gradient-primary-accounts)" }}
      >
        <p className="text-[18px] font-bold">บัญชี</p>
        <div className="mt-4 flex rounded-full bg-white/20 p-1">
          <SegmentButton
            active={segment === "accounts"}
            onClick={() => setSegment("accounts")}
            testId="segment-accounts"
          >
            บัญชีของฉัน
          </SegmentButton>
          <SegmentButton
            active={segment === "products"}
            onClick={() => setSegment("products")}
            testId="segment-products"
          >
            ผลิตภัณฑ์และบริการ
          </SegmentButton>
        </div>
      </div>

      <div className="-mt-2 space-y-3 px-4 pt-4">
        {error && <p className="rounded-xl bg-white p-4 text-sm text-error">{error}</p>}

        {segment === "accounts" && (
          <>
            {!error && accounts === null && (
              <p className="rounded-xl bg-white p-4 text-sm text-neutral">กำลังโหลดบัญชี...</p>
            )}
            {accounts?.length === 0 && (
              <p className="rounded-xl bg-white p-4 text-sm text-neutral">
                ยังไม่มีบัญชีสำหรับผู้ใช้นี้ (บัญชีสาธิต: demo / demopass123)
              </p>
            )}
            {accounts?.map((account) => <AccountCard key={account.id} account={account} />)}
          </>
        )}

        {segment === "products" && (
          <>
            {!error && products === null && (
              <p className="rounded-xl bg-white p-4 text-sm text-neutral">กำลังโหลด...</p>
            )}
            {products?.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </>
        )}
      </div>
    </AppShell>
  );
}

function SegmentButton({
  active,
  onClick,
  testId,
  children,
}: {
  active: boolean;
  onClick: () => void;
  testId: string;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={`flex-1 rounded-full py-2 text-[13px] font-semibold transition ${
        active ? "bg-white text-primary-dark" : "text-white/80"
      }`}
    >
      {children}
    </button>
  );
}
