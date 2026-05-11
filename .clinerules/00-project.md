# Project Rule

This project is KeyForge Local, a secure local-first master-key management app for locksmithing work.

Use these files as the project source of truth:

- `PLAN.md` (local-only, gitignored)
- `STYLE.md` (local-only, gitignored)
- `.clinerules/memory-bank/projectbrief.md`
- `.clinerules/memory-bank/productContext.md`
- `.clinerules/memory-bank/activeContext.md`
- `.clinerules/memory-bank/systemPatterns.md`
- `.clinerules/memory-bank/techContext.md`
- `.clinerules/memory-bank/progress.md`

If `PLAN.md` or `STYLE.md` exist locally, they take precedence over any generated assumptions.

## Scope Rules

- Do not invent unrelated features.
- Prefer small, reviewable changes.
- Keep tasks scoped to the current story or Kanban card.
- Do not change unrelated files as side effects.
- Do not add speculative abstractions beyond what the current story requires.
- Three similar lines of code is better than a premature abstraction.

## Version Strategy

Version 1 is a local-first static web app. It has no backend, no cloud database, and no required monthly cost. All work should serve that goal unless explicitly working on Version 2 migration posture.
