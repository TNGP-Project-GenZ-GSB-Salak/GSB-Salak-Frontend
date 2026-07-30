import { useEffect, useState } from "react";
import * as api from "../lib/api";
import type { Account } from "../lib/types";
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

  return (
    <AppShell>
      <div
        className="px-5 pb-8 pt-10 text-white"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">สวัสดี</p>
            <p className="text-lg font-semibold">{user?.full_name ?? user?.username}</p>
          </div>
          <button type="button" onClick={logout} className="text-sm underline opacity-90">
            ออกจากระบบ
          </button>
        </div>
      </div>

      <div className="-mt-4 space-y-3 px-4">
        {error && <p className="rounded-xl bg-white p-4 text-sm text-error">{error}</p>}
        {!error && accounts === null && <p className="rounded-xl bg-white p-4 text-sm text-neutral">กำลังโหลดบัญชี...</p>}
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
