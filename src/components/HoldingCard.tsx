import type { Holding } from "../lib/types";
import { formatDate, formatTHB } from "../lib/format";

// The prototype uses a background photo + dark scrim per lot; no product
// artwork exists here, so the salak gradient stands in for it (same visual
// weight: white text over a warm gradient, radius/shadow/type scale match).
export function HoldingCard({ holding }: { holding: Holding }) {
  return (
    <div data-testid="holding-row" className="holding-card">
      <div className="flex-1">
        <p className="holding-card__name">{holding.product_name}</p>
        <p className="holding-card__line">
          {holding.ticket_start} – {holding.ticket_end}
        </p>
        <p className="holding-card__line holding-card__line--muted">
          ซื้อเมื่อ {formatDate(holding.purchase_date)}
        </p>
        <p className="holding-card__line holding-card__line--muted">
          ครบกำหนด {formatDate(holding.maturity_date)}
        </p>
      </div>
      <div>
        <p className="holding-card__amount">฿{formatTHB(holding.purchase_amount)}</p>
        <p className="holding-card__units">{holding.units} หน่วย</p>
      </div>
    </div>
  );
}
