# Active Context

## Current Milestone

**Milestone 1: Secure Local Skeleton** — in progress.

Milestone 1 goal: GitHub Pages deployment, SQLite WASM in browser, OPFS persistence, encryption export/import, lock/unlock, empty schema migrations.

## What Is Built

### Epic 0 — Project Foundation (largely complete)

- Project scaffold created: Vite + React + TypeScript + Vitest.
- App shell with sidebar navigation and routing.
- Module boundary structure in place (`domain`, `db`, `repositories`, `services`, `crypto`, `sync`, `ui`, `reports`, `validation`, `migrations`, `workers`, `pages`, `styles`).
- Global CSS theme system: tokens, themes, base, layout, components, utilities, print.
- Dark and light theme working with `html[data-theme]`.
- Theme toggle in top bar (System / Dark / Light).
- Theme preference stored in localStorage only.
- Lock/unlock system: `LockProvider`, `UnlockPage`, `LockButton`.
- Manual lock button accessible from all pages.
- Security state module (`securityState.ts`) with masking support.
- GitHub Pages deployment workflow: `.github/workflows/pages.yml`.
- Sensitive file scan scripts: `scan-sensitive-files.mjs`, `scan-sample-data.mjs`.
- Pre-commit hook installer: `install-git-hooks.mjs`.
- `.gitignore` blocks all sensitive file extensions.
- `docs/security-data-policy.md` and `docs/deployment.md` created.

### Epic 1 — Local SQLite Engine (in progress)

- `@sqlite.org/sqlite-wasm` installed.
- SQLite WASM worker: `src/workers/sqliteWorker.ts`.
- SQLite client: `src/db/sqliteClient.ts` + `sqliteProtocol.ts`.
- Diagnostics page proves SQLite version and worker communication.
- Transaction helper: `src/db/localTransaction.ts`.
- Migration system: `src/migrations/localMigrations.ts` + `migrations/index.ts`.
- OPFS persistence: implemented inside the worker, needs verification.

### Epic 2 — Encryption and Backup (stub)

- `src/crypto/index.ts` exists (stub or partial).

### Pages Scaffolded (UI shells, no data yet)

- Dashboard
- Customers / Sites
- Key Systems
- Cylinders
- Keyholders
- Backup / Security
- Reports
- Pin Calculator
- Settings
- Diagnostics

## Current Focus

Completing Milestone 1:

1. Verify OPFS persistence survives page refresh (Story 1.2).
2. Confirm migration system runs in order and rolls back on failure (Story 1.4).
3. Implement encrypted backup export/import (Epic 2).
4. Implement auto-lock (Story 2.6).

## Known Issues

- `docs/security-data-policy.md` appears to have corrupted text (repeated characters in first line). Should be rewritten.
- `src/crypto/index.ts` may be a stub — encrypted backup not yet functional.

## Next Steps After Milestone 1

Milestone 2: Core domain schema — customers, sites, openings, key systems, key platforms, keys, cylinders, audit log.
