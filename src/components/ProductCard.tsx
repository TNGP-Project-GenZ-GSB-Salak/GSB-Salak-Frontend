import { Link } from "react-router-dom";
import type { SalakProduct } from "../lib/types";
import { formatTHB } from "../lib/format";
import { Card } from "./Card";

// Secondary lines use real backend fields (term_months/unit_price) in place of
// the prototype's fictional lottery "round" number, which this backend has no
// concept of.
export function ProductCard({ product, index }: { product: SalakProduct; index: number }) {
  return (
    <Card data-testid="product-row">
      <div className="flex items-center gap-3.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-white"
          style={{ backgroundImage: "var(--gradient-button)" }}
        >
          {index + 1}
        </span>
        <div className="flex-1">
          <p className="text-[16px] font-bold text-ink" data-testid="product-name">
            {product.name}
          </p>
          <p className="mt-0.5 text-[13px] text-neutral">ระยะเวลา {product.term_months} เดือน</p>
          <p className="text-[13px] text-neutral">หน่วยละ ฿{formatTHB(product.unit_price)} บาท</p>
        </div>
      </div>
      <div className="mt-3.5 flex items-center justify-between border-t border-[color:var(--color-hairline)] pt-3.5">
        <span className="text-[14px] font-semibold text-neutral">
          ฝากขั้นต่ำ ฿{formatTHB(product.min_purchase)} สูงสุด ฿{formatTHB(product.max_purchase)}
        </span>
        <Link
          to={`/salak/buy/${product.id}`}
          data-testid="buy-button"
          className="flex h-8 shrink-0 items-center rounded-full px-4 text-[14px] font-semibold text-white"
          style={{ backgroundImage: "var(--gradient-button)" }}
        >
          ซื้อ
        </Link>
      </div>
    </Card>
  );
}
