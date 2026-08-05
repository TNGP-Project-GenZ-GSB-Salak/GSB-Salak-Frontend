export function formatTHB(amount: string | number): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(value)) return amount.toString();
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 8) return accountNumber;
  const start = accountNumber.slice(0, 4);
  const end = accountNumber.slice(-4);
  return `${start}xxxx${end}`;
}

// Display-only derivation (a progress-bar width, a percentage label) - never
// a value driving a button gate, which comes from the server's own flags.
export function progressPct(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
