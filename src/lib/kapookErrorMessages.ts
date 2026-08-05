import { ApiError } from "./api";

// Thai copy for the ~8-10 customer-facing Kapook error codes the backend
// assigns (internal/kapook/service/kapook_service.go's .WithCode(...) call
// sites). Everything else - contract violations a real UI flow can't
// trigger, and internal/infrastructure failures - has no code and falls
// back to MESSAGE_BY_STATUS below, deliberately: giving them real Thai copy
// would imply a customer might see them.
const MESSAGE_BY_CODE: Record<string, string> = {
  kapook_terms_not_accepted: "กรุณายอมรับข้อกำหนดและเงื่อนไขกระปุกออมก่อนตั้งเป้าหมายการออม",
  kapook_goal_already_exists: "คุณมีเป้าหมายการออมที่กำลังดำเนินการอยู่แล้ว",
  kapook_amount_must_be_positive: "จำนวนเงินไม่ถูกต้อง",
  kapook_deposit_exceeds_target: "จำนวนเงินที่ฝากเกินกว่าเป้าหมายที่ตั้งไว้",
  kapook_withdrawal_exceeds_balance: "จำนวนเงินที่ถอนเกินยอดคงเหลือในกระปุกออม",
  kapook_withdrawal_must_be_full_during_countdown: "เมื่อออมครบเป้าหมายแล้ว การถอนเงินต้องถอนเต็มจำนวนเท่านั้น",
  kapook_balance_below_minimum_purchase: "ยอดเงินในกระปุกออมต้องไม่ต่ำกว่าจำนวนขั้นต่ำในการซื้อสลากของผลิตภัณฑ์นี้",
  kapook_buy_amount_exceeds_balance: "จำนวนเงินที่ต้องการซื้อสลากเกินยอดคงเหลือในกระปุกออม",
  // Constructed in the salak domain's ValidatePurchase/EnsureNotDrawDay
  // (internal/salak/service/salak_service.go), not kapook_service.go, but
  // reached via CreateGoal/BuyFromGoal and named by the decision doc as
  // needing real Thai copy - see internal/salak/errorcodes.go.
  salak_amount_not_step_multiple: "จำนวนเงินไม่ตรงกับจำนวนขั้นบันไดที่ผลิตภัณฑ์นี้กำหนด กรุณาตรวจสอบอีกครั้ง",
  salak_draw_day_purchase_blocked: "ไม่สามารถซื้อสลากได้ในวันออกรางวัล กรุณาลองใหม่อีกครั้งหลังวันออกรางวัล",
};

// Per-Kind generic fallback, keyed by the HTTP status apperror.HTTPStatus
// derives from Kind (validation->400, not_found->404, unauthorized->401,
// forbidden->403, conflict->409, internal->500) - the six Kinds map 1:1 to
// these statuses, so the status alone is enough to pick a fallback without
// the envelope needing to carry Kind as well as code.
const MESSAGE_BY_STATUS: Record<number, string> = {
  400: "คำขอไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง",
  401: "ไม่สามารถยืนยันตัวตนได้ กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
  403: "คุณไม่มีสิทธิ์ทำรายการนี้",
  404: "ไม่พบข้อมูลที่ร้องขอ",
  409: "ไม่สามารถทำรายการนี้ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
  500: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
};

const DEFAULT_FALLBACK = "ทำรายการไม่สำเร็จ";

// Thrown client-side, never returned by the backend: no account is flagged
// is_primary_account for this user, so a withdrawal has nowhere safe to
// land. Deliberately not auto-resolved to "the one savings account" as a
// fallback, even though that guess would be unambiguous today - see
// lib/accounts.ts's findPrimaryAccount and KapookContext.withdraw. Mirrors
// the existing "go talk to a human" copy pattern used when onboarding hits
// something it can't resolve on its own (KapookOnboarding.tsx).
export const NO_PRIMARY_ACCOUNT_MESSAGE = "ไม่พบบัญชีคู่โอนหลักของคุณ กรุณาติดต่อสาขาธนาคารออมสิน";

// Drop-in replacement for the repo-wide `err instanceof Error ? err.message
// : "..."` catch pattern: an ApiError with a mapped code gets real Thai
// copy; an ApiError with no mapped code gets a generic per-Kind Thai
// message instead of the raw (English) backend string; any other Error
// (e.g. a client-side-thrown Thai string) keeps its own message untouched.
export function messageForError(err: unknown, fallback: string = DEFAULT_FALLBACK): string {
  if (err instanceof ApiError) {
    if (err.code && MESSAGE_BY_CODE[err.code]) return MESSAGE_BY_CODE[err.code];
    return MESSAGE_BY_STATUS[err.status] ?? MESSAGE_BY_STATUS[500];
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
