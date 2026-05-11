export type ThemePreference = 'system' | 'dark' | 'light';
export type ResolvedTheme = 'dark' | 'light';

export const themeStorageKey = 'keyforge.themePreference';
export const systemThemeQuery = '(prefers-color-scheme: light)';

const themePreferences = ['system', 'dark', 'light'] as const;

export function isThemePreference(value: string | null): value is ThemePreference {
    return themePreferences.some((preference) => preference === value);
}

export function readThemePreference(): ThemePreference {
    const stored = window.localStorage.getItem(themeStorageKey);
    if (isThemePreference(stored)) {
        return stored;
    }
    return 'system';
}

export function persistThemePreference(preference: ThemePreference): void {
    // Security boundary: the theme preference is the only approved localStorage value.
    // Do not store master keys, vault data, bittings, pinning, customer data, or other sensitive values here.
    window.localStorage.setItem(themeStorageKey, preference);
}

export function getPreferredColorScheme(): ResolvedTheme {
    return window.matchMedia(systemThemeQuery).matches ? 'light' : 'dark';
}

export function resolveTheme(preference: ThemePreference, systemTheme: ResolvedTheme = getPreferredColorScheme()): ResolvedTheme {
    if (preference === 'dark' || preference === 'light') {
        return preference;
    }
    return systemTheme;
}

export function applyTheme(preference: ThemePreference, systemTheme?: ResolvedTheme): ResolvedTheme {
    const resolvedTheme = resolveTheme(preference, systemTheme);
    document.documentElement.dataset.theme = resolvedTheme;
    return resolvedTheme;
}
