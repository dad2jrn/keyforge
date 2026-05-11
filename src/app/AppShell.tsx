import { useEffect, type ReactNode } from 'react';
import { useLockState } from './LockProvider';
import { buildUnlockRoute, isProtectedRoute, normalizeRoute } from './securityState';
import { LockButton } from '../ui/LockButton';

export function AppShell({
  route,
  onNavigate,
  title,
  subtitle,
  actions,
  children,
}: {
  readonly route: string;
  readonly onNavigate: (route: string) => void;
  readonly title: string;
  readonly subtitle: string;
  readonly actions: ReactNode;
  readonly children: ReactNode;
}) {
  const { isLocked, status, resetAutoLockTimer } = useLockState();
  const activeRoute = normalizeRoute(route);

  useEffect(() => {
    if (isLocked && isProtectedRoute(activeRoute)) {
      onNavigate(buildUnlockRoute(activeRoute));
    }
  }, [activeRoute, isLocked, onNavigate]);

  return (
    <div className="app-shell" onPointerDown={resetAutoLockTimer} onKeyDown={resetAutoLockTimer}>
      <aside className="sidebar no-print" aria-label="Primary navigation">
        <div className="sidebar-brand">
          <div className="sidebar-logo" aria-hidden="true">K</div>
          <div>
            <strong className="text-strong">KeyForge Local</strong>
            <div className="help-text">Encrypted master key vault</div>
          </div>
        </div>

        <div className="sidebar-lock-panel">
          <span className={isLocked ? 'chip chip-danger' : 'chip chip-success'}>{status}</span>
          <LockButton />
        </div>

        <nav>
          <div className="sidebar-nav-section">Foundation</div>
          <NavLink route="dashboard" activeRoute={activeRoute} onNavigate={onNavigate}>Dashboard <span>⌘1</span></NavLink>
          <NavLink route="boundaries" activeRoute={activeRoute} onNavigate={onNavigate}>Boundaries <span>⌘2</span></NavLink>
          <NavLink route="security" activeRoute={activeRoute} onNavigate={onNavigate}>Security <span>⌘3</span></NavLink>
          <NavLink route="reports" activeRoute={activeRoute} onNavigate={onNavigate}>Reports <span>⌘4</span></NavLink>
          <div className="sidebar-nav-section">Future</div>
          <NavLink route="migration" activeRoute={activeRoute} onNavigate={onNavigate}>D1 Posture <span>⌘5</span></NavLink>
        </nav>
      </aside>

      <main className="main-shell">
        <header className="topbar no-print">
          <div>
            <h1 className="page-title">{title}</h1>
            <p className="help-text">{subtitle}</p>
          </div>
          <div className="cluster" role="group" aria-label="Application controls">{actions}</div>
        </header>

        {children}
      </main>
    </div>
  );
}

function NavLink({ route, activeRoute, onNavigate, children }: { readonly route: string; readonly activeRoute: string; readonly onNavigate: (route: string) => void; readonly children: ReactNode }) {
  return (
    <a
      className={`sidebar-nav-link ${activeRoute === route ? 'active' : ''}`}
      href={`#${route}`}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(route);
      }}
    >
      {children}
    </a>
  );
}