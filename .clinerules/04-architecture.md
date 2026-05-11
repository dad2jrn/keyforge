# Architecture Rule

## Dependency Direction

React components must not call SQLite directly.

```text
pages / ui components
  -> services
  -> repository interfaces
  -> local SQLite implementation (db + workers)
```

Workers are the only code that touches SQLite WASM. Services talk to repositories. UI talks to services. Never skip a layer.

## Module Responsibilities

| Module | Responsibility | May Import |
|--------|---------------|-----------|
| `src/pages/` | Routed page views | `src/ui/`, `src/services/`, `src/app/` |
| `src/ui/` | Reusable React components | `src/services/`, `src/app/`, `src/domain/` |
| `src/services/` | Application workflows | `src/repositories/`, `src/domain/`, `src/crypto/`, `src/reports/`, `src/validation/` |
| `src/repositories/` | Data access interfaces + local implementations | `src/db/`, `src/domain/` |
| `src/db/` | SQLite client, protocol, transactions | `src/workers/` (message protocol only) |
| `src/workers/` | SQLite WASM + OPFS | Nothing from `src/` except protocol types |
| `src/domain/` | Domain types and rules | Nothing from `src/` (pure types/logic) |
| `src/crypto/` | Web Crypto backup/restore | `src/domain/` |
| `src/migrations/` | Schema migration definitions | `src/db/` |
| `src/validation/` | Validation types and helpers | `src/domain/` |
| `src/reports/` | Report descriptors and generation | `src/domain/`, `src/repositories/` |
| `src/sync/` | Future sync posture (stub) | `src/repositories/`, `src/domain/` |
| `src/app/` | App shell, routing, providers, config | `src/ui/`, `src/services/`, `src/domain/` |

## Key Patterns

- Domain logic lives outside UI components. Calculations, validation, and business rules belong in `domain/` or `services/`.
- Writes must be transactional. Use the transaction helper in `src/db/localTransaction.ts`.
- Audit-log writes must happen in the same transaction as the domain write they record.
- Use stable client-generated UUIDs as primary IDs. Do not rely on autoincrement integers as application identity.
- Use soft deletes (`deleted_at`). Hard purge is advanced-only.
- Every domain table should be designed for future sync: `id`, `created_at`, `updated_at`, `deleted_at`, `version`, `dirty`, `last_synced_at`.

## Version 2 Migration Posture

- Repository interfaces must be the boundary between the UI stack and the data layer.
- A future remote or D1 repository can implement the same interfaces without touching UI or service code.
- The `src/sync/` module is a stub for the future Cloudflare Worker + D1 sync adapter.
- Do not couple any service or UI code to SQLite implementation details.
