export type DatabaseStatus = 'initializing' | 'ready' | 'degraded' | 'error';

export type DatabaseStorageMode = 'opfs' | 'transient';

export interface DatabaseCompatibility {
    readonly opfsAvailable: boolean;
    readonly crossOriginIsolated: boolean;
    readonly workerAvailable: boolean;
    readonly warnings: readonly string[];
}

export interface DatabaseDiagnostics {
    readonly status: DatabaseStatus;
    readonly sqliteVersion: string | null;
    readonly storageMode: DatabaseStorageMode | null;
    readonly databasePath: string | null;
    readonly schemaVersion: number | null;
    readonly latestMigrationVersion: number;
    readonly testQueryValue: number | null;
    readonly compatibility: DatabaseCompatibility;
    readonly error: string | null;
}

export interface DiagnosticWriteResult {
    readonly inserted: boolean;
    readonly diagnosticWriteCount: number;
    readonly auditLogCount: number;
}

export interface TransactionProbeResult {
    readonly rolledBack: boolean;
    readonly preventedNestedTransaction: boolean;
    readonly diagnosticWriteCount: number;
    readonly auditLogCount: number;
}