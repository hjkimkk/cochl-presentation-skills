# Design-to-Code Sync Platform — Architecture

> **Status:** Phase 1 discovery document. No implementation code exists yet.
> **Scope of this doc:** describe current state, propose an MVP architecture, and
> record every gap as `[NEEDS INPUT]`. Nothing here invents component names,
> tokens, colors, typography, spacing, Figma node IDs, or code APIs. Where a value
> could not be verified from a connected source, it is marked `[NEEDS INPUT]`.

---

## 0. Ground truth vs. assumption (read this first)

This platform's entire value depends on comparing **verified** design data against
**verified** code data. During discovery, the two sides turned out to be in very
different states:

| Side | Reachable now? | What we can actually read |
|---|---|---|
| **Figma design system** | ✅ Yes — official Figma MCP authenticated as `hjkim@cochlear.ai` (admin). File confirmed: `Cochl Design System` (fileKey `aUrjRMAnE8ND8o6lAI0VcM`) | Variable/token defs, node metadata, screenshots — verified working |
| **Code (`@cochlearai/ui`)** | ✅ Yes — **v1.0.5 published package present in the local Yarn cache** | `dist/types/**` (props/variants), `dist/esm/**` (compiled styles + real hex values), `lib/ThemeColors.js`, `lib/Colors.js` — verified working |

**Both sides are now reachable and cross-verified** (see §11). The remote source
repo (`github.com/cochlearai/cochl-dashboard`) is *not* reachable non-interactively
(see §10 `CODE-SOURCE`), but the **published package artifact is** — and the package
is exactly "the deployed code" we want to compare against, so this is sufficient (and
arguably preferable) for the MVP.

---

## 1. Current architecture

### 1.1 What this repository actually is
The working directory `cochl-presentation-skills/` is a **Claude Code skill
library**, not the design-system product codebase. Confirmed by inspection:

- **No** `package.json`, `node_modules`, build tooling, or test runner anywhere
  (excluding `.git`).
- **No** `/tokens` JSON, **no** `/src/components`, **no** React component source.
  (The `/Users/hyo/CLAUDE.md` project file describes such a repo — `/tokens`,
  `/src/components`, `/docs/design-system`, `/artifacts` — but **that repo is not
  this working directory**. See `[NEEDS INPUT: DS-REPO]`.)
- Content is Markdown skills, self-contained HTML decks, brand asset files, and a
  `scripts/gen_pptx.py` (python-pptx) utility.

```
cochl-presentation-skills/
├── skills/
│   ├── cochl-presentation/   references/brand-core.md, decks/, brochure/, social-kit/
│   ├── pitch-deck/           Cochl PT template
│   ├── design-review/        PPTX source templates
│   ├── proposal-doc/         source PDFs + examples
│   └── design-system/        @cochlearai/ui INSTALL DOCS (no source) + frontend-design skill
├── scripts/gen_pptx.py
├── shared/branding/          logos / brand assets
├── docs/                     architecture.md, onboarding.md, (this file)
└── .claude/                  install-skills.sh, launch.json (static python http.server:8123)
```

### 1.2 How `@cochlearai/ui` is consumed — package located ✅
Not consumed *in this repo*, but the **published package artifact is on this machine**
(Yarn cache), so the code side is fully readable:

- Source of truth for code = **`@cochlearai/ui@1.0.5`** (companions:
  `@cochlearai/util@1.0.3`, `@cochlearai/calendar@1.0.1`). All three are published
  from the **`cochlearai/cochl-dashboard`** monorepo to GitHub Packages (private
  `@cochlearai` scope, not public npm).
- Local artifact path (verified):
  `~/Library/Caches/Yarn/v6/npm-@cochlearai-ui-1.0.5-*/node_modules/@cochlearai/ui`.
- Package shape: `main` `dist/cjs/index.js`, `module` `dist/esm/index.js`, `types`
  `dist/types/index.d.ts`. Peers: react ≥18, react-dom, react-select,
  react-tiny-popover, **styled-components** (components are styled-components).
- Deployed visual reference (Storybook): `https://dashboardstorybook.cochl.ai`
  (e.g. `?path=/story/button--default`).

Readable per component: prop/variant enums (`dist/types/<Comp>/<Comp>.d.ts`),
compiled styles with **real values** (`dist/esm/<Comp>/<Comp>.js`), and the code
token tables (`dist/esm/lib/ThemeColors.js`, `dist/esm/lib/Colors.js`;
`dist/types/types/colors.d.ts`, `theme.d.ts`). No values need to be assumed.
(`CODE-SOURCE` resolved: read the local published package.)

### 1.3 Existing "design token" material (and why it is not trustworthy yet)
Token-like values exist only as **hardcoded CSS in skill Markdown**, and they are
**internally inconsistent**:

- `skills/design-system/SKILL.md` declares a token block (e.g. accent purple
  `#6B4EFF`, blue `#2F80ED`, enterprise `#0B1F3A`) labelled "single source of truth."
- `skills/cochl-presentation/references/brand-core.md` uses a **different, larger**
  palette (adds e.g. `#00D7FF`, `#832BFB`, `#9827FF`, `#4B68FF`, `#4B7EFF`, …).

These are **presentation/HTML styling values**, authored for decks — there is no
evidence they equal the tokens compiled into the `@cochlearai/ui` React package.
Treat them as neither the design source of truth nor the code source of truth.
→ `[NEEDS INPUT: TOKEN-SOURCE]`

### 1.4 Figma / MCP tooling available — target file confirmed ✅
The **official Figma MCP server is connected and authenticated** (verified via
`whoami`). The design source file is **confirmed**:

