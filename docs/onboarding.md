# Contribution guide (v2)

How to change the `cochl-design` plugin: add a template, fix a skill, ship a release.
Users only need the [README](../README.md#install-plugin-v2) install steps.

## How the plugin is built

```
cochl-presentation-skills/          ← the plugin root and the `cochl` marketplace
├── .claude-plugin/                 plugin.json (name, version) · marketplace.json
├── CHANGELOG.md                    add a line under "Unreleased" in every PR that changes skills/
├── skills/
│   ├── cochl-design/               /cochl-design router
│   │   └── core/                   brand-core.md · tokens.md · qa-checklist.md · themes/{plex,pt-template}.md
│   ├── cochl-presentation/         decks, brochure, social kit, press kit (references/registry.md)
│   ├── pitch-deck/                 pointer → cochl-presentation, theme pt-template
│   ├── design-review/              Proposal / Direction Alignment reviews
│   ├── proposal-doc/               proposal documents (HTML → PDF)
│   ├── design-system/              install + apply @cochlearai/ui
│   └── design-sync/                thin wrapper over the design-sync/ engine
├── design-sync/                    Figma ↔ code drift engine + mapping.json
└── scripts/skills-lint/            CI: lint.mjs (skills) · release.mjs (manifests, CHANGELOG)
```

The plugin picks up every `skills/<name>/SKILL.md` on its own. There is nothing to register.

## The one rule: brand values live in `core/`

Colors, fonts and logo rules are defined **only** in `skills/cochl-design/core/`. Everywhere else,
refer to a token (`--accent`, `--font-body`, `--light-gray`) or link to `brand-core.md` / a theme
file. CI fails a PR that adds a hex color or a brand font name outside `core/`.

Need a new value? Add the token to `core/themes/<theme>.md` (and `core/tokens.md` if it comes from
`@cochlearai/ui`) in the same PR, then use the token name.

## Module owners and reviewers

| Module | Path | Owner (reviews PRs) | Backup |
|---|---|---|---|
| Router + brand core | `skills/cochl-design/` | HJ | NS |
| present (decks, brochure, banners, press kit) | `skills/cochl-presentation/`, `skills/pitch-deck/` | HJ | — |
| review | `skills/design-review/` | HJ | — |
| proposal | `skills/proposal-doc/` | HJ | — |
| ds-install | `skills/design-system/` | NS | HJ |
| ds-sync (skill) | `skills/design-sync/` | HJ | YJ |
| design-sync engine + mapping | `design-sync/` | YJ (engine) · HJ (mapping entries) | — |
| Release + CI | `.claude-plugin/`, `scripts/skills-lint/`, `.github/workflows/` | HJ | YJ |

Every PR needs one approval from the module owner. A brand-core change also needs NS.

## Add a deck or document template

1. Find the row in `skills/cochl-presentation/references/registry.md`. A 🟡 row already names the
   file path; otherwise add a row (template, teams, path, status).
2. Write the spec at that path. Start from the nearest ✅ template of the same kind and keep its
   structure. Link `../../../cochl-design/core/brand-core.md` and use the theme's token names;
   decks also inherit `../deck-engine.md`.
3. Flip the registry row to ✅.
4. Generate one sample with `/cochl-presentation` and check it against `core/qa-checklist.md`.
5. CHANGELOG line under **Unreleased**, for example `- present: add data labeling guideline deck`.

## Add a new skill

Only when the work doesn't fit an existing module (ask the router owner first).

1. `skills/<name>/SKILL.md` with frontmatter `name: <name>` (must equal the folder name) and a
   `description` that says what it makes and when to use it. Claude picks the skill by that description.
2. Body: purpose, inputs, numbered build steps, output, QA checklist. Write in the imperative.
   Reference files by relative path so CI can check they exist.
3. Keep SKILL.md under 400 lines; move long specs into `references/`.
4. Add a row to the router table in `skills/cochl-design/SKILL.md` and to the README skills table.
5. CHANGELOG line, minor version bump at the next release.

## Check before opening a PR

```bash
node scripts/skills-lint/lint.mjs --base origin/main
node scripts/skills-lint/lint.mjs --strict
node scripts/skills-lint/release.mjs --base origin/main
claude plugin validate .
```

For design-sync changes: `cd design-sync && npm test && node cli.mjs mapping validate && node scripts/coverage.mjs`.

## Release (every two weeks)

1. In `CHANGELOG.md`, rename **Unreleased** to `## X.Y.Z — YYYY-MM-DD` and add a new empty
   **Unreleased** above it. Version: **patch** for fixes, **minor** for a new template/skill/theme,
   **major** when a command is removed or renamed.
2. Set the same `version` in `.claude-plugin/plugin.json` (not in `marketplace.json`).
3. Merge to `main`. The `plugin-release` workflow tags `vX.Y.Z` and publishes the GitHub release.
4. Teammates with auto-update on get it at their next Claude Code start. Announce it in the design
   channel with the release link.

Success metric: everyone on the design team is on the latest version within 7 days of a release
(check: `claude plugin list` shows the version).

## Style for SKILL.md

- Imperative voice: "Generate all six sections", not "The skill generates".
- Numbered build steps; a QA checklist of conditions at the end.
- Decision rules instead of judgment calls.
- Never invent numbers, customer names or quotes; leave `[NEEDS INPUT]`.

See [architecture.md](./architecture.md) for how the plugin loads skills.
