# Database Rule

## SQLite Baseline

Always enable foreign keys:

```sql
PRAGMA foreign_keys = ON;
```

This must be the first statement executed after opening the database.

## Table Design for All Domain Tables

Every syncable domain table must include these columns:

```sql
id            TEXT PRIMARY KEY   -- stable client-generated UUID, not autoincrement
tenant_id     TEXT               -- nullable in V1; required for V2 multi-tenant
created_at    TEXT NOT NULL      -- ISO-8601 timestamp
updated_at    TEXT NOT NULL      -- ISO-8601 timestamp
deleted_at    TEXT               -- null = active, non-null = soft-deleted
version       INTEGER NOT NULL DEFAULT 1  -- optimistic concurrency / sync version
dirty         INTEGER NOT NULL DEFAULT 1  -- 1 = needs sync, 0 = synced
last_synced_at TEXT              -- null until V2 sync is active
```

## IDs

- Use stable client-generated UUIDs (`crypto.randomUUID()`) as the primary key.
- Never use SQLite `ROWID` or `INTEGER PRIMARY KEY AUTOINCREMENT` as the application's primary identity.
- Foreign keys between tables must use the UUID `id`, not an integer.

## Soft Deletes

- Delete by setting `deleted_at` to an ISO-8601 timestamp, not by removing the row.
- All queries must filter `WHERE deleted_at IS NULL` unless the query intentionally includes deleted records.
- Hard purge (physical row removal) is advanced-only and must be audited.

## Migrations

- All schema changes go through the migration system in `src/migrations/localMigrations.ts`.
- Migrations run in ascending order by version number.
- A failed migration must roll back completely.
- The current schema version must be visible in the Diagnostics page.
- Never alter production tables outside of a migration.

## Audit Log

The `audit_log` table is append-only. Never update or delete audit log rows.

Audit entries must include:

- `id` (UUID)
- `tenant_id`
- `created_at`
- `action` (what happened)
- `entity_type` (what was affected)
- `entity_id` (which record)
- `actor` (who did it — local user in V1)
- `before_json` (serialized before-state where applicable)
- `after_json` (serialized after-state where applicable)
- `note` (freeform reason or override justification)

## Tenant Boundary

The `tenants` table exists in V1 with a single default local tenant. Every domain record should carry a `tenant_id` so V2 multi-tenant queries remain tenant-scoped without a schema migration.

## Change Log

The `change_log` table records write events for future sync use. Each write appends a change event with a sequence number, entity type, entity ID, operation type, and timestamp. Do not use it for reads or reports.
