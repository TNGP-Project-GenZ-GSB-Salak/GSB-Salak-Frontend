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
        <span className="product-card__footer-label">
          ฝากขั้นต่ำ ฿{formatTHB(product.min_purchase)} สูงสุด ฿{formatTHB(product.max_purchase)}
        </span>
        <Link to={`/salak/buy/${product.id}`} data-testid="buy-button" className="product-card__buy">
          ซื้อ
        </Link>
      </div>
    </Card>
  );
}
