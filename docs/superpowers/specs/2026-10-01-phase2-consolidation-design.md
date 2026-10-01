# Phase 2 · Workstream A — Skill Consolidation (Design)

- **Date:** 2026-10-01
- **Owner:** HJ · **Reviewers:** NS (design-system), YJ (design-sync), PT template owner (pt-template output)
- **Timeline:** W1–W4 (Oct 5 – Oct 30, 2026)
- **Source plan:** [Unified Design Ecosystem, Phase 2: Execution Plan (Q4 2026)](https://cochl.atlassian.net/wiki/spaces/UXIT/pages/2134278154)

## 1. Goal

Merge the five Cochl skills into one shared brand core plus modules, with `/cochl-design` as the single entry point, while every command that works today keeps working.

Out of scope: plugin packaging / semver / changelog (Workstream B), Code Connect (C), onboarding (D).

## 2. Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **One core, two named themes**: `plex` (default) and `pt-template` (Century Gothic + Roboto, `#832BFB`, 10×5.625in) | The official `Cochl_PT_template.pptx` uses a different type system; keeping it as a theme keeps every value in `core/` without changing pitch-deck output. |
| D2 | **Modules stay real skills; `/cochl-design` is a router** | Each skill keeps its name, description and auto-trigger. |
| D3 | **Skill names unchanged** | Existing commands keep working without alias stubs. |
| D4 | **pitch-deck merges into cochl-presentation** as `decks/pt-template/`; `/pitch-deck-skill` becomes the only stub | One deck-building skill; removes the largest SKILL.md. |
| D5 | **Router is named `cochl-design`, not `cochl`** | `cochl` would claim the company-wide namespace and collide with skills other teams may build; installer `rm -rf`s same-named folders silently. Matches the Workstream B plugin name. |
| D6 | **`core/` lives inside the router skill** (`skills/cochl-design/core/`) | Installer copies each `skills/<dir>` as a sibling into `~/.claude/skills/`, and the plugin layout keeps the same siblings, so `../cochl-design/core/…` resolves in both. |
| D7 | **Drop `triggers:` frontmatter; no stubs for `/dr-template`, `/proposal-doc`** | Claude Code ignores `triggers:`, so those aliases never worked; adding them would add entry points. |

## 3. Target layout

```
skills/
├── cochl-design/                   NEW router skill (/cochl-design)
│   ├── SKILL.md                    routing table only (~60 lines)
│   └── core/
│       ├── brand-core.md           shared: logo, glow, gradient, voice, imagery
│       ├── themes/plex.md          DEFAULT — IBM Plex Sans/Mono, near-black + indigo
│       ├── themes/pt-template.md   Century Gothic + Roboto, #832BFB, 10×5.625in
│       ├── tokens.md               pointer to @cochlearai/ui tokens (not a copy)
│       └── qa-checklist.md         shared brand QA, run by every skill
├── cochl-presentation/             present
│   └── references/
│       ├── deck-engine.md          HTML→PPTX, page-nav, output paths (moved out of brand-core)
│       └── decks/pt-template/      pitch-deck's 30 layouts + Cochl_PT_template.pptx
├── pitch-deck/                     STUB — name `pitch-deck-skill`, original description
├── design-review/                  review (name unchanged)
├── proposal-doc/                   proposal (name unchanged)
├── design-system/                  ds-install (name unchanged)
└── design-sync/                    NEW thin skill wrapping the design-sync/ CLI (YJ owns engine)
```

**Rules**

- Hex colors and font names appear **only** under `skills/cochl-design/core/`.
- Each module SKILL.md keeps only module-specific content (structure, layouts, workflow) and replaces its brand section with:
  > Brand: read `../cochl-design/core/brand-core.md`, then `../cochl-design/core/themes/<theme>.md`. Default theme `plex`. Run `../cochl-design/core/qa-checklist.md` before delivering.
- `design-system` reads tokens from `@cochlearai/ui` directly; its pitch-deck mode is removed and handed to `cochl-presentation`.

## 4. Routing (`/cochl-design`)

| The request is about… | Goes to | Theme |
|---|---|---|
| deck, pitch, presentation, brochure, banner, press kit, document | `cochl-presentation` | `plex` |
| …PT template, `.pptx` template, Century Gothic, AcousticShield deck | `cochl-presentation` → `decks/pt-template` | `pt-template` |
| design review (Proposal / Direction Alignment & Feedback) | `design-review` | `plex` |
| design proposal document (HTML → PDF) | `proposal-doc` | `plex` |
| install/apply `@cochlearai/ui`, build React UI | `design-system` | `@cochlearai/ui` tokens |
| Figma ↔ code drift, mapping, coverage | `design-sync` | n/a |

- **Unclear request:** ask one multiple-choice question listing the six rows, then route. Never guess between two skills.
- **Two-part request:** route the first part; offer the second when it is done. Never run two skills at once.
- **`/cochl-design` with no arguments:** show a menu of the six rows, one line each.
- The router does no work itself. Every skill can still be called directly.
- Users may override the theme in words; there is no third theme. Only `decks/pt-template` sets `pt-template`.

**pitch-deck stub** (~10 lines): name `pitch-deck-skill`, original description; body: load `cochl-presentation`, use `references/decks/pt-template/`, theme `pt-template`, always output HTML **and** PPTX.

## 5. Migration

**Branching.** The SessionStart hook pulls `main` into every teammate's session, so `main` is effectively production.
- W1 cleanup merges **directly to `main`** (deletes only unused copies).
- All other work goes to the integration branch **`phase2/consolidation`**, merged to `main` once, after the W4 regression check passes.

| Week | Work |
|---|---|
| **W1** (Oct 5) | (1) `docs/phase2-inventory.md`: every brand value with file:line and its target in `core/`. (2) **Cleanup → `main`**: delete root `SKILL.md`, `cochl-brochure-skill/`, `cochl-social-kit/`, nested `cochl-presentation-skills/`, `skills/pitch-deck/pitch-deck-skill.md` (stale v1.0), duplicate `install-skills.sh` copies — after diffing each against `references/` to confirm nothing exists only in the copy. (3) Record the "before" outputs in `docs/phase2-baseline/`. |
| **W2** (Oct 12) | (4) Create `skills/cochl-design/core/` from `cochl-presentation/references/brand-core.md` + pitch-deck Part 1 tokens. (5) Split deck machinery into `cochl-presentation/references/deck-engine.md`. (6) Replace each skill's brand section — **one PR per skill**: design-review, proposal-doc, design-system (NS reviews), cochl-presentation. |
| **W3** (Oct 19) | (7) Move pitch-deck layouts + `.pptx` into `decks/pt-template/`, add to `registry.md`, replace `pitch-deck/SKILL.md` with the stub. (8) Add `/cochl-design` router. (9) Add `design-sync` thin skill (YJ reviews). (10) Add CI lint. (11) Check plugin namespacing: bare skill names and `/cochl-design` must still resolve, and the router must not become `/cochl-design:cochl-design`. If it would, plan to put the router at the plugin root in Workstream B. |
| **W4** (Oct 26) | (12) Regression check (§6); fix differences. (13) Tag `main` `v1-final`, merge `phase2/consolidation` → `main`. (14) Update Confluence (`/cochl` → `/cochl-design`) and README. |

**Size metric.** Report two numbers at W4:
- SKILL.md lines: baseline **3,907**, target **≤ 2,735** (−30%).
- Total markdown lines under `skills/`, so that moving text into `references/` is not counted as cleanup.

## 6. Testing

### Regression (W4)

| Skill | Fixed input | Compared |
|---|---|---|
| `cochl-presentation` (plex) | investor deck, `docs/phase2-baseline/inputs/investor.md` | per-slide HTML screenshots |
| `cochl-presentation` → `pt-template` via `/pitch-deck-skill` | same content in PT layouts | HTML screenshots + `.pptx` fonts, colors, 10×5.625in slide size |
| `design-review` | one Proposal review | HTML screenshots |
| `proposal-doc` | `examples/mobile-dashboard-proposal.md` | HTML screenshots + PDF |
| `design-system` | install into a scratch Vite app | files changed, tokens applied |

- Playwright screenshots at a fixed viewport, side by side in `docs/phase2-baseline/report.html`.
- AI output varies between runs, so the comparison checks **brand facts**, not pixels: rendered fonts, computed hex colors, logo placement, slide size and which layouts were chosen. A script pulls these from the DOM before and after and flags differences.
- **Pass:** zero brand-fact differences; layout differences documented and accepted by the owner. **Fail:** the merge to `main` waits.
- **Router:** 12 example requests (2 per routing row, 1 unclear, 1 two-part) must each land on the expected skill.

### CI lint — `.github/workflows/skills-lint.yml`, every PR

1. Every `skills/*/SKILL.md` has `name` and `description`; no two skills share a `name`.
2. Every path referenced (`../cochl-design/core/…`, `references/…`) exists.
3. No hex color or font name **added** outside `skills/cochl-design/core/` (checks the PR diff, so W2 can clean up one skill at a time).
4. Warning only: any SKILL.md over 400 lines.

## 7. Rollback

- W2/W3 PRs each change one skill, so a bad one can be reverted alone inside `phase2/consolidation`.
- After the W4 merge: revert that one merge commit; the existing hook brings everyone back to the old skills on their next session. The hook stays until the Workstream B plugin migration replaces it.
- `v1-final` tag on `main` marks the pre-merge state.

## 8. Risks

| Risk | Mitigation |
|---|---|
| A deleted leftover folder held content that exists nowhere else | W1 diffs each folder against `references/` before deleting |
| pt-template output drifts after the merge | Brand-fact regression check + sign-off from the PT template owner |
| Relative `../cochl-design/core/` paths break in the plugin layout | W3 namespacing check; CI path check |
| Teammates get half-migrated skills | Integration branch; one merge to `main` after W4 |
