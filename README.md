# cochl-presentation-skills

A reusable Claude Code skill library for creating Cochl presentations, design reviews, proposal documents, and design system workflows.

## Skills

| Skill | Trigger | Purpose |
|---|---|---|
| [cochl-pitch-deck](./skills/cochl-pitch-deck/) | `/cochl-pitch-deck` | Build a Cochl pitch deck from a brief. Bundles 5 deck template variants under `references/`: **Investor** (15), **B2B partnership/sales** (22), **Corporate strategy/roadmap** (15), **QBR/board update** (15), **Market & competitive landscape** (13) — plus a **brochure SVG library** at `references/brochure/` (12 editable-SVG layouts + 32 icons) |
| [pitch-deck](./skills/pitch-deck/) | `/pitch-deck-skill` | Update/rebuild within the official Cochl PT template (HTML + PPTX) |
| [design-review](./skills/design-review/) | `/design-review-template` · `/dr-template` | Generate Proposal or Direction Alignment review presentations |
| [proposal-doc](./skills/proposal-doc/) | `/proposal-doc-template` · `/proposal-doc` | Create styled Cochl proposal documents (HTML → PDF) |
| [design-system](./skills/design-system/) | `/install-cochl-design-system` · `/frontend-design` | Install and apply the Cochl design system in React projects |

## Quick Start

```bash
git clone https://github.com/hjkimkk/cochl-presentation-skills.git
cd cochl-presentation-skills
bash .claude/install-skills.sh
```

After install, skills are available in any Claude Code session:

```
/pitch-deck-skill        — update or build a Cochl pitch deck
/design-review-template  — generate a design review HTML presentation
/proposal-doc            — create a styled proposal document
```

## Repository Structure

```
cochl-presentation-skills/
├── skills/
│   ├── cochl-pitch-deck/    — /cochl-pitch-deck skill + references/ (5 deck-variant specs + previews; brochure/ = 12 SVG brochure templates + logos + icons)
│   ├── pitch-deck/          — /pitch-deck-skill + Cochl PT template (assets/)
│   ├── design-review/       — Design review skill + PPTX source templates
│   ├── proposal-doc/        — Proposal doc skill + source PDFs + examples
│   └── design-system/       — Design system install + frontend-design skill
├── scripts/
│   └── gen_pptx.py          — PPTX generation utility
├── shared/
│   └── branding/            — Shared logos and brand assets
├── docs/
│   ├── architecture.md      — How the skills system works
│   └── onboarding.md        — New contributor guide
└── .claude/
    └── install-skills.sh    — Copies skills to ~/.claude/skills/
```

## Dependencies

- Claude Code CLI
- Skills install to `~/.claude/skills/` and are available globally
- `scripts/gen_pptx.py` requires `python-pptx` — `pip install python-pptx`

## Contributing

See [docs/onboarding.md](./docs/onboarding.md) for how to add or update a skill.
