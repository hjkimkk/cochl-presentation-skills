---
name: design-sync
description: Checks drift between the Figma Cochl Design System and @cochlearai/ui code. Use when the user asks whether a component in code matches Figma, wants a drift or coverage report, or wants to validate or extend the Figma ↔ code component mapping.
---

# design-sync (wrapper)

The engine lives in the repo at `design-sync/` and is owned by YJ. This skill only runs it.

1. Find the engine: `design-sync/cli.mjs` in the current repo, or, when this skill runs from the `cochl-design` plugin, `../../design-sync/cli.mjs` next to this skill folder. Ask the user for the path if neither exists.
2. Pick the command:

| Ask | Command (run in `design-sync/`) |
|---|---|
| Is the mapping valid? | `node cli.mjs mapping validate` |
| Drift for all components | `node cli.mjs sync` |
| Drift for one component | `node cli.mjs compare <Component>` |
| Suggested fixes | `node cli.mjs suggest <Component>` |
| Report | `node cli.mjs report` |

3. Exit codes: `0` clean · `1` drift · `2` mapping error · `3` needs input. Report drift; only `2` is a failure.
4. Do not edit `design-sync/config/mapping.json` or engine code from this skill — open an issue for YJ instead.

Supported components today: run `node cli.mjs` with no arguments to print the list.
