// Shared client-side guard for money amounts crossing the wire as decimal
// strings (see lib/api.ts's own money-field convention). The backend's
// shopspring/decimal fields accept arbitrary precision, but every amount a
// customer can actually key in through this app's Keypad is whole baht — so
// anything carrying more than two decimal places reaching a deposit/withdraw/
// buy call would only be a client-side bug (float drift, a bad conversion),
// and should be rejected before it ever reaches the network rather than sent
// for the backend to reject.
//
// New shared file — ticket 06/07/08 (deposit/withdraw/buy) each add this
// under the same exact path + signature during parallel development, so
// whichever copy survives the merge is a trivial no-op dedupe.
export function hasAtMostTwoDecimals(amount: string): boolean {
  const trimmed = amount.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return false;
  const dotIndex = trimmed.indexOf(".");
  if (dotIndex === -1) return true;
  return trimmed.length - dotIndex - 1 <= 2;
}
