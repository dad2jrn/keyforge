import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import type { DatabaseCompatibility, DatabaseDiagnostics } from '../domain/database';
import type { SqliteWorkerRequest, SqliteWorkerResponse } from '../db/sqliteProtocol';

type SqliteModule = Awaited<ReturnType<typeof sqlite3InitModule>>;
type DiagnosticDatabase = InstanceType<SqliteModule['oo1']['DB']>;

interface DatabaseState {
    readonly sqlite3: SqliteModule;
    readonly db: DiagnosticDatabase;
    readonly compatibility: DatabaseCompatibility;
}

let statePromise: Promise<DatabaseState> | null = null;

self.addEventListener('message', (event: MessageEvent<SqliteWorkerRequest>) => {
    void respond(event.data);
});

async function respond(request: SqliteWorkerRequest): Promise<void> {
    try {
        const payload = await handleRequest(request);
        postMessage({ id: request.id, ok: true, type: request.type, payload } satisfies SqliteWorkerResponse);
    } catch (error) {
        postMessage({ id: request.id, ok: false, error: readableError(error) } satisfies SqliteWorkerResponse);
    }
}

async function handleRequest(request: SqliteWorkerRequest): Promise<DatabaseDiagnostics> {
    switch (request.type) {
        case 'diagnostics':
            return getDiagnostics();
    }
}

async function getState(): Promise<DatabaseState> {
    statePromise ??= initializeDatabase();
    return statePromise;
}

async function initializeDatabase(): Promise<DatabaseState> {
    assertWebAssemblySupport();

    const sqlite3 = await sqlite3InitModule();
    const db = new sqlite3.oo1.DB(':memory:', 'c');

    return {
        sqlite3,
        db,
        compatibility: buildCompatibility(sqlite3),
    };
}

async function getDiagnostics(): Promise<DatabaseDiagnostics> {
    try {
        const state = await getState();
        const version = state.db.selectValue('SELECT sqlite_version();');
        const testQueryValue = state.db.selectValue('SELECT 1 + 1;');

        return {
            status: 'ready',
            sqliteVersion: typeof version === 'string' ? version : state.sqlite3.version.libVersion,
            testQueryValue: typeof testQueryValue === 'number' ? testQueryValue : Number(testQueryValue),
            compatibility: state.compatibility,
            error: null,
        };
    } catch (error) {
        return {
            status: isUnsupportedError(error) ? 'unsupported' : 'error',
            sqliteVersion: null,
            testQueryValue: null,
            compatibility: fallbackCompatibility(readableError(error)),
            error: readableError(error),
        };
    }
}

function assertWebAssemblySupport(): void {
    if (typeof WebAssembly === 'undefined') {
        throw new Error('SQLite WASM is unsupported in this browser because WebAssembly is unavailable.');
    }
}

function buildCompatibility(sqlite3: SqliteModule): DatabaseCompatibility {
    const crossOriginIsolated = Boolean(self.crossOriginIsolated);
    const opfsAvailable = 'opfs' in sqlite3 && typeof sqlite3.oo1.OpfsDb === 'function';
    const warnings = [
        ...(!crossOriginIsolated ? ['Cross-origin isolation is unavailable; this diagnostic uses an in-memory SQLite database.'] : []),
        ...(!opfsAvailable ? ['OPFS persistence is unavailable; this diagnostic uses an in-memory SQLite database.'] : []),
    ];

    return {
        opfsAvailable,
        crossOriginIsolated,
        workerAvailable: true,
        warnings,
    };
}

function fallbackCompatibility(message: string): DatabaseCompatibility {
    return {
        opfsAvailable: false,
        crossOriginIsolated: Boolean(self.crossOriginIsolated),
        workerAvailable: true,
        warnings: [message],
    };
}

function isUnsupportedError(error: unknown): boolean {
    return readableError(error).toLowerCase().includes('unsupported');
}

function readableError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
