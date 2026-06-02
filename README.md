# cochl-presentation-skills

A reusable Claude Code skill library for creating Cochl presentations, design reviews, proposal documents, and design system workflows.

## Skills

| Skill | Trigger | Purpose |
|---|---|---|
| [pitch-deck](./skills/pitch-deck/) | `/pitch-deck-skill` · `/cochl-pitch-deck` | Build and update Cochl pitch decks (HTML + PPTX) |
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
│   ├── pitch-deck/          — Pitch deck skill + Cochl PT template
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
