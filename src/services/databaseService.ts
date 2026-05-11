import type { DatabaseDiagnostics, DiagnosticWriteResult, TransactionProbeResult } from '../domain/database';
import type { DatabaseClient } from '../db/sqliteClient';

export interface DatabaseSummary {
    readonly diagnostics: DatabaseDiagnostics;
}

export class DatabaseService {
    constructor(private readonly client: DatabaseClient) { }

    async getSummary(): Promise<DatabaseSummary> {
        return { diagnostics: await this.client.getDiagnostics() };
    }

    recordDiagnosticWrite(message: string): Promise<DiagnosticWriteResult> {
        return this.client.recordDiagnosticWrite(message);
    }

    runRollbackProbe(): Promise<TransactionProbeResult> {
        return this.client.runRollbackProbe();
    }
}