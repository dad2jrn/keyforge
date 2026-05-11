import { describe, expect, it } from 'vitest';
import { buildUnlockRoute, isProtectedRoute, readReturnTo } from './securityState';

describe('securityState route helpers', () => {
  it('marks sensitive feature routes as protected', () => {
    expect(isProtectedRoute('security')).toBe(true);
    expect(isProtectedRoute('#reports')).toBe(true);
    expect(isProtectedRoute('dashboard')).toBe(false);
  });

  it('carries the requested protected route through the unlock placeholder', () => {
    const unlockRoute = buildUnlockRoute('reports');

    expect(unlockRoute).toBe('unlock?returnTo=reports');
    expect(readReturnTo(unlockRoute)).toBe('reports');
  });
});