import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import type { Account, KapookGoalResponse, SalakProduct } from "../lib/types";
import { formatTHB } from "../lib/format";
import { useKapook } from "../context/KapookContext";
import { AppShell } from "../components/AppShell";
import { AccountCard } from "../components/AccountCard";
import { ProductCard } from "../components/ProductCard";

type Segment = "accounts" | "products";

// The prototype's Accounts screen: a gradient header with an underline-tab
// segmented control — "บัญชีของฉัน" (accounts) is the functional tab; the
// prototype's "ผลิตภัณฑ์และบริการ" tab is repurposed here to show the Salak
// product catalog (a real in-scope "product"), rather than left as a dead tab.
// Tapping either action here just hands off into the real buy flow (Salak's
// buy-list screen owns the actual detail sheet / mode-choose sheet).
//
// prompt/README.md §20/§Balance accounting: the savings account's own
// `balance` already excludes whatever's been moved into an open Kapook
// goal - POST /kapook/goals/deposit debits it server-side at deposit time
// - so this screen shows it as-is, with no further client-side subtraction.
// Once a piggy account has ever been opened, a "กระปุกออมสลาก" row appears
// too, showing its own saved amount (while a goal is active).
export function Accounts() {
  const navigate = useNavigate();
  const { state: kapookState } = useKapook();
  const [segment, setSegment] = useState<Segment>("accounts");
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [products, setProducts] = useState<SalakProduct[] | null>(null);
  const [goal, setGoal] = useState<KapookGoalResponse | null>(null);
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
    if (!kapookState.account) return;
    let cancelled = false;
    api
      .getActiveKapookGoal(kapookState.account.id)
      .then((g) => !cancelled && setGoal(g))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"));
    return () => {
      cancelled = true;
    };
  }, [kapookState.account]);

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
            {/* The kapook-type account is excluded here - registration now opens
                one for every user (see the account-provisioning ticket), but
                the piggy card below already shows it. */}
            {accounts
              ?.filter((account) => account.type !== "kapook")
              .map((account) => <AccountCard key={account.id} account={account} />)}
            {kapookState.termsAccepted && (
              <button
                type="button"
                onClick={() => navigate("/salak/buy", { state: { from: "/accounts" } })}
                className="gradient-card gradient-card--piggy"
                data-testid="piggy-account-row"
              >
                <div className="gradient-card__top">
                  <div>
                    <p className="gradient-card__label">กระปุกออมสลาก</p>
                    <p className="gradient-card__meta">{kapookState.account?.accountNumber ?? ""}</p>
                  </div>
                  <ArrowIcon />
                </div>
                <p className="gradient-card__eyebrow">คงเหลือ</p>
                <p className="gradient-card__balance">฿{formatTHB(goal?.available_balance ?? 0)}</p>
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
