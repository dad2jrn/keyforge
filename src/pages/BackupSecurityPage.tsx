import { PlaceholderPage } from './PageScaffold';

export function BackupSecurityPage() {
  return (
    <PlaceholderPage
      title="Backup / Security"
      intro="Security posture route for future local backup, restore, encryption, and reveal controls."
      cards={[
        { title: 'Backups', body: 'Backup creation and restore controls are intentionally not wired in this placeholder.', status: 'Local only' },
        { title: 'Sensitive data', body: 'Examples remain masked and synthetic until real data flows are implemented.', status: 'Masked' },
        { title: 'Review checklist', body: 'Future security reviews will validate export, storage, and reveal behavior.' },
      ]}
      rows={[
        { label: 'Backup file', value: 'Not selected', note: 'No files read or written' },
        { label: 'Encryption status', value: 'Planned', note: 'No crypto changes in shell' },
        { label: 'Reveal policy', value: 'Masked by default', note: 'Safe placeholder posture' },
      ]}
    />
  );
}