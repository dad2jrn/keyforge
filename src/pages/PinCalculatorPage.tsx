import { PlaceholderPage } from './PageScaffold';

export function PinCalculatorPage() {
  return (
    <PlaceholderPage
      title="Pin Calculator"
      intro="Calculator workspace placeholder. No bitting, pin stack, or locksmithing calculations are implemented in this shell."
      cards={[
        { title: 'Input guardrails', body: 'Future inputs will require explicit reveal and validation before sensitive values appear.', status: 'Masked' },
        { title: 'Worksheet preview', body: 'The grid below demonstrates layout only and contains masked cells.' },
        { title: 'Export posture', body: 'Printing and export flows will default to restricted, masked output.' },
      ]}
    >
      <div className="card stack-sm">
        <h3 className="card-title">Masked worksheet preview</h3>
        <div className="pin-grid" aria-label="Masked pin calculator worksheet preview">
          {['Ch', '1', '2', '3', '4', '5', '6', 'Top', '••', '••', '••', '••', '••', '••', 'Master', '••', '••', '••', '••', '••', '••', 'Bottom', '••', '••', '••', '••', '••', '••'].map((value, index) => (
            <div className={`pin-grid-cell ${index < 7 ? 'pin-grid-header' : ''} ${value === '••' ? 'masked' : ''}`} key={`${value}-${index}`}>{value}</div>
          ))}
        </div>
      </div>
    </PlaceholderPage>
  );
}