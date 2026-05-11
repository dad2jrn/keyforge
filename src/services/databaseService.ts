import { SqliteWorkerClient, type DatabaseClient } from '../db/sqliteClient';
import type { DatabaseDiagnostics } from '../domain/database';

export interface DatabaseSummary {
    readonly diagnostics: DatabaseDiagnostics;
}

export class DatabaseService {
    constructor(private readonly client: DatabaseClient) { }

    async getSummary(): Promise<DatabaseSummary> {
        return { diagnostics: await this.client.getDiagnostics() };
    }
}

let diagnosticsService: DatabaseService | null = null;

export function getDiagnosticsService(): DatabaseService {
    diagnosticsService ??= new DatabaseService(new SqliteWorkerClient());
    return diagnosticsService;
}