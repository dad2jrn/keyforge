import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import type { DatabaseCompatibility, DatabaseDiagnostics, DiagnosticWriteResult, TransactionProbeResult } from '../domain/database';
import { latestLocalSchemaVersion, localMigrations } from '../migrations/localMigrations';
import type { SqliteWorkerRequest, SqliteWorkerResponse } from '../db/sqliteProtocol';
import { applyMigrations, countRows, getCurrentSchemaVersion, LocalTransactionHelper, type LocalDatabaseLike } from '../db/localTransaction';

type SqliteModule = Awaited<ReturnType<typeof sqlite3InitModule>>;

interface DatabaseState {
    readonly sqlite3: SqliteModule;
    readonly db: LocalDatabaseLike & { readonly filename: string };
    readonly storageMode: 'opfs' | 'transient';
    readonly compatibility: DatabaseCompatibility;
}

const databasePath = '/keyforge-local.sqlite3';
let statePromise: Promise<DatabaseState> | null = null;

self.addEventListener('message', (event: MessageEvent<SqliteWorkerRequest>) => {
    void respond(event.data);
});

async function respond(request: SqliteWorkerRequest): Promise<void> {
    try {
        const payload = await handleRequest(request);
        postMessage({ id: request.id, ok: true, type: request.type, payload } as SqliteWorkerResponse);
    } catch (error) {
        postMessage({ id: request.id, ok: false, error: error instanceof Error ? error.message : String(error) } as SqliteWorkerResponse);
    }
}

async function handleRequest(request: SqliteWorkerRequest) {
    switch (request.type) {
        case 'diagnostics':
            return getDiagnostics();
        case 'recordDiagnosticWrite':
            return recordDiagnosticWrite(request.message);
        case 'runRollbackProbe':
            return runRollbackProbe();
    }
}

async function getState(): Promise<DatabaseState> {
    statePromise ??= initializeDatabase();
    return statePromise;
}

async function initializeDatabase(): Promise<DatabaseState> {
    const sqlite3 = await sqlite3InitModule();
    const compatibility = buildCompatibility(sqlite3);
    const hasOpfs = 'opfs' in sqlite3 && typeof sqlite3.oo1.OpfsDb === 'function';
    const db = hasOpfs
        ? new sqlite3.oo1.OpfsDb(databasePath, 'c') as LocalDatabaseLike & { readonly filename: string }
        : new sqlite3.oo1.DB(':memory:', 'c') as LocalDatabaseLike & { readonly filename: string };

    db.exec('PRAGMA foreign_keys = ON;');
    applyMigrations(db, localMigrations);

    return {
        sqlite3,
        db,
        storageMode: hasOpfs ? 'opfs' : 'transient',
        compatibility,
    };
}

async function getDiagnostics(): Promise<DatabaseDiagnostics> {
    try {
        const state = await getState();
        const testQueryValue = Number(state.db.selectValue('SELECT 1 + 1;') ?? 0);
        const schemaVersion = getCurrentSchemaVersion(state.db);

        return {
            status: state.storageMode === 'opfs' ? 'ready' : 'degraded',
            sqliteVersion: state.sqlite3.version.libVersion,
            storageMode: state.storageMode,
            databasePath: state.db.filename,
            schemaVersion,
            latestMigrationVersion: latestLocalSchemaVersion,
            testQueryValue,
            compatibility: state.compatibility,
            error: null,
        };
    } catch (error) {
        return {
            status: 'error',
            sqliteVersion: null,
            storageMode: null,
            databasePath: null,
            schemaVersion: null,
            latestMigrationVersion: latestLocalSchemaVersion,
            testQueryValue: null,
            compatibility: fallbackCompatibility(),
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

async function recordDiagnosticWrite(message: string): Promise<DiagnosticWriteResult> {
    const { db } = await getState();
    const helper = new LocalTransactionHelper(db);
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    helper.transaction(() => {
        db.exec(`INSERT INTO diagnostic_writes (id, tenant_id, message, created_at, updated_at)
            VALUES ('${id}', 'local', '${message.replaceAll("'", "''")}', '${now}', '${now}');`);
        helper.writeAuditEvent({
            entityType: 'diagnostic_writes',
            entityId: id,
            action: 'create',
            note: 'Diagnostic write committed with audit event in the same transaction.',
        });
    });

    return {
        inserted: true,
        diagnosticWriteCount: countRows(db, 'diagnostic_writes'),
        auditLogCount: countRows(db, 'audit_log'),
    };
}

async function runRollbackProbe(): Promise<TransactionProbeResult> {
    const { db } = await getState();
    const helper = new LocalTransactionHelper(db);
    const beforeDiagnostics = countRows(db, 'diagnostic_writes');
    const beforeAudit = countRows(db, 'audit_log');
    let preventedNestedTransaction = false;

    try {
        helper.transaction(() => {
            preventedNestedTransaction = catchNestedTransaction(helper);
            const now = new Date().toISOString();
            db.exec(`INSERT INTO diagnostic_writes (id, tenant_id, message, created_at, updated_at)
                VALUES ('${crypto.randomUUID()}', 'local', 'rollback probe', '${now}', '${now}');`);
            helper.writeAuditEvent({
                entityType: 'diagnostic_writes',
                entityId: null,
                action: 'rollback_probe',
                note: 'This audit event must roll back with the diagnostic write.',
            });
            throw new Error('Intentional rollback probe failure.');
        });
    } catch (error) {
        if (!(error instanceof Error) || error.message !== 'Intentional rollback probe failure.') {
            throw error;
        }
    }

    const afterDiagnostics = countRows(db, 'diagnostic_writes');
    const afterAudit = countRows(db, 'audit_log');

    return {
        rolledBack: beforeDiagnostics === afterDiagnostics && beforeAudit === afterAudit,
        preventedNestedTransaction,
        diagnosticWriteCount: afterDiagnostics,
        auditLogCount: afterAudit,
    };
}

function catchNestedTransaction(helper: LocalTransactionHelper): boolean {
    try {
        helper.transaction(() => undefined);
        return false;
    } catch {
        return true;
    }
}

function buildCompatibility(sqlite3: SqliteModule): DatabaseCompatibility {
    const crossOriginIsolated = Boolean(self.crossOriginIsolated);
    const opfsAvailable = 'opfs' in sqlite3 && typeof sqlite3.oo1.OpfsDb === 'function';
    const warnings = [
        ...(!crossOriginIsolated ? ['Cross-origin isolation is unavailable; OPFS may not be usable in this browser/session.'] : []),
        ...(!opfsAvailable ? ['OPFS persistence is unavailable; the database is running in transient storage.'] : []),
    ];

    return {
        opfsAvailable,
        crossOriginIsolated,
        workerAvailable: true,
        warnings,
    };
}

function fallbackCompatibility(): DatabaseCompatibility {
    return {
        opfsAvailable: false,
        crossOriginIsolated: Boolean(self.crossOriginIsolated),
        workerAvailable: true,
        warnings: ['SQLite WASM failed to initialize.'],
    };
}