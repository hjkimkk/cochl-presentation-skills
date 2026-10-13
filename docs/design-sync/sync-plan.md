# Figma ↔ GitHub ↔ Storybook sync plan

- **Date:** 2026-10-07 · **Owner:** HJ (coordination) · **Decisions:** NS (design system), YJ (design-sync engine), Dev lead (library code)
- **Inputs:** `docs/design-sync/inventory/README.md` (3-way inventory), `design-sync/config/mapping.json`
- **Fits into:** Phase 2 Workstream C (W4–W10, Oct 26 – Dec 4). Phase 0–1 can start now.

## Goal

Every design-system component is:
1. defined in **Figma** (design intent),
2. implemented once in the **library** `cochlearai/cochl-dashboard/packages/cochl-ui` (no component exists only inside a story),
3. documented in **Storybook** with a link to its Figma node,
4. linked in **`mapping.json`** with a Figma component node ID,

and the gap between them is visible as a coverage % on the design-sync dashboard, regenerated automatically.

**Done when:** mapping coverage ≥ 80% of DS families with zero AMBIGUOUS; no story-only components; every story has a Figma link; the inventory regenerates in CI.

## Roles of each source

| Source | Role | Who changes it |
|---|---|---|
| Figma `Cochl Design System` | What it should look like (variants, states, tokens) | NS / design |
| GitHub `packages/cochl-ui` | The one implementation | Dev |
| Storybook | Generated from the library; shows each component and links to Figma | Dev (stories), checked by design |
| `mapping.json` | Which Figma variant = which code component + props | YJ (engine), HJ (entries) |

Rule: when Figma and code disagree, the design-sync drift report decides who changes (design intent vs implementation bug). Neither side gets edited by the sync tooling automatically.

## Current state (2026-10-07)

- Figma: 14 component families (19 with sub-parts). Two pages can't be read through the Figma MCP tool (Progress, Date picker).
- Library: 45 component folders. Storybook: 42 story files.
- Mapping: 10 entries. 9 complete, Dropdown AMBIGUOUS. Coverage 9/14 = 64%.
- Gaps: 18 components in code + Storybook but not in the Figma DS file; `Scroll` in code only; Date picker and the Dropdown `sm`/`timePicker` fields exist only inside story files.

## Phases

### Phase 0: Decisions (this week)
Answers needed before the denominator and the backlog are fixed.
- **D1 (NS):** Are Modal, Card, Navigation (GNB/LNB/FNB/ProjectNavi), Chart, Popover, Skeleton, UsageBar, UserProfile, CodeView, Accordian, NumberInput in another Figma file? → sets the DS component count (14 or up to 32).
- **D2 (NS):** For each of the 18 code-only components: **add to Figma** or **mark code-only** (excluded from coverage, documented reason).
- **D3 (NS + Dev):** Promote Date picker and the Dropdown `sm`/`timePicker` fields into library components? (recommended: yes, as `DatePicker`, `SmallDropdown`, `TimePicker`)
- **D4 (YJ):** Variant-level mapping. Keep ONE_TO_MANY with a `variant` field per target (as proposed for Dropdown), or extend the engine with a `VARIANT_MAP` type?
- **D5 (HJ/Dev):** `Scroll` is an internal utility → exclude from the DS count?
- **D6 (NS):** Are the older libraries (ADDS, B2C app, Dashboard_App_Design_System, Design_System, Dashboard_Ideation) still in use, or can they be archived?
- **D7 (NS):** Token source of truth: Figma paint/text styles (today) or Figma variables with Light/Dark modes?

