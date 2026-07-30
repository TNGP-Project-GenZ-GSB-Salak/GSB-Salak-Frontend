import { useEffect, useState } from "react";
import * as api from "../lib/api";
import type { Account, SalakProduct } from "../lib/types";
import { AppShell } from "../components/AppShell";
import { AccountCard } from "../components/AccountCard";
import { ProductCard } from "../components/ProductCard";

type Segment = "accounts" | "products";

// The prototype's Accounts screen: a gradient header with an underline-tab
// segmented control — "บัญชีของฉัน" (accounts) is the functional tab; the
// prototype's "ผลิตภัณฑ์และบริการ" tab is repurposed here to show the Salak
// product catalog (a real in-scope "product"), rather than left as a dead tab.
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
      <div className="accounts-header">
        <p className="accounts-header__title">บัญชี</p>
        <div className="segment-tabs">
          <SegmentTab active={segment === "accounts"} onClick={() => setSegment("accounts")} testId="segment-accounts">
            บัญชีของฉัน
          </SegmentTab>
          <SegmentTab active={segment === "products"} onClick={() => setSegment("products")} testId="segment-products">
            ผลิตภัณฑ์และบริการ
          </SegmentTab>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pt-4">
        {error && <p className="error-box">{error}</p>}

        {segment === "accounts" && (
          <>
            {!error && accounts === null && <p className="empty-state">กำลังโหลดบัญชี...</p>}
            {accounts?.length === 0 && (
              <p className="empty-state">ยังไม่มีบัญชีสำหรับผู้ใช้นี้ (บัญชีสาธิต: demo / demopass123)</p>
            )}
            {accounts?.map((account) => <AccountCard key={account.id} account={account} />)}
          </>
        )}

        {segment === "products" && (
          <>
            {!error && products === null && <p className="empty-state">กำลังโหลด...</p>}
            {products?.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </>
        )}
      </div>
    </AppShell>
  );
}

function SegmentTab({
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
      className={`segment-tabs__tab ${active ? "segment-tabs__tab--active" : ""}`}
    >
      {children}
    </button>
  );
}
