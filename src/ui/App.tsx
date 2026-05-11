import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../app/AppShell';
import { appConfig } from '../app/config';
import { LockProvider, useLockState, type SensitiveRevealKey } from '../app/LockProvider';
import { isProtectedRoute, normalizeRoute, readReturnTo, unlockRoute } from '../app/securityState';
import { applyTheme, persistThemePreference, readThemePreference, type ThemePreference } from '../app/theme';
import { SqliteWorkerClient } from '../db/sqliteClient';
import type { DatabaseDiagnostics, DiagnosticWriteResult, TransactionProbeResult } from '../domain/database';
import { UnlockPage } from '../pages/UnlockPage';
import { DatabaseService } from '../services/databaseService';
import type { FoundationSummary } from '../services/foundationService';
import { FoundationService } from '../services/foundationService';
import { StaticFoundationRepository } from '../repositories/staticFoundationRepository';

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
  return (
    <LockProvider>
      <AppContent />
    </LockProvider>
  );
}

function AppContent() {
  const service = useMemo(() => new FoundationService(new StaticFoundationRepository()), []);
  const databaseService = useMemo(() => new DatabaseService(new SqliteWorkerClient()), []);
  const { clearReveals, isLocked, revealedKeys, reveal, mask } = useLockState();
  const [summary, setSummary] = useState<FoundationSummary | null>(null);
  const [databaseDiagnostics, setDatabaseDiagnostics] = useState<DatabaseDiagnostics | null>(null);
  const [diagnosticWriteResult, setDiagnosticWriteResult] = useState<DiagnosticWriteResult | null>(null);
  const [transactionProbeResult, setTransactionProbeResult] = useState<TransactionProbeResult | null>(null);
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => readThemePreference());
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, '') || 'dashboard');

  const navigate = (nextRoute: string) => {
    const nextHashRoute = nextRoute.replace(/^#/, '') || 'dashboard';
    window.location.hash = nextHashRoute;
    setRoute(nextHashRoute);
  };

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash.replace(/^#/, '') || 'dashboard');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    applyTheme(themePreference);
    persistThemePreference(themePreference);
  }, [themePreference]);

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

  const activeRoute = normalizeRoute(route);
  const shouldShowUnlock = activeRoute === unlockRoute || (isLocked && isProtectedRoute(activeRoute));
  const pageTitle = shouldShowUnlock ? 'Security Lock' : 'Project Foundation';
  const pageSubtitle = shouldShowUnlock
    ? 'Unlock the in-memory shell before opening protected feature screens.'
    : 'Epic 0 scaffold: local-first, secure-by-default, and ready for GitHub Pages.';

  return (
    <AppShell
      route={route}
      onNavigate={navigate}
      title={pageTitle}
      subtitle={pageSubtitle}
      actions={(
        <>
          <label className="form-field">
            <span>Theme</span>
            <select
              className="select"
              value={themePreference}
              onChange={(event) => setThemePreference(event.target.value as ThemePreference)}
              aria-label="Theme preference"
            >
              <option value="system">System</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
          <button className="btn btn-warning" type="button" onClick={clearReveals}>Mask Sensitive</button>
        </>
      )}
    >
      {shouldShowUnlock ? (
        <UnlockPage returnTo={activeRoute === unlockRoute ? readReturnTo(route) : activeRoute} onUnlocked={navigate} />
      ) : (
        <AppSections
          activeRoute={activeRoute}
          summary={summary}
          databaseDiagnostics={databaseDiagnostics}
          diagnosticWriteResult={diagnosticWriteResult}
          transactionProbeResult={transactionProbeResult}
          revealedKeys={revealedKeys}
          onDiagnosticWrite={handleDiagnosticWrite}
          onRollbackProbe={handleRollbackProbe}
          onReveal={reveal}
          onMask={mask}
        />
      )}
    </AppShell>
  );
}