#### Answers (2026-10-12)
| # | Answer | Consequence |
|---|---|---|
| D1 | **All in this file.** The "missing" components are on the Cochl Design System file's 38 pages (the first scan only read 15). | Denominator = the full Figma set, not 14 families. |
| D5 | **Yes, exclude `Scroll`.** It's an internal utility. | Not counted in coverage; listed as code-only with that reason. |
| D6 | **`Design_System` stays:** it is the homepage design system. **`Dashboard_App_Design_System` is idle:** it's for the notification app, which isn't used now, so it can be archived. ADDS, B2C app and Dashboard_Ideation: no answer yet. | design-sync ignores `Design_System` (different product) and `Dashboard_App_Design_System`. Ask again about ADDS, B2C app, Dashboard_Ideation. |
| D7 | **Variables split by Light/Dark mode** (one token, a value per mode). Fix the `Light/Semantic/Gray/10,20` paint styles either way (they hold the dark values #18191a/#111112; should be #f9f9fa/#f1f1f2). | New todo: build a color variable collection with Light and Dark modes from the 95 paint styles, then bind components to it. Interpretation to confirm with NS: modes in one collection, not two separate Light/Dark collections. |

Still open: D2, D3 (NS), D4 (YJ).

**Coverage (2026-10-13): 100% mapped (20/20 Figma families), 75% checked by `sync` (15), 5 pending, 0 AMBIGUOUS** — `node design-sync/scripts/coverage.mjs`. Pending: NumberInput, Tabs, Menu, Navigation (not in published `@cochlearai/ui@1.0.5`), DatePicker (`@cochlearai/calendar`, needs engine support). Popover, Card, Skeleton, Modal and Icons are mapped by structure only (no value comparisons yet). Icons has 8 `probable` + 1 `ambiguous` icon matches to confirm visually.

**Phase 1 status (2026-10-13): done.** Dropdown ONE_TO_MANY by type, Button/Input/Alert variant targets, node IDs on all 10 entries, NumberInput parked in `pending`; `mapping validate` exit 0.

### Phase 1: Fix the existing mapping (week of Oct 7)
Unblocks pushing `main` (design-sync CI).
- Dropdown → ONE_TO_MANY by `type` (emailSelect → `MultiSelectDropdown`; sm → `ListDropdown` + `DropdownButton`; timePicker → `Dropdown` + `DropdownButton` + `DropdownItem`).
- Complete the partial entries:
  - Button + `HyperlinkButton` (type=Link) + `ComplexButton` (type=ComplexButton)
  - Input + `TagChipInput` (type=TagChipInput)
  - Alert → decide `Toast` vs `Banner` vs `Notification` per Figma type (Basic | Link), using the Feedback/Alert stories.
- Add **component node IDs** to every entry (today only page IDs are recorded).
- `node cli.mjs mapping validate` → exit 0.

### Phase 2: Map what already exists on both sides (W4–W5)
- Tabs ↔ `Tab` + `TabItem`; Menu ↔ `Menu` (`NotificationMenu`, `UserMenu`) + MenuItem; Icons ↔ `Icons` (24 sub-families).
- Capture Figma snapshots for each new entry (`data/figma/*.snapshot.json`) and run `sync`.
- Re-read Progress and Date picker in Figma per frame (or via REST API with `FIGMA_TOKEN`) to get their variants.
- Coverage after this phase: 12/14 = 86% (Date picker still missing in code).

### Phase 3: Close story-only gaps (W5–W7, Dev)
- Move `DatePickerTrigger` and the calendar from `stories/data-display/DatePicker.stories.tsx` into `src/DatePicker/`; the story imports it.
- Add `SmallDropdown` and `TimePicker` (or size/variant props on `DropdownButton`) with the styles now in `stories/form/Dropdown.stories.tsx`.
- Map Date picker in `mapping.json` → 14/14.

### Phase 4: Figma gaps (W6–W9, NS)
Per D2:
- **Add to Figma:** design the chosen components as component sets with the same variant scheme (`theme`, `type`, `state`).
- **Code-only:** add a `mapping.json` entry with type `UNMATCHED` and a reason, so they show on the dashboard but don't count against coverage.

### Phase 5: Storybook ↔ Figma links (W5–W8, Dev)
- Every story gets `parameters.design.url` pointing at its Figma **component** node (today only a few do; some point at the old "Dashboard_Design_System_v3" URL).
- Storybook titles follow Figma family names (e.g. "Feedback/Alert" splits into Toast / Banner / Notification stories if Figma splits them).

### Phase 6: Figma cleanup (W6–W8, NS)
- Fix the misnamed spec frames: Tabs uses "InputField_Specs", Radio uses "Chip".
- Remove or archive the ~20 legacy `Dropdown/<theme>/<type>/<State>/<bool>` symbols; fix the "FiiledActive" typo.
- Split Input Field's `state` into interaction state vs layout variant.
- Decide on the "v1" page suffix (keep as version, or drop).

### Phase 7: Automate the inventory (W7–W10, HJ + YJ)
- `node cli.mjs inventory` regenerates `docs/design-sync/inventory/` from:
  - Figma: REST API (`FIGMA_TOKEN`), list component sets per page
  - GitHub: `packages/cochl-ui/src/index.ts` exports
  - Storybook: `https://dashboardstorybook.cochl.ai/index.json` (story ids, titles, component names)
- The weekly CI job (existing `snapshot-freshness` schedule) runs it, fails on new AMBIGUOUS, and publishes coverage % on the drift dashboard.

## Todo list

| # | Task | Owner | When | Done when |
|---|---|---|---|---|
| 1 | Share inventory + ask D1, D2, D3, D5 — **partly done**: D1, D5 answered; D2, D3 open | HJ → NS, Dev | Oct 7–9 | Answers recorded in this file |
| 2 | Ask D4 (variant mapping format) — **open**; interim: `variant` field per target | HJ → YJ | Oct 7–9 | Format chosen |
| 3 | ✅ Fix Dropdown mapping (variant targets) | HJ, YJ review | Oct 8–10 | validate exit 0 |
| 4 | ✅ Complete Button / Input / Alert targets (Alert: Basic + Link → Toast, 2026-10-13) | HJ, YJ review | Oct 8–10 | entries list all code targets |
| 5 | ✅ Add component node IDs to all 10 entries | HJ | Oct 10–14 | every entry has `figma.nodeId` |
| 6 | ✅ Push `main` (Workstream A) — pushed 2026-10-13 (01e06ad) | HJ | after 3 | design-sync CI passes |
| 7 | ✅ Map Tabs, Menu, Icons + snapshots (2026-10-13; Tabs/Menu pending publish) | HJ | Oct 27 – Nov 7 | `sync` runs; coverage 86% |
| 8 | ✅ Read Progress + Date picker variants (mismatch audits) | HJ | Oct 27 – Nov 7 | rows complete in figma-components.md |
| 9 | ~~Move DatePicker into the library~~ → **changed:** it exists in `@cochlearai/calendar`; add calendar stories + engine support for a 2nd package (YJ) | Dev | Nov 3–21 | `src/DatePicker` exported |
| 10 | Add SmallDropdown / TimePicker to library | Dev | Nov 3–21 | story uses library components only |
| 11 | ✅ Map Date picker (pending: engine reads only `@cochlearai/ui`) | HJ | after 9 | coverage 14/14 |
| 12 | Figma: design or mark the 18 code-only items (per D2) | NS | Nov 10 – Dec 4 | each has a Figma set or an UNMATCHED entry |
| 13 | Storybook `parameters.design` on every story | Dev | Nov 3 – Nov 28 | 42/42 stories link a Figma node |
| 14 | Figma cleanup (frame names, legacy symbols, typo, Input states) | NS | Nov 10 – Nov 28 | items in inventory §5 closed |
| 15 | ◐ `scripts/coverage.mjs` + CI step + dashboard KPI done (2026-10-13); `cli.mjs inventory` regeneration still open | HJ + YJ | Nov 17 – Dec 4 | dashboard shows coverage from CI |
| 16 | ✅ Hand UNMATCHED backlog to YJ's live-site Design QA (`unmatched-backlog.md`, 2026-10-13; send to YJ) | HJ → YJ | Dec 4 | list delivered |

## Risks

| Risk | Mitigation |
|---|---|
| D1/D2 answers late → denominator unknown | Report coverage two ways (14-family and full) until decided |
| Figma MCP truncates big pages | Per-frame queries, or REST API in CI (Phase 7) |
| Library changes (Phase 3, 5) need Dev time not planned in Q4 | Make them small PRs; Phase 3 is two components |
| Figma Dev seat not approved | Doesn't block: `mapping.json` stays the source (plan Path 2) |
