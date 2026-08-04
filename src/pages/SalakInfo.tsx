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

const TABLE_ROWS = [
  { label: "งวดปัจจุบัน", y1: "635", y2: "274" },
  { label: "รางวัลที่ 1", y1: "10 ล้าน", y2: "30 ล้าน" },
  { label: "รางวัลที่ 2", y1: "1 ล้าน", y2: "1 ล้าน" },
  { label: "รางวัลที่ 3 (x5)", y1: "10,000", y2: "10,000" },
  { label: "รางวัลที่ 4 (x10)", y1: "3,000", y2: "3,000" },
  { label: "รางวัลที่ 5 (x15)", y1: "1,000", y2: "1,000" },
  { label: "เลขท้าย 4 ตัว", y1: "150", y2: "500" },
  { label: "เลขท้าย 3 ตัว", y1: "40", y2: "–" },
  { label: "วันออกรางวัล", y1: "16 ทุกเดือน", y2: "1 ทุกเดือน" },
  { label: "สิทธิถูกรางวัล", y1: "12 ครั้ง", y2: "24 ครั้ง" },
  { label: "ถอนก่อนครบ 6 ด.", y1: "98.00", y2: "98.00" },
  { label: "ถือครบ 6 ด. (ยังไม่ครบอายุ)", y1: "100.00", y2: "100.00" },
  { label: "ครบกำหนดอายุ", y1: "100.15", y2: "100.50" },
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
// pig, two colored info rows, and the 1-year/2-year comparison table).
// Content is the same official sales-sheet facts as before; only the layout
// was rebuilt to match — informational only, no backend needed.
export function SalakInfo() {
  const navigate = useNavigate();
  const [fountainKey, setFountainKey] = useState(0);
  const [pigTapping, setPigTapping] = useState(false);

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
            <Button onClick={() => navigate("/salak/buy")} data-testid="salak-info-buy">
              ซื้อสลากดิจิทัล
            </Button>
          </div>
        </div>

        <div className="salak-info-row-card salak-info-row-card--peach">
          <button type="button" className="salak-info-row">
            <span>
              <p className="salak-info-row__title">การันตีรางวัลรายเดือน</p>
              <p className="salak-info-row__subtitle">ฝากถึงเกณฑ์ ลุ้นไม่พลาดทุกเดือน ดูเงื่อนไข</p>
            </span>
            <span className="salak-info-row__chevron">▸</span>
          </button>
        </div>

        <div className="salak-info-row-card salak-info-row-card--mint">
          <button type="button" className="salak-info-row">
            <span>
              <p className="salak-info-row__title">ต่อให้ไม่ถูกรางวัลเลย ก็ไม่ขาดทุน :)</p>
              <p className="salak-info-row__subtitle">การันตีผลตอบแทนขั้นต่ำ สูงสุด 0.85% ต่อปี</p>
            </span>
            <span className="salak-info-row__chevron">▸</span>
          </button>
        </div>

        <div className="salak-info-table">
          <div className="salak-info-table__row salak-info-table__row--head">
            <span className="salak-info-table__label">รายการ</span>
            <span className="salak-info-table__value">1 ปี</span>
            <span className="salak-info-table__value">2 ปี</span>
          </div>
          {TABLE_ROWS.map((row) => (
            <div className="salak-info-table__row" key={row.label}>
              <span className="salak-info-table__label">{row.label}</span>
              <span className="salak-info-table__value">{row.y1}</span>
              <span className="salak-info-table__value">{row.y2}</span>
            </div>
          ))}
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
