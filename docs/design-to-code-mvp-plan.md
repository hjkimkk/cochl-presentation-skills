# Design-to-Code Sync — MVP Plan (single-component proof of concept)

> **Goal of the MVP:** compare **ONE** real Figma component against **ONE** real
> `@cochlearai/ui` code component, end-to-end, and emit a `sync-report.json` + a
> human-readable summary. Nothing more. No `--fix`, no multi-component crawl.
>
> **Non-negotiable:** no invented components, tokens, values, or node ids. Anything
> not verified from a connected source is reported as `[NEEDS INPUT]`.
>
> **STATUS: BUILT & VERIFIED (2026-09-22).** Grown well past the single-component PoC:
> - Button PoC → full pipeline in `design-sync/` against real sources.
> - Phases 8–9: read-only fix suggestions + confirm-gated `--fix` (sandbox apply,
>   tests, BEFORE/AFTER). Alert (→ code `Toast`) proved generalization.
> - Phase 10: **batch drift dashboard across 10 components** — `design-sync sync`
>   writes `sync-summary.json` + `dashboard.html`, drift taxonomy, CI exit codes.
> - Phase 11–12: **composite / intent-checked mapping** (`ONE_TO_ONE`,
>   `ONE_TO_MANY`, `AMBIGUOUS`, `UNMATCHED`, explicit roles), `mapping validate`,
>   **snapshot freshness** (FRESH/STALE/UNKNOWN, configurable), and **scoped
>   accepted-drift** (`ACCEPTED_DRIFT`, auditable). Engine still unchanged.
>
> Full detail — composite mapping model, intent/role mapping, mapping validation,
> snapshot lifecycle, freshness, accepted-drift, auditability, aggregate schema,
> statuses, exit codes, caching, and the architectural problems + resolutions — is in
> `docs/design-to-code-architecture.md` §13–§14. `npm test` = 16 assertions.
>
> **Proven now:** detection, normalized comparison, drift taxonomy, batch + dashboard,
> composite/intent mapping + validation, freshness, scoped acceptance, fix
> suggestions, and gated `token-drift` auto-apply (sandbox, tests, re-sync).
> **Future work:** per-target value comparison for `ONE_TO_MANY`; per-variant capture;
> production source wiring; CI. **Exit codes:** `0` clean · `1` drift · `2`
> config/mapping error (incl. AMBIGUOUS) · `3` needs-input / `ONE_TO_MANY` pending.

---

## 1. The smallest thing that proves the concept

A single command:

```
design-sync compare <component>
```

that:
1. reads the component from Figma (design),
2. reads the same component from `@cochlearai/ui` (code),
3. normalizes both,
4. diffs them field-by-field,
5. writes `sync-report.json` + prints a summary,

for exactly one component, across this initial property set only:

- Colors · Typography · Spacing · Border radius · Component dimensions
- Variants · States · Component properties

That is the whole MVP. Fix suggestions and auto-apply come **after** this is
reliable (Phases 8–9 of the master plan), not now.

---

## 2. Preconditions — mostly RESOLVED ✅

| # | Needed | Status |
|---|---|---|
| 1 | Figma target | ✅ `Cochl Design System` `aUrjRMAnE8ND8o6lAI0VcM`, Button page `52:718` |
| 2 | Readable `@cochlearai/ui` | ✅ `@cochlearai/ui@1.0.5` in local Yarn cache (`~/Library/Caches/Yarn/v6/npm-@cochlearai-ui-1.0.5-*/…/@cochlearai/ui`) |
| 3 | PoC component | ⏳ **recommend Button** (both sides already read — see architecture §11) |
| 4 | Where to build | ⏳ **recommend `design-sync/` in this repo** |
| 5 | Code Connect | ✅ resolved — unavailable on this seat; use `config/mapping.json` + heuristic |

Only #3 and #4 remain, and both are single-word confirmations. The MVP is
**startable now** — nothing is blocked on unreachable data.

---

## 3. What each side can actually yield (today, verified)

### Design side — reachable ✅
Figma MCP is authenticated. For a specified node we can call:
- `get_variable_defs` → token-bound values (colors, radius, spacing, type)
- `get_metadata` → structure + dimensions
- `get_design_context` → resolved properties/variants
- `get_code_connect_map` → existing mapping (maybe)
- `get_screenshot` → visual reference for the report

### Code side — reachable ✅ (published package)
`@cochlearai/ui@1.0.5` is in the local Yarn cache. The code adapter reads, per
component:
- `dist/types/<Comp>/<Comp>.d.ts` → prop/variant enums (verified: `ButtonProps` has
  `color: default|primary|secondary|danger`, `disabled`, `leftIcon`/`rightIcon`)
- `dist/esm/<Comp>/<Comp>.js` → real style values (verified: Button
  `border-radius: 4px`, styled-components, hover/disabled CSS)
- `dist/esm/lib/{ThemeColors,Colors}.js` → code token tables (verified:
  `blue.60 = #4B68FF`)

No stub needed — the code adapter is real from day one. (Caveat: it reports against
**v1.0.5**, the cached version; record that in every report.)

---

## 4. MVP build order (each step verified before the next)

Per the master plan's "do not proceed if the previous phase is unreliable":

1. **Scaffold** `design-sync/` (types + CLI skeleton, no logic). Verify it runs.
2. **Normalized models** (`core/model.ts`): `NormalizedDesignModel`,
   `NormalizedCodeModel`, `Difference`, each field carrying `source` provenance.
