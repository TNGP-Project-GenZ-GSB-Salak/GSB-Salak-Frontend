import { Link } from "react-router-dom";
import type { Account } from "../lib/types";
import { formatTHB, maskAccountNumber } from "../lib/format";

const LABELS: Record<Account["type"], string> = {
  savings: "บัญชีเงินฝากเผื่อเรียก",
  salak: "สลากดิจิทัล",
};

const GRADIENTS: Record<Account["type"], string> = {
  savings: "var(--gradient-savings)",
  salak: "var(--gradient-salak)",
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
        className="block rounded-2xl p-4 text-white shadow-[var(--shadow-card)]"
        style={{ backgroundImage: GRADIENTS[account.type] }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[15px] font-bold">{LABELS[account.type]}</p>
            <p className="mt-0.5 text-xs opacity-90" data-testid="account-number">
              {maskAccountNumber(account.account_number)}
            </p>
          </div>
          <ArrowIcon className="h-[18px] w-[18px] opacity-90" />
        </div>
        <p className="mt-[18px] text-[11px] font-semibold tracking-wider opacity-85">คงเหลือ</p>
        <p className="font-bold tabular-nums" style={{ fontSize: 24 }}>
          ฿{formatTHB(account.balance)}
        </p>
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
