import { useEffect, useState } from 'react';
import type { DatabaseDiagnostics } from '../domain/database';
import { getDiagnosticsService } from '../services/databaseService';

type DiagnosticsState =
  | { readonly phase: 'loading'; readonly diagnostics: null; readonly error: null }
  | { readonly phase: 'loaded'; readonly diagnostics: DatabaseDiagnostics; readonly error: null }
  | { readonly phase: 'failed'; readonly diagnostics: null; readonly error: string };

const initialState: DiagnosticsState = { phase: 'loading', diagnostics: null, error: null };

export function DiagnosticsPage() {
  const [state, setState] = useState<DiagnosticsState>(initialState);

  useEffect(() => {
    let cancelled = false;

    getDiagnosticsService().getSummary()
      .then((summary) => {
        if (!cancelled) {
          setState({ phase: 'loaded', diagnostics: summary.diagnostics, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({ phase: 'failed', diagnostics: null, error: error instanceof Error ? error.message : String(error) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const diagnostics = state.diagnostics;
  const status = diagnostics?.status ?? (state.phase === 'failed' ? 'error' : 'loading');

  return (
    <section className="page-section stack" aria-labelledby="sqlite-engine-diagnostics-title">
      <div className="card stack-sm">
        <div className="split">
          <div>
            <h2 className="section-title" id="sqlite-engine-diagnostics-title">SQLite Engine Diagnostics</h2>
            <p className="help-text">
              Verifies the local SQLite WASM engine through the diagnostics service and worker client boundary.
              No schema tables, domain records, bittings, pinning, or customer data are read or logged.
            </p>
          </div>
          <span className={statusChipClass(status)}>{status}</span>
        </div>
      </div>

      <div className="cols-3">
        <article className="card stack-sm">
          <h3 className="card-title">Worker boundary</h3>
          <p className="help-text">React renders diagnostics from a service abstraction; SQLite is loaded only inside a Web Worker.</p>
          <span className="chip chip-success">Isolated API</span>
        </article>
        <article className="card stack-sm">
          <h3 className="card-title">SQLite version</h3>
          <p className="metric-value">{diagnostics?.sqliteVersion ?? '—'}</p>
          <p className="help-text">Returned by <code>SELECT sqlite_version()</code> inside the worker.</p>
        </article>
        <article className="card stack-sm">
          <h3 className="card-title">Diagnostic query</h3>
          <p className="metric-value">{diagnostics?.testQueryValue ?? '—'}</p>
          <p className="help-text">Expected result for <code>SELECT 1 + 1</code> is 2.</p>
        </article>
      </div>

      <div className="card stack-sm">
        <h3 className="card-title">Runtime details</h3>
        <table className="table">
          <tbody>
            <tr>
              <th scope="row">Status</th>
              <td>{status}</td>
            </tr>
            <tr>
              <th scope="row">Worker available</th>
              <td>{formatBoolean(diagnostics?.compatibility.workerAvailable)}</td>
            </tr>
            <tr>
              <th scope="row">Cross-origin isolated</th>
              <td>{formatBoolean(diagnostics?.compatibility.crossOriginIsolated)}</td>
            </tr>
            <tr>
              <th scope="row">OPFS available</th>
              <td>{formatBoolean(diagnostics?.compatibility.opfsAvailable)}</td>
            </tr>
            <tr>
              <th scope="row">Readable error</th>
              <td>{diagnostics?.error ?? state.error ?? 'None'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {diagnostics?.compatibility.warnings.length ? (
        <div className="callout callout-warning stack-sm" role="status">
          <strong>Compatibility notes</strong>
          <ul>
            {diagnostics.compatibility.warnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function statusChipClass(status: string): string {
  if (status === 'ready') return 'chip chip-success';
  if (status === 'unsupported') return 'chip chip-warning';
  if (status === 'error') return 'chip chip-danger';
  return 'chip';
}

function formatBoolean(value: boolean | undefined): string {
  if (value === undefined) return 'Unknown';
  return value ? 'Yes' : 'No';
}
