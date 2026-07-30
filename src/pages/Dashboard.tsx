import { useEffect, useState } from "react";
import * as api from "../lib/api";
import type { Account } from "../lib/types";
import { formatTHB, maskAccountNumber } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import { AppShell } from "../components/AppShell";
import { AccountCard } from "../components/AccountCard";

export function Dashboard() {
  const { user, logout } = useAuth();
  const [accounts, setAccounts] = useState<Account[] | null>(null);
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

  const savings = accounts?.find((a) => a.type === "savings");

  return (
    <AppShell>
      <div
        className="rounded-b-[32px] px-5 pb-7 pt-8 text-white"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] opacity-90">สวัสดี</p>
            <p className="text-[18px] font-bold">{user?.full_name ?? user?.username}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            data-testid="logout-button"
            className="text-xs opacity-90 underline"
          >
            ออกจากระบบ
          </button>
        </div>

        <div className="mt-[22px]">
          <p className="text-[11px] font-semibold tracking-wider opacity-85">ยอดเงินหลัก</p>
          <p className="mt-1 font-bold tabular-nums" style={{ fontSize: 34 }}>
            ฿{savings ? formatTHB(savings.balance) : "0.00"}
          </p>
          {savings && (
            <p className="mt-0.5 text-[13px] opacity-90">
              บัญชีเงินฝากเผื่อเรียก · {maskAccountNumber(savings.account_number)}
            </p>
          )}
        </div>
      </div>

      <div className="-mt-4 space-y-3 px-4">
        {error && <p className="rounded-xl bg-white p-4 text-sm text-error">{error}</p>}
        {!error && accounts === null && (
          <p className="rounded-xl bg-white p-4 text-sm text-neutral">กำลังโหลดบัญชี...</p>
        )}
        {accounts?.length === 0 && (
          <p className="rounded-xl bg-white p-4 text-sm text-neutral">
            ยังไม่มีบัญชีสำหรับผู้ใช้นี้ (บัญชีสาธิต: demo / demopass123)
          </p>
        )}
        {accounts?.map((account) => <AccountCard key={account.id} account={account} />)}
      </div>
    </AppShell>
  );
}
