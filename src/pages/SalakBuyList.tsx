import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import type { SalakProduct } from "../lib/types";
import { formatTHB } from "../lib/format";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { BottomSheet } from "../components/BottomSheet";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/Button";
import { useKapook } from "../context/KapookContext";

type SheetKind = "detail" | "mode" | "piggyExists" | null;

// Matches the prototype's "buyList" screen: a plain list of products, a
// detail bottom-sheet ("รายละเอียดเพิ่มเติม"), and a mode-choose bottom-sheet
// ("ซื้อเลย" / "ออมก่อน" / "ยกเลิก"). "ออมก่อน" enters the Kapook goal-saving loop
// (see src/context/KapookContext.tsx) — the mock account/goal live entirely
// client-side, so this doesn't touch the real buy-salak flow below it.
// prompt/README.md §One piggy at a time: a user may have at most one open
// goal across all products — tapping "ออมก่อน" again shows the "piggy
// exists" modal instead of goal setup.
export function SalakBuyList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: kapookState } = useKapook();
  const [products, setProducts] = useState<SalakProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  // Reused from more than one entry point (Salak.tsx's "ซื้อสลาก" quick
  // action, and Accounts.tsx's piggy-account row) — each expects the close
  // (X) button to return to wherever it came from, not a single fixed
  // screen. Defaults to "/salak" so Salak.tsx's existing Link (which passes
  // no state) keeps its exact current behavior.
  const backTo = (location.state as { from?: string } | null)?.from ?? "/salak";

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

  function chooseSaveFirst() {
    if (!activeProductId) return;
    if (kapookState.goal) {
      setSheet("piggyExists");
      return;
    }
    if (!kapookState.account) {
      navigate("/kapook/open", { state: { productId: activeProductId } });
    } else {
      navigate("/kapook/goal/new", { state: { productId: activeProductId } });
    }
  }

  return (
    <AppShell showNav={false}>
      <PageHeader title="สลากดิจิทัล" variant="close" onAction={() => navigate(backTo)} />

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
          <button type="button" className="action-sheet__action" onClick={chooseSaveFirst} data-testid="mode-save-first">
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

      {sheet === "piggyExists" && (
        <div className="confirm-dialog-backdrop" onClick={closeSheet}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="sheet-panel__title">มีกระปุกออมที่เปิดอยู่</p>
            <p className="confirm-dialog__message mt-1">
              ขณะนี้คุณมีกระปุกออมสลากที่เปิดอยู่แล้ว 1 กระปุก สามารถเปิดกระปุกใหม่ได้หลังจากถอนหรือปิดกระปุกเดิมก่อน
            </p>
            <div className="mt-4 flex gap-2">
              <div className="flex-1">
                <Button variant="secondary" onClick={closeSheet} data-testid="piggy-exists-close">
                  ปิด
                </Button>
              </div>
              <div className="flex-1">
                <Button onClick={() => navigate("/kapook")} data-testid="piggy-exists-go">
                  ไปที่กระปุกออม
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
