export type AppRouteId =
  | 'dashboard'
  | 'customers-sites'
  | 'key-systems'
  | 'cylinders'
  | 'pin-calculator'
  | 'keyholders'
  | 'reports'
  | 'backup-security'
  | 'settings';

export interface NavigationItem {
  readonly id: AppRouteId;
  readonly label: string;
  readonly path: string;
  readonly shortcut: string;
}

export const navigationItems: readonly NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', shortcut: '1' },
  { id: 'customers-sites', label: 'Customers / Sites', path: '/customers-sites', shortcut: '2' },
  { id: 'key-systems', label: 'Key Systems', path: '/key-systems', shortcut: '3' },
  { id: 'cylinders', label: 'Cylinders', path: '/cylinders', shortcut: '4' },
  { id: 'pin-calculator', label: 'Pin Calculator', path: '/pin-calculator', shortcut: '5' },
  { id: 'keyholders', label: 'Keyholders', path: '/keyholders', shortcut: '6' },
  { id: 'reports', label: 'Reports', path: '/reports', shortcut: '7' },
  { id: 'backup-security', label: 'Backup / Security', path: '/backup-security', shortcut: '8' },
  { id: 'settings', label: 'Settings', path: '/settings', shortcut: '9' },
] as const;

export function routeToHash(path: string): string {
  return `#${path}`;
}

export function normalizeRoutePath(path: string): string {
  const trimmedPath = path.trim();
  if (trimmedPath === '' || trimmedPath === '/') return '/';

  const withoutHash = trimmedPath.startsWith('#') ? trimmedPath.slice(1) : trimmedPath;
  const withoutQuery = withoutHash.split('?')[0] ?? '/';
  const withLeadingSlash = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
  const withoutTrailingSlash = withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, '') : withLeadingSlash;

  return withoutTrailingSlash === '' ? '/' : withoutTrailingSlash;
}

export function findNavigationItem(path: string): NavigationItem {
  const normalizedPath = normalizeRoutePath(path);
  return navigationItems.find((item) => item.path === normalizedPath) ?? navigationItems[0];
}