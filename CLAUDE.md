# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Vite + React 19 + TypeScript single-page app covering the core "Digital Salak"
buy/hold/view flow: login/register, viewing accounts, viewing Salak products, buying
Salak, viewing holdings, and viewing transaction history. Routing is `react-router-dom`;
styling is Tailwind v4. It's a browser SPA, not a native app — `MobileViewport`
(`src/components/MobileViewport.tsx`) just constrains the layout to a phone-width
column, centered on wider screens, so the desktop-browser dev experience still looks
like a phone.

It talks exclusively to `GSB-Salak-Backend`'s HTTP API (`src/lib/api.ts`) — there is no
other backend and no server-side rendering.

## Commands

```sh
npm install
npm run dev          # vite dev server on :5174 (see below for why not :5173)
npm run build         # tsc -b && vite build
npm run preview        # preview the production build
npm run typecheck      # tsc -b --noEmit

npm test               # Playwright E2E suite (headless)
npm run test:headed     # same, in a real browser window
npm run report          # open the last Playwright HTML report
```

Copy `.env.example` to `.env` to override `VITE_API_BASE_URL` (defaults to
`http://localhost:8080/api/v1`, i.e. `GSB-Salak-Backend`'s default `go run ./cmd/api`
address).

The dev server is pinned to port **5174** specifically to avoid clashing with
`GSB-Salak-Backend/testfrontend`'s static server, which defaults to **5173** — the two
can run side by side.

## Architecture

```
src/
├── pages/          # route-level screens (Login, Register, Home, Accounts, Salak,
│                   #   BuySalak, TransactionHistory, Settings) — one per route in App.tsx
├── components/     # presentational pieces (AccountCard, HoldingCard, ProductCard,
│                   #   ReceiptSummary, AppShell, BottomNav, Button, Card, PageHeader,
│                   #   MobileViewport)
├── context/        # AuthContext (token + user in localStorage) and ProtectedRoute
│                   #   (redirects to /login when AuthContext has no token)
└── lib/
    ├── api.ts      # fetch client: attaches `Authorization: Bearer <token>`, unwraps
    │               #   the backend's `{ data }` envelope, throws on `{ error }`
    ├── types.ts    # DTOs — see "API contract" below
    └── format.ts   # formatTHB, maskAccountNumber, formatDate — presentation-only
                     #   formatting, mirrors testfrontend's equivalent JS helpers
```

`App.tsx` wires `AuthProvider` → `MobileViewport` → `<Routes>`; every route except
`/login` and `/register` is wrapped in `ProtectedRoute`.

## API contract — hand-mirrored, not generated

`src/lib/types.ts`'s interfaces are **hand-written to mirror**
`GSB-Salak-Backend/internal/*/http/dto.go` — there is no codegen step from the
backend's `docs/swagger.json`/`swagger.yaml` today. If a backend DTO field is renamed,
added, or removed, nothing here fails to compile or fails a test — it just silently
drifts until something breaks at runtime. When changing a backend DTO, update the
matching interface in `types.ts` by hand in the same change.

The money fields (`balance`, `amount`, `unit_price`, etc.) are typed `string`, not
`number`, because the backend serializes `shopspring/decimal` values as JSON strings —
`format.ts`'s `formatTHB` handles the string→display conversion; don't coerce these to
`number` for anything other than display formatting; use string comparison/arithmetic
libraries if real math on them is ever needed client-side.

Auth: `login`/`register` return a token which `AuthContext` persists to
`localStorage` (`token` and `user` keys) via `src/lib/api.ts`'s `setToken`/`getToken`;
every subsequent request attaches it as a Bearer header. There is no refresh-token flow
— an expired/invalid token surfaces as a 401 from the backend, which `api.ts` turns into
a thrown `Error`.

## Testing

End-to-end coverage lives in `tests/` (Playwright): `login`, `register`, `home`,
`accounts`, `salak`, `buy-salak`, `transactions`, `settings` specs, each screenshotting
its key steps into `screenshots/<flow>/<case>/` (gitignored, regenerated per run).

`playwright.config.js`'s `webServer` array starts **both** `npm run dev` (this app, port
5174) and `go run ./cmd/api` (in `../GSB-Salak-Backend`, port 8080) automatically,
reusing either if already running outside CI — so `npm test` alone is enough as long as
Postgres is already up, migrated, and seeded:

```sh
cd ../GSB-Salak-Backend
docker compose up -d
go run ./cmd/migrate up
SEED_DEMO_DATA=true go run ./cmd/seed
```

`tests/globalSetup.js` then resets the seeded demo user's account balances, ticket
sequence, and transaction/holdings history to a known baseline via `docker exec ...
psql` before every run (same Postgres container/demo user as
`GSB-Salak-Backend/testfrontend` — see its README for the shared setup story). Fixed
demo IDs/credentials live in `tests/helpers/fixtures.js`. `fullyParallel: false` /
`workers: 1` in `playwright.config.js` is deliberate: tests mutate shared demo-account
state (balances, ticket numbers), so they must run serially, not concurrently.

**No unit or component tests exist yet** — there's no `vitest`/`jest` or
`@testing-library/react` configured, only Playwright. `src/lib/format.ts` (pure
formatting logic with real edge cases: `NaN` amounts, account numbers ≤8 chars, invalid
ISO date strings) and component-level behavior (`ProtectedRoute` redirect logic, form
validation states in `BuySalak.tsx`) are currently only exercised indirectly through the
E2E suite. Add a Vite-compatible test runner (`vitest` + `@testing-library/react` +
`jsdom`) before writing these rather than reaching for Playwright for logic that
doesn't need a real browser.
