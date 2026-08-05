import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import * as api from "../lib/api";
import type { KapookGoalResponse, SalakProduct } from "../lib/types";
import { formatTHB, formatDate } from "../lib/format";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ProgressBar } from "../components/ProgressBar";
import { Countdown } from "../components/Countdown";
import { BottomSheet } from "../components/BottomSheet";
import { PigMascot, PartyBackdrop, CelebrateStickerIcon, TipCloud, TipGround, type CelebrateSticker } from "../components/PigMascot";
import { useKapook } from "../context/KapookContext";
import { messageForError } from "../lib/kapookErrorMessages";

// State handed from KapookDeposit.tsx's slide-to-confirm success (matches
// prompt/prototype-reference.html's `completeSlideAction`, which navigates
// straight to the goalTracker screen and lets *it* own the celebrate
// bubble/sticker and the goal-reached/salak-suggestion sheets — they're
// rendered inside `isGoalTracker`, not on the deposit screen itself).
// The salak-suggestion sheet (first time availableBalance crosses ฿1,000) takes
// priority over the goal-reached one if a single deposit triggers both at
// once — `pendingGoalReachedAfterSuggestion` is how the goal-reached sheet
// still gets shown right after the suggestion is dismissed.
export interface KapookCelebrateState {
  celebrate: true;
  celebrateAmount: number;
  celebrateSticker: CelebrateSticker;
  showSuggestion: boolean;
  pendingGoalReachedAfterSuggestion: boolean;
  justReachedGoal: boolean;
}

const CELEBRATE_DURATION_MS = 3200;

