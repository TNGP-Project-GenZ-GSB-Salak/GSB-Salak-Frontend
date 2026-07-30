import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as api from "../lib/api";
import type { Account, Transaction } from "../lib/types";
import { formatDate, formatTHB, maskAccountNumber } from "../lib/format";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";

export function TransactionHistory() {
  const { accountId } = useParams<{ accountId: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;

    Promise.all([api.getAccount(accountId), api.listTransactions(accountId, { limit: 50 })])
      .then(([accountData, txns]) => {
        if (cancelled) return;
        setAccount(accountData);
        setTransactions(txns);
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"));

    return () => {
      cancelled = true;
    };
  }, [accountId]);

  return (
    <AppShell showNav={false}>
      <PageHeader title="รายการเดินบัญชี" />
      <div className="flex flex-col gap-3 p-4">
        {account && (
          <p className="text-muted">
            {maskAccountNumber(account.account_number)} · ยอดคงเหลือ ฿{formatTHB(account.balance)}
          </p>
        )}
        {error && <p className="message">{error}</p>}
        {transactions === null && !error && <p className="text-muted">กำลังโหลด...</p>}
        {transactions?.length === 0 && <p className="empty-state">ยังไม่มีรายการเดินบัญชี</p>}
        {transactions?.map((txn) => (
          <Card key={txn.id} data-testid="transaction-row" className="transaction-row">
            <div>
              <p className="transaction-row__desc">{txn.description}</p>
              <p className="transaction-row__date">{formatDate(txn.created_at)}</p>
            </div>
            <div>
              <p
                className={`transaction-row__amount ${
                  txn.type === "credit" ? "transaction-row__amount--credit" : "transaction-row__amount--debit"
                }`}
              >
                {txn.type === "credit" ? "+" : "-"}฿{formatTHB(txn.amount)}
              </p>
              <p className="transaction-row__balance">คงเหลือ ฿{formatTHB(txn.balance_after)}</p>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
