import type { Holding } from "../lib/types";
import { formatDate, formatTHB } from "../lib/format";

// The prototype uses a background photo + dark scrim per lot; no product
// artwork exists here, so the salak gradient stands in for it (same visual
// weight: white text over a warm gradient, radius/shadow/type scale match).
export function HoldingCard({ holding }: { holding: Holding }) {
  return (
    <div
      data-testid="holding-row"
      className="flex items-center justify-between gap-3 rounded-2xl p-4 text-white shadow-[var(--shadow-card)]"
      style={{ backgroundImage: "var(--gradient-salak)" }}
    >
      <div className="flex-1">
        <p className="text-[15px] font-semibold">{holding.product_name}</p>
        <p className="mt-[3px] text-[13px] font-semibold">
          {holding.ticket_start} – {holding.ticket_end}
        </p>
        <p className="mt-[3px] text-[13px] opacity-85">ซื้อเมื่อ {formatDate(holding.purchase_date)}</p>
        <p className="mt-[3px] text-[13px] opacity-85">ครบกำหนด {formatDate(holding.maturity_date)}</p>
      </div>
      <div className="text-right">
        <p className="text-[16px] font-bold">฿{formatTHB(holding.purchase_amount)}</p>
        <p className="mt-0.5 text-xs opacity-85">{holding.units} หน่วย</p>
      </div>
    </div>
  );
}