- **File:** `Cochl Design System` · **fileKey:** `aUrjRMAnE8ND8o6lAI0VcM`
- **Pages (verified):** Welcome, Icons v1, Tabs v1, Alert v1, Progress v1, Menu v1,
  Tooltip v1, Chip v1, Table v1, Date picker, Checkbox v1, **Button v1 (`52:718`)**,
  Input Field v1, Dropdown v1, Radio v1.
  (These line up 1:1 with the repo's component-builder subagents.)
- Working read tools confirmed against this file: `get_metadata`,
  `get_variable_defs`, `search_design_system`, `get_screenshot`.

**Verified Button design data (real, not invented):**
- Variant axes on the Button component set: `theme` {Light, Dark} · `category`
  {Primary, Secondary} · `type` {Basic, Red, Link, sm, md, lg} · `state` {Default,
  Hovered, Disabled} · `leftIcon` {true,false} · `rightIcon` {true,false}.
  (Note: the `type` axis mixes semantic kinds *Basic/Red/Link* with sizes *sm/md/lg*
  — a real quirk to reconcile against code, not smoothed over.)
- Example variant `theme=Light, category=Primary, type=Basic, state=Default`
  (node `3251:7349`) resolves to: background `Light/Blue/60` = `#4B68FF`, text
  `Light/White` = `#FFFFFF`, font `dashboard/button` = IBM Plex Sans Medium 14/500.

Caveat: a **separate** duplicate Figma identity (`plugin:figma:figma`) reports as
un-authenticated; ignore it — the functional server above works.

### 1.5 Code Connect / existing mapping — CONFIRMED UNAVAILABLE ⚠️
- **No** Code Connect config, `*.figma.tsx`, or mapping file exists in this repo.
- **Figma Code Connect cannot be used on this account:** `list_file_components_for_code_connect`
  and `get_code_connect_map` require a **Dev/Full seat on an Org/Enterprise plan**;
  this account is on `starter`/`pro` seats and the call is refused. → Mapping must
  rely on **explicit config + structured heuristic only**; the Code Connect path is
  removed from the MVP. (`CODE-CONNECT` resolved: not available.)

### 1.6 Testing / validation infrastructure
- **None** in this repo (no test runner, CI, or lint config beyond skill installs).
- `@cochlearai/ui`'s own repo presumably has tests, but that repo is not reachable
  here. → `[NEEDS INPUT: TEST-INFRA]`

### 1.7 Adjacent tooling noted (not the core pipeline)
- A `DesignSync` tool + `/design-sync` skill exist, but they sync a local component
  library to **claude.ai/design** projects — **not** Figma↔`@cochlearai/ui`. Out of
  MVP scope; noted so it is not confused with this platform.
- Many component-builder subagents (`alert-component-builder`, `chip-…`, `wdds-…`)
  encode "WDDS v3" component *rules* as prose. They are a candidate **expectations
  source** later, but they are agent prompts, not verifiable code — not used as
  ground truth in the MVP.

---

## 2. Proposed architecture

Modular, adapter-based, so Figma / code / future sources are independently
replaceable. Each stage consumes and emits a typed, serializable model and never
reaches across a boundary.

```
        ┌─────────────┐        ┌─────────────┐
Figma ─▶│ Figma Adapter│        │ Code Adapter │◀─ @cochlearai/ui
        └──────┬───────┘        └──────┬───────┘   (source or installed pkg)
               ▼                        ▼
      Normalized Design Model   Normalized Code Model
               └────────┬───────────────┘
                        ▼
                 Component Mapper   ◀─ mapping config / Code Connect
                        ▼
                   Sync Engine  ──▶  Diff Engine
                        ▼
                 Sync Report (JSON + human)
                        ▼
              Fix Generator (suggest only)
                        ▼
         Safe Apply (--fix, confirm-gated)
                        ▼
                   Validation
```

**Design rules:**
1. **Adapters are the only source-aware code.** Everything after the normalized
   models is source-agnostic.
2. **Provenance is mandatory.** Every normalized value carries a `source` reference
   (Figma node id + variable name, or code file path + symbol) so any verdict is
   traceable. No value without a source.
3. **No fabrication.** An adapter that cannot extract a field emits `null` +
   `[NEEDS INPUT]`, never a placeholder that reads like real data.
4. **Detection and mutation are separate packages.** Diff/report never writes code;
   apply is a distinct, confirmation-gated step.

Suggested layout (created only after user confirms — see MVP plan):
```
design-sync/
├── adapters/figma/      figma → NormalizedDesignModel
├── adapters/code/       @cochlearai/ui → NormalizedCodeModel
├── core/model.ts        shared normalized types + provenance
├── core/mapper.ts       component mapping
├── core/diff.ts         reusable comparison engine
├── report/              json + human renderers
├── fix/                 suggestion generator (+ later, safe apply)
├── config/mapping.json  explicit Figma↔code mapping overrides
└── cli.ts               design-sync analyze|compare|report|fix|validate
```

---

## 3. Data flow

1. **Select target.** User names ONE component + a Figma file/node (+ its code
   counterpart). No auto-discovery of "the whole system" in MVP.
2. **Figma Adapter** pulls that node: `get_variable_defs` (tokens), `get_metadata`
   (dimensions/structure), optionally `get_screenshot`, `get_code_connect_map`.
   Emits `NormalizedDesignModel` with per-field provenance.
3. **Code Adapter** reads the same component from the code source (see
   `[NEEDS INPUT: CODE-SOURCE]`). Emits `NormalizedCodeModel` with provenance.
4. **Mapper** aligns the two into a `MappedComponent` (or `UNMATCHED`).
5. **Diff Engine** compares field-by-field → list of `Difference` records.
6. **Report** serializes to `sync-report.json` + prints a human summary.
7. **Fix Generator** proposes changes (no writes).
8. **(Opt) Apply** shows diff → confirm → edit → run tests → re-run sync.
9. **Validation** re-runs steps 2–6 and asserts 0 unresolved mismatches.

---

## 4. Component mapping strategy

Never string-match alone. Precedence:

1. **Explicit config** — `config/mapping.json` (highest authority; human-authored).
   **This is the primary mechanism for the MVP** (see below).
2. ~~Published Code Connect~~ — **not available on this Figma seat/plan** (§1.5).
   Removed from the pipeline until a Dev/Full Org seat exists.
3. **Structured heuristic** — component name + variant/property-name sets, with
   case/format normalization. But note the Button case (§11) shows Figma axes
   (`category`+`type`) do **not** map 1:1 to the code `color` prop — so the heuristic
   must express **axis-level** mappings (e.g. Figma `type=Red` → code `color=danger`),
   which is exactly what `config/mapping.json` encodes. A match requires corroboration
   beyond the name alone.

If confidence is below threshold → emit **`UNMATCHED COMPONENT`**. Never silently
assume equivalence. Mapping decisions are recorded with their basis (which rule fired).

---

## 5. Token comparison strategy

- **Design tokens come from Figma variables** (`get_variable_defs`), not from the
  skill Markdown palettes (§1.3), which are unverified for the package.
  **Hard evidence:** the real Figma primary-button background is `Light/Blue/60` =
  `#4B68FF` (verified from node `3251:7349`). That matches `brand-core.md` but
  **contradicts** `SKILL.md`'s claimed primary `#6B4EFF`. Conclusion: skill Markdown
  is NOT the design source of truth — use Figma variables.
- **Code tokens come from the package** — `dist/esm/lib/ThemeColors.js` (per-component
  color maps keyed by `[color][theme]`) and `dist/esm/lib/Colors.js` (palette; e.g.
  `blue.60 = "#4B68FF"`). **Verified:** code `blue.60` `#4B68FF` == Figma
  `Light/Blue/60` `#4B68FF` → the primary-blue token **MATCHES** across design and
  code. (`TOKEN-SOURCE` resolved: Figma variables vs package `lib/`.)
- Compare **by token reference first, then by resolved value.** Report both:
  - `color.primary.500` (design) vs `color.primary.500` (code) → MATCH by ref.
  - same ref but different resolved hex → MISMATCH (ref aliased differently).
  - raw value vs token → flag as "hardcoded in code" (violates CLAUDE.md rule
    "No hardcoded colors in components").
- Normalize units before comparing (px/rem, hex case, `#fff`↔`#ffffff`) — a
  normalization step is explicit and logged, so "8px" vs "8" is not a false mismatch.

---

## 6. Diff model

A `Difference` record:

```jsonc
{
  "component": "…",          // mapped component id
  "category": "color | typography | spacing | radius | dimension | variant | state | property",
  "property": "borderRadius",
  "designValue": "8px",       // null if MISSING_IN_DESIGN
  "codeValue": "6px",         // null if MISSING_IN_CODE / NEEDS INPUT
  "designSource": "figma:node=…, var=radius.md",
  "codeSource": "code:packages/ui/Button/…",
  "status": "MATCH | MISMATCH | MISSING_IN_DESIGN | MISSING_IN_CODE | UNMATCHED | NEEDS_INPUT",
  "severity": "critical | high | medium | low",
  "suggestedAction": "…"      // description only; no auto-write
}
```

Status semantics:
- **MATCH** — both present, equal after normalization.
- **MISMATCH** — both present, unequal.
- **MISSING_IN_DESIGN / MISSING_IN_CODE** — present on one side only.
- **UNMATCHED** — component/property could not be confidently aligned.
- **NEEDS_INPUT** — a side could not be read (e.g. code source unreachable). This is
  the honest default whenever the code adapter cannot verify a value.

Severity is assigned by category + a rule table (e.g. wrong font-family = high;
1px radius delta = low), defined explicitly, never inferred ad hoc.

---

## 7. Validation strategy

- **Re-run the pipeline** after any fix; assert unresolved (`MISMATCH`+`UNMATCHED`)
  count is 0 for the component.
- Report **BEFORE / AFTER** counts explicitly.
- **Run the code project's own tests** where they exist (→ `[NEEDS INPUT: TEST-INFRA]`;
  in this repo there are none, so MVP validation = re-diff + type/build check on
  whatever scratch project hosts the code adapter).
