import type { ReactNode } from 'react';

interface PlaceholderCard {
  readonly title: string;
  readonly body: string;
  readonly status?: 'Planned' | 'Masked' | 'Local only';
}

interface PlaceholderTableRow {
  readonly label: string;
  readonly value: string;
  readonly note: string;
}

export function PlaceholderPage({
  title,
  intro,
  cards,
  rows,
  children,
}: {
  readonly title: string;
  readonly intro: string;
  readonly cards: readonly PlaceholderCard[];
  readonly rows?: readonly PlaceholderTableRow[];
  readonly children?: ReactNode;
}) {
  return (
    <section className="page-section stack" aria-labelledby={`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-title`}>
      <div className="card stack-sm">
        <div className="split">
          <div>
            <h2 className="section-title" id={`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-title`}>{title}</h2>
            <p className="help-text">{intro}</p>
          </div>
          <span className="chip chip-warning">Placeholder</span>
        </div>
      </div>

      <div className="cols-3">
        {cards.map((card) => (
          <article className="card stack-sm" key={card.title}>
            <div className="split">
              <h3 className="card-title">{card.title}</h3>
              <span className="chip">{card.status ?? 'Planned'}</span>
            </div>
            <p className="help-text">{card.body}</p>
          </article>
        ))}
      </div>

      {rows ? (
        <div className="card stack-sm">
          <h3 className="card-title">Synthetic preview</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Example</th>
                <th>Security note</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {children}
    </section>
  );
}