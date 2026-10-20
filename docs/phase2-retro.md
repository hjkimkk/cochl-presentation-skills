# Phase 2 retro: Unified Design Ecosystem (template)

- **Date:** Dec 18, 2026 (handover) · **Facilitator:** HJ · **People:** NS, YJ, HJ (+ Dev lead)
- **Plan:** [Confluence: Phase 2 Execution Plan](https://cochl.atlassian.net/wiki/spaces/UXIT/pages/2134278154)

## 1. Success metrics

Fill the **Result** column on the day; the **How to measure** column is reproducible.

| Metric (target) | How to measure | Status on 2026-10-15 | Result Dec 18 |
|---|---|---|---|
| One install path and one entry point; zero root leftovers | README install = plugin only; `/cochl-design` router; `git ls-tree --name-only HEAD` | ✅ plugin v2.0.0 released; router live; no leftovers; hub page `docs/hub/` | |
| Brand values only in `core/`; CI keeps hardcoded values at zero | `node scripts/skills-lint/lint.mjs --strict` | ✅ clean | |
| SKILL.md lines down ≥ 30% | `wc -l skills/*/SKILL.md` vs tag `phase2-before` (3,907) | ✅ 1,818 (−53%) | |
| Design team on latest version within 7 days of each release | `claude plugin list` per person, collected with [form B](./phase2-feedback-form.md#form-b-7-day-version-check) 7 days after each release | first update **v2.1.0** prepared (PR `phase2/milestone3-prep`); count from its release date | |
| Code Connect / mapping ≥ 80% of DS components, zero AMBIGUOUS | `node design-sync/scripts/coverage.mjs` | ✅ 100% mapped, 0 AMBIGUOUS; checked by sync 75% → **80% (16/20)** with PR #42 (DatePicker via `@cochlearai/calendar`); last 4 wait for the next `@cochlearai/ui` publish (cochl-dashboard `fix/publish-packages-workflow`). Drift dashboard live; snapshots re-verified 2026-10-15 | |
| Onboarding: 4 teams | attendance log in `phase2-onboarding-sessions.md` | not started (W8–W11) | |

## 2. What worked / what didn't

| Worked | Didn't | Change next time |
|---|---|---|
| | | |

## 3. Open items handed over

| Item | Owner | Where |
|---|---|---|
| D2 (18 code-only components: add to Figma or mark code-only) | NS | `docs/design-sync/unmatched-backlog.md` |
| D3 (story-only variants → library) | NS + Dev | `docs/design-sync/sync-plan.md` |
| D4 (variant-level mapping format) | YJ | `sync-plan.md` |
| ~~Engine support for a 2nd package (`@cochlearai/calendar`)~~ Done 2026-10-15 (branch `design-sync/calendar-package`, YJ to review): `code.package` + `COCHL_CALENDAR_DIR`; DatePicker checked by sync | YJ | `adapters/code/codeAdapter.mjs`, `mapping.json` → `components.DatePicker` |
| Move pending entries after the next `@cochlearai/ui` publish | HJ | `mapping.json` → `pending` |
| ~~Icon matches marked probable/ambiguous (9)~~ Done 2026-10-15: all exact; Mic → `RecordIcon` | HJ + NS | `mapping.json` → `Icons.mapping.iconMap` |
| ~~Refresh stale Figma snapshots (`FIGMA_TOKEN` secret)~~ Done 2026-10-15: all re-verified, FRESH; optional REST fingerprints via `capture.mjs --write` | YJ | `design-sync/scripts/capture.mjs` |
| PT template owner sign-off on regression | PT owner | `docs/phase2-baseline/RESULT.md` |
| Live check of plugin namespacing (run the migration first) | HJ | `docs/phase2-plugin-namespace-check.md` |
| ~~Repo secrets `COCHLEARAI_NPM_TOKEN` + `FIGMA_TOKEN`; enable GitHub Pages~~ Done 2026-10-15: CI green, hub and drift dashboard live | HJ | repo Settings |

## 4. Phase 3 candidates

- Visual regression for decks (screenshot diff per template, run in CI).
- Accessibility module (contrast and focus checks on generated HTML; Tabs `Focus` gap).
- Jira tickets created automatically from Design QA findings.
- Value comparisons for structure-only mapping entries (Popover, Card, Skeleton, Modal, Icons).
- `cli.mjs inventory`: regenerate the Figma/GitHub/Storybook inventory weekly in CI.
