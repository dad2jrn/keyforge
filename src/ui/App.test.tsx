import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('../db/sqliteClient', () => ({
  SqliteWorkerClient: class {
    async getDiagnostics() {
      return {
        status: 'ready',
        sqliteVersion: '3.test',
        storageMode: 'opfs',
        databasePath: '/keyforge-local.sqlite3',
        schemaVersion: 1,
        latestMigrationVersion: 1,
        testQueryValue: 2,
        compatibility: {
          opfsAvailable: true,
          crossOriginIsolated: true,
          workerAvailable: true,
          warnings: [],
        },
        error: null,
      };
    }

    async recordDiagnosticWrite() {
      return { inserted: true, diagnosticWriteCount: 1, auditLogCount: 1 };
    }

    async runRollbackProbe() {
      return { rolledBack: true, preventedNestedTransaction: true, diagnosticWriteCount: 1, auditLogCount: 1 };
    }
  },
}));

describe('App', () => {
  it('renders Epic 1 SQLite diagnostics behind the service boundary', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Project Foundation' })).toBeInTheDocument();
    expect(await screen.findByText('Vite static app')).toBeInTheDocument();
    expect(await screen.findByText('3.test')).toBeInTheDocument();
    expect(screen.getByText('Passed (SELECT 1 + 1)')).toBeInTheDocument();
    expect(screen.getByText('SQLite WASM, OPFS persistence, transactions, and migrations')).toBeInTheDocument();
    expect(screen.getByText(/This repository must never contain real customer names/)).toBeInTheDocument();
  });
});
