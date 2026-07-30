import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../lib/api";
import type { Account, Holding, SalakProduct } from "../lib/types";
import { formatTHB, maskAccountNumber } from "../lib/format";
import { AppShell } from "../components/AppShell";
import { ProductCard } from "../components/ProductCard";
import { HoldingCard } from "../components/HoldingCard";

export function Salak() {
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
      <div className="rounded-b-2xl px-5 py-5 text-white" style={{ backgroundImage: "var(--gradient-salak)" }}>
        <div className="flex justify-between text-[13px] opacity-95">
          <span>{salakAccount ? maskAccountNumber(salakAccount.account_number) : ""}</span>
          <span>สลากออมสินดิจิทัล</span>
        </div>
        <p className="mt-[14px] font-bold tabular-nums" style={{ fontSize: 32 }}>
          ฿{salakAccount ? formatTHB(salakAccount.balance) : "0.00"}
        </p>
        <p className="mt-0.5 text-xs opacity-90">ยอดฝากสลากทั้งหมด</p>
      </div>

      <div className="space-y-6 px-4 pt-4">
        {error && <p className="rounded-xl bg-white p-4 text-sm text-error">{error}</p>}

        <section>
          <h2 className="mb-2 text-sm font-semibold text-neutral">ผลิตภัณฑ์สลากดิจิทัล</h2>
          <div className="space-y-2">
            {products === null && <p className="text-sm text-neutral">กำลังโหลด...</p>}
            {products?.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex gap-5 border-b" style={{ borderColor: "var(--color-hairline)" }}>
            <span className="border-b-2 border-primary pb-2 text-sm font-semibold text-ink">
              สลาก ({holdings?.length ?? 0})
            </span>
            {salakAccount && (
              <Link
                to={`/accounts/${salakAccount.id}/transactions`}
                data-testid="salak-history-link"
                className="pb-2 text-sm font-medium text-neutral"
              >
                รายการเดินบัญชี
              </Link>
            )}
          </div>
          <div className="space-y-3" data-testid="holdings-table">
            {holdings === null && <p className="text-sm text-neutral">กำลังโหลด...</p>}
            {holdings?.length === 0 && (
              <p className="rounded-xl bg-white p-4 text-sm text-neutral">คุณยังไม่มีรายการสลาก</p>
            )}
            {holdings?.map((holding) => (
              <HoldingCard key={holding.id} holding={holding} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
