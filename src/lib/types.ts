// Mirrors the DTOs returned by GSB-Salak-Backend (internal/*/http/dto.go).
// Money fields are typed as `string` because the backend serializes
// shopspring/decimal values as JSON strings, not numbers.

export interface User {
  id: string;
  username: string;
  full_name: string;
  created_at: string;
}

export interface LoginResult {
  user: User;
  token: string;
}

export type AccountType = "savings" | "salak";

export interface Account {
  id: string;
  account_number: string;
  type: AccountType;
  balance: string;
  currency: string;
  created_at: string;
}

export interface SalakProduct {
  id: string;
  code: string;
  name: string;
  term_months: number;
  unit_price: string;
  min_purchase: string;
  max_purchase: string;
  step_amount: string;
}

export interface Holding {
  id: string;
  account_id: string;
  product_id: string;
  product_name: string;
  units: number;
  ticket_start: string;
  ticket_end: string;
  purchase_amount: string;
  purchase_date: string;
  maturity_date: string;
}

export interface BuySalakResponse {
  reference_id: string;
  product_name: string;
  units: number;
  ticket_start: string;
  ticket_end: string;
  amount: string;
  funding_account_balance_after: string;
  salak_account_balance_after: string;
  purchase_date: string;
  maturity_date: string;
}

export type LedgerEntryType = "debit" | "credit";

export interface Transaction {
  id: string;
  account_id: string;
  holding_id?: string;
  type: LedgerEntryType;
  amount: string;
  balance_after: string;
  reference_id: string;
  description: string;
  created_at: string;
}
