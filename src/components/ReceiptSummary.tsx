import type { CSSProperties } from "react";
import type { BuySalakResponse } from "../lib/types";
import { formatDate, formatTHB } from "../lib/format";
import { Card } from "./Card";

export function ReceiptSummary({ receipt }: { receipt: BuySalakResponse }) {
  return (
    <div className="space-y-4 text-center">
      <div
        className="mx-auto flex items-center justify-center rounded-full text-white"
        style={{
          width: 76,
          height: 76,
          backgroundColor: "var(--color-success)",
          boxShadow: "0 8px 24px rgba(44,168,124,0.35)",
        }}
      >
        <CheckIcon style={{ width: 38, height: 38 }} />
      </div>

      <p className="font-bold text-ink tabular-nums" style={{ fontSize: 38 }}>
        ฿{formatTHB(receipt.amount)}
      </p>

      <Card className="divide-y divide-[color:var(--color-hairline)] text-left text-sm [&>*]:py-3">
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
    <div className="flex justify-between gap-3">
      <span className="shrink-0 text-neutral">{label}</span>
      <span className="break-all text-right font-medium text-ink" data-testid={testId}>
        {value}
      </span>
    </div>
  );
}

function CheckIcon({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} style={style}>
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
