import type { Holding } from "../lib/types";
import { formatDate, formatTHB } from "../lib/format";
import { Card } from "./Card";

export function HoldingCard({ holding }: { holding: Holding }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <p className="font-semibold text-ink">{holding.product_name}</p>
        <p className="text-sm font-semibold text-primary">฿{formatTHB(holding.purchase_amount)}</p>
      </div>
      <p className="mt-2 font-mono text-sm tracking-wide text-neutral">
        {holding.ticket_start} – {holding.ticket_end}
      </p>
      <div className="mt-3 flex justify-between text-xs text-neutral">
        <span>ซื้อเมื่อ {formatDate(holding.purchase_date)}</span>
        <span>ครบกำหนด {formatDate(holding.maturity_date)}</span>
      </div>
    </Card>
  );
}
