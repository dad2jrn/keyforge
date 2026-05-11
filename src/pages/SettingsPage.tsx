import { PlaceholderPage } from './PageScaffold';

export function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      intro="Application preferences route for future profile, display, and local-only configuration."
      cards={[
        { title: 'Display', body: 'Theme preference is available in the app shell top bar.' },
        { title: 'Local storage', body: 'Future controls will describe where local data is stored and how it is protected.' },
        { title: 'Danger zone', body: 'Destructive actions will require explicit confirmation and are not present yet.' },
      ]}
      rows={[
        { label: 'Workspace', value: 'Local browser', note: 'No cloud account' },
        { label: 'Data examples', value: 'Synthetic only', note: 'No sensitive fixtures' },
        { label: 'Feature flags', value: 'Planned', note: 'No business feature toggles yet' },
      ]}
    />
  );
}