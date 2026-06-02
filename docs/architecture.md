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

The skill index file (e.g., `pitch-deck-skill.md`) is what Claude Code's skill system reads to discover the skill. It registers the trigger words and points to SKILL.md for full instructions.

## Install Flow

```
git clone → bash .claude/install-skills.sh
```

`install-skills.sh` copies skill index files to `~/.claude/skills/` and folder-based skills to `~/.claude/skills/{skill-name}/`. This makes them available in any Claude Code session on the machine.

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
