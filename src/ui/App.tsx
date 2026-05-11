import { useEffect, useMemo, useState } from 'react';
import { appConfig } from '../app/config';
import { SqliteWorkerClient } from '../db/sqliteClient';
import type { DatabaseDiagnostics, DiagnosticWriteResult, TransactionProbeResult } from '../domain/database';
import { DatabaseService } from '../services/databaseService';
import type { FoundationSummary } from '../services/foundationService';
import { FoundationService } from '../services/foundationService';
import { StaticFoundationRepository } from '../repositories/staticFoundationRepository';
import { ThemeToggle } from './ThemeToggle';

const statusClassNames = {
  ready: 'chip chip-success',
  planned: 'chip',
  guarded: 'chip chip-warning',
} as const;

const databaseStatusClassNames = {
  initializing: 'chip',
  ready: 'chip chip-success',
  degraded: 'chip chip-warning',
  error: 'chip chip-danger',
} as const;

export function App() {
  const service = useMemo(() => new FoundationService(new StaticFoundationRepository()), []);
  const databaseService = useMemo(() => new DatabaseService(new SqliteWorkerClient()), []);
  const [summary, setSummary] = useState<FoundationSummary | null>(null);
  const [databaseDiagnostics, setDatabaseDiagnostics] = useState<DatabaseDiagnostics | null>(null);
  const [diagnosticWriteResult, setDiagnosticWriteResult] = useState<DiagnosticWriteResult | null>(null);
  const [transactionProbeResult, setTransactionProbeResult] = useState<TransactionProbeResult | null>(null);

  useEffect(() => {
    void service.getSummary().then(setSummary);
  }, [service]);

  useEffect(() => {
    void databaseService.getSummary().then(({ diagnostics }) => setDatabaseDiagnostics(diagnostics));
  }, [databaseService]);

  const refreshDatabaseDiagnostics = async () => {
    const { diagnostics } = await databaseService.getSummary();
    setDatabaseDiagnostics(diagnostics);
  };

  const handleDiagnosticWrite = async () => {
    const result = await databaseService.recordDiagnosticWrite('Manual Epic 1 diagnostic write from dashboard.');
    setDiagnosticWriteResult(result);
    await refreshDatabaseDiagnostics();
  };

  const handleRollbackProbe = async () => {
    const result = await databaseService.runRollbackProbe();
    setTransactionProbeResult(result);
    await refreshDatabaseDiagnostics();
  };

  return (
    <div className="app-shell">
      <aside className="sidebar no-print" aria-label="Primary navigation">
        <div className="sidebar-brand">
          <div className="sidebar-logo" aria-hidden="true">K</div>
          <div>
            <strong className="text-strong">KeyForge Local</strong>
            <div className="help-text">Encrypted master key vault</div>
          </div>
        </div>

        <nav>
          <div className="sidebar-nav-section">Foundation</div>
          <a className="sidebar-nav-link active" href="#dashboard">Dashboard <span>⌘1</span></a>
          <a className="sidebar-nav-link" href="#boundaries">Boundaries <span>⌘2</span></a>
          <a className="sidebar-nav-link" href="#security">Security <span>⌘3</span></a>
          <a className="sidebar-nav-link" href="#reports">Reports <span>⌘4</span></a>
          <div className="sidebar-nav-section">Future</div>
          <a className="sidebar-nav-link" href="#migration">D1 Posture <span>⌘5</span></a>
        </nav>
      </aside>

      <main className="main-shell">
        <header className="topbar no-print">
          <div>
            <h1 className="page-title">Project Foundation</h1>
            <p className="help-text">Epic 0 scaffold: local-first, secure-by-default, and ready for GitHub Pages.</p>
          </div>
          <div className="cluster" role="group" aria-label="Theme controls">
            <ThemeToggle />
            <button className="btn btn-warning" type="button">Mask Sensitive</button>
          </div>
        </header>

        <section id="dashboard" className="page-section stack">
          <div className="cols-4">
            <MetricCard label="Mode" value="Local" detail="No backend" />
            <MetricCard label="Data posture" value="Masked" detail="Sensitive by default" />
            <MetricCard label="Build target" value="Pages" detail={appConfig.repositoryBasePath} />
            <MetricCard label="DB state" value={databaseDiagnostics?.status ?? 'initializing'} detail={databaseDiagnostics?.storageMode ?? 'worker starting'} />
          </div>

          <div className="callout callout-warning">
            Plaintext exports and real locksmithing data are dangerous. This repository must never contain real customer names,
            addresses, bittings, pinning, keyholder records, databases, spreadsheets, or backup files.
          </div>

          <DatabaseDiagnosticsPanel
            diagnostics={databaseDiagnostics}
            diagnosticWriteResult={diagnosticWriteResult}
            transactionProbeResult={transactionProbeResult}
            onDiagnosticWrite={handleDiagnosticWrite}
            onRollbackProbe={handleRollbackProbe}
          />
        </section>

        <section id="boundaries" className="page-section cols-2">
          <div className="card stack-sm">
            <h2 className="card-title">Module Boundaries</h2>
            <p className="help-text">React UI consumes services. Services depend on repository interfaces and worker-backed database clients.</p>
            <table className="table">
              <thead><tr><th>Layer</th><th>Responsibility</th></tr></thead>
              <tbody>
                <tr><td>ui</td><td>Presentation and semantic STYLE.md classes</td></tr>
                <tr><td>services</td><td>Application workflows and orchestration</td></tr>
                <tr><td>repositories</td><td>Testable interfaces and local implementations</td></tr>
                <tr><td>db/workers</td><td>SQLite WASM, OPFS persistence, transactions, and migrations</td></tr>
              </tbody>
            </table>
          </div>

          <div className="card stack-sm">
            <h2 className="card-title">Foundation Capabilities</h2>
            <div className="stack-sm">
              {summary?.capabilities.map((capability) => (
                <div className="split" key={capability.label}>
                  <div>
                    <strong>{capability.label}</strong>
                    <div className="help-text">{capability.detail}</div>
                  </div>
                  <span className={statusClassNames[capability.status]}>{capability.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="page-section cols-2">
          <div className="card stack-sm">
            <h2 className="card-title">Security Checklist</h2>
            <table className="table">
              <thead><tr><th>Control</th><th>Status</th><th>Note</th></tr></thead>
              <tbody>
                {summary?.securityChecklist.map((item) => (
                  <tr key={item.control}>
                    <td>{item.control}</td>
                    <td><span className={statusClassNames[item.state]}>{item.state}</span></td>
                    <td>{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card stack-sm">
            <h2 className="card-title">Sensitive Data Masking</h2>
            <div className="form-grid">
              <label className="form-field">Key symbol<input className="input" value="SYN-MK" readOnly /></label>
              <label className="form-field">Bitting<input className="input masked" value="••••••" readOnly /></label>
              <label className="form-field">Pinning<input className="input masked" value="•• •• ••" readOnly /></label>
              <label className="form-field">Keyholder<input className="input masked" value="Hidden" readOnly /></label>
            </div>
            <p className="help-text">Values are synthetic placeholders, intentionally not realistic operational data.</p>
          </div>
        </section>

        <section id="reports" className="page-section cols-2">
          <div className="card stack-sm">
            <h2 className="card-title">Worksheet Styling</h2>
            <div className="pin-grid" aria-label="Masked pinning worksheet preview">
              {['Ch', '1', '2', '3', '4', '5', '6', 'Top', '••', '••', '••', '••', '••', '••', 'Master', '••', '••', '••', '••', '••', '••', 'Bottom', '••', '••', '••', '••', '••', '••'].map((value, index) => (
                <div className={`pin-grid-cell ${index < 7 ? 'pin-grid-header' : ''} ${value === '••' ? 'masked' : ''}`} key={`${value}-${index}`}>{value}</div>
              ))}
            </div>
          </div>

          <div className="report-surface">
            <h2 className="card-title">Report Preview</h2>
            <table className="table">
              <thead><tr><th>Report</th><th>Sensitivity</th><th>Default</th></tr></thead>
              <tbody>
                <tr><td>Door Schedule</td><td>Restricted</td><td>Masked</td></tr>
                <tr><td>Pinning Worksheet</td><td>Critical</td><td>Explicit reveal</td></tr>
              </tbody>
            </table>
            <p className="report-footer">Restricted — synthetic scaffold preview only. Destroy printed sensitive reports when no longer needed.</p>
          </div>
        </section>

        <section id="migration" className="page-section card stack-sm">
          <h2 className="card-title">Future Cloudflare Worker + D1 Posture</h2>
          <p className="help-text">Epic 0 establishes the tenant/sync-friendly boundaries without adding a backend. Version 1 remains useful offline and local-only.</p>
          <div className="cluster">
            <span className="chip chip-success">Repository interfaces</span>
            <span className="chip chip-success">Stable module boundaries</span>
            <span className="chip chip-warning">No cloud plaintext</span>
            <span className="chip chip-success">SQLite Epic 1 active</span>
          </div>
        </section>
      </main>
    </div>
  );
}

function DatabaseDiagnosticsPanel({
  diagnostics,
  diagnosticWriteResult,
  transactionProbeResult,
  onDiagnosticWrite,
  onRollbackProbe,
}: {
  readonly diagnostics: DatabaseDiagnostics | null;
  readonly diagnosticWriteResult: DiagnosticWriteResult | null;
  readonly transactionProbeResult: TransactionProbeResult | null;
  readonly onDiagnosticWrite: () => Promise<void>;
  readonly onRollbackProbe: () => Promise<void>;
}) {
  return (
    <div className="card stack-sm">
      <div className="split">
        <div>
          <h2 className="card-title">SQLite Engine Diagnostics</h2>
          <p className="help-text">Epic 1 runs SQLite WASM in a Web Worker with OPFS when the browser supports it.</p>
        </div>
        <span className={databaseStatusClassNames[diagnostics?.status ?? 'initializing']}>{diagnostics?.status ?? 'initializing'}</span>
      </div>

      <table className="table">
        <tbody>
          <tr><td>SQLite version</td><td>{diagnostics?.sqliteVersion ?? 'Loading…'}</td></tr>
          <tr><td>Storage mode</td><td>{diagnostics?.storageMode ?? 'Detecting…'}</td></tr>
          <tr><td>Database path</td><td>{diagnostics?.databasePath ?? 'Pending worker initialization'}</td></tr>
          <tr><td>Test query</td><td>{diagnostics?.testQueryValue === 2 ? 'Passed (SELECT 1 + 1)' : 'Pending'}</td></tr>
          <tr><td>Schema version</td><td>{diagnostics?.schemaVersion ?? 'Pending'} / {diagnostics?.latestMigrationVersion ?? 1}</td></tr>
          <tr><td>OPFS available</td><td>{diagnostics?.compatibility.opfsAvailable ? 'Yes' : 'No / pending'}</td></tr>
          <tr><td>Cross-origin isolated</td><td>{diagnostics?.compatibility.crossOriginIsolated ? 'Yes' : 'No / pending'}</td></tr>
        </tbody>
      </table>

      {diagnostics?.compatibility.warnings.map((warning) => (
        <div className="callout callout-warning" key={warning}>{warning}</div>
      ))}
      {diagnostics?.error ? <div className="callout callout-danger">{diagnostics.error}</div> : null}

      <div className="cluster">
        <button className="btn" type="button" onClick={() => void onDiagnosticWrite()}>Commit diagnostic write</button>
        <button className="btn btn-warning" type="button" onClick={() => void onRollbackProbe()}>Run rollback probe</button>
      </div>

      <div className="cols-2">
        <ResultCard title="Committed write" lines={[
          `Inserted: ${diagnosticWriteResult?.inserted ? 'yes' : 'not run'}`,
          `Diagnostic rows: ${diagnosticWriteResult?.diagnosticWriteCount ?? '—'}`,
          `Audit rows: ${diagnosticWriteResult?.auditLogCount ?? '—'}`,
        ]} />
        <ResultCard title="Rollback probe" lines={[
          `Rolled back: ${transactionProbeResult?.rolledBack ? 'yes' : 'not run'}`,
          `Nested misuse blocked: ${transactionProbeResult?.preventedNestedTransaction ? 'yes' : 'not run'}`,
          `Audit rows unchanged on failure: ${transactionProbeResult ? 'yes' : '—'}`,
        ]} />
      </div>
    </div>
  );
}

function ResultCard({ title, lines }: { readonly title: string; readonly lines: readonly string[] }) {
  return (
    <div className="card stack-sm">
      <strong>{title}</strong>
      {lines.map((line) => <div className="help-text" key={line}>{line}</div>)}
    </div>
  );
}

function MetricCard({ label, value, detail }: { readonly label: string; readonly value: string; readonly detail: string }) {
  return (
    <div className="card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <span className="chip">{detail}</span>
    </div>
  );
}
