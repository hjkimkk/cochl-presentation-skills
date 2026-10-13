# Skills System Architecture

## How It Works

Each skill is a folder inside `skills/`. A skill folder contains:

```
skills/{skill-name}/
├── SKILL.md              — Full skill spec (read by Claude at invocation)
├── USAGE.md              — Human-readable quick reference
├── {skill-name}.md       — Skill index file (trigger registration)
├── assets/               — Source templates, PPTX files, logos
├── examples/             — Reference outputs
└── templates/            — Reusable intermediate templates
```

The skill index file (e.g., `skills/pitch-deck/SKILL.md`) is what Claude Code's skill system reads to discover the skill. It registers the trigger words and points to SKILL.md for full instructions.

## Install Flow

```
claude plugin marketplace add hjkimkk/cochl-presentation-skills → claude plugin install cochl-design@cochl
```

The repo is a Claude Code plugin (`.claude-plugin/plugin.json`) and its own marketplace (`.claude-plugin/marketplace.json`, name `cochl`, plugin source `.`). Claude Code caches the plugin and discovers every `skills/<name>/SKILL.md`; skills answer to `/<name>` and `/cochl-design:<name>`. Updates arrive when `plugin.json`'s version changes and marketplace auto-update is on. v1 installs (copy script + SessionStart `git pull` hook) migrate once with `scripts/migrate-to-plugin.sh`.

## Skill Loading Order

When a trigger (e.g., `/proposal-doc`) is invoked:
1. Claude reads the skill index file (`.md`) for metadata and args
2. Claude reads `SKILL.md` inside the folder for the full specification
3. Claude reads any referenced asset paths (PDFs, logos, examples)
4. Claude executes the construction process defined in SKILL.md

## Shared Assets

The `shared/` directory holds brand assets used across multiple skills:

```
shared/
├── branding/
│   ├── logo_cochl_top.svg    — Primary Cochl wordmark (inline SVG)
│   └── ...
└── templates/                — Cross-skill reusable HTML/CSS snippets
```

## Scripts

`scripts/gen_pptx.py` — Python utility that converts structured JSON or HTML slide data into `.pptx` format using `python-pptx`. Required for skills that produce PPTX output.

```bash
pip install python-pptx
python scripts/gen_pptx.py --input deck.json --output output.pptx
```

## Adding a New Skill

See [onboarding.md](./onboarding.md) for step-by-step instructions.