3. **Figma adapter** for the ONE node → `NormalizedDesignModel`. Verify against the
   real node; print it; confirm every value has a Figma provenance ref.
4. **Code adapter** — **real**, reads `@cochlearai/ui@1.0.5` from the Yarn cache
   (`.d.ts` for props/variants, `.js` for style values, `lib/` for tokens). Verify
   every value carries a `file:line` provenance ref; emit `[NEEDS INPUT]` only where
   the package genuinely doesn't express a field (never fabricate).
5. **Mapper** (`core/mapper.ts`): `config/mapping.json` → structured heuristic; else
   `UNMATCHED`. Must express axis-level maps (Figma `type=Red` → code `color=danger`;
   Figma `category`+`type` → code `color`). Verify on Button.
6. **Diff engine** (`core/diff.ts`): field-by-field, normalization logged. Verify on
   a hand-checked pair.
7. **Report** (`report/`): `sync-report.json` (schema below) + human summary.
8. **Stop. Review output with the user.** Only then consider fix suggestions.

Each step: run it, inspect output, note works/limitations. No step is "done" on
assertion alone — evidence first.

---

## 5. `sync-report.json` shape (MVP)

```jsonc
{
  "component": "Button",              // [NEEDS INPUT until POC-COMPONENT chosen]
  "status": "MISMATCH",               // worst status across differences
  "designSource": "figma://<file>?node-id=<id>",  // [NEEDS INPUT: FIGMA-TARGET]
  "codeSource": "<path or pkg@version>",           // [NEEDS INPUT: CODE-SOURCE]
  "generatedAt": "<iso8601>",
  "summary": { "matches": 0, "mismatches": 0, "missing": 0, "unmatched": 0, "needsInput": 0 },
  "differences": [ /* Difference records — see architecture §6 */ ]
}
```

Human output (illustrative **format**, values are placeholders, not real data):

```
Button  —  status: NEEDS_INPUT (code source not connected)
  typography   design: [from Figma]      code: [NEEDS INPUT]   → NEEDS_INPUT
  borderRadius design: [from Figma]      code: [NEEDS INPUT]   → NEEDS_INPUT
  color        design: [from Figma]      code: [NEEDS INPUT]   → NEEDS_INPUT
  summary: 0 matches · 0 mismatches · 3 needs-input
```

Once `CODE-SOURCE` is connected, the same rows resolve to real MATCH/MISMATCH.

---

## 6. CLI surface (MVP subset)

```
design-sync analyze <component>   # dump the normalized design model (Figma only)
design-sync compare <component>   # full diff → sync-report.json + summary  ← MVP core
design-sync report  <component>   # re-print last report, human-readable
# design-sync fix / validate      # deferred to Phases 8–10, NOT in MVP
```

Exact command/flag shape may be revised after the code source is inspected.

---

## 7. Files the MVP would CREATE (only after confirmation)

```
design-sync/adapters/figma/figmaAdapter.ts
design-sync/adapters/code/codeAdapter.ts        # stub until CODE-SOURCE
design-sync/core/model.ts
design-sync/core/mapper.ts
design-sync/core/diff.ts
design-sync/report/json.ts
design-sync/report/human.ts
design-sync/config/mapping.json
design-sync/cli.ts
design-sync/package.json                         # first real package.json in this repo
docs/design-to-code-architecture.md              # ✅ created in Phase 1
docs/design-to-code-mvp-plan.md                  # ✅ this file
```

(Location assumes `WHERE-TO-BUILD` = this repo. If a dedicated repo is preferred,
these paths move accordingly.)

---

## 8. Files that must NOT be modified yet

- **Any existing skill** under `skills/**` (cochl-presentation, pitch-deck,
  design-review, proposal-doc, design-system). These are production skills.
- `scripts/gen_pptx.py`, `shared/branding/**`, existing `docs/*.md`, `README.md`,
  `SKILL.md`, `.claude/**`.
- The untracked `cochl-presentation-skills/` (nested duplicate) and `Claude outputs/`.
- No production `@cochlearai/ui` code is touched at all in the MVP — it is
  **read-only** input. (Fix/apply is a later, gated phase.)

---

## 9. Definition of done (MVP) — ✅ MET

- ✅ `design-sync compare Button` runs against the **real** Figma snapshot + the
  **real** `@cochlearai/ui@1.0.5` package, producing a valid
  `reports/sync-report.Button.json` + readable summary.
- ✅ Every reported value is traceable (Figma node id / code `file:line`) or is an
  explicit `NEEDS_INPUT`.
- ✅ No fabricated components/tokens/values in the output.
- ✅ Limitations stated in the report (design radius, code font, version pin).
- ✅ Engine unit tests pass.

---

## 10. Next implementation step (single, concrete)

All data is reachable and both sides of Button are already cross-verified
(architecture §11). The next action after a **go** is:

1. Scaffold `design-sync/` (recommended location) with `core/model.ts`.
2. Build the **Figma adapter** against Button node `52:718` / variant `3251:7349`
   and print the `NormalizedDesignModel` — verify every value traces to Figma.
3. Then the **code adapter** against `@cochlearai/ui@1.0.5`, then mapper → diff →
   report, stopping to show you the generated `sync-report.json` for Button.

Confirmation needed on just two points: **PoC = Button?** and **build under
`design-sync/` in this repo?** (both recommended). **Awaiting your go before writing
implementation code.**
