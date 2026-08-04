# Handoff: MyMo Digital Salak — Piggy Savings (Digital Salak) Flow

## Overview
A prototype for **MyMo** (GSB — Government Savings Bank Thailand mobile banking app) covering the "Digital Salak" (digital lottery-bond) buy flow, plus a new "save-first" piggy-savings goal feature (MyPiggy) that lets a user save toward a target amount before buying a Salak bond, with partial withdrawals, an auto-purchase countdown when the goal is reached, and a badge/collectible reward system.

## Prompt for Claude Code

Use the paragraph below verbatim as the task brief; the rest of this document is supporting reference.

> Build the MyMo Digital Salak + Piggy Savings flow as a production React app using **React + Vite**. The full interaction/state logic and visual design are captured in `prototype-reference.html` (a self-contained HTML/React prototype — do not ship it, recreate it) and the design tokens/components are in `design-system/`. Recreate every screen listed under "Screens / Views" below, wire up the exact state transitions under "State Management & Business Rules", and use the design tokens (colors, type, spacing) from `design-system/tokens/*.css` and `design-system/styles.css` — do not invent new colors or spacing. Componentize by screen (route) and by repeated UI (ProductCard, LotCard, BadgeChip, ConfirmModal, AmountKeypad, SlideToConfirm) using your judgement, but preserve every business rule exactly, especially the piggy open/close conditions, the countdown/auto-purchase behavior, and the balance-deduction math — these have been fixed multiple times during design review and are easy to regress. Use React Router for navigation between screens/steps. Mock the account balance and product data as local state/fixtures (no real backend); leave clear TODOs for the real API integration points (KYC/citizen-ID verification, account balance fetch, transfer execution, lottery number issuance).

## Fidelity
**High-fidelity.** `prototype-reference.html` is pixel-accurate for colors, type, spacing, and copy (Thai). Recreate it closely using the design system's components/tokens rather than the prototype's inline styles verbatim — but match spacing/type/color values exactly.

## How to read the reference file
`prototype-reference.html` is a single-file React component (custom runtime, not standard JSX) styled entirely with inline styles. Open it in a browser to click through the live flow. Screen switching is driven by `this.state.screen` (a string) — search the file for `screen === '...'` and `isXxx: s.screen === '...'` to find each screen's condition, and for the matching `<sc-if value="{{ isXxx }}">` block to find its markup. All event handlers are class methods (e.g. `chooseSaveFirst`, `confirmWithdrawFull`, `finalConfirm`) — these are the authoritative source for business logic.

## Screens / Views

