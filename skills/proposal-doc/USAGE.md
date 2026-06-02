# Proposal Document Skill — Usage

## Triggers
- `/proposal-doc-template` — generate from args or a .md source file
- `/proposal-doc` — shorthand alias

## Assets
- `examples/source-pdfs/` — 6 official Cochl proposal PDFs (01–06.pdf), the visual source of truth
- `examples/mobile-dashboard-proposal.html` — reference output (fully styled HTML)
- `examples/mobile-dashboard-proposal.md` — reference source Markdown
- `../../shared/branding/logo_cochl_top.svg` — Cochl logo (inline SVG, two gradient IDs per doc)

## Key Arguments
| Arg | Description |
|---|---|
| `source` | Path to a .md file to convert (optional) |
| `project` | Project name (required) |
| `client` | Client name or company (required) |
| `presenter` | Designer / presenter name (default: HJ Kim) |
| `date` | Proposal date (default: today) |
| `scope` | Comma-separated scope phases |
| `milestones` | Number of milestones (default: 2) |
| `budget` | Total project budget in USD |
| `output` | Output path (default: ./{project-slug}-proposal.html) |

## Output
- Self-contained HTML — A4 pages (210mm × 297mm)
- Print via `Cmd+P → Save as PDF` for pixel-perfect output
- 6 pages: Cover → Project Overview → Milestones → Payments → Terms and Conditions → Final Summary

## Writing Conventions
- First person: "I will", "I'll", "I've"
- Scope bullet descriptions end with semicolons
- All placeholder variables in `<angle-bracket>` notation, rendered in blue (`#1155cc`)
- GDPR and Governing Law headings use IBM Plex Mono

## Examples
See `examples/mobile-dashboard-proposal.html` for a complete reference proposal.
