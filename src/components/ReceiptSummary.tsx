import type { BuySalakResponse } from "../lib/types";
import { formatDate, formatTHB } from "../lib/format";
import { Card } from "./Card";

export function ReceiptSummary({ receipt }: { receipt: BuySalakResponse }) {
  return (
    <div className="receipt-summary">
      <div className="receipt-summary__check">
        <CheckIcon className="h-[38px] w-[38px]" />
      </div>

      <p className="receipt-summary__amount">฿{formatTHB(receipt.amount)}</p>

      <Card className="receipt-summary__card">
        <Row label="ผลิตภัณฑ์" value={receipt.product_name} />
        <Row label="จำนวนหน่วย" value={String(receipt.units)} />
        <Row label="เลขที่สลาก" value={`${receipt.ticket_start} – ${receipt.ticket_end}`} testId="receipt-ticket-range" />
        <Row label="วันที่ซื้อ" value={formatDate(receipt.purchase_date)} />
        <Row label="วันครบกำหนด" value={formatDate(receipt.maturity_date)} />
        <Row label="เลขที่อ้างอิง" value={receipt.reference_id} />
      </Card>
    </div>
  );
}

function Row({ label, value, testId }: { label: string; value: string; testId?: string }) {
  return (
    <div className="receipt-summary__row">
      <span className="receipt-summary__row-label">{label}</span>
      <span className="receipt-summary__row-value" data-testid={testId}>
        {value}
      </span>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} className={className}>
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
