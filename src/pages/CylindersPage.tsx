import { PlaceholderPage } from './PageScaffold';

export function CylindersPage() {
  return (
    <PlaceholderPage
      title="Cylinders"
      intro="Inventory routes for cylinders and openings are available, with no real hardware locations or keying records."
      cards={[
        { title: 'Inventory', body: 'Future cylinder records will be searchable and grouped by site.' },
        { title: 'Door schedule', body: 'Opening labels remain generic until real data storage and masking rules are implemented.', status: 'Masked' },
        { title: 'Lifecycle', body: 'Install, rekey, and retire workflows are planned but inactive.' },
      ]}
      rows={[
        { label: 'Cylinder label', value: 'Cylinder Demo 01', note: 'Synthetic inventory item' },
        { label: 'Opening', value: 'Area Placeholder', note: 'No address or room identifier' },
        { label: 'Pinning', value: '•• •• ••', note: 'Masked operational detail' },
      ]}
    />
  );
}