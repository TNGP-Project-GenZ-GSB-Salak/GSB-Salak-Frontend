// Shared with SalakInfo.tsx's "งวดปัจจุบัน" table row - the single source of
// truth for each product term's current draw round, so a holding card and
// the ข้อมูลสลากดิจิทัล page never disagree on the same number. Still a
// static demo value (no backend field for this exists yet) - just no
// longer duplicated in two places.
export const CURRENT_ROUND_BY_TERM_MONTHS: Record<number, number> = {
  12: 635,
  24: 274,
};
