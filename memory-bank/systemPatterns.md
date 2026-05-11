# System Patterns

## Version 1 Architecture

- Static React + TypeScript frontend.
- Static deployment through GitHub Pages.
- SQLite WASM running in the browser.
- OPFS/local persistence where supported.
- Web Worker for SQLite operations.
- Web Crypto for encrypted backup and restore.
- Repository/service layer between UI and data access.
- Global CSS theme system.
- Sensitive data masked by default.

## Future Version 2 Architecture

- Static frontend hosted by GitHub Pages or Cloudflare Pages.
- Cloudflare Worker API.
- Cloudflare D1 tenant database.
- Client-side encryption for sensitive tenant records.
- Encrypted cloud backup and sync.
- Roles, permissions, device/session management, and billing later.

## Key Patterns

- React components must not call SQLite directly.
- Services call repository interfaces.
- Domain logic lives outside UI components.
- Writes should be transactional.
- Sensitive writes should be auditable.
- Use stable client-generated IDs for sync readiness.
- Use soft deletes/tombstones for syncable records.
- Styling comes from global CSS tokens and reusable classes.
- Theme is applied through `html[data-theme]`.
- Only non-sensitive theme preference may be stored in localStorage.
- Do not store application data in localStorage.

## Future SaaS Pattern

D1 should store encrypted tenant records, not raw bittings, pinning, keyholder data, or door-to-key relationships in plaintext.