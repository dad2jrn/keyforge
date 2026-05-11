import type { LocalMigration } from '../migrations/localMigrations';

export interface LocalDatabaseLike {
    exec(sql: string | readonly string[]): unknown;
    exec<T extends Record<string, unknown>>(options: {
        readonly sql: string;
        readonly rowMode: 'object';
        readonly returnValue: 'resultRows';
        readonly bind?: readonly unknown[] | Record<string, unknown>;
    }): T[];
    selectValue(sql: string, bind?: readonly unknown[] | Record<string, unknown>): unknown;
}

export interface AuditEventInput {
    readonly entityType: string;
    readonly entityId: string | null;
    readonly action: string;
    readonly note: string;
}

export class NestedTransactionError extends Error {
    constructor() {
        super('Nested database transactions are not allowed. Use a single service-level transaction boundary.');
        this.name = 'NestedTransactionError';
    }
}

export class LocalTransactionHelper {
    private transactionActive = false;

    constructor(private readonly db: LocalDatabaseLike) { }

    transaction<T>(callback: () => T): T {
        if (this.transactionActive) {
            throw new NestedTransactionError();
        }

        this.transactionActive = true;
        this.db.exec('BEGIN IMMEDIATE;');
        try {
            const result = callback();
            this.db.exec('COMMIT;');
            return result;
        } catch (error) {
            this.db.exec('ROLLBACK;');
            throw error;
        } finally {
            this.transactionActive = false;
        }
    }

    writeAuditEvent(event: AuditEventInput): void {
        const now = new Date().toISOString();
        this.db.exec(`INSERT INTO audit_log (
            id, tenant_id, entity_type, entity_id, action, note, created_at, updated_at
        ) VALUES (
            '${crypto.randomUUID()}', 'local', '${escapeSql(event.entityType)}', ${nullableSql(event.entityId)},
            '${escapeSql(event.action)}', '${escapeSql(event.note)}', '${now}', '${now}'
        );`);
    }
}

export function ensureMigrationTable(db: LocalDatabaseLike): void {
    db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        description TEXT NOT NULL,
        applied_at TEXT NOT NULL
    );`);
}

export function applyMigrations(db: LocalDatabaseLike, migrations: readonly LocalMigration[]): number {
    const helper = new LocalTransactionHelper(db);
    ensureMigrationTable(db);

    const appliedVersions = new Set(
        db.exec<{ version: number }>({
            sql: 'SELECT version FROM schema_migrations ORDER BY version;',
            rowMode: 'object',
            returnValue: 'resultRows',
        }).map((row) => Number(row.version)),
    );

    for (const migration of [...migrations].sort((left: LocalMigration, right: LocalMigration) => left.version - right.version)) {
        if (appliedVersions.has(migration.version)) {
            continue;
        }

        helper.transaction(() => {
            for (const statement of migration.statements) {
                db.exec(statement);
            }
            db.exec(`INSERT INTO schema_migrations (version, description, applied_at)
                VALUES (${migration.version}, '${escapeSql(migration.description)}', '${new Date().toISOString()}');`);
        });
    }

    return getCurrentSchemaVersion(db);
}

export function getCurrentSchemaVersion(db: LocalDatabaseLike): number {
    ensureMigrationTable(db);
    return Number(db.selectValue('SELECT COALESCE(MAX(version), 0) FROM schema_migrations;') ?? 0);
}

export function countRows(db: LocalDatabaseLike, tableName: 'audit_log' | 'diagnostic_writes'): number {
    return Number(db.selectValue(`SELECT COUNT(*) FROM ${tableName};`) ?? 0);
}

export function escapeSql(value: string): string {
    return value.replaceAll("'", "''");
}

function nullableSql(value: string | null): string {
    return value === null ? 'NULL' : `'${escapeSql(value)}'`;
}