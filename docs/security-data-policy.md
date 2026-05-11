# Security Data Policy

KeyForge Local manages sensitive physical access-control information. The application code may be public. Operational data must not be public.

## Never Commit

- Real customer, site, building, area, opening, or door- Real customer, site, building, area, opening, or door- Real customer, site, building, area, opening, or door- Real customer, site, building, area, opening, or door- Real customer, site, building, area, opening, or door- Real customer, site, building, area, opening, or door- Real customer, site, building, area, opening, or door- Real customer, site, building, area, opening, or door- Real customer, site, building, area, opening, or door- Real customer, site, building, area, opening, or door- Real customer, site, building, area, opening, or door- Real customer, site, building, area, opening, or door- Real customer, site, building, area, opening, or door- Real customer, site, building, area, opening, or door- Real customer, site, brsion 2 can add Cloudflare Worker + D1 sync without a rewrite.

## Module Boundaries

- `src/ui`: React components. Uses global style classes and calls services only.
- `src/services`: application workflows. Depends on repository interfaces.
- `src/repositories`: interfaces and local implementations.
- `src/domain`: domain types and rules.
- `src/db`: SQLite-facing boundary for Epic 1.
- `src/workers`: Web Worker boundary for SQLite WASM and OPFS.
- `src/crypto`: Web Crypto backup/encryption boundary.
- `src/sync`: future sync/D1 posture.
- `src/reports`: report descriptors and report generation boundary.
- `src/validation`: validation issue types and future validation functions.
- `src/migrations`: schema migration definitions.

React components must not call SQLite directly. SQLite access belongs behind workers, repositories, and services.
