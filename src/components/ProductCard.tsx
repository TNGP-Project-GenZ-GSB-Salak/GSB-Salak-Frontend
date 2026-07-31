import type { SalakProduct } from "../lib/types";
import { formatTHB } from "../lib/format";
import { Card } from "./Card";

interface ProductCardProps {
  product: SalakProduct;
  index: number;
  onDetail: () => void;
  onBuy: () => void;
}

// Secondary lines use real backend fields (term_months/unit_price) in place
// of the prototype's fictional lottery "round" number, which this backend has
// no concept of. The footer mirrors the prototype's buy-list card: a detail
// link that opens a bottom sheet, and a "ซื้อ" button that opens the
// buy-now/save-first mode-choose sheet (not a direct link — see SalakBuyList).
export function ProductCard({ product, index, onDetail, onBuy }: ProductCardProps) {
  return (
    <Card data-testid="product-row">
      <div className="product-card__top">
        <span className="product-card__badge">{index + 1}</span>
        <div className="flex-1">
          <p className="product-card__name" data-testid="product-name">
            {product.name}
          </p>
          <p className="product-card__meta">ระยะเวลา {product.term_months} เดือน</p>
          <p className="product-card__meta">หน่วยละ ฿{formatTHB(product.unit_price)} บาท</p>
        </div>
      </div>
      <div className="product-card__footer">
        <button type="button" onClick={onDetail} data-testid="product-detail-link" className="product-card__detail-link">
          รายละเอียดเพิ่มเติม
        </button>
        <button type="button" onClick={onBuy} data-testid="buy-button" className="product-card__buy">
          ซื้อ
        </button>
      </div>
    </Card>
  );
}
