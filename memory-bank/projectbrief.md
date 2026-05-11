# Project Brief

## Product

KeyForge Local is a secure, local-first master key management application for locksmithing work.

## Version 1 Goal

Build a static GitHub Pages web app that uses browser-local SQLite, OPFS persistence, Web Crypto encryption, and encrypted `.mkdb` backups.

## Future Goal

Preserve a migration path to Cloudflare Worker + D1 for encrypted cloud backup, encrypted record sync, and eventual SaaS use by small locksmith operations.

## Core Requirements

- App code can be public.
- Master-key data must never be public.
- Version 1 has no required backend.
- Version 1 has no required cloud database.
- Version 1 must run from static hosting.
- No real locksmithing, customer, keyholder, bitting, pinning, or door-schedule data belongs in the repository.
- Bittings and pinning must be masked by default.
- Sensitive reveal must be intentional and temporary.
- Encrypted backup and restore are required.
- Sensitive writes must be auditable.
- The architecture must support future Cloudflare Worker + D1 sync.

## Primary Source Documents

- `PLAN.md`
- `STYLE.md`

If those files conflict with generated assumptions, prefer `PLAN.md` and `STYLE.md`.