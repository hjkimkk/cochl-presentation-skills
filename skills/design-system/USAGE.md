# Design System Skill — Usage

## Triggers
- `/install-cochl-design-system` — scaffold and install the Cochl design system into a React project
- `/frontend-design` — apply Cochl design principles and tokens to UI implementation

## Key Arguments
| Arg | Description |
|---|---|
| `project_path` | Path to the target React project root |
| `framework` | `vite` · `next` · `cra` (default: vite) |
| `theme` | `light` · `dark` · `both` (default: both) |

## What It Does
- Installs design tokens (colors, typography, spacing) as CSS custom properties
- Sets up the brand font from the shared theme as the primary font
- Scaffolds base theme provider and example components
- Enforces no-hardcoded-colors rule via token references

## Design Tokens
Brand tokens live in `../cochl-design/core/` (React mode: `tokens.md`; HTML mode: `brand-core.md` + `themes/plex.md`). Pitch decks and presentations: use the `cochl-presentation` skill.

## Examples
See `examples/base-theme-example.tsx` and `examples/vite-react-install.md`.
