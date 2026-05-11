# Memory Bank Rule

Before starting any task in this repository, read these files if they exist:

- `PLAN.md` (local-only, gitignored)
- `STYLE.md` (local-only, gitignored)
- `.clinerules/memory-bank/projectbrief.md`
- `.clinerules/memory-bank/productContext.md`
- `.clinerules/memory-bank/activeContext.md`
- `.clinerules/memory-bank/systemPatterns.md`
- `.clinerules/memory-bank/techContext.md`
- `.clinerules/memory-bank/progress.md`

Use these files as the project source of truth. Do not rely on assumptions about the tech stack, feature scope, or architecture without reading them first.

## Updating the Memory Bank

At the end of any meaningful task, update the relevant Memory Bank files:

- Update `activeContext.md` with current focus, recent changes, and next steps.
- Update `progress.md` with completed work, remaining work, and known issues.
- Update `systemPatterns.md` only when architecture decisions change.
- Update `techContext.md` only when tooling, commands, dependencies, or setup change.
- Update `memory-bank/kanbanState.md` to ensure a consistent and constant up to date kanban state.
- Update `memory-bank/backlog.md` if planned work changed
- Do not rewrite the entire Memory Bank unnecessarily.
- Keep updates concise and factual.

## If Memory Bank Files Are Missing

If `activeContext.md` or `progress.md` do not exist, create them before continuing with any feature work. Ask the user to confirm if you are unsure of the current state.
