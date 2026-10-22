# cochl-presentation-skills

A reusable Claude Code skill library for creating Cochl presentations, design reviews, proposal documents, and design system workflows.

**Team hub:** https://hjkimkk.github.io/cochl-presentation-skills/ (install, commands, owners, links) · drift dashboard at [`/drift/`](https://hjkimkk.github.io/cochl-presentation-skills/drift/). Source: [`docs/hub/index.html`](./docs/hub/index.html).

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

## Install (plugin, v2)

The skills ship as one Claude Code plugin, `cochl-design`, from the `cochl` marketplace in this repo.

**Everyone (new teammates and the old copy install):** paste this into the Terminal once:

```bash
curl -fsSL https://raw.githubusercontent.com/hjkimkk/cochl-presentation-skills/main/scripts/migrate-to-plugin.sh | bash
```

It adds the `cochl` marketplace, installs `cochl-design` for your user and **turns auto-update on**
(`extraKnownMarketplaces.cochl.autoUpdate` in `~/.claude/settings.json`), so there is no `/plugin`
step. If you had the old copy install, it also removes the `cochl-skills-autoupdate` hook and moves
the copied skills out of `~/.claude/skills/` (backup, not deleted). From a clone:
`bash scripts/migrate-to-plugin.sh` (add `--dry-run` to see what it would change). It needs `python3`.

<details><summary>Manual install</summary>

```bash
claude plugin marketplace add hjkimkk/cochl-presentation-skills
claude plugin install cochl-design@cochl --scope user
```

Then turn on auto-update once: in Claude Code run `/plugin` → Marketplaces → `cochl` → Enable auto-update.
</details>

Restart Claude Code, then:

```
/cochl-design        — not sure which skill? start here (router)
/cochl-presentation  — build a Cochl deck, brochure or social banner
/pitch-deck          — update or build a deck in the PT template style
/design-review       — generate a design review HTML presentation
/proposal-doc        — create a styled proposal document
```

Plugin skills also answer to their namespaced form, e.g. `/cochl-design:cochl-presentation`.

**Private repo:** installs and background updates use your git credentials and never prompt.
Set them up once with `gh auth login` and `gh auth setup-git` (or an SSH key in ssh-agent).

## Releases and updates

- Version lives in `.claude-plugin/plugin.json` (semver). Teammates only get an update when it changes.
- Every PR that changes `skills/` or `.claude-plugin/` adds a line under **Unreleased** in [CHANGELOG.md](./CHANGELOG.md) (CI checks it).
- **Every Monday** the `weekly-release` workflow checks Unreleased. If anything is waiting, it opens a
  `Release v<version>` PR (plugin.json bumped: minor when something was added, else patch; entries
  moved under a dated heading). Review and merge it: `plugin-release` tags `v<version>` and publishes
  the GitHub release, and teammates get the new version in their next Claude Code session (auto-update
  runs within ten minutes of their first message; the new version loads on the next launch).
  So a change merged to `main` reaches everyone within about a week. Run it any time from
  Actions → weekly-release → Run workflow.

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
│   ├── skills-lint/         — CI lint for skills (names, paths, brand-value rules) + release check
│   ├── migrate-to-plugin.sh — one-time v1 → plugin migration
│   ├── brand-facts/         — Brand fact extraction + tests
│   ├── check-leftovers.sh   — Leftover-reference check
│   └── gen_pptx.py          — PPTX generation utility
├── design-sync/             — Design-sync engine (YJ)
├── shared/
│   └── branding/            — Shared logos and brand assets
├── docs/
│   ├── architecture.md      — How the skills system works
│   └── onboarding.md        — New contributor guide
├── .claude-plugin/
│   ├── plugin.json          — plugin name + version (semver)
│   └── marketplace.json     — the `cochl` marketplace (this repo)
├── CHANGELOG.md
└── .claude/
    └── install-skills.sh    — DEPRECATED v1 copy installer (use scripts/migrate-to-plugin.sh)
```

Brand values live only in `skills/cochl-design/core/` — CI (skills-lint) enforces it.

## Dependencies

- Claude Code CLI
- Installed as the `cochl-design` plugin (user scope), available in every project
- `scripts/gen_pptx.py` requires `python-pptx` — `pip install python-pptx`

## Contributing

See [docs/onboarding.md](./docs/onboarding.md) for how to add or update a skill.
