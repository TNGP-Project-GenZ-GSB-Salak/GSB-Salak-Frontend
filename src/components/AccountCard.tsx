import { Link } from "react-router-dom";
import type { Account } from "../lib/types";
import { formatTHB, maskAccountNumber } from "../lib/format";

const LABELS: Record<Account["type"], string> = {
  savings: "บัญชีเงินฝากเผื่อเรียก",
  salak: "สลากดิจิทัล",
  // Not rendered via AccountCard today (see Accounts.tsx's kapook filter),
  // kept for completeness/type-safety.
  kapook: "กระปุกออมสลาก",
};

export function AccountCard({ account }: { account: Account }) {
  // Salak accounts have their own richer overview screen; everything else
  // (just savings, for now) goes to its plain transaction ledger.
  const destination = account.type === "salak" ? "/salak" : `/accounts/${account.id}/transactions`;

  return (
    <div data-testid="account-row">
      <Link
        to={destination}
        data-testid="account-history-link"
        className={`gradient-card gradient-card--${account.type}`}
      >
        <div className="gradient-card__top">
          <div>
            <p className="gradient-card__label">{LABELS[account.type]}</p>
            <p className="gradient-card__meta" data-testid="account-number">
              {maskAccountNumber(account.account_number)}
            </p>
          </div>
          <ArrowIcon className="h-[18px] w-[18px] opacity-90" />
        </div>
        <p className="gradient-card__eyebrow">คงเหลือ</p>
        <p className="gradient-card__balance">฿{formatTHB(account.balance)}</p>
      </Link>
    </div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
