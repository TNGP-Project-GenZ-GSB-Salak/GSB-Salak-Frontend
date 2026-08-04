import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import type { Account, SalakProduct } from "../lib/types";
import { formatTHB } from "../lib/format";
import { computeAvailableBalance, cumulativeCommitted, goalProgressPct } from "../lib/kapookStore";
import { useKapook } from "../context/KapookContext";
import { AppShell } from "../components/AppShell";
import { AccountCard } from "../components/AccountCard";
import { ProgressBar } from "../components/ProgressBar";
import { ProductCard } from "../components/ProductCard";

type Segment = "accounts" | "products";

// The prototype's Accounts screen: a gradient header with an underline-tab
// segmented control — "บัญชีของฉัน" (accounts) is the functional tab; the
// prototype's "ผลิตภัณฑ์และบริการ" tab is repurposed here to show the Salak
// product catalog (a real in-scope "product"), rather than left as a dead tab.
// Tapping either action here just hands off into the real buy flow (Salak's
// buy-list screen owns the actual detail sheet / mode-choose sheet).
//
// prompt/README.md §20/§Balance accounting: the savings row shows the
// balance *net of* whatever's reserved in an open Kapook goal, and — once a
// piggy account has ever been opened — a "กระปุกออมสลาก" row appears too,
// showing its own saved amount and (while a goal is active) progress.
export function Accounts() {
  const navigate = useNavigate();
  const { state: kapookState } = useKapook();
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

  const goal = kapookState.goal;

  return (
    <AppShell>
      <div className="accounts-header">
        <p className="accounts-header__title">บัญชีของฉัน</p>
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
            {accounts?.map((account) => (
              <AccountCard
                key={account.id}
                account={
                  account.type === "savings"
                    ? { ...account, balance: String(computeAvailableBalance(Number(account.balance), goal)) }
                    : account
                }
              />
            ))}
            {kapookState.account && (
              <button type="button" onClick={() => navigate("/kapook")} className="gradient-card gradient-card--piggy" data-testid="piggy-account-row">
                <div className="gradient-card__top">
                  <div>
                    <p className="gradient-card__label">กระปุกออมสลาก</p>
                    <p className="gradient-card__meta">{kapookState.account.accountNumber}</p>
                  </div>
                  <ArrowIcon />
                </div>
                <p className="gradient-card__eyebrow">คงเหลือ</p>
                <p className="gradient-card__balance">฿{formatTHB(goal?.savedAmount ?? 0)}</p>
                {goal && (
                  <div className="mt-3">
                    <div className="flex justify-between items-baseline">
                      <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.85 }}>ความคืบหน้า</span>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{goalProgressPct(goal)}%</span>
                    </div>
                    <ProgressBar value={cumulativeCommitted(goal)} max={goal.targetAmount} />
                    <p style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>เป้าหมาย ฿{formatTHB(goal.targetAmount)}</p>
                  </div>
                )}
              </button>
            )}
          </>
        )}

        {segment === "products" && (
          <>
            {!error && products === null && <p className="empty-state">กำลังโหลด...</p>}
            {products?.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onDetail={() => navigate("/salak/buy")}
                onBuy={() => navigate(`/salak/buy/${product.id}`)}
              />
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-[18px] w-[18px] opacity-90">
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
