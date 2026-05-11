import { navigationItems } from '../app/navigation';

export function DashboardPage() {
  return (
    <section className="page-section stack" aria-labelledby="dashboard-title">
      <div className="cols-4">
        <MetricCard label="Mode" value="Local" detail="No backend" />
        <MetricCard label="Data posture" value="Masked" detail="Sensitive by default" />
        <MetricCard label="Modules" value="9" detail="Version 1 shell" />
        <MetricCard label="Status" value="Planned" detail="No live records" />
      </div>

      <div className="callout callout-warning">
        Placeholder pages use synthetic labels only. Real customer names, addresses, key cuts, bittings, pinning, keyholder records,
        databases, spreadsheets, and backup files must not be committed to this repository.
      </div>

      <div className="card stack-sm">
        <h2 className="section-title" id="dashboard-title">Version 1 App Shell</h2>
        <p className="help-text">Navigate between top-level modules. Business features and real data workflows are intentionally not implemented yet.</p>
        <div className="cols-3">
          {navigationItems.map((item) => (
            <article className="card stack-sm" key={item.id}>
              <h3 className="card-title">{item.label}</h3>
              <p className="help-text">Route available at <span className="masked">••</span>{item.path === '/' ? '/dashboard' : item.path} with placeholder content.</p>
              <span className="chip">Shell ready</span>
            </article>
          ))}
        </div>
      </div>
    </section>
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