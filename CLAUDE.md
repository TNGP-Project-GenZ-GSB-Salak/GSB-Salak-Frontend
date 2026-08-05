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

It also covers **Kapook (กระปุกออม)**, a goal-saving piggy bank that funds a future
Salak purchase: open the piggy and accept terms (`KapookOnboarding`), set a savings
target against a product (`KapookGoalSetup`), then deposit/withdraw/watch progress
(`KapookTracker`, `KapookDeposit`, `KapookWithdraw`) until the target is reached, at
which point a 24-hour countdown starts and the backend's own worker
(`GSB-Salak-Backend/cmd/worker`) buys the Salak automatically unless the customer buys
it themselves first (`KapookBuyFromPiggy`). Every domain fact — the goal, its balances,
its transaction history, the countdown — is fetched live from the backend; `KapookContext`
(`src/context/KapookContext.tsx`) holds no local copy of any of it, only a handful of
browser-only UI preferences (`src/lib/kapookPreferences.ts`: the "don't show this
suggestion again" flag, per-goal suggestion-seen ids, the dismissible auto-purchase
notice) that are allowed to be lost if the browser's storage is cleared, because none of
them represent money or a promise the bank made.

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

The dev server is pinned to port **5174** (a fixed convention, distinct from the backend's
own `:8080` and `GSB-Salak-Backend/adminfrontend`'s `:5175`).

## Architecture

```
src/
├── pages/          # route-level screens — one per route in App.tsx
│                   #   Login, Register, Home, Accounts, Salak, BuySalak, SalakInfo,
│                   #   SalakBuyList, TransactionHistory, Settings
│                   #   Kapook: KapookOnboarding (terms), KapookGoalSetup (create),
│                   #   KapookTracker (progress/countdown/history), KapookDeposit,
│                   #   KapookWithdraw, KapookBuyFromPiggy
├── components/     # presentational pieces (AccountCard, HoldingCard, ProductCard,
│                   #   ReceiptSummary, AppShell, BottomNav, Button, Card, PageHeader,
│                   #   MobileViewport, ProgressBar, Countdown, PigMascot, BottomSheet,
│                   #   SlideToConfirm)
├── context/        # AuthContext (token + user in localStorage) and ProtectedRoute
│                   #   (redirects to /login when AuthContext has no token); KapookContext
│                   #   (real kapook account + terms-acceptance status, fetched from the
│                   #   API — see "Kapook" below)
└── lib/
    ├── api.ts                # fetch client: attaches `Authorization: Bearer <token>`,
    │                         #   unwraps the backend's `{ data }` envelope, throws on
    │                         #   `{ error }`
    ├── types.ts              # DTOs — see "API contract" below
    ├── format.ts             # formatTHB, maskAccountNumber, formatDate, progressPct —
    │                         #   presentation-only formatting
    ├── accounts.ts           # findPrimaryAccount — resolves a user's บัญชีคู่โอน
    ├── moneyValidation.ts    # hasAtMostTwoDecimals — client-side input guard the
    │                         #   backend's decimal fields don't themselves enforce
    ├── kapookErrorMessages.ts # messageForError, NO_PRIMARY_ACCOUNT_MESSAGE
    └── kapookPreferences.ts  # the only Kapook state that lives in the browser — see
                              #   "Kapook" below
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

## Kapook (กระปุกออม)

`src/context/KapookContext.tsx` is a thin wrapper, not a store: it fetches the real
kapook account and terms-acceptance status once per signed-in user, exposes the
domain actions (`createGoal`, `deposit`, `withdraw`, `confirmGoalPurchase`) as pure
API calls, and holds nothing else about the goal itself. Every screen that needs the
goal — its balances, whether the target's reached, its transaction history — fetches
it fresh via `src/lib/api.ts` (`getActiveKapookGoal`, `listKapookGoalHistory`,
`getKapookWithdrawalStatus`) rather than reading it from context. Money fields on the
goal response follow the same rule as everywhere else in this app: never recomputed
client-side, only coerced to `Number` for display.

The only Kapook state that lives in the browser is `src/lib/kapookPreferences.ts`,
localStorage-backed and scoped per user (`kapook-preferences:<userId>`):

- `hideSalakSuggestion` — permanent "don't show this suggestion again", set from the
  buy-Salak suggestion sheet. Per-device only; there is no backend table for it (a
  deliberate scope cut — see `.scratch/mvp1-frontend-integration-build/issues/12-*`).
- `seenSuggestionGoalIds` — stops that same suggestion firing twice for one goal.
- `autoPurchaseNotice` — the amount the worker bought unattended, shown as a
  dismissible banner on the Salak overview; discovered by `reportGoalObservation`
  checking a just-closed goal's history for an automatic `buy_salak` row, never set
  after a manual purchase.
- `lastKnownGoalId` — bookkeeping for that same reconciliation.

Losing any of this on a cleared browser costs one repeated tip or banner, never a
broken promise — that's the line that keeps it out of the backend.

The auto-purchase countdown itself is entirely server-driven: `KapookTracker`'s
countdown reads `goal.countdown_remaining_seconds` from the server and polls
(`GET /kapook/goals/active`) only while a goal has reached its target, never running
its own purchase timer. The actual purchase only ever happens in
`GSB-Salak-Backend/cmd/worker`; the browser's job is discovery, not action.

## Testing

End-to-end coverage lives in `tests/` (Playwright): `login`, `register`, `home`,
`accounts`, `salak`, `buy-salak`, `transactions`, `settings` specs, each screenshotting
its key steps into `screenshots/<flow>/<case>/` (gitignored, regenerated per run).

`playwright.config.js`'s `webServer` array starts **three** processes automatically,
reusing any already running outside CI: `npm run dev` (this app, port 5174),
`go run ./cmd/api` (port 8080), and `go run ./cmd/worker` (the Kapook auto-purchase
worker — no port of its own; Playwright just spawns it and moves on). Omitting the
worker entry is the exact silent failure the worker package's own docs warn about: a
countdown spec's goal would simply never get bought, with every assertion up to that
point passing, or worse, hang until timeout. `KAPOOK_COUNTDOWN_DURATION` and
`REGISTRATION_SAVINGS_STARTING_BALANCE` (`tests/helpers/fixtures.js`) are passed as env
vars to the relevant webServer entries. So `npm test` alone is enough as long as
Postgres is already up and migrated:

```sh
cd ../GSB-Salak-Backend
docker compose up -d
go run ./cmd/migrate up
```

**Every spec registers its own user** via `tests/helpers/auth.js`'s `registerFreshUser`
— registration (see `GSB-Salak-Backend`'s account-provisioning ticket) provisions all
three accounts atomically and funds savings from `REGISTRATION_SAVINGS_STARTING_BALANCE`,
so each test owns its own balances/holdings instead of contending over shared demo-user
state. Only `login.spec.js`/`register.spec.js` still use the real seeded demo user
(`tests/helpers/fixtures.js`'s `DEMO_USERNAME`/`DEMO_PASSWORD`), since they assert
against credentials that must already exist (a wrong-password rejection, a
duplicate-username conflict) — seeding via `SEED_DEMO_DATA=true go run ./cmd/seed` is
only needed for those two specs. There is no `globalSetup.js` — nothing resets shared
state anymore, because nothing shares state. `fullyParallel`/`workers` are unset
(Playwright's parallel defaults apply): the fresh-user-per-test fixture removed the
constraint that previously forced serial execution. The one exception, if a future spec
ever manipulates `salak.draw_dates` or `salak.products` (both still globally shared),
is that it would need to stay serial or run isolated deliberately — no such spec exists
in this suite yet.

**No unit or component tests exist yet** — there's no `vitest`/`jest` or
`@testing-library/react` configured, only Playwright. `src/lib/format.ts` (pure
formatting logic with real edge cases: `NaN` amounts, account numbers ≤8 chars, invalid
ISO date strings) and component-level behavior (`ProtectedRoute` redirect logic, form
validation states in `BuySalak.tsx`) are currently only exercised indirectly through the
E2E suite. Add a Vite-compatible test runner (`vitest` + `@testing-library/react` +
`jsdom`) before writing these rather than reaching for Playwright for logic that
doesn't need a real browser.
