import { PlaceholderPage } from './PageScaffold';

export function KeySystemsPage() {
  return (
    <PlaceholderPage
      title="Key Systems"
      intro="Prepare the navigation surface for key system management while keeping all symbols and hierarchy examples synthetic."
      cards={[
        { title: 'System overview', body: 'Future dashboards will summarize systems without exposing sensitive keying data.', status: 'Masked' },
        { title: 'Hierarchy', body: 'Master, change, and operating levels are planned but not calculated in this shell.' },
        { title: 'Authorization', body: 'Reveal controls and audit flows will be added before sensitive values are shown.' },
      ]}
      rows={[
        { label: 'System code', value: 'SYN-SYS', note: 'Synthetic symbol only' },
        { label: 'Hierarchy preview', value: 'Level • / Level ••', note: 'Masked structure' },
        { label: 'Keying data', value: '••••••', note: 'Never shown in placeholders' },
      ]}
    />
  );
}