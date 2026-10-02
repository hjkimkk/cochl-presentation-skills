# design-sync (MVP)

Design-to-Code Sync — proof of concept. Compares components between the Figma
**Cochl Design System** and the **`@cochlearai/ui`** package, emits a structured
diff + fix suggestions (`sync-report.json` + human summary), and can apply verified
fixes behind a confirmation gate. **Zero runtime dependencies.**

Scope today: **10 components** — Button, Alert, Chip, Input, Checkbox, Radio,
Tooltip, Dropdown, Table, Progress. Adding a component is **config, not code**
(`config/mapping.json` + a Figma snapshot). Includes read-only fix suggestions
(Phase 8), a confirm-gated `--fix` (Phase 9), and a **batch drift dashboard**
(Phase 10) with CI exit codes.

### Batch + mapping + lifecycle (Phase 10–12)
```bash
node cli.mjs sync                    # all components → sync-summary.json + dashboard.html
node cli.mjs sync --max-age-hours 0  # force STALE to see freshness warnings
node cli.mjs mapping validate        # check the mapping table BEFORE comparison
open reports/dashboard.html          # scan the drift dashboard (read-only)
```
- **Statuses:** SYNC · DRIFT · UNMATCHED · NEEDS_INPUT · **ONE_TO_MANY** · **AMBIGUOUS** · CONFIG_ERROR.
- **Drift classes:** token-drift (auto-fixable) · value-drift · structural-drift · unmatched · missing-info · **accepted-drift**.
- **Mapping** (`config/mapping.json`): explicit `type` (ONE_TO_ONE/ONE_TO_MANY/AMBIGUOUS/UNMATCHED) + `figma.role` + per-target `role` — names are not trusted (same name + different role → AMBIGUOUS).
- **Freshness:** `config/sync-config.json` `snapshot.maxAgeHours` (or `--max-age-hours`); FRESH/STALE/UNKNOWN; stale never treated as current.
- **Accepted drift:** `config/accepted-drift.json` — scoped per component+property+values; reclassifies to ACCEPTED_DRIFT (auditable, never auto-fixed). Not a blanket ignore.
- **Exit codes:** `0` clean · `1` verified drift · `2` config/mapping error (incl. AMBIGUOUS) · `3` needs-input / ONE_TO_MANY pending.

See `../docs/design-to-code-architecture.md` §13–§14.

## Guarantees
- **No fabrication.** Every value comes from a real source and carries provenance
  (Figma node id, or code `file:line`). A value the adapter can't verify is emitted
  as `[NEEDS INPUT]`, never guessed.
- **Deterministic + offline.** Reads the design snapshot + the local package.

## Usage
```bash
cd design-sync
node cli.mjs analyze Alert          # normalized DESIGN model (from Figma snapshot)
node cli.mjs code    Alert          # normalized CODE model (from @cochlearai/ui)
node cli.mjs compare Alert          # full diff + suggestions → reports/sync-report.Alert.json
node cli.mjs suggest Alert          # Phase 8: read-only fix suggestions
node cli.mjs fix     Alert --dry-run  # Phase 9: show proposed patch, write nothing
node cli.mjs fix     Alert --yes      # Phase 9: apply to sandbox copy, test, re-compare, BEFORE/AFTER
node cli.mjs report  Alert          # re-print the last report
npm test                            # engine tests (diff + fix)
```
Components: `Button`, `Alert`. `compare` exits `2` when there is unresolved drift.

### Fix workflow (Detect → Diff → Suggest → Dry-run → Confirm → Patch → Test → Re-compare)
- **Read-only by default.** `fix` without `--yes` is a dry run; it prints the exact
  proposed diff and writes nothing.
- **Confirm-gated.** `--yes` is the explicit confirmation (the non-interactive
  equivalent of answering "yes" at a prompt).
- **Safe target.** Applied edits go to a **sandbox working copy** under `.work/ui`,
  never the installed package or production. In production the same edit descriptor
  targets the real source repo (`cochlearai/cochl-dashboard`) once reachable.
- **Only verified fixes.** A fix is auto-applied only when a mismatch is a scalar
  value with both sides verified and a locatable code literal/token. Structural
  mismatches (variant taxonomy), missing props, unmatched components, and anything
  `[NEEDS INPUT]` are **suggestion-only** — never auto-changed.
- **Validated.** After applying, it runs the tests and re-compares, reporting
  BEFORE vs AFTER.

## How each side is read
- **Design** — `adapters/figma/figmaAdapter.mjs` reads
  `data/figma/Button.snapshot.json`, a **verified** capture from the Figma MCP
  (variant axes via `get_metadata`, tokens via `get_variable_defs`). The CLI can't
  call MCP tools itself, so the agent captures the snapshot; regenerate it when the
  design changes.
- **Code** — `adapters/code/codeAdapter.mjs` reads the real published package:
  `Button.d.ts` (props/variants), `Button.js` (style literals, e.g. `border-radius`),
  and **dynamically imports** `lib/ThemeColors.js` to resolve real token hexes.
  Default location is the local Yarn cache; override with `COCHL_UI_DIR=/path/to/@cochlearai/ui`.
- **Mapping** — `config/mapping.json` is the human-authored, authoritative mapping
  (Figma Code Connect is unavailable on this seat). It declares which design key
  compares to which code key and how (`equal` / `setEqual` / `presence` / `unmatched`).
  It supplies **no values** — only the mapping.

## Current results (real)
- **Button** `7 match · 1 mismatch · 1 missing · 1 unmatched · 1 needs-input` — primary
  color `#4b68ff` and radius `4px` **match**; variant taxonomy **mismatches** (Figma
  `category`+`type` vs code `color`); `sm/md/lg` **missing in code**; `type=Link`
  **unmatched** (separate `HyperlinkButton`); code label font **needs input**. No
  auto-fixable value drift.
- **Alert → Toast** BEFORE `7 match · 2 mismatch` → after `fix Alert --yes` `8 match ·
  1 mismatch`. The **success/info accent** was drifted (design `Blue/70 #445EE5` vs code
  `blue[60] #4B68FF`) and is **auto-fixed** (`blue[60]→blue[70]`, verified token swap);
  the **Success↔info** naming stays a **manual** taxonomy decision.

## Layout
```
design-sync/
├── cli.mjs                     analyze | code | compare | suggest | fix | report
├── core/       model · normalize · diff · fix · apply
├── adapters/   figma/figmaAdapter (snapshot-driven) · code/codeAdapter (recipe-driven)
├── config/mapping.json         authoritative Figma↔code mapping + code extract recipes
├── data/figma/*.snapshot.json  verified design captures (provenance)
├── report/     json · human
├── test/       diff.test.mjs · fix.test.mjs
├── .work/      sandbox working copy for `fix --yes` (gitignored)
└── reports/    generated sync-report.*.json (gitignored)
```

## Adding a component (data, not code)
1. Capture a verified Figma snapshot → `data/figma/<Name>.snapshot.json` (generic
   `fields` list with node-id provenance).
2. Add a `components.<Name>` entry to `config/mapping.json`: `code.component` (dist
   dir name — may differ, e.g. Alert→Toast), a `code.extract` recipe, and
   `comparisons`.
3. `node cli.mjs compare <Name>`. No engine/adapter code changes.
