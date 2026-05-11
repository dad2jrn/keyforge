import { PlaceholderPage } from './PageScaffold';

export function CustomersSitesPage() {
  return (
    <PlaceholderPage
      title="Customers / Sites"
      intro="Plan customer accounts and site groupings without entering real organization names or addresses."
      cards={[
        { title: 'Customer records', body: 'Future list, detail, and search surfaces will live here with secure defaults.' },
        { title: 'Site hierarchy', body: 'Buildings, floors, and areas are represented only as generic placeholder labels for now.' },
        { title: 'Contacts', body: 'Contact workflows are planned; no personal names, emails, or phone numbers are displayed.' },
      ]}
      rows={[
        { label: 'Customer label', value: 'Synthetic Customer A', note: 'Non-sensitive fixture label' },
        { label: 'Site label', value: 'Demo Site Zone', note: 'No physical address' },
        { label: 'Access note', value: 'Masked', note: 'Operational detail hidden' },
      ]}
    />
  );
}