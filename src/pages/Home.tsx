import { useEffect, useState, type SVGProps } from "react";
import { Link } from "react-router-dom";
import * as api from "../lib/api";
import type { Account } from "../lib/types";
import { formatTHB, maskAccountNumber } from "../lib/format";
import { findPrimaryAccount } from "../lib/accounts";
import { useAuth } from "../context/AuthContext";
import { AppShell } from "../components/AppShell";
import { PigMascot, TipCloud, TipGround } from "../components/PigMascot";

// The prototype's Home quick-action grid (8 tiles) — static/decorative only,
// same treatment as BottomNav's "scan"/"history" tabs: visible, but nothing
// is wired behind them (no backend concept of transfers/withdrawals/bills/
// credit-bureau checks/etc.). The loyalty-points pill is decorative for the
// same reason (no loyalty-points backend concept exists) — kept as a static
// display to match the prototype's header, not a real feature.
const HOME_ACTIONS = [
  { label: "โอนเงิน", icon: TransferIcon, variant: "pink", to: undefined },
  { label: "ถอนเงินสด", icon: WithdrawIcon, variant: "pink", to: undefined },
  { label: "รายการโปรด", icon: FavoritesIcon, variant: "pink", to: undefined },
  { label: "บิล", icon: BillIcon, variant: "pink", to: undefined },
  { label: "สลากดิจิทัล", icon: SalakIcon, variant: "salak", to: "/salak" },
  { label: "เติมเงิน", icon: TopUpIcon, variant: "pink", to: undefined },
  { label: "ขอตรวจเครดิตบูโร", icon: CreditCheckIcon, variant: "pink", to: undefined },
  { label: "เมนูอื่นๆ", icon: MoreIcon, variant: "pink", to: undefined },
] as const;

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// designs/…V.5.html's `salakTips` list — the pig banner's headline
// ("สลากดิจิทัลใกล้ออกผลแล้ว") is static, but the tag+body pair is re-rolled
// every time the user lands on the home screen (`rerollHomeTip()`).
const SALAK_TIPS = [
  { tag: "เกร็ดความรู้", text: "ฝากขั้นต่ำ 1,000 บาท (10 หน่วย) ราคาต่อหน่วย 100 บาท (สลาก 1 ปี)" },
  { tag: "เกร็ดความรู้", text: "สลาก 1 ปี ฝากครบ 1 ปี รับดอกเบี้ย 0.15 บาทต่อหน่วย (0.15% ต่อปี)" },
  { tag: "ทริค", text: "ถอนก่อนครบ 6 เดือน ได้คืนหน่วยละ 98 บาทเท่านั้น ถือให้ครบ 6 เดือนก่อนถอนจะคุ้มกว่า" },
  { tag: "เกร็ดความรู้", text: "สลาก 1 ปี มีสิทธิลุ้นรางวัลได้สูงสุด 12 ครั้งตลอดอายุการฝาก" },
  { tag: "เกร็ดความรู้", text: "รางวัลที่ 1 ของสลาก 1 ปี มูลค่า 10 ล้านบาท ออกรางวัลทุกวันที่ 16 ของเดือน" },
  { tag: "ทริค", text: "ฝาก 100,000 บาทขึ้นไปในสลาก 1 ปี จะได้การันตีรางวัลรายเดือนขั้นต่ำ 40 บาท" },
  { tag: "ทริค", text: "ระบุจำนวนฝากได้เองตั้งแต่ 1,000 ถึง 10,000,000 บาท แต่ต้องเป็นจำนวนที่หารด้วย 1,000 ลงตัว" },
  { tag: "เกร็ดความรู้", text: "ดอกเบี้ยและเงินรางวัลของสลากดิจิทัลทุกประเภทไม่ถูกหักภาษี" },
  { tag: "เกร็ดความรู้", text: "ดอกเบี้ยและเงินรางวัลสลากดิจิทัล ไม่ถูกหักภาษี ณ ที่จ่าย และไม่ต้องนำไปยื่นภาษีเงินได้บุคคลธรรมดาด้วย" },
  { tag: "เกร็ดความรู้", text: "สลากดิจิทัล 2 ปี หน่วยละ 100 บาท เท่ากับสลาก 1 ปี แต่ลุ้นรางวัลได้นานถึง 24 ครั้ง" },
  { tag: "เกร็ดความรู้", text: "สลาก 2 ปี ฝากครบกำหนดรับดอกเบี้ย 0.50 บาทต่อหน่วย (0.25% ต่อปี)" },
  { tag: "ทริค", text: "อยากลุ้นรางวัลใหญ่กว่าเดิม สลาก 2 ปี มีรางวัลที่ 1 สูงถึง 30 ล้านบาท มากกว่าสลาก 1 ปี" },
  { tag: "เกร็ดความรู้", text: "สลาก 2 ปี ออกรางวัลทุกวันที่ 1 ของเดือน (ยกเว้น ม.ค. และ พ.ค. ออกวันที่ 2)" },
  { tag: "ทริค", text: "ไม่ต้องรอมีเงินก้อน 1,000 บาท ใช้กระปุกหมูออมหยอดเก็บทีละนิดจนครบ แล้วค่อยซื้อสลากได้" },
  { tag: "ทริค", text: "เริ่มต้นแค่ 1,000 บาทก็ซื้อสลากดิจิทัลได้แล้ว ไม่ต้องมีเงินก้อนใหญ่เหมือนที่คิด" },
  { tag: "ทริค", text: "หยอดกระปุกหมูวันละนิด แทนควักเงินก้อนซื้อทีเดียว ครบ 1,000 บาทเมื่อไหร่ก็ซื้อสลากได้ทันที" },
] as const;

