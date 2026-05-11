import { PlaceholderPage } from './PageScaffold';

export function ReportsPage() {
  return (
    <PlaceholderPage
      title="Reports"
      intro="Report routes are available for future worksheets, schedules, and audits with masked defaults."
      cards={[
        { title: 'Catalog', body: 'Report selection and filtering are planned for Version 1 feature work.' },
        { title: 'Preview', body: 'Previews must mask sensitive locksmithing data until explicitly revealed.', status: 'Masked' },
        { title: 'Print safety', body: 'Restricted-print guidance will accompany any sensitive report output.' },
      ]}
      rows={[
        { label: 'Door schedule', value: 'Planned', note: 'No site data' },
        { label: 'Keyholder audit', value: 'Planned', note: 'No personal data' },
        { label: 'Pinning worksheet', value: 'Masked', note: 'No real pinning' },
      ]}
    />
  );
}