function AppSections({
  activeRoute,
  summary,
  databaseDiagnostics,
  diagnosticWriteResult,
  transactionProbeResult,
  revealedKeys,
  onDiagnosticWrite,
  onRollbackProbe,
  onReveal,
  onMask,
}: {
  readonly activeRoute: string;
  readonly summary: FoundationSummary | null;
  readonly databaseDiagnostics: DatabaseDiagnostics | null;
  readonly diagnosticWriteResult: DiagnosticWriteResult | null;
  readonly transactionProbeResult: TransactionProbeResult | null;
  readonly revealedKeys: ReadonlySet<SensitiveRevealKey>;
  readonly onDiagnosticWrite: () => Promise<void>;
  readonly onRollbackProbe: () => Promise<void>;
  readonly onReveal: (key: SensitiveRevealKey) => void;
  readonly onMask: (key: SensitiveRevealKey) => void;
}) {
  return (
    <>

        <section id="dashboard" className={`page-section stack ${activeRoute === 'dashboard' ? '' : 'hidden'}`}>
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
            onDiagnosticWrite={onDiagnosticWrite}
            onRollbackProbe={onRollbackProbe}
          />
        </section>

        <section id="boundaries" className={`page-section cols-2 ${activeRoute === 'boundaries' ? '' : 'hidden'}`}>
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

        <section id="security" className={`page-section cols-2 ${activeRoute === 'security' ? '' : 'hidden'}`}>
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
              <SensitivePlaceholder
                label="Bitting"
                revealKey="bitting-preview"
                revealedKeys={revealedKeys}
                onReveal={onReveal}
                onMask={onMask}
              />
              <SensitivePlaceholder
                label="Pinning"
                revealKey="pinning-worksheet"
                revealedKeys={revealedKeys}
                onReveal={onReveal}
                onMask={onMask}
              />
              <label className="form-field">Keyholder<input className="input masked" value="Hidden" readOnly /></label>
            </div>
            <p className="help-text">Values are synthetic placeholders, intentionally not realistic operational data.</p>
          </div>
        </section>

        <section id="reports" className={`page-section cols-2 ${activeRoute === 'reports' ? '' : 'hidden'}`}>
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
            <div className="cluster">
              <button className="btn" type="button" onClick={() => onReveal('report-preview')}>Reveal report placeholder</button>
              <button className="btn btn-warning" type="button" onClick={() => onMask('report-preview')}>Mask report placeholder</button>
            </div>
            <p className={revealedKeys.has('report-preview') ? 'help-text' : 'help-text masked'}>
              {revealedKeys.has('report-preview') ? 'Restricted placeholder is visible for review.' : '•••••• restricted placeholder hidden'}
            </p>
          </div>
        </section>

        <section id="migration" className={`page-section card stack-sm ${activeRoute === 'migration' ? '' : 'hidden'}`}>
          <h2 className="card-title">Future Cloudflare Worker + D1 Posture</h2>
          <p className="help-text">Epic 0 establishes the tenant/sync-friendly boundaries without adding a backend. Version 1 remains useful offline and local-only.</p>
          <div className="cluster">
            <span className="chip chip-success">Repository interfaces</span>
            <span className="chip chip-success">Stable module boundaries</span>
            <span className="chip chip-warning">No cloud plaintext</span>
            <span className="chip chip-success">SQLite Epic 1 active</span>
          </div>
        </section>
    </>
  );
}

function SensitivePlaceholder({ label, revealKey, revealedKeys, onReveal, onMask }: { readonly label: string; readonly revealKey: SensitiveRevealKey; readonly revealedKeys: ReadonlySet<SensitiveRevealKey>; readonly onReveal: (key: SensitiveRevealKey) => void; readonly onMask: (key: SensitiveRevealKey) => void }) {
  const isRevealed = revealedKeys.has(revealKey);
  return (
    <label className="form-field">
      {label}
      <input className={`input ${isRevealed ? '' : 'masked'}`} value={isRevealed ? 'Synthetic placeholder visible' : '••••••'} readOnly />
      <span className="cluster sensitive-actions">
        <button className="btn btn-ghost" type="button" onClick={() => onReveal(revealKey)}>Reveal placeholder</button>
        <button className="btn btn-ghost" type="button" onClick={() => onMask(revealKey)}>Mask</button>
      </span>
    </label>
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