- A fix is "done" only when: diff clean **and** tests/build green. Partial success is
  reported as partial, never rounded up to "synchronized."

---

## 8. Risks

1. **Code freshness / version drift (now the top risk).** The read package is
   `@cochlearai/ui@1.0.5` from the Yarn cache — it may lag the latest published
   version and will lag unreleased `main`. Diffs are only as current as the cached
   artifact. Mitigation: record the exact version in every report; re-pull the
   package to refresh; treat the report as "design vs v1.0.5", not "vs latest".
2. **Token source ambiguity.** Three candidate palettes (Figma vars, SKILL.md,
   brand-core.md) that disagree. Picking wrong = systematically wrong diffs.
   Mitigation: Figma variables are design truth; code tokens are code truth; skill
   palettes are neither.
3. **False mismatches from normalization gaps** (units, hex case, aliasing).
   Mitigation: explicit, logged normalization; compare ref then value.
4. **Over-confident mapping** causing wrong-component diffs. Mitigation: require
   corroboration; default to `UNMATCHED`.
5. **Unsafe auto-apply** touching production. Mitigation: `--fix` is opt-in,
   diff-shown, confirm-gated, test-gated; detection never writes.
6. **Figma rate limits / node-resolution differences.** Mitigation: cache reads;
   target one node at a time in MVP.
