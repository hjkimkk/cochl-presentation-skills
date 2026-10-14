# Changelog

All notable changes to the `cochl-design` plugin. Versions follow [semver](https://semver.org):
**major** = a command or skill is removed or renamed, **minor** = a new skill, template or theme,
**patch** = fixes to existing templates and docs.

Every release bumps `version` in `.claude-plugin/plugin.json`; teammates only receive an update
when that number changes. Add entries under **Unreleased** in each PR; the release moves them
under a version heading.

## Unreleased

- design-system: turn a Figma node into code via `design-sync/config/mapping.json` (Code Connect
  stand-in, Path 2); test snippet uses `color="primary"` (was a non-existent `variant` prop).
- design-sync skill (review by YJ): `report <Component>` (last compare result, not a full report);
  exit `1` can be a run error, not only drift; debug (`analyze`, `code`), coverage and
  `fix --dry-run` listed; mapping changes are filed for the owners, not edited.
- design-sync: Button `propMap` verified against Figma fills (Red → `color="danger"`, Primary →
  `primary`, Secondary → `secondary`, Link → `HyperlinkButton`).

## 2.0.0 — 2026-10-13

First release as a Claude Code plugin (Phase 2, Workstream A + B).

### Changed (breaking)
- **Install is now a plugin**, not a file copy. Run `bash scripts/migrate-to-plugin.sh` once; it
  removes the old copied skills and the `cochl-skills-autoupdate` SessionStart hook, then installs
  the plugin. Updates arrive through the plugin marketplace, no `git pull` hook.
- `/pitch-deck` is a pointer into `cochl-presentation` (PT template theme `pt-template`).
- Old command names `/pitch-deck-skill`, `/dr-template`, `/design-review-template` and
  `/proposal-doc-template` are no longer skills; `/cochl-design` routes them to the current skill.

### Added
- `/cochl-design` router: one entry point for every Cochl skill.
- `skills/cochl-design/core/`: `brand-core.md`, `tokens.md`, `qa-checklist.md`, themes `plex` and
  `pt-template`. The only place brand colors and fonts are defined.
- `/design-sync` skill: thin wrapper over the `design-sync/` drift engine.
- CI: `skills-lint` on every PR (frontmatter, referenced paths, no brand values outside `core/`,
  manifests agree, CHANGELOG line for plugin changes); `plugin-release` tags `v<version>` and
  publishes a GitHub release when `plugin.json`'s version changes on `main`.
- design-sync: Figma ↔ code inventory and mismatch audits (`docs/design-sync/`); mapping covers
  all 20 Figma families (15 checked by `sync`, 5 pending publish/engine), 0 AMBIGUOUS
  (`design-sync/scripts/coverage.mjs`, coverage KPI on the dashboard).

### Removed
- Root leftovers: root `SKILL.md`, `cochl-brochure-skill/`, `cochl-social-kit/`, nested
  `cochl-presentation-skills/`, stray screenshot.
- Brand values copied into individual SKILL.md files (SKILL.md lines 3,907 → 1,818).

### Fixed
- 101 class lecture: cover, closing and footer-logo rules; logo path.
- design-review: agenda has no highlight band; one section-divider variant per deck.

## 1.0.0 — 2026-09-18

Tag `v1-final`. Skills copied by `.claude/install-skills.sh`, updated by a SessionStart `git pull` hook.
