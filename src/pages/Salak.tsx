import { useEffect, useState } from "react";
import * as api from "../lib/api";
import type { Account, Holding, SalakProduct } from "../lib/types";
import { formatTHB } from "../lib/format";
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
      <div className="px-5 pb-8 pt-10 text-white" style={{ backgroundImage: "var(--gradient-salak)" }}>
        <p className="text-sm opacity-90">สลากดิจิทัล</p>
        <p className="mt-2 text-2xl font-semibold">
          ฿{salakAccount ? formatTHB(salakAccount.balance) : "0.00"}
        </p>
      </div>

      <div className="space-y-6 px-4 pt-4">
        {error && <p className="rounded-xl bg-white p-4 text-sm text-error">{error}</p>}

        <section>
          <h2 className="mb-2 text-sm font-semibold text-neutral">ผลิตภัณฑ์สลากดิจิทัล</h2>
          <div className="space-y-2">
            {products === null && <p className="text-sm text-neutral">กำลังโหลด...</p>}
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-neutral">สลากที่คุณถืออยู่</h2>
          <div className="space-y-2">
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
