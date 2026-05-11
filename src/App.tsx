import { useCallback, useEffect, useState } from 'react';
import { AppShell } from './app/AppShell';
import { LockProvider, useLockState } from './app/LockProvider';
import { findNavigationItem, normalizeRoutePath, routeToHash } from './app/navigation';
import { findRouteById } from './app/routes';
import { isProtectedRoute, normalizeSecurityRouteId, readReturnTo, unlockRoute } from './app/securityState';
import { applyTheme, persistThemePreference, readThemePreference, type ThemePreference } from './app/theme';
import { UnlockPage } from './pages/UnlockPage';

function readCurrentHashPath(): string {
  return window.location.hash.slice(1) || '/';
}

export function App() {
  return (
    <LockProvider>
      <AppContent />
    </LockProvider>
  );
}

function AppContent() {
  const { clearReveals, isLocked } = useLockState();
  const [currentPath, setCurrentPath] = useState(readCurrentHashPath);
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => readThemePreference());

  const navigate = useCallback((path: string) => {
    window.location.hash = routeToHash(path);
    setCurrentPath(path);
  }, []);

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(readCurrentHashPath());
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    applyTheme(themePreference);
    persistThemePreference(themePreference);
  }, [themePreference]);

  const normalizedPath = normalizeRoutePath(currentPath);
  const normalizedRouteId = normalizeSecurityRouteId(currentPath);
  const isUnlockRoute = normalizedRouteId === unlockRoute;
  const requestedPath = isUnlockRoute ? readReturnTo(currentPath) : normalizedPath;
  const activeNavigationItem = findNavigationItem(requestedPath);
  const activeRoute = findRouteById(activeNavigationItem.id);
  const shouldShowUnlock = isUnlockRoute || (isLocked && isProtectedRoute(activeRoute.id));

  return (
    <AppShell
      activeRoute={activeRoute}
      title={shouldShowUnlock ? 'Security Lock' : activeRoute.title}
      description={shouldShowUnlock ? 'Unlock the in-memory shell before opening protected feature screens.' : activeRoute.description}
      currentPath={currentPath}
      themePreference={themePreference}
      onThemePreferenceChange={setThemePreference}
      onNavigate={navigate}
      onMaskSensitive={clearReveals}
    >
      {shouldShowUnlock ? (
        <UnlockPage returnTo={activeNavigationItem.path} onUnlocked={navigate} />
      ) : activeRoute.element}
    </AppShell>
  );
}
