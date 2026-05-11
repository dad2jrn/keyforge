import type { AppRouteId } from './navigation';

export type LockStatus = 'locked' | 'unlocked';

export const unlockRoute = 'unlock';

const protectedRouteIds = new Set<AppRouteId>(['reports', 'backup-security']);
const legacyProtectedRoutes = new Set(['security']);

export const defaultProtectedRoute = '/';

export function normalizeSecurityRoute(route: string): string {
  const withoutHash = route.replace(/^#/, '').trim();
  const path = withoutHash.split('?')[0] ?? defaultProtectedRoute;
  if (path === '' || path === '/') return defaultProtectedRoute;
  return path.startsWith('/') ? path : `/${path}`;
}

export function normalizeSecurityRouteId(route: string): string {
  const normalizedPath = normalizeSecurityRoute(route);
  return normalizedPath === '/' ? 'dashboard' : normalizedPath.replace(/^\//, '');
}

export function isProtectedRoute(route: string): boolean {
  const routeId = normalizeSecurityRouteId(route);
  return protectedRouteIds.has(routeId as AppRouteId) || legacyProtectedRoutes.has(routeId);
}

export function buildUnlockRoute(returnTo: string): string {
  return `${unlockRoute}?returnTo=${encodeURIComponent(returnTo)}`;
}

export function readReturnTo(route: string): string {
  const query = route.replace(/^#/, '').split('?')[1];
  if (!query) return defaultProtectedRoute;

  const params = new URLSearchParams(query);
  return params.get('returnTo') ?? defaultProtectedRoute;
}
