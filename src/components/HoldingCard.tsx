import type { Holding, SalakProduct } from "../lib/types";
import { formatDate, formatTHB } from "../lib/format";
import { CURRENT_ROUND_BY_TERM_MONTHS } from "../lib/salakRounds";

// The prototype uses a background photo + dark scrim per lot; no product
// artwork exists here, so the salak gradient stands in for it (same visual
// weight: white text over a warm gradient, radius/shadow/type scale match).
export function HoldingCard({ holding, product }: { holding: Holding; product?: SalakProduct }) {
  const termYears = product ? Math.round(product.term_months / 12) : null;
  const round = product ? CURRENT_ROUND_BY_TERM_MONTHS[product.term_months] : undefined;

  return (
    <div data-testid="holding-row" className="holding-card">
      <div className="flex-1">
        <p className="holding-card__name">{holding.product_name}</p>
        <p className="holding-card__line">
          {holding.ticket_start} - {holding.ticket_end}
        </p>
        {termYears != null && round != null && (
          <p className="holding-card__line holding-card__line--muted">
            {termYears} ปี | งวดที่ {round} (งวดปัจจุบัน)
          </p>
        )}
        <p className="holding-card__line holding-card__line--muted">
          ฝากเมื่อ {formatDate(holding.purchase_date)}
        </p>
      </div>
      <div>
        <p className="holding-card__amount">฿{formatTHB(holding.purchase_amount)}</p>
        <p className="holding-card__units">{holding.units} หน่วย</p>
      </div>
    </div>
  );
}