export function Home() {
  const { user } = useAuth();
  const [savings, setSavings] = useState<Account | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [homeTip] = useState(() => SALAK_TIPS[Math.floor(Math.random() * SALAK_TIPS.length)]);
  // The savings balance the server reports already reflects any real Kapook
  // deposit (a real debit) - subtracting the goal's saved amount again would
  // double-count money that's already left the account. See the goal-read
  // model ticket's home-screen fix.
  const availableBalance = savings ? Number(savings.balance) : 0;

  useEffect(() => {
    let cancelled = false;
    api
      .listAccounts()
      .then((data) => !cancelled && setSavings(findPrimaryAccount(data) ?? null))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell>
      <div className="home-header">
        <div className="home-header__top">
          <div className="home-header__identity">
            <span className="home-header__avatar" data-testid="user-avatar">
              {getInitials(user?.full_name ?? user?.username ?? "")}
            </span>
            <div>
              <p className="home-header__greeting">สวัสดี</p>
              <p className="home-header__name">{user?.full_name ?? user?.username}</p>
            </div>
          </div>
        </div>

        <div className="home-header__balance-block">
          <p className="home-header__eyebrow">ยอดเงินหลัก</p>
          <div className="home-header__balance-row">
            <p className="home-header__balance" data-testid="main-balance">
              {showBalance ? `฿${formatTHB(availableBalance)}` : "฿••••••.••"}
            </p>
            <button
              type="button"
              className="home-header__balance-toggle"
              onClick={() => setShowBalance((v) => !v)}
              data-testid="toggle-balance"
            >
              {showBalance ? "ซ่อนยอดเงิน" : "แสดงยอดเงิน"}
            </button>
          </div>
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
          {HOME_ACTIONS.map((action) =>
            action.to ? (
              <Link to={action.to} className="home-actions__item" key={action.label}>
                <span className={`home-actions__icon home-actions__icon--${action.variant}`}>
                  <action.icon className="h-7 w-7" />
                </span>
                <span className="home-actions__label">{action.label}</span>
              </Link>
            ) : (
              <div className="home-actions__item" key={action.label}>
                <span className={`home-actions__icon home-actions__icon--${action.variant}`}>
                  <action.icon className="h-7 w-7" />
                </span>
                <span className="home-actions__label">{action.label}</span>
              </div>
            ),
          )}
        </div>

        <Link to="/salak/info" state={{ from: "/" }} data-testid="salak-promo-banner" className="home-tip-card">
          <span className="home-tip-card__sun" />
          <TipCloud className="home-tip-card__cloud" />
          <TipGround className="home-tip-card__ground" />

          <div className="home-tip-card__header">
            <span className="home-tip-card__title-row">
              <span className="home-tip-card__title">สลากดิจิทัลใกล้ออกผลแล้ว</span>
              <span className="home-tip-card__tag">{homeTip.tag}</span>
            </span>
            <ChevronIcon className="home-tip-card__chevron h-4 w-4" />
          </div>
          <p className="home-tip-card__body">{homeTip.text}</p>
          <PigMascot className="home-tip-card__mascot" />
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

function ChevronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

