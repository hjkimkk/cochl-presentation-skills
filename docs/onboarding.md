# New Contributor Guide

## Overview

This repo is a skill library for Claude Code. Skills are structured Markdown specifications that teach Claude how to produce specific outputs (HTML presentations, proposal documents, design system setups).

> **Keeping skills current.** The skills ship as the `cochl-design` plugin. Teammates get your change when it is released (version bump in `.claude-plugin/plugin.json`, see [README → Releases and updates](../README.md#releases-and-updates)). Team members who only present/test a deck should use the shared Figma instead — see [cochl-101-team-guide.md](./cochl-101-team-guide.md).

## Repository Structure

```
cochl-presentation-skills/
├── skills/           — One folder per skill
├── scripts/          — Shared utilities (gen_pptx.py)
├── shared/           — Cross-skill brand assets
├── docs/             — Architecture and contributor docs
├── .claude-plugin/   — plugin.json (version) + marketplace.json
└── CHANGELOG.md      — add a line under "Unreleased" in every skill PR
```

## Adding a New Skill

### 1. Create the skill folder

```bash
mkdir -p skills/{skill-name}/{assets,examples,templates}
```

### 2. Write SKILL.md

SKILL.md is the authoritative spec Claude reads. It must define:
- **Purpose** — what the skill produces and when to use it
- **Input format** — required and optional arguments
- **Construction process** — numbered steps Claude follows
- **Output spec** — file format, naming, where to save
- **QA checklist** — conditions that must be true before output is delivered

Keep SKILL.md self-contained. Claude reads it fresh on each invocation with no memory of prior runs.

### 3. Write the skill index file

Create `skills/{skill-name}/{skill-name}.md` with frontmatter:

```yaml
---
name: skill-name
description: >
  One paragraph. What it does, when to use it, what it produces.
triggers:
  - /skill-trigger
  - /skill-alias
args:
  - name: arg_name
    required: true
    description: "What this argument controls"
---

Complete skill spec in: /path/to/SKILL.md
```

### 4. Write USAGE.md

USAGE.md is for humans. Keep it under one page. Include: triggers, args table, output description, and a link to the example.

### 5. Add an example

Put a representative output in `examples/`. For HTML-output skills, the example should be a complete, working HTML file.

### 6. Add a CHANGELOG line

Nothing to register: the plugin picks up every `skills/<name>/SKILL.md`. Add a line under **Unreleased** in `CHANGELOG.md` (CI fails without it).

### 7. Update README.md

Add a row to the Skills table with: skill name, triggers, and one-line purpose.

---

## Style Rules for SKILL.md

- Write in imperative voice: "Parse inputs", "Generate all 6 sections", not "You should parse" or "The skill parses"
- Numbered construction steps — Claude follows them in order
- Include a QA checklist at the end — these are conditions, not instructions
- No section should be ambiguous enough to require judgment calls — if judgment is needed, specify the decision rule explicitly
- Reference exact file paths for assets and examples so Claude can read them without searching

## Design Principles

All skills in this repo follow the **Cochl Presentation System**:
- IBM Plex Sans as the primary typeface
- Dark enterprise palette: `#0B1F3A` backgrounds, `#0F2847` card surfaces
- Gradient accent: `linear-gradient(135deg, #6B4EFF, #2F80ED)`
- Narrative-first layouts: avoid dashboard-style card grids
- Self-contained output: no broken external asset refs

See [architecture.md](./architecture.md) for how the skill system works.
