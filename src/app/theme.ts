export type ThemePreference = 'system' | 'dark' | 'light';
export type ResolvedTheme = 'dark' | 'light';

const themeStorageKey = 'keyforge.themePreference';

export function readThemePreference(): ThemePreference {
    const stored = window.localStorage.getItem(themeStorageKey);
    if (stored === 'system' || stored === 'dark' || stored === 'light') {
        return stored;
    }
    return 'system';
}

export function persistThemePreference(preference: ThemePreference): void {
    window.localStorage.setItem(themeStorageKey, preference);
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
    if (preference === 'dark' || preference === 'light') {
        return preference;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function applyTheme(preference: ThemePreference): ResolvedTheme {
    const resolvedTheme = resolveTheme(preference);
    document.documentElement.dataset.theme = resolvedTheme;
    return resolvedTheme;
}
