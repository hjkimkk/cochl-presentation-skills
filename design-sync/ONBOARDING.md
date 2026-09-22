# design-sync — Team Onboarding

**What it is:** a tool that compares the **Cochl Design System (Figma)** against the
deployed **`@cochlearai/ui`** package and reports where they have drifted — per
property, with full provenance (Figma node id ↔ code `file:line`). It suggests fixes,
can apply verified value fixes behind a confirmation gate (sandbox only), and renders
a drift dashboard.

There are **two ways to use it** — pick your row.

| You are… | You want to… | Do this |
|---|---|---|
| Designer / PM | just see current drift | Open the **dashboard link** (below). No setup. |
| Engineer | run comparisons / fixes / refresh the dashboard | Follow **Engineer quickstart** below. |

---

## 📊 View the dashboard (no setup)

- **Shared link (claude.ai):** ask the maintainer for the current link (it is private
  until shared; the maintainer sets access from the page's **Share** menu).
- **Team URL (GitHub Pages, auto-updates on `main`):**
  `https://<org>.github.io/cochl-presentation-skills/` *(live once the CI in
  §"Automation" has run on `main` and Pages is enabled)*.

The dashboard is **read-only** — it never changes code. Click a component to see each
property's Figma value, code value, status, source, suggested fix, and whether it is
auto-fixable.

---

## 🛠 Engineer quickstart

### Prerequisites
- **Node ≥ 18** (zero runtime dependencies — no `npm install` for the tool itself).
- **Access to `@cochlearai/ui`** (the "code" side), one of:
  - it's already in your **Yarn cache** (if you've built the dashboard app), or
  - install it on demand with a **GitHub PAT that has `read:packages`** (below).

### 1. Get the repo
```bash
git clone https://github.com/hjkimkk/cochl-presentation-skills.git
cd cochl-presentation-skills/design-sync
```

### 2. Make `@cochlearai/ui` available
The code adapter auto-finds `@cochlearai/ui` in the Yarn cache. If it isn't there:
```bash
export COCHLEARAI_NPM_TOKEN=ghp_xxx          # GitHub PAT, scope: read:packages
mkdir -p /tmp/cochlui && cd /tmp/cochlui && npm init -y
printf '@cochlearai:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=%s\n' "$COCHLEARAI_NPM_TOKEN" > .npmrc
npm i @cochlearai/ui
export COCHL_UI_DIR=/tmp/cochlui/node_modules/@cochlearai/ui   # point the tool at it
cd -                                          # back to design-sync
```

### 3. Run it
```bash
node cli.mjs sync                 # all components → reports/sync-summary.json + reports/dashboard.html
open reports/dashboard.html       # scan locally (macOS; use xdg-open on Linux)

node cli.mjs compare Button       # one component, detailed
node cli.mjs suggest Alert        # read-only fix suggestions
node cli.mjs mapping validate     # check the Figma↔code mapping table
npm test                          # engine tests (16 assertions)
```
**No Figma access is needed** for the above — the tool reads committed, verified
snapshots in `data/figma/*.snapshot.json`.

### 4. Apply a verified fix (confirmation-gated, sandbox only)
```bash
node cli.mjs fix Alert --dry-run  # show the exact proposed patch; writes nothing
node cli.mjs fix Alert --yes      # apply to a SANDBOX copy (.work/ui), run tests, re-sync, BEFORE/AFTER
```
Only **token-drift** (verified value/token mismatches) is auto-fixable. The installed
package and production source are **never** touched — fixes go to a sandbox working
copy. Wiring to the real source repo is intentionally not enabled yet.

---

## 🔁 Refresh against the latest Figma (self-service)

The committed snapshots are a point-in-time capture. To detect whether Figma has
changed since:
```bash
export FIGMA_TOKEN=figd_xxx                   # Figma → Settings → Security → personal access token (File content read)
node scripts/capture.mjs                       # reports FRESH / CHANGED per component
node scripts/capture.mjs --write               # refresh capturedAt + fingerprint
```
- Capture **detects** change (fingerprint of background/radius/padding/type/variant
  axes); it does **not** overwrite verified values — that keeps the "no fabrication"
  guarantee. If a component is `CHANGED`, refresh its verified snapshot values (via
  Claude + the Figma MCP) and commit. This is the two-phase design: **capture →
  review → compare**.

