import { useTheme } from '../app/ThemeProvider';
import { type ThemePreference } from '../app/theme';

const themeOptions: ReadonlyArray<{ value: ThemePreference; label: string }> = [
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

export function ThemeToggle() {
  const { preference, resolvedTheme, setPreference } = useTheme();

  return (
    <label className="form-field theme-toggle">
      <span>Theme</span>
      <select
        className="select"
        value={preference}
        onChange={(event) => setPreference(event.target.value as ThemePreference)}
        aria-label={`Theme preference, currently ${preference} resolving to ${resolvedTheme}`}
      >
        {themeOptions.map((option) => (
          <option value={option.value} key={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}