7. **Repo confusion.** Docs/tools might land in the wrong repo (skills lib vs DS
   product). Mitigation: `[NEEDS INPUT: DS-REPO]`; keep MVP code in its own dir and
   do not touch skill files.

---

## 9. Assumptions (each must be confirmed, not relied on silently)

- **A1 — RESOLVED.** Code source of truth = the published **`@cochlearai/ui@1.0.5`**
  package (local Yarn cache), from `cochlearai/cochl-dashboard`.
- **A2 — RESOLVED.** Design source of truth = Figma `Cochl Design System`
  (`aUrjRMAnE8ND8o6lAI0VcM`).
- **A3 — recommended, pending confirm.** PoC component = **Button** (both sides
  already read and cross-verified in §11). `[NEEDS INPUT: POC-COMPONENT]`
- **A4 — pending confirm.** MVP code lives in this repo under `design-sync/`.
  `[NEEDS INPUT: WHERE-TO-BUILD]`

---

## 10. Unresolved questions (`[NEEDS INPUT]` register)

Most Phase-1 blockers are now resolved. Remaining:

| Tag | Status / Question |
|---|---|
| `POC-COMPONENT` | **Open (recommend Button).** Confirm the PoC component. |
| `WHERE-TO-BUILD` | **Open (recommend `design-sync/` here).** This repo or a dedicated one? |
| `TEST-INFRA` | **Partly open.** No tests in this repo; the package ships `*.test.d.ts` but not runnable tests. MVP validation = re-diff + `tsc` build of the code adapter's scratch project. Confirm acceptable. |
| `CODE-VERSION` | **Note.** Cached package is `v1.0.5` — is that the version to sync against, or should we pull latest first? |
| `CODE-SOURCE` | ✅ Resolved — read local published `@cochlearai/ui@1.0.5`. |
| `FIGMA-TARGET` | ✅ Resolved — `aUrjRMAnE8ND8o6lAI0VcM`, Button page `52:718`. |
| `TOKEN-SOURCE` | ✅ Resolved — Figma variables vs package `lib/`; skill Markdown is neither. |
| `CODE-CONNECT` | ✅ Resolved — unavailable on this seat/plan; use config + heuristic. |
| `DS-REPO` | ✅ Resolved — the `/Users/hyo/CLAUDE.md` repo is not this dir; code source is the package. |
| `GITHUB-MCP` | Note — GitHub MCP + `gh` tokens are invalid; not needed for MVP (package is local). Fix later if syncing to `main`. |

---

## 11. Verified cross-comparison — Button (real data, both sides)

This is a **real** preview of what the Diff Engine will output, built only from
verified sources (Figma file `aUrjRMAnE8ND8o6lAI0VcM` + `@cochlearai/ui@1.0.5`).

**Design (Figma) — Button variant axes**
`theme` {Light, Dark} · `category` {Primary, Secondary} · `type` {Basic, Red, Link,
sm, md, lg} · `state` {Default, Hovered, Disabled} · `leftIcon` · `rightIcon`.
Default Primary/Basic tokens: bg `Light/Blue/60` `#4B68FF`, text `Light/White`
`#FFFFFF`, font `dashboard/button` = IBM Plex Sans Medium 14/500.

**Code (`@cochlearai/ui@1.0.5`) — `ButtonProps`**
`color` {default, primary, secondary, danger} · `disabled: boolean` · `leftIcon`,
`rightIcon` (ReactNode) · `onClick`. Styles (`dist/esm/Button/Button.js`):
`border-radius: 4px`, `border-width: 1px solid`, colors from
`ThemeColors.button[...][color][theme]`, hover/disabled handled in CSS
(`&:hover`, `&:disabled { opacity: 0.4 }`), default `color = "default"`.

| Category | Property | Design (Figma) | Code (v1.0.5) | Provisional status |
|---|---|---|---|---|
| color | primary blue | `Light/Blue/60` `#4B68FF` | `blue.60` `#4B68FF` | **MATCH** |
| variant | kind axis | `category` + `type` (Basic/Red/Link) | single `color` (default/primary/secondary/danger) | **MISMATCH** (axis shape differs) |
| variant | naming | `type=Red`, `type=Basic` | `color=danger`, `color=default` | **MISMATCH** (needs mapping config) |
| size | sm/md/lg | present (in `type` axis) | **no size prop** | **MISSING_IN_CODE** |
| variant | Link | `type=Link` | not in Button (separate `HyperlinkButton`) | **UNMATCHED** (different component) |
| state | hover | `state=Hovered` variant | CSS `&:hover` (no prop) | MATCH semantically; representation differs |
| state | disabled | `state=Disabled` variant | `disabled: boolean` + `opacity 0.4` | MATCH semantically |
| radius | border-radius | *(needs Figma metadata value)* | `4px` (hardcoded) | `[NEEDS INPUT]` (design value) → note: code radius is hardcoded, not tokenized |
| type | button font | IBM Plex Sans Medium 14/500 | not set in Button (inherited/Typo) | `[NEEDS INPUT]` (confirm code font source) |
| icons | left/right | boolean toggles | ReactNode presence | MATCH semantically |

Takeaways that shape the build: (1) the token *values* largely agree; the real gap
is **structural** (variant taxonomy + missing size + Link-as-separate-component), so
the mapper's config layer is the crux. (2) A few fields still need the exact design
value (radius, font binding) — the Figma adapter will pull these via `get_metadata`
/ `get_variable_defs`; until then they are honest `[NEEDS INPUT]`, not guesses.

See `docs/design-to-code-mvp-plan.md` for the smallest PoC that produces this table
as a `sync-report.json` automatically.

---

## 12. Phase 2 update — Fix suggestions (P8), confirm-gated apply (P9), and Alert

