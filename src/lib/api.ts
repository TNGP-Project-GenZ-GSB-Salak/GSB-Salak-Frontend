// Fetch client mirroring GSB-Salak-Backend/testfrontend/api.js's contract:
// bearer token in localStorage, unwrap `{ data }` on success, throw `error` on failure.
import type {
  Account,
  BuySalakResponse,
  Holding,
  KapookBuyFromGoalResponse,
  KapookGoalResponse,
  KapookTermsStatus,
  LoginResult,
  SalakProduct,
  Transaction,
  User,
} from "./types";

// Falls back to whatever host served this page (localhost on the
// presenter's own machine, a LAN IP on a spectator's), not a hardcoded
// "localhost" - a spectator's phone calling its own localhost would reach
// nothing. VITE_API_BASE_URL still overrides this for any deployment where
// the API lives on a different host than the frontend.
const API_BASE: string =
  import.meta.env.VITE_API_BASE_URL ?? `http://${window.location.hostname}:8080/api/v1`;

const TOKEN_KEY = "token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Thrown by apiFetch on a non-2xx response. `code` mirrors the backend
// envelope's optional machine-readable `code` field (undefined when the
// server didn't assign one) - see lib/kapookErrorMessages.ts for how a
// screen maps this to Thai copy. `message` stays exactly the backend's raw
// `error` string, so every existing `err instanceof Error ? err.message :
// ...` call site keeps working unchanged.
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(body.error ?? `Request failed with status ${res.status}`, res.status, body.code);
  }
  return body.data as T;
}

export function register(input: {
  username: string;
  password: string;
  full_name: string;
}): Promise<User> {
  return apiFetch<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(input: { username: string; password: string }): Promise<LoginResult> {
  return apiFetch<LoginResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listAccounts(): Promise<Account[]> {
  return apiFetch<Account[]>("/accounts");
}

export function getAccount(id: string): Promise<Account> {
  return apiFetch<Account>(`/accounts/${id}`);
}

export function listSalakProducts(): Promise<SalakProduct[]> {
  return apiFetch<SalakProduct[]>("/salak/products");
}

export function getSalakProduct(id: string): Promise<SalakProduct> {
  return apiFetch<SalakProduct>(`/salak/products/${id}`);
}

export function listHoldings(accountId: string): Promise<Holding[]> {
  return apiFetch<Holding[]>(`/salak/holdings?account_id=${accountId}`);
}

export function buySalak(input: {
  funding_account_id: string;
  salak_account_id: string;
  product_id: string;
  amount: string;
}): Promise<BuySalakResponse> {
  return apiFetch<BuySalakResponse>("/transactions/buy-salak", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getKapookTermsStatus(): Promise<KapookTermsStatus> {
  return apiFetch<KapookTermsStatus>("/kapook/terms");
}

export function acceptKapookTerms(): Promise<KapookTermsStatus> {
  return apiFetch<KapookTermsStatus>("/kapook/terms/accept", { method: "POST" });
}

// goal_amount crosses as a decimal string, matching every other money field
// - never a number.
export function createKapookGoal(input: {
  account_id: string;
  product_id: string;
  goal_amount: string;
}): Promise<KapookGoalResponse> {
  return apiFetch<KapookGoalResponse>("/kapook/goals", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// Resolves to null when accountId has no active goal - a normal empty
// state, not an error (GET /kapook/goals/active's 200-with-null contract).
export function getActiveKapookGoal(accountId: string): Promise<KapookGoalResponse | null> {
  return apiFetch<KapookGoalResponse | null>(`/kapook/goals/active?account_id=${accountId}`);
}

// amount crosses as a decimal string, matching createKapookGoal's own
// goal_amount convention - never a number. Response is the same goalResponse
// shape as createKapookGoal/getActiveKapookGoal (internal/kapook/http/dto.go's
// toGoalResponse) - the read model's derived fields (available_balance,
// target_reached, buy_eligible, ...) reflect this deposit immediately, so
// callers should use them directly rather than recomputing locally.
export function depositToKapookGoal(input: {
  kapook_account_id: string;
  savings_account_id: string;
  amount: string;
}): Promise<KapookGoalResponse> {
  return apiFetch<KapookGoalResponse>("/kapook/goals/deposit", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// Funds a Salak purchase from the goal's own kapook account balance (POST
// /kapook/goals/buy) - the Kapook domain's own purchase path, NOT
// /transactions/buy-salak above. amount crosses as a decimal string,
// matching every other money field. Deliberately the only door in for
// Kapook-funded purchases; buySalak stays closed to kapook-type accounts.
export function buyFromKapookGoal(input: {
  kapook_account_id: string;
  salak_account_id: string;
  amount: string;
}): Promise<KapookBuyFromGoalResponse> {
  return apiFetch<KapookBuyFromGoalResponse>("/kapook/goals/buy", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listTransactions(
  accountId: string,
  options: { limit?: number; offset?: number } = {},
): Promise<Transaction[]> {
  const params = new URLSearchParams({ account_id: accountId });
  if (options.limit !== undefined) params.set("limit", String(options.limit));
  if (options.offset !== undefined) params.set("offset", String(options.offset));
  return apiFetch<Transaction[]>(`/transactions?${params.toString()}`);
}
