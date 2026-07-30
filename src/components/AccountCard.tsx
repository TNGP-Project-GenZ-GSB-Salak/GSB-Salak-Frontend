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
  return (
    <Link
      to={`/accounts/${account.id}/transactions`}
      className="block rounded-2xl p-5 text-white shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
      style={{ backgroundImage: GRADIENTS[account.type] }}
    >
      <p className="text-sm opacity-90">{LABELS[account.type]}</p>
      <p className="mt-1 text-xs opacity-75">{maskAccountNumber(account.account_number)}</p>
      <p className="mt-4 text-2xl font-semibold">
        ฿{formatTHB(account.balance)}
        <span className="ml-1 text-sm font-normal opacity-80">{account.currency}</span>
      </p>
    </Link>
  );
}