**Status: BUILT & VERIFIED (2026-09-22).** Implemented in `design-sync/`. Button +
Alert both run end-to-end; `npm test` (diff + fix engines) passes. This section
records what changed from the Phase-1 design and why.

### 12.1 What changed vs the Phase-1 architecture

| Area | Phase 1 (as designed) | Phase 2 (as built) — why |
|---|---|---|
| **Code adapter** | Button-specific extraction | **Recipe-driven.** Each component declares a `code.extract` recipe in `mapping.json` (methods: `unionType`, `propUnion`, `hasProp`, `literal`, `tokenRef`, `tokenValue`, `themeColors`, `regexBool`). Adding a component adds **data, not code** — required to prove generalization. |
| **Figma adapter** | Button-shaped snapshot | **Snapshot-driven.** Snapshot is a generic `fields[]` list with per-field node-id provenance; the adapter is component-agnostic. |
| **Pipeline** | …→ Diff → Report | Extended to the requested flow: **Detect → Diff → Suggest (P8) → Dry-run → Confirm → Patch → Test → Re-compare (P9)**. New modules `core/fix.mjs` (suggestions) and `core/apply.mjs` (gated patch). |
| **Mapping** | Code Connect + config + heuristic | Code Connect **removed** (seat/plan). Config `mapping.json` is authoritative; comparison modes `equal` / `setEqual` / `presence` / `unmatched`. |
| **Fixes** | "suggest only, defer apply" | P8 suggestions carry: current code value, verified Figma value, recommended change, provenance, confidence/status. P9 applies **only** verified scalar fixes to a **sandbox working copy**. |

### 12.2 Fix engine (Phase 8) — read-only, honest

`buildSuggestions(diff, design, code)` classifies each non-MATCH difference:
- **Auto-fixable** only when: `MISMATCH` from an `equal` comparison, **both sides
  verified**, and the code field exposes a locatable `edit` — a unique literal
  (`replaceLiteral`) or a token whose **target design value maps back to the code's
  own palette** (`replaceToken`, e.g. `#445EE5` → `blue[70]`). Confidence `high`.
- **Manual** (suggestion-only): structural/taxonomy `setEqual` mismatches,
  `MISSING_IN_CODE` (needs a new prop/API), `UNMATCHED` (wrong component).
- **`[NEEDS INPUT]`** is never fixable and never silently changed — enforced by test.

### 12.3 Apply engine (Phase 9) — safety model

The code we read is the **published package** (a build artifact in a read-only cache),
and the real source repo is unreachable non-interactively. So `--fix`:
1. Requires **explicit confirmation** (`--yes`; bare `fix` is a dry run that writes nothing).
2. Applies to a **sandbox working copy** at `design-sync/.work/ui` — the installed
   package and any production source are never touched.
3. Runs the tests, then **re-compares against the patched copy** (via a scoped
   `COCHL_UI_DIR` override) and prints **BEFORE vs AFTER**.

The `edit` descriptor is source-agnostic; wiring it to the real
`cochlearai/cochl-dashboard` source (or a PR) is the only change needed for
production apply — documented, not hidden.

### 12.4 Second component — Alert (proves generalization)

Adding Alert required **zero** engine/adapter code — only an `Alert.snapshot.json`
and an `Alert` entry in `mapping.json`. Findings, all verified:

- **Name mismatch handled by config:** Figma **Alert** has no `Alert` code component;
  it maps to code **`Toast`** (`severity: info|error`, `message`, `buttonText`≈Link).
  This is exactly the kind of non-string mapping the mapping layer exists for.
- **Verified value drift (auto-fixed):** design Success accent `Blue/70 #445EE5` vs
  code `Toast` info accent `blue[60] #4B68FF`. `fix Alert --yes` swaps
  `blue[60]→blue[70]` (verified token-to-token), tests pass, re-compare confirms:
  **BEFORE 7 match · 2 mismatch → AFTER 8 match · 1 mismatch.**
- **Structural drift (stays manual):** design status `{Success, Error}` vs code
  severity `{info, error}` — `Success↔info` is a naming/API decision, correctly left
  for a human.
- **Backgrounds/radius/padding match** (`#EDF0FF`/`#FFF4F4`, `4px`, `20/16`). Note:
  a stale canvas annotation claimed the error bg was `#FF7A00`; the tool used the
  **real fill** (`#FFF4F4`) via `get_design_context`, not the annotation.

### 12.5 Success criteria (from the request) — status

1. Same engine for Button + Alert — ✅ (only config/snapshots differ).
2. Component specifics are data/config, not hardcoded — ✅ (recipes + mapping + snapshots).
3. Every reported value has provenance — ✅ (Figma node id / code `file:line`).
4. Unverified info stays `[NEEDS INPUT]` — ✅ (enforced by test).
5. Fixes are confirmation-gated — ✅ (`--yes`, sandbox copy).
6. System validates a fix resolved the mismatch — ✅ (tests + BEFORE/AFTER re-compare).

### 12.6 Batch sync / drift dashboard — see §13 (now built).

---

## 13. Phase 10 — Batch drift detection + dashboard

**Status: BUILT & VERIFIED (2026-09-22).** Runs across **10 components**. The proven
diff/fix engine is **unchanged**; batch, classification, aggregation and the
dashboard are a strictly **additive** layer over the existing per-component reports.

### 13.1 Batch architecture

```
config/mapping.json (N components)
   │  for each component  (core/batch.mjs)
   ▼
loadDesignModel(snapshot) + loadCodeModel(recipe)  →  diff  →  buildSuggestions   ← UNCHANGED engine
   ▼
classifyReport (core/classify.mjs)  →  drift taxonomy + component status           ← additive
   ▼
reports/sync-report.<C>.json  (per component, full provenance retained)
   +  reports/sync-summary.json  (aggregate)
   +  reports/dashboard.html     (static, embeds the classified reports)
```

