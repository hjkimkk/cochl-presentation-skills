# Phase 2 retro: Unified Design Ecosystem (template)

- **Date:** Dec 18, 2026 (handover) · **Facilitator:** HJ · **People:** NS, YJ, HJ (+ Dev lead)
- **Plan:** [Confluence: Phase 2 Execution Plan](https://cochl.atlassian.net/wiki/spaces/UXIT/pages/2134278154)

## 1. Success metrics

Fill the **Result** column on the day; the **How to measure** column is reproducible.

| Metric (target) | How to measure | Status on 2026-10-13 | Result Dec 18 |
|---|---|---|---|
| One install path and one entry point; zero root leftovers | README install = plugin only; `/cochl-design` router; `git ls-tree --name-only HEAD` | ✅ plugin v2.0.0 released; router live; no leftovers; hub page `docs/hub/` | |
| Brand values only in `core/`; CI keeps hardcoded values at zero | `node scripts/skills-lint/lint.mjs --strict` | ✅ clean | |
| SKILL.md lines down ≥ 30% | `wc -l skills/*/SKILL.md` vs tag `phase2-before` (3,907) | ✅ 1,818 (−53%) | |
| Design team on latest version within 7 days of each release | `claude plugin list` per person after each release | not started (first release pending) | |
| Code Connect / mapping ≥ 80% of DS components, zero AMBIGUOUS | `node design-sync/scripts/coverage.mjs` | ✅ 100% mapped (75% checked by sync, 5 pending), 0 AMBIGUOUS; Path 2: ds-install reads mapping, Button propMap verified | |
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
| Engine support for a 2nd package (`@cochlearai/calendar`) | YJ | `mapping.json` → `pending.DatePicker.blockedBy` |
| Move pending entries after the next `@cochlearai/ui` publish | HJ | `mapping.json` → `pending` |
| Icon matches marked probable/ambiguous (9) | HJ + NS | `mapping.json` → `Icons.mapping.iconMap` |
| Refresh stale Figma snapshots (`FIGMA_TOKEN` secret) | YJ | `design-sync/scripts/capture.mjs` |
| PT template owner sign-off on regression | PT owner | `docs/phase2-baseline/RESULT.md` |
| Live check of plugin namespacing (run the migration first) | HJ | `docs/phase2-plugin-namespace-check.md` |
| Repo secrets `COCHLEARAI_NPM_TOKEN` + `FIGMA_TOKEN`; enable GitHub Pages (hub + dashboard deploy) | HJ | repo Settings |

## 4. Phase 3 candidates

- Visual regression for decks (screenshot diff per template, run in CI).
- Accessibility module (contrast and focus checks on generated HTML; Tabs `Focus` gap).
- Jira tickets created automatically from Design QA findings.
- Value comparisons for structure-only mapping entries (Popover, Card, Skeleton, Modal, Icons).
- `cli.mjs inventory`: regenerate the Figma/GitHub/Storybook inventory weekly in CI.
