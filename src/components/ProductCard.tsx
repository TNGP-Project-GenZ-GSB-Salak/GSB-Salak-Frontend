import { Link } from "react-router-dom";
import type { SalakProduct } from "../lib/types";
import { formatTHB } from "../lib/format";
import { Card } from "./Card";

export function ProductCard({ product }: { product: SalakProduct }) {
  return (
    <Card className="flex items-center justify-between gap-3">
      <div>
        <p className="font-semibold text-ink">{product.name}</p>
        <p className="mt-1 text-xs text-neutral">
          หน่วยละ ฿{formatTHB(product.unit_price)} · ฝากขั้นต่ำ ฿{formatTHB(product.min_purchase)}{" "}
          สูงสุด ฿{formatTHB(product.max_purchase)}
        </p>
      </div>
      <Link
        to={`/salak/buy/${product.id}`}
        className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-white"
        style={{ backgroundImage: "var(--gradient-button)" }}
      >
        ซื้อ
      </Link>
    </Card>
  );
}