`design-sync sync` (aliases: `sync --all`, `sync A B …`) runs it. Nothing about the
component set is hardcoded — the batch iterates `mapping.json`.

### 13.2 Aggregate report — `sync-summary.json` schema

```jsonc
{
  "generatedAt": "<iso8601>",
  "codePackage": "@cochlearai/ui",
  "codeVersion": "1.0.5",
  "componentsChecked": 10,
  "overallStatus": "SYNC | DRIFT | NEEDS_INPUT | CONFIG_ERROR",
  "byStatus": { "SYNC": 3, "DRIFT": 4, "UNMATCHED": 3 },
  "totals": { "matches", "mismatches", "missing", "unmatched", "needsInput", "fixable", "manual" },
  "taxonomy": { "match", "token-drift", "value-drift", "structural-drift", "unmatched", "missing-info" },
  "components": [ { "component", "codeName", "status", "summary", "fixSummary", "taxonomy", "mappingResolved" } ]
}
```
Each **component** keeps its own detailed `sync-report.<C>.json` with full
per-difference provenance (design node id + code `file:line`) and suggested fixes.

### 13.3 Status definitions (component-level)

| Status | Meaning |
|---|---|
| **SYNC** | 0 mismatch / missing / unmatched / needs-input — everything compared matches. |
| **DRIFT** | ≥1 mismatch or missing — a verified difference exists. |
| **UNMATCHED** | no drift values, but ≥1 field/component could not be aligned (mapping problem). |
| **NEEDS_INPUT** | no drift/unmatched, but ≥1 value is `[NEEDS INPUT]` (a side unverified). |
| **CONFIG_ERROR** | the component failed to load (missing snapshot / bad recipe). |

Precedence when several apply: **DRIFT → UNMATCHED → NEEDS_INPUT → SYNC** (worst
wins). The dashboard shows the one status; the detail view breaks down all counts.
**No score/percentage is invented** — only explicit counts and statuses.

### 13.4 Drift taxonomy (the requested distinction)

| Class | Meaning | Auto-fixable? |
|---|---|---|
| `token-drift` | value/token mismatch, both sides verified, locatable literal/token (e.g. Figma `blue.70` vs code `blue.60`) | **yes** (gated) |
| `value-drift` | value mismatch but no safe locator / value not in code palette | no (manual) |
| `structural-drift` | taxonomy or missing capability (e.g. Figma `category`+`type` vs code `color`; missing size prop) | no (manual) |
| `unmatched` | no code counterpart / composition mismatch (e.g. Figma Table → 5 code components) | no (mapping decision) |
| `missing-info` | `[NEEDS INPUT]` — a side is unverified; **not** treated as a normal mismatch | no |

### 13.5 Exit codes (CI-ready; documented)

| Code | Meaning |
|---|---|
| `0` | no unresolved drift (all SYNC, no needs-input) |
| `1` | verified drift exists (mismatch / missing / unmatched) |
| `2` | configuration / mapping error (a component failed to load) |
| `3` | missing required input (`[NEEDS INPUT]` present, but no hard drift) |

`design-sync sync` sets `process.exitCode` accordingly (`core/batch.mjs`
`exitCodeFor`). No GitHub Action is wired yet, but the CLI is CI-shaped: offline,
deterministic, meaningful exit codes.

### 13.6 Performance / caching decisions

- **Batch is offline.** It reads captured Figma **snapshots** from disk and the local
  package — **no network** during a run, so it is CI-safe and fast.
- **Snapshot capture is the bottleneck** (Figma `get_metadata`/`get_design_context`
  are large + rate-limited). It is a **separate upstream step**, not part of the
  compare run → two-phase design (capture → compare).
- **Token modules are import-cached.** `ThemeColors.js`/`Colors.js` are dynamically
  imported once per package path; Node's ESM loader caches them across all
  components in a run (no re-parse per component). The resolved package dir is reused.
- Snapshots are plain JSON (cheap to parse). Per-component `.d.ts`/`.js` reads are the
  only per-component disk I/O and are small.

### 13.7 What is automated vs manual (current)

- **Automated:** detection, normalized comparison, drift classification, aggregate +
  dashboard, fix *suggestions*, and gated auto-apply for `token-drift` (verified
  literal/token swaps) to a sandbox copy, with tests + BEFORE/AFTER re-sync.
- **Manual (by design):** structural drift (taxonomy, missing capability), unmatched
  / 1:many mappings, semantic name collisions, and anything `[NEEDS INPUT]`. The
  dashboard is **read-only** — it never edits code; it shows the fix and the CLI
  command that runs the gated workflow.

### 13.8 Batch result (real, 2026-09-22)

`10 components · @cochlearai/ui@1.0.5 · overall DRIFT · exit 1`

| Component | Code | Status | Notable |
|---|---|---|---|
| Button | Button | DRIFT | taxonomy (structural), size MISSING, Link UNMATCHED, font NEEDS_INPUT |
| Alert | Toast | DRIFT | accent **token-drift (auto-fixable)** + Success↔info structural |
| Chip | Chip | DRIFT | radius **token-drift (auto-fixable, 74↔100px)** + no variant props MISSING |
| Input | Input | SYNC | border/placeholder/radius/padding all match |
| Checkbox | Checkbox | SYNC | checked color `#4B68FF` match |
| Radio | RadioButton | SYNC | circle `blue[60]` match |
| Tooltip | InfoTooltip | DRIFT | bg/radius/padding match; 8 placements vs 4 positions (structural) |
| Dropdown | Dropdown | UNMATCHED | **semantic mismatch** (select field vs generic popover) |
| Table | Table | UNMATCHED | **1:many** (Table+Head/Body/Row/Cell) |
| Progress | ProgressIndicator | UNMATCHED | **1:many** (ProgressIndicator + CircleProgress) |

