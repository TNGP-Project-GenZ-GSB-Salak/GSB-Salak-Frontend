import { useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { PigMascot } from "../components/PigMascot";

const PIG_TAP_DURATION_MS = 500;

const COINS = [
  { size: 24, tx: -46, rot: -24, delay: 0 },
  { size: 22, tx: -16, rot: 12, delay: 90 },
  { size: 26, tx: 14, rot: -16, delay: 45 },
  { size: 22, tx: 44, rot: 22, delay: 130 },
  { size: 20, tx: 0, rot: 0, delay: 170 },
] as const;

// TABLE_COLUMNS/`values` (rather than fixed `y1`/`y2` fields) let a future
// product column (e.g. "5 ปี") drop in as one more header string + one more
// value per row, with no JSX/CSS changes — see .salak-info-table-scroll below.
const TABLE_COLUMNS = ["1 ปี", "2 ปี"] as const;

const TABLE_ROWS = [
  { label: "งวดปัจจุบัน", values: ["635", "274"] },
  { label: "รางวัลที่ 1", values: ["10 ล้าน", "30 ล้าน"] },
  { label: "รางวัลที่ 2", values: ["1 ล้าน", "1 ล้าน"] },
  { label: "รางวัลที่ 3 (หมุน 5 ครั้ง)", values: ["10,000", "10,000"] },
  { label: "รางวัลที่ 4 (หมุน 10 ครั้ง)", values: ["3,000", "3,000"] },
  { label: "รางวัลที่ 5 (หมุน 15 ครั้ง)", values: ["1,000", "1,000"] },
  { label: "เลขท้าย 4 ตัว", values: ["150", "500"] },
  { label: "เลขท้าย 3 ตัว", values: ["40", "–"] },
  { label: "วันออกรางวัล", values: ["16 ทุกเดือน", "1 ทุกเดือน"] },
  { label: "สิทธิถูกรางวัล", values: ["12 ครั้ง", "24 ครั้ง"] },
  { label: "ถอนก่อนครบ 6 เดือน", values: ["98.00", "98.00"] },
  { label: "ถือครบ 6 เดือน (ยังไม่ครบอายุ)", values: ["100.00", "100.00"] },
  { label: "ครบกำหนดอายุ", values: ["100.15", "100.50"] },
] as const;

// V.5's own hidden accordion content for the two "salak-info-row" dropdowns
// below (extracted from the design file — the React port kept only the
// static header and dropped the expand/collapse content entirely).
const GUARANTEE_ROWS = [
  { label: "ยอดฝากขั้นต่ำ", y1: "100,000 บาท", y2: "1,000,000 บาท" },
  { label: "สิทธิ์ที่ได้รับ", y1: "เลขท้าย 3 ตัว", y2: "เลขท้าย 4 ตัว" },
] as const;

const MIN_YIELD_ROWS = [
  { label: "ฝาก 100,000 บาท", y1: "0.63%", y2: "0.25%" },
  { label: "ฝาก 1,000,000 บาท", y1: "0.81%", y2: "0.85%" },
  { label: "ฝาก 10,000,000 บาท", y1: "0.81%", y2: "0.85%" },
] as const;

const CONDITIONS = [
  "กำหนดงวด/หมวดอักษรเฉพาะรางวัลที่ 1 และ 2",
  "โอนเงินรางวัลเข้าบัญชีคู่โอนวันถัดจากวันออกรางวัล",
  "ใช้เป็นหลักทรัพย์กู้เงินธนาคารออมสินไม่ได้",
  "เงื่อนไขการรับรางวัลเป็นไปตามที่ธนาคารประกาศ",
  "ถ้าถูกรางวัล ควรถอนหลังวันออกรางวัลเพื่อไม่เสียสิทธิ์",
] as const;

// Matches the prototype's salakInfo screen exactly (extracted by driving
// designs/…V.4.html: the sky/grass hero with a coin-fountain + speech-bubble
// pig, two expandable info rows, and the 1-year/2-year comparison table).
// The two info rows' expanded content and the "(หมุน N ครั้ง)" reward-tier
// wording are sourced from V.5's own hidden accordion data and the official
// GSB sales sheets respectively — informational only, no backend needed.
export function SalakInfo() {
  const navigate = useNavigate();
  const [fountainKey, setFountainKey] = useState(0);
  const [pigTapping, setPigTapping] = useState(false);
  const [guaranteeOpen, setGuaranteeOpen] = useState(false);
  const [minYieldOpen, setMinYieldOpen] = useState(false);

  // Matches the prototype's `playFountain`: tapping the pig replays the
  // coin-fountain animation (it isn't tied to navigation at all — "ซื้อสลาก
  // ดิจิทัล" below is the only way to actually buy). Remounting the coins via
  // a changing key restarts their one-shot CSS animation on every tap.
  function playFountain() {
    setFountainKey((k) => k + 1);
    setPigTapping(true);
    setTimeout(() => setPigTapping(false), PIG_TAP_DURATION_MS);
  }

  return (
    <AppShell showNav={false}>
      <header className="page-header">
        <span className="page-header__spacer" />
        <h1 className="page-header__title page-header__title--plain">ข้อมูลสลากดิจิทัล</h1>
        <button type="button" onClick={() => navigate("/salak")} className="page-header__button" aria-label="ปิด">
          <CloseCircleIcon className="h-7 w-7" />
        </button>
      </header>

      <div className="px-3.5 pb-6 pt-2">
        <div className="salak-info-hero">
          <p className="salak-info-hero__title">ฝากออมสไตล์ลุ้นโชค ดอกเบี้ย+เงินรางวัลไม่หักภาษี :)</p>

          <div className="salak-info-hero__rates">
            <div className="salak-info-rate-card">
              <p className="salak-info-rate-card__label">ดอกเบี้ย สลาก 1 ปี</p>
              <p className="salak-info-rate-card__value">0.15%</p>
              <p className="salak-info-rate-card__meta">ขั้นต่ำ ยิ่งฝากมากยิ่งได้เพิ่ม</p>
            </div>
            <div className="salak-info-rate-card">
              <p className="salak-info-rate-card__label">ดอกเบี้ย สลาก 2 ปี</p>
              <p className="salak-info-rate-card__value">0.25%</p>
              <p className="salak-info-rate-card__meta">ขั้นต่ำ ยิ่งฝากมากยิ่งได้เพิ่ม</p>
            </div>
          </div>

          <p className="salak-info-hero__note">ลุ้นได้สูงสุด 12–24 ครั้งตลอดอายุการฝาก แถมยังได้เงินต้นคืนเต็มเมื่อครบกำหนด</p>

          <div className="salak-info-stage">
            <div className="salak-info-speech">
              ลองซื้อสลากมั้ย?
              <span className="salak-info-speech__tail" />
            </div>

            {COINS.map((coin, i) => (
              <span
                key={`${fountainKey}-${i}`}
                className="salak-info-coin"
                style={
                  {
                    width: coin.size,
                    height: coin.size,
                    "--tx": `${coin.tx}px`,
                    "--rot": `${coin.rot}deg`,
                    animationDelay: `${coin.delay}ms`,
                  } as CSSProperties
                }
              >
                <CoinIcon width={coin.size} height={coin.size} />
              </span>
            ))}

            <button type="button" className="salak-info-mascot" onClick={playFountain} data-testid="salak-info-pig" aria-label="เขย่ากระปุก">
              <PigMascot width={120} height={112} animation={pigTapping ? "tap" : "bounce"} medal />
            </button>
          </div>

          <div className="mt-1.5">
            <Button onClick={() => navigate("/salak/buy", { state: { from: "/salak/info" } })} data-testid="salak-info-buy">
              ซื้อสลากดิจิทัล
            </Button>
          </div>
        </div>

        <div className="salak-info-row-card salak-info-row-card--peach">
          <button
            type="button"
            className="salak-info-row"
            onClick={() => setGuaranteeOpen((v) => !v)}
            aria-expanded={guaranteeOpen}
          >
            <span>
              <p className="salak-info-row__title">การันตีรางวัลรายเดือน</p>
              <p className="salak-info-row__subtitle">ฝากถึงเกณฑ์ ลุ้นไม่พลาดทุกเดือน ดูเงื่อนไข</p>
            </span>
            <span className="salak-info-row__chevron">{guaranteeOpen ? "▾" : "▸"}</span>
          </button>
          {guaranteeOpen && (
            <div className="salak-info-row-card__body">
              <div className="salak-info-subtable">
                <div className="salak-info-subtable__row salak-info-subtable__row--head">
                  <span className="salak-info-subtable__label">รายการ</span>
                  <span className="salak-info-subtable__value">1 ปี</span>
                  <span className="salak-info-subtable__value">2 ปี</span>
                </div>
                {GUARANTEE_ROWS.map((row) => (
                  <div className="salak-info-subtable__row" key={row.label}>
                    <span className="salak-info-subtable__label">{row.label}</span>
                    <span className="salak-info-subtable__value">{row.y1}</span>
                    <span className="salak-info-subtable__value">{row.y2}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="salak-info-row-card salak-info-row-card--mint">
          <button
            type="button"
            className="salak-info-row"
            onClick={() => setMinYieldOpen((v) => !v)}
            aria-expanded={minYieldOpen}
          >
            <span>
              <p className="salak-info-row__title">ต่อให้ไม่ถูกรางวัลเลย ก็ไม่ขาดทุน :)</p>
              <p className="salak-info-row__subtitle">การันตีผลตอบแทนขั้นต่ำ สูงสุด 0.85% ต่อปี</p>
            </span>
            <span className="salak-info-row__chevron">{minYieldOpen ? "▾" : "▸"}</span>
          </button>
          {minYieldOpen && (
            <div className="salak-info-row-card__body">
              <div className="salak-info-subtable">
                <div className="salak-info-subtable__row salak-info-subtable__row--head">
                  <span className="salak-info-subtable__label">ยอดฝาก</span>
                  <span className="salak-info-subtable__value">1 ปี</span>
                  <span className="salak-info-subtable__value">2 ปี</span>
                </div>
                {MIN_YIELD_ROWS.map((row) => (
                  <div className="salak-info-subtable__row" key={row.label}>
                    <span className="salak-info-subtable__label">{row.label}</span>
                    <span className="salak-info-subtable__value">{row.y1}</span>
                    <span className="salak-info-subtable__value">{row.y2}</span>
                  </div>
                ))}
              </div>
              <p className="salak-info-subtable__footnote">
                คิดจากดอกเบี้ย+เงินรางวัลการันตีรวมกัน เทียบเท่าอัตราดอกเบี้ยต่อปี ไม่หักภาษี
              </p>
            </div>
          )}
        </div>

        <div className="salak-info-table-scroll">
          <table className="salak-info-table">
            <thead>
              <tr className="salak-info-table__row salak-info-table__row--head">
                <th className="salak-info-table__label">รายการ</th>
                {TABLE_COLUMNS.map((col) => (
                  <th className="salak-info-table__value" key={col}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row) => (
                <tr className="salak-info-table__row" key={row.label}>
                  <td className="salak-info-table__label">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td className="salak-info-table__value" key={i}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="salak-info-conditions">
          <p className="salak-info-conditions__title">เงื่อนไขที่เหมือนกันทั้ง 2 แบบ</p>
          {CONDITIONS.map((text) => (
            <div className="salak-info-condition" key={text}>
              <span className="salak-info-condition__check">
                <CheckIcon className="h-[9px] w-[9px]" />
              </span>
              <p className="salak-info-condition__text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function CoinIcon({ width, height }: { width: number; height: number }) {
  return (
    <svg viewBox="0 0 40 40" width={width} height={height}>
      <circle cx="20" cy="20" r="16" fill="#FFD86B" stroke="#F4B23F" strokeWidth={2} />
      <circle cx="20" cy="20" r="11" fill="none" stroke="#F4B23F" strokeWidth={1.6} />
    </svg>
  );
}

function CheckIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CloseCircleIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" {...props}>
      <path d="M16,16m-16,0a16,16 0,1 1,32 0a16,16 0,1 1,-32 0" fill="#ffffff" fillOpacity={0.56} />
      <path d="M9,9L23,23" fill="none" stroke="#d63252" strokeWidth={2} strokeLinecap="round" />
      <path d="M23,9L9,23" fill="none" stroke="#d63252" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
