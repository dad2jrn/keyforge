export type LockStatus = 'locked' | 'unlocked';

export const unlockRoute = 'unlock';

export const protectedRoutes = new Set(['reports', 'security']);

export const defaultProtectedRoute = 'dashboard';

export function normalizeRoute(route: string): string {
  const trimmedRoute = route.replace(/^#/, '').split('?')[0]?.trim() ?? '';
  return trimmedRoute.length > 0 ? trimmedRoute : defaultProtectedRoute;
}

export function isProtectedRoute(route: string): boolean {
  return protectedRoutes.has(normalizeRoute(route));
}

export function buildUnlockRoute(returnTo: string): string {
  return `${unlockRoute}?returnTo=${encodeURIComponent(normalizeRoute(returnTo))}`;
}

export function readReturnTo(route: string): string {
  const query = route.replace(/^#/, '').split('?')[1];
  if (!query) return defaultProtectedRoute;

  const params = new URLSearchParams(query);
  return normalizeRoute(params.get('returnTo') ?? defaultProtectedRoute);
}