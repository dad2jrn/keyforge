import type { ReactElement } from 'react';
import type { AppRouteId } from './navigation';
import { DashboardPage } from '../pages/DashboardPage';
import { CustomersSitesPage } from '../pages/CustomersSitesPage';
import { KeySystemsPage } from '../pages/KeySystemsPage';
import { CylindersPage } from '../pages/CylindersPage';
import { PinCalculatorPage } from '../pages/PinCalculatorPage';
import { KeyholdersPage } from '../pages/KeyholdersPage';
import { ReportsPage } from '../pages/ReportsPage';
import { BackupSecurityPage } from '../pages/BackupSecurityPage';
import { SettingsPage } from '../pages/SettingsPage';

export interface AppRoute {
  readonly id: AppRouteId;
  readonly title: string;
  readonly description: string;
  readonly element: ReactElement;
}

export const appRoutes: readonly AppRoute[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Version 1 module landing area with masked status placeholders.',
    element: <DashboardPage />,
  },
  {
    id: 'customers-sites',
    title: 'Customers / Sites',
    description: 'Synthetic customer and site organization placeholder.',
    element: <CustomersSitesPage />,
  },
  {
    id: 'key-systems',
    title: 'Key Systems',
    description: 'Secure planning placeholder for systems, hierarchy, and symbols.',
    element: <KeySystemsPage />,
  },
  {
    id: 'cylinders',
    title: 'Cylinders',
    description: 'Hardware inventory placeholder using masked operational examples.',
    element: <CylindersPage />,
  },
  {
    id: 'pin-calculator',
    title: 'Pin Calculator',
    description: 'Masked calculator workspace placeholder without real bittings or pinning.',
    element: <PinCalculatorPage />,
  },
  {
    id: 'keyholders',
    title: 'Keyholders',
    description: 'Synthetic assignment and accountability placeholder.',
    element: <KeyholdersPage />,
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'Report catalog placeholder with masked output defaults.',
    element: <ReportsPage />,
  },
  {
    id: 'backup-security',
    title: 'Backup / Security',
    description: 'Local backup, restore, and security posture placeholder.',
    element: <BackupSecurityPage />,
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Application preferences placeholder.',
    element: <SettingsPage />,
  },
] as const;

export function findRouteById(routeId: AppRouteId): AppRoute {
  return appRoutes.find((route) => route.id === routeId) ?? appRoutes[0];
}