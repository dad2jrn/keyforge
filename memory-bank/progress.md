# Progress

## Current Milestone

**Milestone 1: Secure Local Skeleton** — in progress.

---

## Epic 0 — Project Foundation

| Story | Status | Notes |
|-------|--------|-------|
| 0.1 Create project scaffold | ✅ Done | Vite + React + TS + Vitest |
| 0.2 GitHub Pages deployment | ✅ Done | `.github/workflows/pages.yml` exists |
| 0.3 Sensitive data repository protections | ✅ Done | `.gitignore`, scan scripts, pre-commit hooks |
| 0.4 Define app module boundaries | ✅ Done | All modules present in `src/` |

---

## Epic 1 — Local SQLite Engine

| Story | Status | Notes |
|-------|--------|-------|
| 1.1 Initialize SQLite WASM | ✅ Done | Worker + diagnostics page prove SQLite version |
| 1.2 Add OPFS persistence | 🔄 In progress | Worker implements OPFS; page-refresh survival needs verification |
| 1.3 Add database transaction helper | 🔄 In progress | `src/db/localTransaction.ts` exists; unit tests needed |
| 1.4 Add schema migration system | 🔄 In progress | `src/migrations/localMigrations.ts` exists; rollback behavior needs tests |

---

## Epic 2 — Encryption and Backup

| Story | Status | Notes |
|-------|--------|-------|
| 2.1 Create encrypted backup format | ⬜ Not started | `src/crypto/index.ts` may be stub |
| 2.2 Passphrase-based key derivation | ⬜ Not started | |
| 2.3 Backup encryption | ⬜ Not started | |
| 2.4 Backup import | ⬜ Not started | |
| 2.5 Manual lock | ✅ Done | LockProvider + LockButton working |
| 2.6 Auto-lock | ⬜ Not started | |
| 2.7 Backup reminders | ⬜ Not started | |

---

## Epics 3–15 — Not started

All remaining epics (Core Domain Schema, Key Hierarchy, Cylinders, Keyholder, Rekey, Reporting, Search, Security UX, Data Import/Export, Cloud Readiness, SaaS Migration, Testing, Documentation) are not started.

See `PLAN.md` for full epic/story details.

---

## Milestone Checklist

### Milestone 1: Secure Local Skeleton

- [x] GitHub Pages deployment
- [x] SQLite WASM in browser
- [ ] OPFS persistence verified (page refresh survives)
- [ ] Encryption export/import working
- [ ] Lock/unlock complete
- [x] Manual lock
- [ ] Auto-lock
- [x] App shell and navigation
- [ ] Schema migrations verified (order, rollback)

### Milestone 2: Real Master-Key Data Model

- [ ] Customer/site model
- [ ] Openings
- [ ] Key systems
- [ ] Key platforms
- [ ] Keys (hierarchy)
- [ ] Cylinders
- [ ] Audit log

---

## Known Issues

- `docs/security-data-policy.md` has corrupted text in the first line (repeated characters). Needs rewrite.
- Encrypted backup (`src/crypto/index.ts`) may be a stub — functional encryption not confirmed.
- OPFS persistence across page refresh not yet verified against real browser behavior.
- Auto-lock not yet implemented.

---

## Completed Work Summary

- Full project scaffold with correct module boundaries.
- Global CSS design system (tokens, themes, layout, components, utilities, print).
- Dark and light theme working.
- App shell and sidebar navigation routing.
- Lock/unlock flow working.
- SQLite WASM worker proven via Diagnostics page.
- Transaction and migration modules scaffolded.
- GitHub Pages CI/CD in place.
- Security data scan scripts and pre-commit hooks in place.