// Matches the prototype's goalTracker screen (prompt/prototype-reference.html):
// a sky/pig hero (swapping to a starry "party mode" backdrop once the goal is
// reached), a summary card (product + cumulative-committed/target + progress
// + start date + account number, with the auto-purchase countdown shown
// *inside* the card once reached), a two-column "พร้อมฝากสลาก" / "ซื้อสลากแล้ว"
// breakdown, and an ออมเงิน/ถอนเงิน/ซื้อสลาก action row. "ซื้อสลาก" routes to an
// amount-entry screen (capped + rounded to ฿1,000, prompt/README.md §15)
// rather than instantly spending the whole balance; the same "ถอนเงิน" screen
// doubles as the countdown bail-out (forced to the full balance there,
// prompt/README.md §13) — there's no separate action.
//
// The goal itself is real (GET /kapook/goals/active), fetched once per visit
// - not the local fiction in KapookContext's `state.goal`, which
// deposit/withdraw/buy-from-piggy still read until their own tickets move
// them onto the real backend. Money fields cross as decimal strings and are
// coerced to Number only for display (a progress-bar width, a formatted
// ฿ figure) - never for a value driving a button gate, which come from the
// server's own flags (target_reached, buy_eligible).
export function KapookTracker() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, freeWithdrawalsRemaining, hideSalakSuggestionForever } = useKapook();
  const [products, setProducts] = useState<SalakProduct[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [termsSheetOpen, setTermsSheetOpen] = useState(false);

  // undefined = still loading; null = no active goal (a normal empty
  // state, not an error - see GET /kapook/goals/active's 200-with-null
  // contract).
  const [goal, setGoal] = useState<KapookGoalResponse | null | undefined>(undefined);

  const celebrateState = location.state as KapookCelebrateState | null;
  const [celebrate, setCelebrate] = useState(celebrateState?.celebrate ?? false);
  const [goalReachedSheet, setGoalReachedSheet] = useState(celebrateState?.justReachedGoal ?? false);
  const [suggestionSheet, setSuggestionSheet] = useState(celebrateState?.showSuggestion ?? false);
  const [hideSuggestionChecked, setHideSuggestionChecked] = useState(false);

  function closeSuggestionSheet() {
    if (hideSuggestionChecked) hideSalakSuggestionForever();
    setSuggestionSheet(false);
    if (celebrateState?.pendingGoalReachedAfterSuggestion) setGoalReachedSheet(true);
  }

  function buySalakFromSuggestion() {
    if (hideSuggestionChecked) hideSalakSuggestionForever();
    setSuggestionSheet(false);
    navigate("/kapook/buy");
  }

  useEffect(() => {
    if (!celebrate) return;
    const id = window.setTimeout(() => setCelebrate(false), CELEBRATE_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [celebrate]);

  useEffect(() => {
    let cancelled = false;
    api
      .listSalakProducts()
      .then((list) => !cancelled && setProducts(list))
      .catch((err) => !cancelled && setLoadError(messageForError(err, "โหลดข้อมูลไม่สำเร็จ")));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!state.account) return;
    let cancelled = false;
    api
      .getActiveKapookGoal(state.account.id)
      .then((g) => !cancelled && setGoal(g))
      .catch((err) => !cancelled && setLoadError(messageForError(err, "โหลดข้อมูลไม่สำเร็จ")));
    return () => {
      cancelled = true;
    };
  }, [state.account]);

  const productName = useMemo(
    () => products?.find((p) => p.id === goal?.product_id)?.name ?? "",
    [products, goal?.product_id],
  );

  if (state.termsAccepted === null) return null;
  if (!state.termsAccepted) return <Navigate to="/kapook/open" replace />;
  if (goal === undefined) return null;

  if (goal === null) {
    return (
      <AppShell showNav={false}>
        <PageHeader title="ออมก่อนซื้อสลาก" variant="close" onAction={() => navigate("/")} />
        <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-2">
          {loadError && <p className="error-box">{loadError}</p>}
          <div className="kapook-hero-card">
            <span className="home-tip-card__sun" />
            <TipCloud className="home-tip-card__cloud" />
            <TipGround className="home-tip-card__ground" />
            <PigMascot width={120} height={112} animation="bob" className="kapook-hero-card__mascot" />
          </div>
          <p className="font-semibold mt-4" style={{ fontSize: 15 }}>
            ยังไม่มีเป้าหมายการออม
          </p>
          <p className="text-muted mt-1 text-center">เริ่มออมก่อนเพื่อนำไปซื้อสลากดิจิทัล</p>
          <div className="mt-4 w-full">
            <Button onClick={() => navigate("/kapook/goal/new")} data-testid="kapook-create-goal-action">
              ตั้งเป้าหมายการออม
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  // prompt/README.md: opening a new piggy resets its history (and free-
  // withdrawal quota) — a closed goal's old transactions must never show up
  // under the new one, even though they still live in the same flat array.
  // Reads the local-fiction transaction log (ticket 09 makes this real);
  // its ids won't match the real goal's until deposit/withdraw/buy are
  // themselves real, so this list is expected to read empty for now.
  const goalTransactions = state.transactions.filter((t) => t.goalId === goal.id);
  const totalCommitted = Number(goal.saving_amount);
  const targetAmount = Number(goal.goal_amount);
  const remainingToTarget = Math.max(0, targetAmount - totalCommitted);
  const depositResultNote = goal.target_reached
    ? "ออมครบเป้าหมายแล้ว! กดซื้อสลากได้เลย"
    : `เหลืออีก ฿${formatTHB(remainingToTarget)} ถึงเป้าหมาย ยังไม่ได้สลากจนกว่าจะออมครบนะ`;

  const pigAnimation = celebrate ? "celebrate" : goal.target_reached ? "party" : "bob";

  return (
    <AppShell showNav={false}>
      <PageHeader title="ออมก่อนซื้อสลาก" variant="close" onAction={() => navigate("/")} />

      <div className="flex flex-col px-4 pb-4">
        {loadError && <p className="error-box">{loadError}</p>}
        <div className="kapook-hero-card">
          {goal.target_reached ? (
            <PartyBackdrop />
          ) : (
            <>
              <span className="home-tip-card__sun" />
              <TipCloud className="home-tip-card__cloud" />
              <TipGround className="home-tip-card__ground" />
            </>
          )}
          <PigMascot width={120} height={112} animation={pigAnimation} className="kapook-hero-card__mascot" />
          {celebrate && (
            <div className="kapook-celebrate-bubble">
              <div>ออมสำเร็จวันนี้ ฿{formatTHB(celebrateState?.celebrateAmount ?? 0)} :)</div>
              <div className="kapook-celebrate-bubble__note">{depositResultNote}</div>
            </div>
          )}
          {celebrate && <CelebrateStickerIcon sticker={celebrateState?.celebrateSticker ?? "coin"} />}
        </div>

        <Card className="kapook-summary-card">
          <div className="kapook-summary-card__product-row">
            <span className="kapook-summary-card__product">{productName}</span>
            <button
              type="button"
              className="kapook-summary-card__info"
              onClick={() => setTermsSheetOpen(true)}
              data-testid="kapook-terms-info"
            >
              i
            </button>
          </div>
          <p className="kapook-summary-card__saved" data-testid="kapook-saved">
            ฿{formatTHB(totalCommitted)}
          </p>
          <p className="kapook-summary-card__target">จากเป้าหมาย ฿{formatTHB(targetAmount)}</p>
          <ProgressBar value={totalCommitted} max={targetAmount} />

          {goal.target_reached && goal.countdown_remaining_seconds !== undefined && (
            <div className="kapook-countdown-box">
              <p className="kapook-countdown-box__label">ระบบจะซื้อสลากให้อัตโนมัติใน</p>
              <p className="kapook-countdown-box__value">
                <Countdown deadline={new Date(Date.now() + goal.countdown_remaining_seconds * 1000).toISOString()} />
              </p>
              <p className="kapook-countdown-box__hint">กดปุ่ม "ซื้อสลาก" ด้านล่างเพื่อเลือกเอง</p>
            </div>
          )}

          <p className="kapook-summary-card__started">เริ่มออมเมื่อ {formatDate(goal.created_at)}</p>

          <div className="kapook-account-row">
            <span className="kapook-account-row__label">บัญชีกระปุกออมสลาก</span>
            <span className="kapook-account-row__value">{state.account?.accountNumber ?? ""}</span>
          </div>
        </Card>

        <div className="kapook-split-card">
          <div className="kapook-split-card__col">
            <span className="kapook-split-card__label">
              <span className="kapook-split-card__dot" style={{ backgroundColor: "var(--color-brand)" }} />
              พร้อมฝากสลาก
            </span>
            <p className="kapook-split-card__amount" style={{ color: "var(--color-brand)" }}>
              ฿{formatTHB(goal.available_balance)}
            </p>
            <p className="kapook-split-card__meta">ยอดออมที่ใช้ซื้อสลากได้</p>
          </div>
          <div className="kapook-split-card__col">
            <span className="kapook-split-card__label">
              <span className="kapook-split-card__dot" style={{ backgroundColor: "var(--mymo-cat-salak)" }} />
              ซื้อสลากแล้ว
            </span>
            <p className="kapook-split-card__amount" style={{ color: "var(--mymo-cat-salak)" }}>
              ฿{formatTHB(goal.salak_amount)}
            </p>
            <p className="kapook-split-card__meta">
              {goal.purchased_units} หน่วย · {goal.purchased_count} รายการ
            </p>
          </div>
        </div>

        <div className="kapook-actions">
          <button
            type="button"
            className="kapook-actions__item"
            disabled={goal.target_reached}
            onClick={() => navigate("/kapook/deposit")}
            data-testid="kapook-deposit-action"
          >
            <span className="kapook-actions__icon">
              <SaveIcon className="h-5 w-5" />
            </span>
            ออมเงิน
          </button>
          <button
            type="button"
            className="kapook-actions__item"
            disabled={Number(goal.available_balance) <= 0}
            onClick={() => navigate("/kapook/withdraw")}
            data-testid="kapook-withdraw-action"
          >
            <span className="kapook-actions__icon">
              <WithdrawIcon className="h-5 w-5" />
            </span>
            ถอนเงิน
          </button>
          <button
            type="button"
            className="kapook-actions__item"
            disabled={!goal.buy_eligible}
            onClick={() => navigate("/kapook/buy")}
            data-testid="kapook-redeem-action"
          >
            <span className="kapook-actions__icon">
              <BuyIcon className="h-5 w-5" />
            </span>
            ซื้อสลาก
          </button>
        </div>

        <p className="text-muted mt-3">เหลือสิทธิ์ถอนฟรี: {freeWithdrawalsRemaining} ครั้ง</p>

        <section className="mt-2">
          <p className="field-label">ประวัติการออม</p>
          <div className="flex flex-col gap-3 mt-2" data-testid="kapook-history">
            {goalTransactions.length === 0 && <p className="empty-state">ยังไม่มีประวัติการออม</p>}
            {goalTransactions.map((txn) => {
              const isCredit = txn.type === "deposit";
              const net = txn.type === "withdraw_with_fee" ? txn.amount - txn.feeAmount : txn.amount;
              const label =
                txn.type === "deposit" ? "ออมเงิน" : txn.type === "buy_salak" ? "ซื้อสลากแล้ว" : "ถอนเงินคืนบัญชีหลัก";
              return (
                <Card key={txn.id} data-testid="kapook-transaction-row" className="transaction-row">
                  <div>
                    <p className="transaction-row__desc">{label}</p>
                    <p className="transaction-row__date">{formatDate(txn.createdAt)}</p>
                    {txn.type === "withdraw_with_fee" && (
                      <p className="transaction-row__fee-note">
                        ถอนเต็ม ฿{formatTHB(txn.amount)} หักค่าธรรมเนียม ฿{formatTHB(txn.feeAmount)}
                      </p>
                    )}
                  </div>
                  <p className={`transaction-row__amount ${isCredit ? "transaction-row__amount--credit" : "transaction-row__amount--debit"}`}>
                    {isCredit ? "+" : "-"}฿{formatTHB(net)}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>
      </div>

      {goalReachedSheet && (
        <div className="confirm-dialog-backdrop" onClick={() => setGoalReachedSheet(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="sheet-panel__title">ออมครบเป้าหมายแล้ว! :)</p>
            <p className="confirm-dialog__message">
              คุณออมครบ ฿{formatTHB(targetAmount)} แล้ว ต้องการซื้อสลากดิจิทัลด้วยยอดที่ออมได้เลยตอนนี้หรือไม่
            </p>
            <p className="kapook-sheet-note mt-2">หากยังไม่ซื้อ ระบบจะซื้อสลากให้อัตโนมัติภายใน 24 ชั่วโมง</p>
            <div className="mt-4 flex gap-2">
              <div className="flex-1">
                <Button variant="secondary" onClick={() => setGoalReachedSheet(false)} data-testid="goal-reached-later">
                  ไว้ก่อน
                </Button>
              </div>
              <div className="flex-1">
                <Button onClick={() => navigate("/kapook/buy")} data-testid="goal-reached-buy-now">
                  ซื้อเลย
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomSheet open={suggestionSheet} onClose={closeSuggestionSheet} data-testid="salak-suggestion-sheet">
        <div className="sheet-panel flex flex-col items-center text-center">
          <div className="kapook-suggestion-emoji">🎉</div>
          <div className="sheet-panel__title">ยินดีด้วย ยอดออมของคุณถึงขั้นต่ำสำหรับซื้อสลากแล้ว</div>
          <div className="bullet-list mt-2 w-full text-left">
            <div className="bullet-list__item">
              <span className="bullet-list__dot" />
              <span className="bullet-list__text">ร่วมลุ้นรางวัลได้ทุกงวดตั้งแต่ตอนนี้ โดยการซื้อสลาก ไม่ต้องรอออมครบเป้าหมาย</span>
            </div>
            <div className="bullet-list__item">
              <span className="bullet-list__dot" />
              <span className="bullet-list__text">เงินต้นไม่หาย ยังคงนับความคืบหน้าของเป้าหมายเดิมต่อเนื่อง</span>
            </div>
          </div>
          <div className="kapook-suggestion-box mt-4 w-full">
            <span className="kapook-suggestion-box__badge">SUGGESTION</span>
            <p className="kapook-suggestion-box__text">
              ทั้งนี้ การทยอยซื้อสลากเป็นงวดย่อมมีข้อดีในแง่การกระจายโอกาส แต่การซื้อสลากเป็นก้อนใหญ่ในคราวเดียวจะทำให้ท่านได้รับเลขชุดที่ต่อเนื่องกัน
              ซึ่งเพิ่มโอกาสในการถูกรางวัลเลขท้าย 2 ตัวและ 3-4 ตัวได้มากกว่าการแบ่งซื้อเป็นหลายครั้ง
            </p>
          </div>
          <button
            type="button"
            className="kapook-suggestion-checkbox"
            onClick={() => setHideSuggestionChecked((v) => !v)}
            data-testid="salak-suggestion-hide-checkbox"
          >
            <span className={`kapook-suggestion-checkbox__box ${hideSuggestionChecked ? "kapook-suggestion-checkbox__box--checked" : ""}`}>
              {hideSuggestionChecked && <SmallCheckIcon />}
            </span>
            <span>ไม่ต้องแสดงคำแนะนำนี้อีก</span>
          </button>
          <div className="mt-4 w-full flex gap-2">
            <div className="flex-1">
              <Button variant="secondary" onClick={closeSuggestionSheet} data-testid="salak-suggestion-close">
                ปิด
              </Button>
            </div>
            <div className="flex-1">
              <Button onClick={buySalakFromSuggestion} data-testid="salak-suggestion-buy-now">
                ซื้อสลากตอนนี้
              </Button>
            </div>
          </div>
          <p className="text-muted mt-3">หากยังไม่พร้อมตอนนี้ สามารถกลับมาซื้อได้ภายหลังผ่านปุ่ม "ซื้อสลาก" ในหน้าออมก่อนซื้อสลาก</p>
        </div>
      </BottomSheet>

      <BottomSheet open={termsSheetOpen} onClose={() => setTermsSheetOpen(false)}>
        <div className="sheet-panel">
          <div className="sheet-panel__title">ข้อกำหนดและเงื่อนไข การออมในกระปุกเงินฝาก</div>
          <div className="bullet-list">
            <div className="bullet-list__item">
              <span className="bullet-list__dot" />
              <span className="bullet-list__text">
                เงินที่เก็บสะสมในกระปุกออมสิน (กระปุกเงินฝาก) จะยังคงได้รับอัตราดอกเบี้ยตามเงื่อนไขบัญชีเงินฝากออมทรัพย์ปกติ
              </span>
            </div>
            <div className="bullet-list__item">
              <span className="bullet-list__dot" />
              <span className="bullet-list__text">
                ผู้ฝากสามารถถอนเงินออมได้โดยไม่มีค่าธรรมเนียม จำนวนไม่เกิน 2 ครั้งต่อปี หากมีการถอนเกินกว่าจำนวนครั้งที่กำหนดในปีถัดไป
                ธนาคารจะคิดค่าธรรมเนียมในอัตราร้อยละ 2 ของยอดเงินที่ถอน โดยจะหักออกจากยอดเงินดังกล่าวก่อนนำเข้าบัญชีจริง
              </span>
            </div>
            <div className="bullet-list__item">
              <span className="bullet-list__dot" />
              <span className="bullet-list__text">ในกรณีที่ผู้ฝากไม่สามารถออมเงินได้ครบตามจำนวนหรือเงื่อนไขที่กำหนดไว้ จะไม่มีการหักค่าธรรมเนียมหรือค่าปรับใดๆ ทั้งสิ้น</span>
            </div>
          </div>
          <div className="mt-5">
            <Button variant="secondary" onClick={() => setTermsSheetOpen(false)}>
              ปิด
            </Button>
          </div>
        </div>
      </BottomSheet>
    </AppShell>
  );
}

function SmallCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SaveIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M12 4v11" strokeLinecap="round" />
      <path d="M16.5 11.5 12 16l-4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" strokeLinecap="round" />
    </svg>
  );
}

function WithdrawIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M12 4v11" strokeLinecap="round" />
      <path d="M7.5 11.5 12 16l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" strokeLinecap="round" />
    </svg>
  );
}

function BuyIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path
        d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1.5 1.5 0 0 0 0 3v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1.5 1.5 0 0 0 0-3Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
