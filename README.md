# cochl-presentation-skills

A reusable Claude Code skill library for creating Cochl presentations, design reviews, proposal documents, and design system workflows.

## Skills

| Skill | Command | Purpose |
|---|---|---|
| [cochl-design](./skills/cochl-design/) | `/cochl-design` | Router: picks the right Cochl skill for a request and owns the shared brand core (`core/`: brand rules, themes, tokens, QA checklist) |
| [cochl-presentation](./skills/cochl-presentation/) | `/cochl-presentation` | Build any Cochl presentation collateral — decks, documents, brochures, social media banners, press kit. Template registry in `references/registry.md`, deck engine in `references/deck-engine.md`, deck variants in `references/decks/`, brochure SVG library (`references/brochure/`), Social Media Banner Kit (`references/social-kit/`), Press / Media Kit (`references/press-kit/`) |
| [pitch-deck](./skills/pitch-deck/) | `/pitch-deck` | Thin stub that forwards to `/cochl-presentation` with theme `pt-template` (official Cochl PT template look) |
| [design-review](./skills/design-review/) | `/design-review` | Generate Proposal or Direction Alignment review presentations |
| [proposal-doc](./skills/proposal-doc/) | `/proposal-doc` | Create styled Cochl proposal documents (HTML → PDF) |
| [design-system](./skills/design-system/) | `/design-system` | Install and apply the Cochl design system (`@cochlearai/ui`) in React projects |
| [design-sync](./skills/design-sync/) | `/design-sync` | Sync design tokens and check design/code drift (thin skill over the `design-sync/` engine) |

Commands are the skill folder names.

## Quick Start

```bash
git clone https://github.com/hjkimkk/cochl-presentation-skills.git
cd cochl-presentation-skills
bash .claude/install-skills.sh
```

After install, skills are available in any Claude Code session:

```
/cochl-design        — not sure which skill? start here (router)
/cochl-presentation  — build a Cochl deck, brochure or social banner
/pitch-deck          — update or build a deck in the PT template style
/design-review       — generate a design review HTML presentation
/proposal-doc        — create a styled proposal document
```

## Stay up to date (auto-update)

Skills are **copied** into `~/.claude/skills/` at install time — they do **not** refresh on
their own. So after anyone updates a template on `main`, each teammate would otherwise have
to `git pull` + re-install + restart Claude Code. To avoid chasing everyone, set up
auto-update **once**; from then on every new Claude Code session pulls the latest templates
automatically, **from any project**.

Add this to your **`~/.claude/settings.json`** (create the file if it doesn't exist), and
replace `/ABSOLUTE/PATH/TO/cochl-presentation-skills` with where you cloned this repo:

```json
{
  "hooks": {
    "SessionStart": [
      { "hooks": [ { "type": "command",
        "command": ": cochl-skills-autoupdate; git -C \"/ABSOLUTE/PATH/TO/cochl-presentation-skills\" pull --ff-only -q 2>/dev/null || true; bash \"/ABSOLUTE/PATH/TO/cochl-presentation-skills/.claude/install-skills.sh\" >/dev/null 2>&1 || true" } ] }
    ]
  }
}
```

- **One-time setup — no more manual pulls or per-teammate update requests.**
- It only fast-forwards (`--ff-only`), so it never clobbers local work; if it can't, it silently no-ops.
- Turn it off by deleting the `cochl-skills-autoupdate` hook from `~/.claude/settings.json`.
- Newly pulled skills load on the **next** session start.

> **Just presenting or testing a deck (not generating a new one)?** You don't need the skill
> installed at all — the canonical, always-latest deck is the shared **Figma** file. See
> [docs/cochl-101-team-guide.md](./docs/cochl-101-team-guide.md).

## Repository Structure

```
cochl-presentation-skills/
├── skills/
│   ├── cochl-design/        — /cochl-design router + shared brand core
│   │   ├── SKILL.md
│   │   └── core/            — brand-core.md, tokens.md, qa-checklist.md, themes/{plex,pt-template}.md
│   ├── cochl-presentation/  — /cochl-presentation
│   │   ├── SKILL.md
│   │   └── references/      — deck-engine.md, registry.md, decks/ (incl. pt-template/), brochure/, social-kit/, press-kit/, assets/
│   ├── pitch-deck/          — /pitch-deck stub → cochl-presentation, theme pt-template
│   ├── design-review/       — Design review skill + PPTX source templates
│   ├── proposal-doc/        — Proposal doc skill + source PDFs + examples
│   ├── design-system/       — Design system install + apply (@cochlearai/ui)
│   └── design-sync/         — /design-sync thin skill over the design-sync/ engine
├── scripts/
│   ├── skills-lint/         — CI lint for skills (names, paths, brand-value rules)
│   ├── brand-facts/         — Brand fact extraction + tests
│   ├── check-leftovers.sh   — Leftover-reference check
│   └── gen_pptx.py          — PPTX generation utility
├── design-sync/             — Design-sync engine (YJ)
├── shared/
│   └── branding/            — Shared logos and brand assets
├── docs/
│   ├── architecture.md      — How the skills system works
│   └── onboarding.md        — New contributor guide
└── .claude/
    └── install-skills.sh    — Copies every skills/<dir> to ~/.claude/skills/
```

Brand values live only in `skills/cochl-design/core/` — CI (skills-lint) enforces it.

## Dependencies

- Claude Code CLI
- Skills install to `~/.claude/skills/` and are available globally
- `scripts/gen_pptx.py` requires `python-pptx` — `pip install python-pptx`

## Contributing

See [docs/onboarding.md](./docs/onboarding.md) for how to add or update a skill.
