export type DatabaseStatus = 'ready' | 'unsupported' | 'error';

export interface DatabaseCompatibility {
    readonly opfsAvailable: boolean;
    readonly crossOriginIsolated: boolean;
    readonly workerAvailable: boolean;
    readonly warnings: readonly string[];
}

export interface DatabaseDiagnostics {
    readonly status: DatabaseStatus;
    readonly sqliteVersion: string | null;
    readonly testQueryValue: number | null;
    readonly compatibility: DatabaseCompatibility;
    readonly error: string | null;
}