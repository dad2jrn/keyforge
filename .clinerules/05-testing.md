# Testing Rule

## Test Runner

Use Vitest. Run with:

```bash
npm test          # single pass
npm run test:watch  # watch mode
```

## Test Location

Tests live alongside their source file:

```text
src/app/LockProvider.tsx
src/app/LockProvider.test.tsx

src/db/sqliteClient.ts
src/db/sqliteClient.test.ts
```

Do not create a separate `__tests__/` directory. Keep tests co-located.

## What to Test

Priority test targets for this project:

1. **Locksmithing validation logic** (`src/domain/`, `src/validation/`) — cut count, depth range, MACS, duplicate bitting, parent-child hierarchy.
2. **Crypto** (`src/crypto/`) — correct passphrase decrypts, wrong passphrase fails, tampered ciphertext fails.
3. **Transaction and rollback** (`src/db/localTransaction.ts`) — failed write rolls back, audit log is in same transaction.
4. **Migration system** (`src/migrations/`) — migrations run in order, rollback on failure, schema version increments.
5. **Repository logic** — use real in-memory SQLite or mock repository interfaces, not mock SQL results.

## Do Not Mock the Database in Integration Tests

For transaction, migration, and repository integration tests, use a real in-memory SQLite instance or jsdom-compatible equivalent. Mocking the database layer masks real integration issues.

Unit tests of pure domain logic (validation, calculations) may use plain TypeScript inputs with no database involved.

## Security Regression Tests

Maintain these specific checks (see Story 14.5 in PLAN.md):

- No sensitive data in localStorage after operations.
- No raw DB file in build output.
- Sensitive values are hidden after lock.
- No bittings in console.log output.

## No Playwright Yet

Playwright E2E tests are deferred. Do not add Playwright until explicitly called for in the roadmap.
