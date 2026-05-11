import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    expect(screen.getByRole('combobox', { name: /Theme preference/ })).toBeInTheDocument();
    expect(await screen.findByText('Vite static app')).toBeInTheDocument();
    expect(await screen.findByText('3.test')).toBeInTheDocument();
    expect(screen.getByText('Passed (SELECT 1 + 1)')).toBeInTheDocument();
    expect(screen.getByText('SQLite WASM, OPFS persistence, transactions, and migrations')).toBeInTheDocument();
    expect(screen.getByText(/This repository must never contain real customer names/)).toBeInTheDocument();
  });

  it('redirects protected routes to unlock and hides sensitive placeholders until unlocked', async () => {
    window.location.hash = '#reports';

    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Unlock KeyForge Local' })).toBeInTheDocument();
    expect(screen.queryByText('Report Preview')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Unlock shell' }));

    expect(await screen.findByText('Report Preview')).toBeInTheDocument();
    expect(window.location.hash).toBe('#reports');
  });

  it('manual lock is always accessible and clears revealed placeholders', async () => {
    window.location.hash = '#reports';

    render(<App />);

    await userEvent.click(await screen.findByRole('button', { name: 'Unlock shell' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Reveal report placeholder' }));

    expect(screen.getByText('Restricted placeholder is visible for review.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Lock application shell' }));

    expect(await screen.findByRole('heading', { name: 'Unlock KeyForge Local' })).toBeInTheDocument();
    expect(screen.queryByText('Restricted placeholder is visible for review.')).not.toBeInTheDocument();
  });
});
