# Tech Context

## Current Stack

- Vite
- React
- TypeScript (strict mode)
- Vitest + @testing-library/react
- jsdom (test environment)
- GitHub CLI
- GitHub PR workflow
- GitHub Pages target deployment
- `@sqlite.org/sqlite-wasm` (installed, active)
- OPFS persistence (in progress, via sqliteWorker)
- Web Worker database layer (active — `src/workers/sqliteWorker.ts`)
- Web Crypto API (in progress — `src/crypto/index.ts`)

## Planned Stack Additions

- Zod or Valibot for domain validation
- Playwright (E2E, deferred)
- Cloudflare Worker + D1 (Version 2)

## Important Notes

- `PLAN.md` and `STYLE.md` are in `.gitignore` — they are local-only source-of-truth files, not committed.
- Pre-commit hooks block sensitive file types. Install with `npm run prepare-hooks`.
- Build scans for sensitive files: `npm run scan:sensitive` and `npm run scan:samples`.

## Common Commands

```bash
npm run dev            # local dev server
npm run build          # type-check + sensitive scan + vite build
npm test               # vitest run (single pass)
npm run test:watch     # vitest watch
npm run scan:sensitive # scan for banned file extensions
npm run scan:samples   # scan for realistic sample data
npm run prepare-hooks  # install git pre-commit hooks
```

## Module Boundaries

```text
src/
  app/        — app shell, routing, lock/theme providers, navigation config
  domain/     — domain types, foundation types, no SQLite imports
  db/         — SQLite-facing boundary (client, protocol, transactions)
  repositories/ — repository interfaces + local SQLite implementations
  services/   — application workflow services, depend on repository interfaces
  validation/ — validation issue types and validation helpers
  crypto/     — Web Crypto backup and encryption boundary
  reports/    — report descriptors and generation boundary
  sync/       — future sync/D1 posture (stub)
  ui/         — React UI components (use global styles, call services only)
  migrations/ — schema migration definitions
  workers/    — Web Worker boundary for SQLite WASM and OPFS
  pages/      — page-level React components (routed views)
  styles/     — global CSS token/theme/component system
```
