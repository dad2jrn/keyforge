export interface LocalMigration {
    readonly version: number;
    readonly description: string;
    readonly statements: readonly string[];
}

export const localMigrations: readonly LocalMigration[] = [
    {
        version: 1,
        description: 'Create Epic 1 diagnostics, audit log, and migration metadata.',
        statements: [
            `CREATE TABLE IF NOT EXISTS audit_log (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT,
        action TEXT NOT NULL,
        note TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        deleted_at TEXT,
        version INTEGER NOT NULL DEFAULT 1,
        dirty INTEGER NOT NULL DEFAULT 1,
        last_synced_at TEXT
      );`,
            `CREATE TABLE IF NOT EXISTS diagnostic_writes (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        deleted_at TEXT,
        version INTEGER NOT NULL DEFAULT 1,
        dirty INTEGER NOT NULL DEFAULT 1,
        last_synced_at TEXT
      );`,
        ],
    },
];

export const latestLocalSchemaVersion = Math.max(...localMigrations.map((migration) => migration.version));