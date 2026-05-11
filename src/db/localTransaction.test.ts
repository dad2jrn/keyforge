import { describe, expect, it } from 'vitest';
import { applyMigrations, countRows, getCurrentSchemaVersion, LocalTransactionHelper, type LocalDatabaseLike } from './localTransaction';
import type { LocalMigration } from '../migrations/localMigrations';

type ObjectQuery = { readonly sql: string; readonly rowMode: 'object'; readonly returnValue: 'resultRows' };

class MemoryDatabase implements LocalDatabaseLike {
    readonly auditLogRows: string[] = [];
    readonly diagnosticRows: string[] = [];
    readonly migrationRows: number[] = [];
    private snapshot: Pick<MemoryDatabase, 'auditLogRows' | 'diagnosticRows' | 'migrationRows'> | null = null;

    exec(sql: string | readonly string[]): unknown;
    exec<T extends Record<string, unknown>>(options: ObjectQuery): T[];
    exec(sqlOrOptions: string | readonly string[] | ObjectQuery): unknown {
        if (typeof sqlOrOptions === 'object' && !Array.isArray(sqlOrOptions) && 'sql' in sqlOrOptions) {
            if (sqlOrOptions.sql.includes('SELECT version FROM schema_migrations')) {
                return this.migrationRows.map((version) => ({ version }));
            }
            return [];
        }

        const statements = Array.isArray(sqlOrOptions) ? sqlOrOptions : [sqlOrOptions];
        for (const statement of statements) {
            this.applyStatement(statement);
        }
        return this;
    }

    selectValue(sql: string): unknown {
        if (sql.includes('MAX(version)')) {
            return Math.max(0, ...this.migrationRows);
        }
        if (sql.includes('COUNT(*) FROM audit_log')) {
            return this.auditLogRows.length;
        }
        if (sql.includes('COUNT(*) FROM diagnostic_writes')) {
            return this.diagnosticRows.length;
        }
        return undefined;
    }

    private applyStatement(statement: string): void {
        if (statement.includes('BEGIN')) {
            this.snapshot = {
                auditLogRows: [...this.auditLogRows],
                diagnosticRows: [...this.diagnosticRows],
                migrationRows: [...this.migrationRows],
            };
            return;
        }
        if (statement.includes('ROLLBACK')) {
            if (this.snapshot) {
                this.auditLogRows.splice(0, this.auditLogRows.length, ...this.snapshot.auditLogRows);
                this.diagnosticRows.splice(0, this.diagnosticRows.length, ...this.snapshot.diagnosticRows);
                this.migrationRows.splice(0, this.migrationRows.length, ...this.snapshot.migrationRows);
            }
            this.snapshot = null;
            return;
        }
        if (statement.includes('COMMIT')) {
            this.snapshot = null;
            return;
        }
        if (statement.includes('INSERT INTO audit_log')) {
            this.auditLogRows.push(statement);
            return;
        }
        if (statement.includes('INSERT INTO diagnostic_writes')) {
            this.diagnosticRows.push(statement);
            return;
        }
        if (statement.includes('INSERT INTO schema_migrations')) {
            const version = Number(statement.match(/VALUES \((\d+)/)?.[1] ?? 0);
            this.migrationRows.push(version);
        }
    }
}

describe('LocalTransactionHelper', () => {
    it('rolls back domain and audit writes together when the transaction fails', () => {
        const db = new MemoryDatabase();
        const helper = new LocalTransactionHelper(db);

        expect(() => helper.transaction(() => {
            db.exec("INSERT INTO diagnostic_writes (id) VALUES ('1');");
            helper.writeAuditEvent({ entityType: 'diagnostic_writes', entityId: '1', action: 'create', note: 'same tx' });
            throw new Error('fail');
        })).toThrow('fail');

        expect(countRows(db, 'diagnostic_writes')).toBe(0);
        expect(countRows(db, 'audit_log')).toBe(0);
    });

    it('prevents nested transaction misuse', () => {
        const helper = new LocalTransactionHelper(new MemoryDatabase());

        expect(() => helper.transaction(() => helper.transaction(() => undefined))).toThrow('Nested database transactions are not allowed');
    });
});

describe('applyMigrations', () => {
    it('runs migrations in order and exposes the current schema version', () => {
        const db = new MemoryDatabase();
        const migrations: readonly LocalMigration[] = [
            { version: 2, description: 'second', statements: ['CREATE TABLE two;'] },
            { version: 1, description: 'first', statements: ['CREATE TABLE one;'] },
        ];

        expect(applyMigrations(db, migrations)).toBe(2);
        expect(db.migrationRows).toEqual([1, 2]);
        expect(getCurrentSchemaVersion(db)).toBe(2);
    });

    it('rolls back a failed migration', () => {
        class FailingMigrationDatabase extends MemoryDatabase {
            override exec(sql: string | readonly string[]): unknown;
            override exec<T extends Record<string, unknown>>(options: ObjectQuery): T[];
            override exec(sqlOrOptions: string | readonly string[] | ObjectQuery): unknown {
                if (typeof sqlOrOptions === 'string' && sqlOrOptions.includes('BROKEN')) {
                    throw new Error('broken migration');
                }
                if (typeof sqlOrOptions === 'object' && !Array.isArray(sqlOrOptions) && 'sql' in sqlOrOptions) {
                    return super.exec(sqlOrOptions);
                }
                return super.exec(sqlOrOptions);
            }
        }

        const db = new FailingMigrationDatabase();

        expect(() => applyMigrations(db, [{ version: 1, description: 'broken', statements: ['BROKEN;'] }])).toThrow('broken migration');
        expect(getCurrentSchemaVersion(db)).toBe(0);
    });
});