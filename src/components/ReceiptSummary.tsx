import type { BuySalakResponse } from "../lib/types";
import { formatDate, formatTHB } from "../lib/format";
import { Card } from "./Card";

export function ReceiptSummary({ receipt }: { receipt: BuySalakResponse }) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckIcon className="h-8 w-8" />
        </div>
      </div>
      <p className="text-center text-2xl font-semibold text-ink">฿{formatTHB(receipt.amount)}</p>
      <dl className="space-y-2 text-sm">
        <Row label="ผลิตภัณฑ์" value={receipt.product_name} />
        <Row label="จำนวนหน่วย" value={String(receipt.units)} />
        <Row label="เลขที่สลาก" value={`${receipt.ticket_start} – ${receipt.ticket_end}`} />
        <Row label="วันที่ซื้อ" value={formatDate(receipt.purchase_date)} />
        <Row label="วันครบกำหนด" value={formatDate(receipt.maturity_date)} />
        <Row label="เลขที่อ้างอิง" value={receipt.reference_id} />
      </dl>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-neutral">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
