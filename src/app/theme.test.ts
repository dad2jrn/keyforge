import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyTheme,
  persistThemePreference,
  readThemePreference,
  resolveTheme,
  themeStorageKey,
} from './theme';

describe('theme preference resolution', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('resolves explicit dark and light preferences without consulting the system theme', () => {
    expect(resolveTheme('dark', 'light')).toBe('dark');
    expect(resolveTheme('light', 'dark')).toBe('light');
  });

  it('follows the preferred color scheme when preference is system', () => {
    expect(resolveTheme('system', 'dark')).toBe('dark');
    expect(resolveTheme('system', 'light')).toBe('light');
  });

  it('sets html data-theme to the resolved theme', () => {
    expect(applyTheme('system', 'light')).toBe('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    expect(applyTheme('dark', 'light')).toBe('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('defaults invalid or absent stored values to system', () => {
    expect(readThemePreference()).toBe('system');

    window.localStorage.setItem(themeStorageKey, 'vault-secret');

    expect(readThemePreference()).toBe('system');
  });

  it('persists only the non-sensitive theme preference under the approved localStorage key', () => {
    persistThemePreference('light');

    expect(window.localStorage).toHaveLength(1);
    expect(window.localStorage.getItem(themeStorageKey)).toBe('light');
    expect(Array.from({ length: window.localStorage.length }, (_, index) => window.localStorage.key(index))).toEqual([
      themeStorageKey,
    ]);
  });
});