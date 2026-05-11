import { PlaceholderPage } from './PageScaffold';

export function KeyholdersPage() {
  return (
    <PlaceholderPage
      title="Keyholders"
      intro="Assignment and accountability placeholders avoid real names, contact details, and possession records."
      cards={[
        { title: 'Roster', body: 'Future rosters will use secure access controls before displaying any person-linked data.', status: 'Masked' },
        { title: 'Issuance', body: 'Checkout, return, and transfer flows are planned but inactive.' },
        { title: 'Audit trail', body: 'Activity previews use synthetic labels only and do not imply real possession.' },
      ]}
      rows={[
        { label: 'Holder label', value: 'Synthetic Holder A', note: 'Non-person placeholder' },
        { label: 'Assigned key', value: 'SYN-KEY-•', note: 'Masked key symbol' },
        { label: 'Contact', value: 'Hidden', note: 'No personal information' },
      ]}
    />
  );
}