1. **Home** (`screen === 'home'`) — MyMo bank home: header with balance (`ยอดเงินหลัก`), quick actions grid (โอนเงิน, ถอนเงินสด, บิล, **สลากดิจิทัล**, เติมเงิน, ...), promo banner. Tapping "สลากดิจิทัล" opens the Salak product screen.
2. **Salak product home** (`screen === 'salak'`) — orange gradient hero card showing total Salak balance, a Badge-collection summary card, tabs: **ซื้อสลาก** (buy list) / **ข้อมูลผลิตภัณฑ์** / **ประวัติการออก** / **ตั้งค่า**, and sub-tabs **สลาก (n)** (owned lots) / **รายการเดินบัญชี** (transactions). If an active savings goal exists, a pink "กำลังออมเพื่อซื้อ {product} {pct}%" progress card appears — tapping it opens the Goal Tracker.
3. **Buy list** (`screen === 'buyList'`) — list of Salak products (1 ปี / 2 ปี, etc.) each with "รายละเอียดเพิ่มเติม" (detail sheet) and a "ซื้อ" button. Tapping "ซื้อ" opens the **mode-choose bottom sheet**: "ซื้อเลย" (buy now) vs "ออมก่อน" (save first) vs "ยกเลิก".
   - **Piggy-exists modal**: if the user already has an open savings goal (any product) and taps "ออมก่อน" again, show a centered modal — "มีกระปุกออมที่เปิดอยู่" / body copy explaining only one piggy is allowed at a time / two buttons: **ปิด** (secondary) and **ไปที่กระปุกออม** (primary, navigates to that goal's tracker). Do NOT let them start a second goal.
4. **Piggy registration** (`screen === 'piggyRegister'`) — one-time KYC step (only first time opening a piggy account): citizen-ID-back-number input, **12 chars, digits 0–9 and uppercase English letters A–Z only** (block Thai script and symbols), auto-uppercase as typed, formatted `0000-0-00000-00`.
5. **Piggy KYC review** (`screen === 'piggyKyc'`) — read-only confirmation of the user's KYC profile (name TH/EN, DOB, ID number, address, occupation) fetched by the ID number; "ยืนยัน" opens a confirm dialog ("ยืนยันข้อมูลถูกต้อง" / "ยกเลิก").
6. **Piggy terms** (`screen === 'piggyTerms'`) — T&Cs document (MyPiggy digital piggy account terms), scroll-to-bottom "ถัดไป" button.
7. **Piggy success** (`screen === 'piggySuccess'`) — "เปิดบัญชีกระปุกออมสำเร็จ" confirmation, "เสร็จสิ้น" → Goal Setup.
8. **Goal setup** (`screen === 'goalSetup'`) — "เลือกจำนวนเงินเป้าหมาย" — preset targets (1,000 / 5,000 / 10,000 / 50,000 / 100,000 / 500,000 บาท) or "กำหนดเอง" (custom amount via keypad); "ยืนยัน" creates the goal (disabled until an amount is chosen).
9. **Goal tracker** (`screen === 'goalTracker'`) — the open piggy's home: big saved-amount hero (`฿{saved}` of `฿{target}` target), progress bar, start date, piggy account number; a two-stat row **พร้อมฝากสลาก** (available to deposit = saved) / **ซื้อสลากแล้ว** (bought so far); action row **ออมเงิน / ถอนเงิน / ซื้อสลาก**; **ประวัติการออม** (history list: deposits, purchases, withdrawals with fee if any).
   - When the goal target is reached, an **auto-purchase countdown banner** appears (party/celebration styling) — see business rules below.
10. **Goal deposit** ("ออมเงิน", `screen === 'goalDeposit'`) — numeric keypad-style entry ("ออมวันนี้เท่าไหร่", capped at remaining-to-target and available main-account balance), source-account picker sheet, slide-to-confirm ("เลื่อนเพื่อออมเงิน"). On success: celebration animation + either the **salak-suggestion sheet** (first time crossing ฿1,000 minimum) or the **goal-reached sheet** (if target hit).
11. **Salak-suggestion sheet** — "ยินดีด้วย ยอดออมของคุณถึงขั้นต่ำสำหรับซื้อสลากแล้ว" + bullet benefits + a pink **SUGGESTION** badge box explaining that buying in one large batch (vs many small batches) gives sequential ticket numbers and better odds on the last-2/last-3-4-digit prizes; buttons "ซื้อสลากตอนนี้" / dismiss checkbox "ไม่ต้องแสดงคำแนะนำนี้อีก".
12. **Goal-reached sheet** — congratulations sheet when saved amount hits the target; same SUGGESTION box; button to buy immediately or close (goal stays open with the countdown running — see below).
13. **Goal withdraw** ("ถอนเงิน", `screen === 'goalWithdraw'`) — slide-to-confirm withdrawal; if a target-reached auto-purchase countdown is active, withdrawal is forced to the full saved amount (partial withdraw keypad is disabled during countdown). A confirm dialog shows net amount to source account, fee breakdown if applicable (2% fee after the 2 free withdrawals/year quota is used), and a free-withdrawals-remaining badge or a red warning.
14. **Withdraw success** (`screen === 'withdrawSuccess'`) — "ถอนเงินสำเร็จ" receipt (gross amount, fee, net amount, date); "เสร็จสิ้น" routes to Goal Tracker if the goal/piggy is still open, or to the Salak home if it just closed.
15. **Transfer / Buy amount** (`screen === 'transfer'`, shared by "buy now" and "buy from piggy") — amount keypad (locked to the piggy's saved balance and forced to multiples of ฿1,000 when funded from a piggy), product summary card, slide-to-confirm ("เลื่อนเพื่อส่ง").
16. **Confirm** (`screen === 'confirm'`) — order summary (from/to account, product, units) → "ยืนยัน" → **Success** (`screen === 'success'`) receipt with lottery ticket numbers, badge-unlock reveal, ticket-earn toast (loyalty tickets, capped at 20/round), and a "เลือกลาย" sticker/skin picker.
17. **My lots list** (inside Salak product home, "สลาก (n)" tab) — cards per purchased lot: period, serial range, purchase date, amount, units, optional unlocked badge chip.
18. **Badge collection** (`screen === 'badges'` or similar) — grid of unlockable badges by rarity, unlocked/total counter, detail sheet per badge.
19. **Transaction history** ("รายการเดินบัญชี" tab) — ledger of piggy deposits/withdrawals/purchases.
20. **Accounts overview** (`screen === 'accounts'`) — list of the user's accounts: main current account (net of any amount reserved in an open piggy), Digital Salak holdings account, and (if a piggy is open) the piggy account itself.

## State Management & Business Rules
These rules were the subject of repeated bug fixes during design review — implement them exactly.

**Balance accounting**
- Main account available balance = `fromBalance − purchasedAmount(direct salak buys) − reservedForGoal(open piggy's saved amount)`. Money moved into the piggy must disappear from the main account's displayed balance (it now lives in the separate piggy account row), everywhere the main balance is shown (Home hero, Accounts list, source-account picker, transfer/deposit screen).
- Withdrawing from the piggy with a fee: **the piggy's saved balance is reduced by the full requested withdrawal amount**, not the post-fee net amount (e.g. saved ฿19,500 → withdraw ฿500 with ฿10 fee → user receives ฿490 net, but the piggy's saved balance becomes ฿19,000, not ฿19,010).

**One piggy at a time**
- A user may have at most one open savings goal/piggy across all products. If they try to start a second one (tap "ออมก่อน" on any product while a goal is already open, regardless of which product it's for), show the "piggy exists" modal instead of the goal-setup flow.

**Piggy closing conditions (important — do not over-close)**
- The piggy/goal should close (become `null`, freeing the user to open a new one) **only when its saved balance hits zero AND the goal's target has actually been reached** (i.e. cumulative deposits + amount already spent buying Salak from it ≥ target).
- If the saved balance hits zero for any other reason (e.g. the user withdraws it all, or spends it all buying Salak, before reaching the target), the piggy stays open with `saved = 0` — the user can keep depositing toward the same target.
- This applies to both the "buy Salak from piggy" action and the "withdraw" action.

**Free withdrawal quota**
- Each savings goal gets **2 free withdrawals per calendar year**, tracked **per goal/piggy** (stored on the goal object, not globally) — closing a piggy and opening a new one resets the quota. The 3rd+ withdrawal in a year incurs a 2% fee.

**Auto-purchase countdown**
- When a deposit causes `saved` to reach the goal's `target`, start a 24-hour countdown (visible as a banner/timer on the goal tracker and salak home). During the countdown:
  - The user can still make partial manual purchases from the piggy or partial withdrawals; the countdown keeps running as long as the piggy still holds savings.
  - If the user withdraws the piggy down to zero manually during the countdown, the piggy closes and the countdown/banner clears immediately (per the closing rule above, since the target was reached).
  - If the countdown reaches zero before the user acts, the system auto-purchases Salak using the **entire remaining saved balance** (not rounded down to a ฿1,000 multiple) and closes the piggy.
- The countdown must **persist across navigation** — e.g. going to the transfer/confirm screens to buy and backing out must not reset or clear it; it only clears when the piggy actually closes.

**Identity input validation**
- Citizen-ID-back-number field accepts digits 0–9 and uppercase English letters A–Z (auto-uppercase user input), max 12 characters. Reject Thai script and punctuation/symbols.

**Ticket-earning cap**
- Loyalty "tickets" earn at 1 per ฿500 spent, capped at 20 tickets per "round" (a rolling ~monthly window keyed off the 16th of the month); purchases beyond the cap show a "capped" indicator instead of the usual earn toast.

## Design Tokens
Do not hardcode values — use `design-system/tokens/*.css` (`colors.css`, `typography.css`, `spacing.css`, `motion.css`, `fonts.css`) and `design-system/styles.css`, plus the component bundle in `design-system/` for buttons, cards, inputs, icons, avatars, etc. Key brand values for quick reference (verify against the token files, which are authoritative):
- Brand crimson-pink `#D83152` (primary/accent), pressed `#9C233B`.
- Pastel pink chip background, used for badges/suggestion boxes and the piggy summary card.
- Primary button: pill (25px radius), gradient `#FA7C93 → #F14658`.
- Header gradient: `#FC7C96 → #D83152`.
- Salak category gradient: `#FF8840 → #F9AD4C`.
- Cards: white fill, 16px radius, soft cool-gray shadow.
- Typeface: SF Pro Display throughout (weights 300–700).

## Assets
- Icons: MyMo's own SVG icon set (see `design-system/assets/icons/`) — tintable via CSS `color`/`fill: currentColor`.
- No photography or emoji in this flow; illustrations are simple flat SVG (pig mascot, coins, clouds) drawn inline in the prototype — recreate as SVG components or ask design for final art.

## Files
- `prototype-reference.html` — the full interactive prototype (open directly in a browser). Authoritative for exact copy (Thai text), layout, and all state transition logic (search for method names referenced above).
- `design-system/` — MyMo design system: tokens, component bundle, icons, fonts.
