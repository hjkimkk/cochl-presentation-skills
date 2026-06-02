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
- Sets up IBM Plex Sans as the primary font
- Scaffolds base theme provider and example components
- Enforces no-hardcoded-colors rule via token references

## Design Tokens (Core)
| Token | Value | Use |
|---|---|---|
| `--c-enterprise` | `#0B1F3A` | Slide / page backgrounds |
| `--c-ai` | `#6B4EFF` | Primary accent (purple) |
| `--c-analytics` | `#2F80ED` | Secondary accent (blue) |
| `--col-card` | `#0F2847` | Card surfaces |
| `--col-muted` | `#8B9BB4` | Secondary text |
| `--grad-main` | `135deg, #6B4EFF → #2F80ED` | KPI values, accent lines |

## Examples
See `examples/base-theme-example.tsx` and `examples/vite-react-install.md`.
