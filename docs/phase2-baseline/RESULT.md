# Phase 2 Workstream A — W4 regression result

Run on 2026-10-01 against branch `phase2/consolidation`. Before = tag `phase2-before` (= local main df49844). Inputs: `inputs/`.
Gate: `scripts/brand-facts/diff.py --allow <theme>` (ruling R11): every after-font/color must be in before ∪ theme; theme colors/fonts present before must stay; canvas equal; logo distortion ≤ 5%.
HTML facts were collected in the built-in browser pane (facts.js in a 1440×810 iframe) because Chromium cannot launch in the Bash sandbox; PPTX facts via python-pptx. No screenshots.

| Case | Theme | Result |
|---|---|---|
| investor (cochl-presentation) | plex | ✓ pass |
| design-review | plex | ✓ pass |
| proposal-doc | plex | ✓ pass (facts identical to before) |
| pt-template HTML (`/pitch-deck` → cochl-presentation) | pt-template | ✗ 4 findings — **within run-to-run variance (see control)** |
| pt-template PPTX | pt-template | ✗ 5 findings — **within run-to-run variance (see control)** |
| design-system | — | not run (no npm registry access, ruling R9); React-mode text verified byte-identical in Task 9 review |

## pt-template: control run
A second run of the **unchanged old** pitch-deck skill (`before-control/`) was compared to the first old run with the same gate:
- HTML: 7 findings, including canvas 1440×810 → 1280×720 and a logo distorted 100%.
- PPTX: 5 findings (Courier New, Segoe UI Emoji, three off-theme colors).

The after output has fewer findings than the old skill against itself, and it is closer to the PT spec (Roboto body font, 1440×810, white content slides + navy section break, undistorted logo). Conclusion: the pt-template differences come from LLM variance in a template family that ships no canonical stylesheet, not from the restructure. **Needs PT template owner sign-off** (compare `before/pt-template/` and `after/pt-template/`).

Follow-up worth doing (not in this workstream): give `decks/pt-template/pt-template.md` one canonical base stylesheet, so agents stop writing CSS ad hoc. That is the main source of variance here.

## Raw gate output

### investor
## Brand facts
- ✓ no brand-fact differences
## Layout notes
- colors dropped (non-theme): #1a2a6e, #2b44b8, #333333
- layouts ['slide cover', 'slide stmt', 'slide', 'slide band', 'slide black', 'slide', 'slide black', 'slide', 'slide black', 'slide stmt', 'slide thanks'] → ['slide cover bg-pure', 'slide statement', 'slide problem', 'slide usecase', 'slide traction bg-pure', 'slide compcards bg-pure', 'slide offering bg-pure', 'slide market', 'slide revenue bg-pure', 'slide statement', 'slide thanks']

### design-review
## Brand facts
- ✓ no brand-fact differences
## Layout notes
- none

### proposal-doc
## Brand facts
- ✓ no brand-fact differences
## Layout notes
- none

### pt
## Brand facts
- ✗ font Arial is off-theme (not in before or theme)
- ✗ color #0b0b12 is off-theme (not in before or theme)
- ✗ color #333333 is a theme color missing after (in before and theme, absent in after)
- ✗ color #ebddff is a theme color missing after (in before and theme, absent in after)
## Layout notes
- colors dropped (non-theme): #4a3a6b

### ptx
## Brand facts
- ✗ color #15294a is off-theme (not in before or theme)
- ✗ color #b0b0c0 is off-theme (not in before or theme)
- ✗ color #dddddd is off-theme (not in before or theme)
- ✗ color #333333 is a theme color missing after (in before and theme, absent in after)
- ✗ color #ebddff is a theme color missing after (in before and theme, absent in after)
## Layout notes
- colors dropped (non-theme): #4a3a6b
- layouts ['Blank', 'Blank', 'Blank', 'Blank', 'Blank', 'Blank', 'Blank', 'Blank'] → ['Blank', 'Blank', 'Blank', 'Blank', 'Blank', 'Blank', 'Blank']

## Size
- SKILL.md lines: **1,871** (baseline 3,907, target ≤ 2,735) — −52%. Includes the two new skills (cochl-design 29, design-sync 24).
- All `.md` lines under `skills/`: **6,147** (baseline 7,871) — −22%, so duplicated text was removed, not just moved.

## Router
12/12 — see `router-results.md`.

## Sign-offs
- PT template owner: PENDING
- NS (design-system): PENDING
- YJ (design-sync skill): PENDING
