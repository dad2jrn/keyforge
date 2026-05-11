import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  applyTheme,
  getPreferredColorScheme,
  persistThemePreference,
  readThemePreference,
  resolveTheme,
  systemThemeQuery,
  type ResolvedTheme,
  type ThemePreference,
} from './theme';

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(() => readThemePreference());
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getPreferredColorScheme());
  const resolvedTheme = resolveTheme(preference, systemTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia(systemThemeQuery);
    const updateSystemTheme = () => setSystemTheme(mediaQuery.matches ? 'light' : 'dark');

    updateSystemTheme();
    mediaQuery.addEventListener('change', updateSystemTheme);

    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);

  useEffect(() => {
    persistThemePreference(preference);
  }, [preference]);

  useEffect(() => {
    applyTheme(preference, systemTheme);
  }, [preference, systemTheme]);

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}