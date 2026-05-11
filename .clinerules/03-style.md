# Style Rule

Use `STYLE.md` as the styling source of truth. If `STYLE.md` is not available, read `.clinerules/memory-bank/systemPatterns.md` for the summary.

## Global CSS — Not Component CSS

Styling belongs in the global style scaffold under `src/styles/`, not inside individual component or page files.

The style files are:

```text
src/styles/tokens.css     — spacing, typography, radius, transitions
src/styles/themes.css     — dark and light color token definitions
src/styles/base.css       — body, root, link, heading, focus, selection defaults
src/styles/layout.css     — app shell, sidebar, topbar, grid, responsive rules
src/styles/components.css — reusable component classes
src/styles/utilities.css  — small layout and text utilities
src/styles/print.css      — print-specific report styling
src/styles/index.css      — @import barrel (main.tsx imports only this)
```

## Semantic Global Classes

Components must use these semantic global classes:

- `.card` — primary panel surface
- `.btn`, `.btn-primary`, `.btn-warning`, `.btn-danger`, `.btn-ghost` — buttons
- `.chip`, `.chip-success`, `.chip-warning`, `.chip-danger` — status badges
- `.table`, `.table-sticky` — data tables
- `.form-grid`, `.form-field` — form layout
- `.input`, `.select`, `.textarea` — form controls
- `.callout`, `.callout-warning`, `.callout-danger` — warnings and notices
- `.masked` — sensitive data masking display
- `.pin-grid`, `.pin-grid-cell`, `.pin-grid-header` — pinning worksheets
- `.report-surface` — print/preview report surfaces
- `.page-title`, `.section-title`, `.card-title`, `.help-text` — typography
- `.metric-value`, `.metric-label` — dashboard metric display
- `.sidebar-nav-link`, `.sidebar-nav-section`, `.sidebar-brand` — sidebar
- `.app-shell`, `.sidebar`, `.main-shell` — layout shell

## Theme Rules

- Do not hard-code theme colors in components.
- Do not use inline styles for layout or color unless there is a narrow, documented technical reason.
- Apply theme through `html[data-theme="dark"]` and `html[data-theme="light"]`.
- Use CSS custom properties from tokens and themes, not literal color values.
- Dark theme: deep navy/slate identity from the original mockups.
- Light theme: off-white app background (`#f3f6fb`) with white cards — never pure white as the body.
- Both themes must use the same class names; only token values differ.

## What Not to Do

```tsx
// BAD: hard-coded color
<div style={{ background: "#fff", borderRadius: 22 }}>

// BAD: Tailwind color utilities (before Tailwind is officially adopted)
<div className="bg-white rounded-xl shadow-lg p-5 text-slate-900">

// GOOD: semantic global class
<div className="card">
```