Regenerate the shareable page after a sync:
```bash
node scripts/gen-share.mjs                      # writes reports/dashboard-share.html
```
The **team URL** updates automatically via CI on `main` (see below). The **claude.ai
link** is refreshed by the maintainer (re-publish to the same URL).

---

## 🧭 Reading the report

- **Component statuses:** `SYNC` · `DRIFT` · `UNMATCHED` · `NEEDS_INPUT` ·
  `ONE_TO_MANY` · `AMBIGUOUS` · `CONFIG_ERROR`.
- **Drift classes:** `token-drift` (auto-fixable) · `value-drift` · `structural-drift`
  · `unmatched` · `missing-info` (`[NEEDS INPUT]`) · `accepted-drift`.
- **Exit codes:** `0` clean · `1` verified drift · `2` config/mapping error (incl.
  `AMBIGUOUS`) · `3` needs-input / `ONE_TO_MANY` pending.
- **Freshness:** `FRESH` / `STALE` / `UNKNOWN` vs `config/sync-config.json`
  `snapshot.maxAgeHours` (override with `--max-age-hours N`). Stale is warned, never
  silently treated as current.

---

## ⚙️ Configuration (human-authored, authoritative)

- `config/mapping.json` — which Figma component maps to which code component(s),
  with explicit **type** (`ONE_TO_ONE`/`ONE_TO_MANY`/`AMBIGUOUS`/`UNMATCHED`),
  **roles** (names are not trusted), and the per-property comparisons + extraction
  recipe. **Add a component here** (+ a snapshot) — no engine code changes.
- `config/sync-config.json` — `snapshot.maxAgeHours` freshness threshold.
- `config/accepted-drift.json` — **scoped** drift acceptances (one component +
  property + exact values). An accepted mismatch becomes `ACCEPTED_DRIFT`: auditable,
  never auto-fixed. Not a blanket ignore.

Add a component:
1. Capture a verified snapshot → `data/figma/<Name>.snapshot.json`.
2. Add a `components.<Name>` entry to `config/mapping.json`.
3. `node cli.mjs compare <Name>`.

---

## 🤖 Automation (CI + Pages)

`.github/workflows/design-sync.yml` runs on PRs touching `design-sync/**`, on pushes
to `main`, on demand, and weekly:
- validates the mapping table (a blocking mapping error fails the check),
- runs the engine tests + batch sync (drift is reported, not failed),
- deploys the dashboard to **GitHub Pages** (the team URL),
- weekly, checks Figma snapshot freshness (if `FIGMA_TOKEN` is set).

**One-time setup by a maintainer:**
1. Repo → Settings → **Secrets** → add `COCHLEARAI_NPM_TOKEN` (required) and
   `FIGMA_TOKEN` (optional, for the freshness check).
2. Repo → Settings → **Pages** → Source = **GitHub Actions**.

---

## ✅ Guarantees & current limits (honest)

- **Verified, no fabrication.** Every reported value traces to a real Figma node or
  code `file:line`; unverifiable values are `[NEEDS INPUT]`, never guessed.
- **Read-only dashboard; gated, sandboxed fixes.** No production code is connected.
- **Compared against a package version** (e.g. `@cochlearai/ui@1.0.5`) — shown in every
  report; it may lag `main`.
- **Snapshots are point-in-time**; use `capture` to detect staleness.
- **`capture.mjs` uses the Figma REST API** and is verified structurally but needs a
  live `FIGMA_TOKEN` to run; on `CHANGED`, refresh values with review (not auto-write).
- **`ONE_TO_MANY`** (Table, Progress) reports the mapping today; per-target property
  comparison is future work.

Questions → the maintainer (hjkim@cochlear.ai). See `README.md` and
`../docs/design-to-code-architecture.md` (§13–§14) for the full design.
