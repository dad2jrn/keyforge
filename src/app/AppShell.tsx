import { useEffect, type ReactNode } from 'react';
import type { AppRoute } from './routes';
import { navigationItems, routeToHash } from './navigation';
import { buildUnlockRoute, isProtectedRoute } from './securityState';
import type { ThemePreference } from './theme';
import { useLockState } from './LockProvider';
import { LockButton } from '../ui/LockButton';

export function AppShell({
  activeRoute,
  title,
  description,
  currentPath,
  themePreference,
  onThemePreferenceChange,
  onNavigate,
  onMaskSensitive,
  children,
}: {
  readonly activeRoute: AppRoute;
  readonly title: string;
  readonly description: string;
  readonly currentPath: string;
  readonly themePreference: ThemePreference;
  readonly onThemePreferenceChange: (preference: ThemePreference) => void;
  readonly onNavigate: (path: string) => void;
  readonly onMaskSensitive: () => void;
  readonly children: ReactNode;
}) {
  const { isLocked, status, resetAutoLockTimer } = useLockState();

  useEffect(() => {
    if (isLocked && isProtectedRoute(activeRoute.id) && !currentPath.replace(/^\//, '').startsWith('unlock')) {
      onNavigate(buildUnlockRoute(activeRoute.id));
    }
  }, [activeRoute.id, currentPath, isLocked, onNavigate]);

  return (
    <div className="app-shell" onPointerDown={resetAutoLockTimer} onKeyDown={resetAutoLockTimer}>
      <aside className="sidebar no-print" aria-label="Primary navigation">
        <div className="sidebar-brand">
          <div className="sidebar-logo" aria-hidden="true">K</div>
          <div>
            <strong className="text-strong">KeyForge Local</strong>
            <div className="help-text">Secure locksmithing workspace</div>
          </div>
        </div>

        <div className="sidebar-lock-panel">
          <span className={isLocked ? 'chip chip-danger' : 'chip chip-success'}>{status}</span>
          <LockButton />
        </div>

        <nav aria-label="Version 1 modules">
          <div className="sidebar-nav-section">Version 1</div>
          {navigationItems.map((item) => (
            <a
              aria-current={activeRoute.id === item.id ? 'page' : undefined}
              className={`sidebar-nav-link ${activeRoute.id === item.id ? 'active' : ''}`}
              href={routeToHash(item.path)}
              key={item.id}
            >
              {item.label}
              <span aria-hidden="true">⌘{item.shortcut}</span>
            </a>
          ))}
        </nav>
      </aside>

      <main className="main-shell" id="main-content">
        <header className="topbar no-print">
          <div>
            <h1 className="page-title">{title}</h1>
            <p className="help-text">{description}</p>
          </div>
          <div className="cluster" role="group" aria-label="Application controls">
            <a className="btn btn-ghost" href="#main-content">Skip to content</a>
            <label className="form-field">
              <span>Theme</span>
              <select
                className="select"
                value={themePreference}
                onChange={(event) => onThemePreferenceChange(event.target.value as ThemePreference)}
                aria-label="Theme preference"
              >
                <option value="system">System</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </label>
            <button className="btn btn-warning" type="button" onClick={onMaskSensitive} aria-label="Mask sensitive placeholder reveals">
              Masked placeholders
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
