# Security Rule

This app manages sensitive physical access-control data. Security rules are not optional.

## Never Commit Real Locksmithing Data

Never create, commit, or store real locksmithing data in this repository.

Do not create real or realistic examples of:

- Customer records.
- Site addresses.
- Door schedules.
- Keyholders.
- Bittings.
- Pinning.
- Master-key charts.
- Cylinder records.
- Access-control mappings.

Use clearly synthetic placeholder data only (e.g., "ACME Corp", door "A-101", bitting "12345").

## localStorage Restrictions

Do not store application data in localStorage.

Only non-sensitive UI preferences may be stored in localStorage:

- Theme preference (`theme`).

Everything else — database content, bittings, keyholder records, session state, key data — must not touch localStorage.

## Banned File Types

Do not create or commit files with these extensions or purposes:

- `.sqlite`, `.sqlite3`, `.db`, `.db3`, `.mkdb`
- `.csv`, `.tsv`, `.xlsx`, `.xls`, `.ods`, `.numbers`
- `.bak`, `.backup`, `.dump`, `.sql`
- Exported reports with real data.
- Real database backups.
- Production fixtures.

These are blocked by `.gitignore` and pre-commit hooks. Do not bypass those protections.

## Sensitive Data UX Rules

- Bittings must be masked by default. Reveal requires an intentional user action.
- Pinning must be masked by default.
- Keyholder contact details should be protectable.
- Sensitive reveal must auto-expire (clear on navigation, lock, or timeout).
- Plaintext export must show a warning flow before proceeding.
- Encrypted `.mkdb` is the normal backup path. Plaintext export is the dangerous exception.
- Every sensitive write must generate an audit log entry.

## Audit Log

Sensitive actions that must be audited include:

- Revealing bittings or pinning.
- Exporting plaintext data.
- Issuing, returning, or marking keys lost/stolen.
- Creating or committing rekey events.
- Restoring a backup.
- Cross-keying exceptions.
