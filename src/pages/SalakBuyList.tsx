import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import type { SalakProduct } from "../lib/types";
import { formatTHB } from "../lib/format";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { BottomSheet } from "../components/BottomSheet";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/Button";

type SheetKind = "detail" | "mode" | null;

// Matches the prototype's "buyList" screen: a plain list of products, a
// detail bottom-sheet ("รายละเอียดเพิ่มเติม"), and a mode-choose bottom-sheet
// ("ซื้อเลย" / "ออมก่อน" / "ยกเลิก"). Only "ซื้อเลย" is wired — saving-first is
// a separate feature not built yet, so it stays visible but disabled.
export function SalakBuyList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<SalakProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .listSalakProducts()
      .then((list) => !cancelled && setProducts(list))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ"));
    return () => {
      cancelled = true;
    };
  }, []);

  const activeProduct = products?.find((p) => p.id === activeProductId) ?? null;

  function closeSheet() {
    setSheet(null);
  }

  function openDetail(productId: string) {
    setActiveProductId(productId);
    setSheet("detail");
  }

  function openModeChoose(productId: string) {
    setActiveProductId(productId);
    setSheet("mode");
  }

  function chooseBuyNow() {
    if (!activeProductId) return;
    navigate(`/salak/buy/${activeProductId}`);
  }

  return (
    <AppShell showNav={false}>
      <PageHeader title="สลากดิจิทัล" variant="close" onAction={() => navigate("/salak")} />

      <div className="flex flex-col gap-2 p-4">
        {error && <p className="error-box">{error}</p>}
        {products === null && !error && <p className="text-muted">กำลังโหลด...</p>}
        {products?.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onDetail={() => openDetail(product.id)}
            onBuy={() => openModeChoose(product.id)}
          />
        ))}
      </div>

      <BottomSheet open={sheet === "mode"} onClose={closeSheet} data-testid="mode-choose-sheet">
        <div className="action-sheet">
          <div className="action-sheet__title">
            ฝากสลากดิจิทัล {activeProduct?.name} แบบไหนดี
          </div>
          <button type="button" className="action-sheet__action" onClick={chooseBuyNow} data-testid="mode-buy-now">
            ซื้อเลย
          </button>
          <button
            type="button"
            className="action-sheet__action action-sheet__action--disabled"
            disabled
            data-testid="mode-save-first"
          >
            ออมก่อน
          </button>
        </div>
        <div className="action-sheet">
          <button type="button" className="action-sheet__action action-sheet__action--strong" onClick={closeSheet}>
            ยกเลิก
          </button>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "detail"} onClose={closeSheet} data-testid="product-detail-sheet">
        <div className="sheet-panel">
          <div className="sheet-panel__title">{activeProduct?.name}</div>
          <p className="sheet-panel__body">
            {activeProduct && (
              <>
                ฝากขั้นต่ำ ฿{formatTHB(activeProduct.min_purchase)} และสูงสุดไม่เกิน ฿
                {formatTHB(activeProduct.max_purchase)} ทวีคูณละ ฿{formatTHB(activeProduct.step_amount)} หน่วยละ ฿
                {formatTHB(activeProduct.unit_price)} บาท ระยะเวลา {activeProduct.term_months} เดือน
              </>
            )}
          </p>
          <div className="mt-5">
            <Button variant="secondary" onClick={closeSheet}>
              ปิด
            </Button>
          </div>
        </div>
      </BottomSheet>
    </AppShell>
  );
}