Totals: 27 match · 5 mismatch · 2 missing · 4 unmatched · 1 needs-input.
Drift classes: 2 token · 0 value · 5 structural · 4 unmatched · 1 missing-info.

### 13.9 Architectural problems discovered at multi-component scale

Running across 10 components surfaced concrete issues to resolve **before** wiring
production code:

1. **1:many mapping is unmodeled.** Table→5 code components, Progress→2. The mapping
   layer assumes 1 Figma ↔ 1 code component. Needs a composite mapping (one Figma
   component → an ordered set of code components, or a variant→component router).
   Currently surfaced honestly as `UNMATCHED`, not forced into a fake comparison.
2. **Semantic name collision.** Figma `Dropdown` (a select field) and code `Dropdown`
   (a generic popover container) share a name but are different abstractions. This is
   direct proof that **string/name matching is unsafe** — the mapping must be
   explicit + intent-checked, exactly as designed.
3. **Snapshot capture is the real bottleneck**, not comparison. Figma reads are large
   and rate-limited and need a Figma token — impossible inside a plain CI job. The
   two-phase split (scheduled/on-demand capture → offline compare in CI) is the right
   shape; a "snapshot freshness" signal is needed so stale captures are visible.
4. **Literal drift that is visually inert.** Chip radius `74px` vs `100px` — both are
   pill radii on a 24px element, so identical on screen but literally drifted. The
   tool flags it (correctly, literally). Need an **accept/ignore** mechanism (per
   comparison) so low-value drift doesn't create noise or churny auto-fixes.
5. **Not everything is tokenized, and annotations lie.** Some fills are raw hex
   (Alert bg), some are variables; a canvas annotation claimed Alert error bg was
   `#FF7A00` while the real fill is `#FFF4F4`. Comparisons must read the **rendered
   value**, treat annotations as untrusted, and record which case each value is.
6. **SVG-flattened components limit extraction.** Checkbox/Radio render as flattened
   SVG assets, so box/token values aren't recoverable from the node — only referenced
   variables are. Icon-like components get shallow coverage (accent + variant axes),
   which the report should mark as partial rather than implying full parity.
7. **Variant explosion vs reference-variant capture.** Button has 60+ variant symbols;
   snapshots capture one representative (Default) variant. Per-variant drift (hover,
   disabled, dark theme) is **not** compared yet. Faithful coverage needs multi-node
   capture per component — a real cost multiplier.
8. **Structural drift dominates (5 vs 2 token).** Most real drift is structural
   (taxonomy / missing capability / mapping), which is **not** auto-fixable. The
   platform's primary value is **detection + triage**, and auto-fix is a useful but
   minority path — worth setting expectations before production.
9. **Coverage is itself a signal.** With a fixed component list, "did we capture a
   verified snapshot?" matters; components without one must read as a distinct state
   (here: the 3 architectural ones are `UNMATCHED` with notes, not fabricated data).

> **§13.9 problems 1–4 are resolved in Phase 11–12 (§14).**

---

## 14. Phase 11–12 — Composite / intent-checked mapping + snapshot lifecycle

**Status: BUILT & VERIFIED (2026-09-22).** The diff/fix engine is still **unchanged**;
this adds a mapping-resolution + validation layer and a snapshot-lifecycle +
acceptance layer, all additive. Full-scale re-run below (§14.8) passes all 8
validation criteria.

### 14.1 Composite mapping model

Each component in `config/mapping.json` now declares its mapping explicitly:

```jsonc
"Table": {
  "figma": { "name": "Table", "role": "data-table", "page": "16:2873" },
  "mapping": {
    "type": "ONE_TO_MANY",                 // ONE_TO_ONE | ONE_TO_MANY | UNMATCHED | AMBIGUOUS
    "targets": [
      { "component": "Table",     "role": "table-root",   "relationship": "container" },
      { "component": "TableHead", "role": "table-header", "relationship": "part" },
      { "component": "TableBody", "role": "table-body",   "relationship": "part" },
      { "component": "TableRow",  "role": "table-row",    "relationship": "part" },
      { "component": "TableCell", "role": "table-cell",   "relationship": "part" }
    ],
    "reason": "Figma 'Table' composes into 5 code components; per-target comparisons not yet captured."
  },
  "comparisons": []                          // no fake 1:1 comparison
}
```

`core/mapping.mjs::resolveMapping` returns the normalized mapping: `mappingType`,
`figmaRole`, `targets` (each with `component` + `role` + `relationship`), `roleMatch`,
`nameCollision`, `confidence`, `reason`, and a `resolvedNote` when a code name
legitimately differs but the role matches (e.g. Alert→Toast, Radio→RadioButton). A
Figma component maps to **one** or **many** code targets; 1:many is never forced into
a fake 1:1 (Table→5, Progress→2 are `ONE_TO_MANY`).

### 14.2 Intent / role mapping (names are NOT trusted)

Every target carries an explicit **role** (its abstraction), separate from its name.
The resolver compares `figma.role` to the primary target's role:

- **Match despite different names** → `ONE_TO_ONE`, resolved (Alert `status-message`
  → Toast `status-message`).
- **Same name, different role** → **`AMBIGUOUS`** — a name-only match is refused.
  Figma `Dropdown` role `form-select` vs code `Dropdown` role `popover-container`
  resolves to `AMBIGUOUS_MAPPING`, not a false SYNC. If intent can't be verified, the
  mapping is `AMBIGUOUS`, never auto-mapped by name.

### 14.3 Mapping validation — `design-sync mapping validate`

