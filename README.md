# GSB-Salak-Frontend

A Vite + React 19 + TypeScript SPA for the "Digital Salak" core flow: register, log
in, view accounts, view Salak products, buy Salak, view holdings, view transaction
history. Talks to `GSB-Salak-Backend`'s HTTP API; no other backend.

```sh
npm install
cp .env.example .env   # override VITE_API_BASE_URL if the API isn't on :8080
npm run dev             # http://localhost:5174
```

See `CLAUDE.md` for architecture, the API-contract mirroring caveat, and how to run
the Playwright E2E suite (`npm test`).
