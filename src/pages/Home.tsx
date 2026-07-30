import { useEffect, useState, type SVGProps } from "react";
import { Link } from "react-router-dom";
import * as api from "../lib/api";
import type { Account } from "../lib/types";
import { formatTHB, maskAccountNumber } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import { AppShell } from "../components/AppShell";

// The prototype's Home quick-action grid (8 tiles) — static/decorative only,
// same treatment as BottomNav's "scan"/"history" tabs: visible, but nothing
// is wired behind them (no backend concept of transfers/withdrawals/bills/
// credit-bureau checks/etc.). The loyalty-points pill and badge-collection
// promo row are out of scope entirely (no such features exist), so only the
// header/balance/grid/promo carry over from the prototype's Home screen.
const HOME_ACTIONS = [
  { label: "โอนเงิน", icon: TransferIcon, variant: "pink" },
  { label: "ถอนเงินสด", icon: WithdrawIcon, variant: "pink" },
  { label: "รายการโปรด", icon: FavoritesIcon, variant: "pink" },
  { label: "บิล", icon: BillIcon, variant: "pink" },
  { label: "สลากดิจิทัล", icon: SalakIcon, variant: "salak" },
  { label: "เติมเงิน", icon: TopUpIcon, variant: "pink" },
  { label: "ขอตรวจเครดิตบูโร", icon: CreditCheckIcon, variant: "pink" },
  { label: "เมนูอื่นๆ", icon: MoreIcon, variant: "pink" },
] as const;

export function Home() {
  const { user } = useAuth();
  const [savings, setSavings] = useState<Account | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .listAccounts()
      .then((data) => !cancelled && setSavings(data.find((a) => a.type === "savings") ?? null))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell>
      <div className="home-header">
        <p className="home-header__greeting">สวัสดี</p>
        <p className="home-header__name">{user?.full_name ?? user?.username}</p>

        <div className="home-header__balance-block">
          <p className="home-header__eyebrow">ยอดเงินหลัก</p>
          <p className="home-header__balance" data-testid="main-balance">
            ฿{savings ? formatTHB(savings.balance) : "0.00"}
          </p>
          {savings && (
            <p className="home-header__mask">
              บัญชีเงินฝากเผื่อเรียก · {maskAccountNumber(savings.account_number)}
            </p>
          )}
        </div>
      </div>

      <div className="home-body">
        {error && <p className="error-box">{error}</p>}

        <div className="card home-actions">
          {HOME_ACTIONS.map((action) => (
            <div className="home-actions__item" key={action.label}>
              <span className={`home-actions__icon home-actions__icon--${action.variant}`}>
                <action.icon className="h-7 w-7" />
              </span>
              <span className="home-actions__label">{action.label}</span>
            </div>
          ))}
        </div>

        <Link to="/salak" data-testid="salak-promo-banner" className="home-promo">
          <span className="home-promo__icon">
            <TicketIcon className="h-6 w-6" />
          </span>
          <span>
            <p className="home-promo__title">สลากดิจิทัลใกล้ออกผลแล้ว</p>
            <p className="home-promo__subtitle">ลุ้นรางวัลทุกเดือน ถอนเงินต้นคืนได้ทุกวันทำการ</p>
          </span>
        </Link>
      </div>
    </AppShell>
  );
}

function TransferIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5v9M9.5 9.3c0-1 1-1.8 2.5-1.8s2.5.7 2.5 1.7c0 2.3-5 1-5 3.3 0 1 1 1.7 2.5 1.7s2.5-.8 2.5-1.8" strokeLinecap="round" />
    </svg>
  );
}

function WithdrawIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M12 4v11" strokeLinecap="round" />
      <path d="M7.5 11.5 12 16l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" strokeLinecap="round" />
    </svg>
  );
}

function FavoritesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2.5" />
      <circle cx="10" cy="10.5" r="2" />
      <path d="M6.5 16c0-1.8 1.6-3 3.5-3s3.5 1.2 3.5 3" strokeLinecap="round" />
      <path d="M14.5 9.5h4M14.5 12.5h4" strokeLinecap="round" />
    </svg>
  );
}

function BillIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="5" y="5" width="14" height="16" rx="2" />
      <rect x="9" y="3.5" width="6" height="3" rx="1" fill="currentColor" stroke="none" />
      <path d="M8 11h8M8 14h8M8 17h5" strokeLinecap="round" />
    </svg>
  );
}

function SalakIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <path d="M6 3h8l3 3v15H6Z" strokeLinejoin="round" />
      <path d="M14 3v3h3" strokeLinejoin="round" />
      <path d="M8.5 12h5M8.5 15h5" strokeLinecap="round" />
      <circle cx="16" cy="17" r="4.2" fill="currentColor" stroke="none" />
      <text x="16" y="18.7" fontSize="4.8" fontWeight="700" textAnchor="middle" fill="#ff8840" stroke="none">
        31
      </text>
      <circle cx="19.5" cy="13.5" r="2" fill="currentColor" stroke="none" />
      <path d="M19.5 12.6v1.8M18.6 13.5h1.8" stroke="#ff8840" strokeWidth={0.9} strokeLinecap="round" />
    </svg>
  );
}

function TopUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M4 8V6a1 1 0 0 1 1-1h2M20 8V6a1 1 0 0 0-1-1h-2M4 16v2a1 1 0 0 0 1 1h2M20 16v2a1 1 0 0 1-1 1h-2" strokeLinecap="round" />
      <path d="M7 12h10" strokeLinecap="round" />
    </svg>
  );
}

function CreditCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 7.5-2" strokeLinecap="round" />
    </svg>
  );
}

function MoreIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} {...props}>
      <path d="M5 7h14M5 12h14M5 17h14" strokeLinecap="round" />
    </svg>
  );
}

function TicketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path
        d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1.5 1.5 0 0 0 0 3v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1.5 1.5 0 0 0 0-3Z"
        strokeLinejoin="round"
      />
      <path d="M9 6v12" strokeDasharray="2 2" />
    </svg>
  );
}
