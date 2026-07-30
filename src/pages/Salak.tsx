import { useEffect, useState, type SVGProps } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import type { Account, Holding, SalakProduct } from "../lib/types";
import { formatTHB, maskAccountNumber } from "../lib/format";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { ProductCard } from "../components/ProductCard";
import { HoldingCard } from "../components/HoldingCard";

// The prototype's 4-icon quick-action row (ซื้อสลาก / ข้อมูลผลิตภัณฑ์ /
// ประวัติการออก / ตั้งค่า). Even in the prototype only the "close" header and
// balance card are functional here — the row itself is decorative in both,
// since buying already happens via the product cards further down this page.
const SALAK_QUICK_ACTIONS = [
  { label: "ซื้อสลาก", icon: BuyIcon },
  { label: "ข้อมูลผลิตภัณฑ์", icon: InfoIcon },
  { label: "ประวัติการออก", icon: ScheduleIcon },
  { label: "ตั้งค่า", icon: GearIcon },
] as const;

export function Salak() {
  const navigate = useNavigate();
  const [salakAccount, setSalakAccount] = useState<Account | null | undefined>(undefined);
  const [products, setProducts] = useState<SalakProduct[] | null>(null);
  const [holdings, setHoldings] = useState<Holding[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [accounts, productList] = await Promise.all([
          api.listAccounts(),
          api.listSalakProducts(),
        ]);
        if (cancelled) return;
        const account = accounts.find((a) => a.type === "salak") ?? null;
        setSalakAccount(account);
        setProducts(productList);

        if (account) {
          const holdingList = await api.listHoldings(account.id);
          if (!cancelled) setHoldings(holdingList);
        } else {
          setHoldings([]);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell>
      <PageHeader title="สลากดิจิทัล" variant="close" onAction={() => navigate("/")} />

      <div className="salak-balance-card">
        <div className="salak-balance-card__top">
          <span>{salakAccount ? maskAccountNumber(salakAccount.account_number) : ""}</span>
          <span>สลากออมสินดิจิทัล</span>
        </div>
        <p className="salak-balance-card__amount">
          ฿{salakAccount ? formatTHB(salakAccount.balance) : "0.00"}
        </p>
        <p className="salak-balance-card__label">ยอดฝากสลากทั้งหมด</p>
      </div>

      <div className="salak-quick-actions">
        {SALAK_QUICK_ACTIONS.map((action) => (
          <div className="salak-quick-actions__item" key={action.label}>
            <span className="salak-quick-actions__icon">
              <action.icon className="h-[22px] w-[22px]" />
            </span>
            <span className="salak-quick-actions__label">{action.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 px-4 pt-2">
        {error && <p className="error-box">{error}</p>}

        <section>
          <h2 className="section-heading">ผลิตภัณฑ์สลากดิจิทัล</h2>
          <div className="flex flex-col gap-2">
            {products === null && <p className="text-muted">กำลังโหลด...</p>}
            {products?.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </section>

        <section>
          <div className="tab-row">
            <span className="tab-row__tab tab-row__tab--active">สลาก ({holdings?.length ?? 0})</span>
            {salakAccount && (
              <Link
                to={`/accounts/${salakAccount.id}/transactions`}
                data-testid="salak-history-link"
                className="tab-row__tab"
              >
                รายการเดินบัญชี
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-3" data-testid="holdings-table">
            {holdings === null && <p className="text-muted">กำลังโหลด...</p>}
            {holdings?.length === 0 && <p className="empty-state">คุณยังไม่มีรายการสลาก</p>}
            {holdings?.map((holding) => (
              <HoldingCard key={holding.id} holding={holding} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function BuyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path
        d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1.5 1.5 0 0 0 0 3v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1.5 1.5 0 0 0 0-3Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}

function ScheduleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 2h6" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path
        d="M19.4 13a7.97 7.97 0 0 0 0-2l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L15 3h-4l-.3 2a8 8 0 0 0-1.7 1l-2.4-1-2 3.5L6.6 11a7.97 7.97 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 1.7 1L11 21h4l.3-2a8 8 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
