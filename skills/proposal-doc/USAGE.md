# Proposal Document Skill — Usage

## Triggers
- `/proposal-doc-template` — generate from args or a .md source file
- `/proposal-doc` — shorthand alias

## Assets
- `examples/source-pdfs/` — 6 official Cochl proposal PDFs (01–06.pdf), the visual source of truth
- `examples/mobile-dashboard-proposal.html` — reference output (fully styled HTML)
- `examples/mobile-dashboard-proposal.md` — reference source Markdown
- `assets/logo_cochl_top.svg` — Cochl logo (inline SVG, two gradient IDs per doc; stops point at `--logo-g1..3` when inlined)

## Key Arguments
| Arg | Description |
|---|---|
| `source` | Path to a .md file to convert (optional) |
| `project` | Project name (required) |
| `client` | Client name or company (required) |
| `presenter` | Presenter name or team (default: HJ Kim) |
| `role` | Presenter role for the footer (optional; omitted if not given) |
| `voice` | `I` (solo designer, default) or `we` (team / BD) |
| `date` | Proposal date (default: today) |
| `scope` | Comma-separated scope phases |
| `milestones` | Number of milestones (default: 2) |
| `budget` | Total project budget in USD (no budget → amounts `[NEEDS INPUT]`) |
| `terms` | Payment terms (default for a solo design engagement: 30% deposit + milestones) |
| `output` | Output path (default: ./{project-slug}-proposal.html) |

## Output
- Self-contained HTML — fixed A4 pages (210mm × 297mm), `@page { size: A4; margin: 0 }`
- Print via `Cmd+P → Save as PDF` → exactly 6 pages
- 6 pages: Cover → Project Overview → Milestones → Payments → Terms and Conditions → Final Summary

## Writing Conventions
- Voice: "I will" for a solo designer, "we will" for a team / BD proposal — one voice throughout
- Scope bullet descriptions end with semicolons
- Unfilled template slots: `<angle-bracket>` `.var` in `--doc-link` blue; unconfirmed facts/figures: `[NEEDS INPUT]` (`.needs-input`)
- Footer company facts from `../cochl-design/core/brand-core.md` §3b (contact@cochl.ai, San Francisco, CA, USA)
- Korean: set `lang="ko"` (`--font-doc` has no Hangul) — see SKILL.md → Typography
- GDPR and Governing Law headings use the `--font-mono` role

## Examples
See `examples/mobile-dashboard-proposal.html` for a complete reference proposal.
