import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../lib/api";
import type { Account } from "../lib/types";
import { formatTHB, maskAccountNumber } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import { AppShell } from "../components/AppShell";

// The prototype's Home screen, minus what's out of scope: the loyalty-points
// pill, the badge-collection promo row, and the quick-actions grid (only one
// of its 8 tiles — "สลากดิจิทัล" — was ever wired; the other 7 are excluded
// features). What's left: greeting/balance header + a single Salak promo.
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
      <div
        className="rounded-b-[32px] px-5 pb-7 pt-8 text-white"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <p className="text-[13px] opacity-90">สวัสดี</p>
        <p className="text-[18px] font-bold">{user?.full_name ?? user?.username}</p>

        <div className="mt-[22px]">
          <p className="text-[11px] font-semibold tracking-wider opacity-85">ยอดเงินหลัก</p>
          <p className="mt-1 font-bold tabular-nums" data-testid="main-balance" style={{ fontSize: 34 }}>
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

        <Link
          to="/salak"
          data-testid="salak-promo-banner"
          className="block rounded-2xl p-4 text-white shadow-[var(--shadow-card)]"
          style={{ backgroundImage: "var(--gradient-salak)" }}
        >
          <p className="text-[15px] font-bold">สลากดิจิทัลใกล้ออกผลแล้ว</p>
          <p className="mt-1 text-[13px] opacity-90">ลุ้นรางวัลทุกเดือน ถอนเงินต้นคืนได้ทุกวันทำการ</p>
        </Link>
      </div>
    </AppShell>
  );
}