`core/mapping.mjs::validateMappings` runs **before** comparison and detects:
duplicate mappings (two Figma comps → same code target), unresolved (no targets),
ambiguous, 1:many (listed as info), same-name semantic collisions, missing code
targets and invalid component references (checked against the installed package).
Blocking problems (`unresolved`, `ambiguous`, `same-name-collision`, `invalid-ref`,
`duplicate`) exit **2**; a clean table exits 0. Example (real): flags Dropdown
`same-name-collision` (blocking) and lists Table/Progress `one-to-many` (info).

### 14.4 Snapshot lifecycle

Every snapshot now carries a `meta` block: `component`, `figmaFileId`, `figmaNodeId`,
`capturedAt` (ISO), `captureMethod`, `sourceRevision` (null until available), and
`captureStatus` (`captured` | `architectural-note`). Every report and the dashboard
show **Snapshot captured: <time>** and **Package version: @cochlearai/ui@<v>**, so a
stale comparison is obvious.

### 14.5 Freshness states (configurable)

`core/freshness.mjs` classifies each snapshot **FRESH | STALE | UNKNOWN** by age vs a
**configurable** threshold — `config/sync-config.json` `snapshot.maxAgeHours`
(default 168h), overridable per run with `--max-age-hours N`. A stale snapshot is
never silently treated as current: the run still executes, but the report/dashboard
show `WARNING: Figma snapshot is stale`. UNKNOWN when no parseable timestamp.

### 14.6 Accepted-drift model + auditability

`config/accepted-drift.json` holds **scoped** acceptances. Each entry matches ONE
`component` + `property` + the **exact** `figmaValue`/`codeValue`, and records
`reason`, `acceptedBy`, `timestamp`, and optional `reviewBy` (expiry). A matched
mismatch is **reclassified** to `ACCEPTED_DRIFT` (drift class `accepted-drift`):

- The **underlying mismatch is retained** — the report keeps `originalStatus:
  "MISMATCH"` and the full acceptance record → **auditable**, never deleted.
- Accepted drift is **never auto-fixed** (`fixable: false`, `fixEdit: null`) and does
  not count toward active drift for status/exit.
- Acceptance is **scoped, not a blanket ignore**: it is per-comparison and
  value-specific — if either value changes, or `reviewBy` passes, the acceptance no
  longer applies and the drift becomes active again.
- Example: `Chip → Border radius` (Figma `74px` vs code `100px`, both pill) is
  accepted; Chip's *other* drift (missing variant types) stays active `MISSING_IN_CODE`.

### 14.7 Updated batch architecture + statuses/exit codes

```
mapping.json ─▶ resolveMapping ─▶ [ONE_TO_ONE → pipeline] / [ONE_TO_MANY|AMBIGUOUS|UNMATCHED → status only]
snapshot.meta ─▶ computeFreshness ─▶ FRESH|STALE|UNKNOWN
diff (UNCHANGED) ─▶ suggestions ─▶ classifyReport(+accepted,+mapping) ─▶ sync-report.<C>.json
                                                                    └▶ aggregate ─▶ sync-summary.json + dashboard.html
```

Component statuses now include **ONE_TO_MANY** and **AMBIGUOUS** (mapping-derived,
take precedence over drift when not `ONE_TO_ONE`), alongside SYNC / DRIFT / UNMATCHED
/ NEEDS_INPUT / CONFIG_ERROR. Exit codes (updated): **2** also covers `AMBIGUOUS`
mappings; **3** also covers `ONE_TO_MANY` pending per-target capture.

`sync-summary.json` gains `maxAgeHours`, `byFreshness`, `staleSnapshots`,
`totals.accepted`, `taxonomy["accepted-drift"]`, and per-component `mappingType` +
`freshness`.

### 14.8 Full-scale validation (real, 2026-09-22) — all 8 criteria pass

`10 components · overall MAPPING_ERROR · exit 2`

| Component | Code | Status | Fresh | Note |
|---|---|---|---|---|
| Button | Button | DRIFT | FRESH | taxonomy + size missing + Link unmatched + font needs-input |
| Alert | Toast | DRIFT | FRESH | accent **token-drift (gated-fixable)** |
| Chip | Chip | DRIFT | FRESH | radius **ACCEPTED_DRIFT** (auditable) + missing types |
| Input / Checkbox / Radio | Input / Checkbox / RadioButton | SYNC | FRESH | values match |
| Tooltip | InfoTooltip | DRIFT | FRESH | 8 placements vs 4 positions (structural) |
| Dropdown | Dropdown | **AMBIGUOUS** | FRESH | same-name/different-role — no false match |
| Table | Table | **ONE_TO_MANY** | FRESH | → 5 code components |
| Progress | ProgressIndicator | **ONE_TO_MANY** | FRESH | → ProgressIndicator + CircleProgress |

1. Table `ONE_TO_MANY` ✅ · 2. Progress `ONE_TO_MANY` ✅ · 3. Dropdown does **not**
false-match (`AMBIGUOUS`) ✅ · 4. Stale snapshots reported (`--max-age-hours 0` →
10 STALE + warning) ✅ · 5. Accepted drift auditable (`originalStatus: MISMATCH`
retained) ✅ · 6. Structural drift stays manual ✅ · 7. Token drift stays
gated-fixable (Alert BEFORE 2 → AFTER 1) ✅ · 8. `[NEEDS INPUT]` never auto-fixed
(Button typography `fixable:false`) ✅. `npm test` = 16 assertions.

### 14.9 Still deferred (not done, by instruction)

No connection to `cochlearai/cochl-dashboard`, no PR, no CI automation, and auto-fix
remains limited to the verified `token-drift` path. Composite **per-target** value
comparison for `ONE_TO_MANY` (capturing each sub-component's Figma properties) is the
natural next step; today those components resolve to the mapping status without a
per-property diff.
