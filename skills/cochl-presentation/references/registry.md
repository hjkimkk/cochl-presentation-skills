# Template Registry

The router's lookup table **and** the build roadmap. Match the user's request to a row, then open that row's spec. Teams are **tags for discovery**, not separate skills — the same template serves many teams (onboarding decks, review decks, etc.).

**Status:** ✅ ready (spec exists) · 🟡 planned (build on this structure when first requested). When you build a 🟡 into a real spec, drop the file at the listed path, inherit [`brand-core.md`](brand-core.md), and flip it to ✅.

Every artifact inherits **[`brand-core.md`](brand-core.md)**. Decks also inherit the shared HTML→PPTX / page-nav / output machinery there.

---

## Decks → `decks/`

| Template | Teams / use | Spec | Status |
|---|---|---|---|
| Investor / fundraising pitch | Business — investors, VCs, a round | [`decks/investor-template.md`](decks/investor-template.md) — 15 layouts (Mono UPPERCASE headings) | ✅ |
| B2B partnership / sales proposal | Business — partners, enterprise buyers | [`decks/b2b-sales-proposal-template.md`](decks/b2b-sales-proposal-template.md) — 22 layouts (mint accent) | ✅ |
| Corporate strategy / product roadmap | Business, leadership — pillars, OKRs, roadmap | [`decks/corporate-strategy-roadmap-template.md`](decks/corporate-strategy-roadmap-template.md) — 15 layouts | ✅ |
| Quarterly business review (QBR) / board update | Business, board — quarter review + ask | [`decks/qbr-board-update-template.md`](decks/qbr-board-update-template.md) — 15 layouts | ✅ |
| Market & competitive landscape | Business — sizing, share, positioning | [`decks/market-competitive-template.md`](decks/market-competitive-template.md) — 13 layouts | ✅ |
| Trade show / conference booth | Business — event booth loop, big-type panels | `decks/tradeshow-booth-template.md` | 🟡 |
| Data pipeline & architecture overview | Data — collection→labeling→training flow | `decks/data-pipeline-architecture-template.md` | 🟡 |
| Data labeling guideline / annotator training | Data — how-to, examples, do/don't | `decks/data-labeling-guideline-template.md` | 🟡 |
| Dataset summary & collection progress | Data — coverage, counts, progress KPIs | `decks/dataset-progress-report-template.md` | 🟡 |
| Annotation vendor onboarding | Data — vendor ramp, standards, QA loop | `decks/annotation-vendor-onboarding-template.md` | 🟡 |
| Data quality & governance review | Data — quality metrics, governance, risks | `decks/data-quality-governance-template.md` | 🟡 |
| Design system & component library overview | Design — tokens, components, usage | `decks/design-system-overview-template.md` | 🟡 |
| UX research findings / usability report | Design — study, findings, recommendations | `decks/ux-research-findings-template.md` | 🟡 |
| Product walkthrough & feature showcase | Design, Product — flows, screens, value | `decks/product-walkthrough-template.md` | 🟡 |
| Technical architecture / system design | Dev — components, data flow, decisions | `decks/technical-architecture-template.md` | 🟡 |
| Sprint review & release notes | Dev — shipped, demos, next sprint | `decks/sprint-review-release-notes-template.md` | 🟡 |
| Engineering onboarding & tech stack | Dev — stack, repos, workflows | `decks/engineering-onboarding-template.md` | 🟡 |
| Research findings / paper summary | Research — problem, method, results | `decks/research-paper-summary-template.md` | 🟡 |
| Model performance & benchmark report | Research — metrics, ablations, comparison | `decks/model-benchmark-report-template.md` | 🟡 |
| Technical deep-dive / conference talk | Research — talk-grade narrative | `decks/technical-deep-dive-template.md` | 🟡 |
| Internal research review (journal-club) | Research — paper critique, discussion | `decks/research-journal-club-template.md` | 🟡 |
| Cochl 101 | All / Event — company & product intro | `decks/cochl-101-template.md` | 🟡 |

> **Design review** (proposal / direction-alignment) already lives in the separate **`design-review`** skill — route there rather than duplicating here.

## Documents → `docs/`

| Template | Teams / use | Spec | Status |
|---|---|---|---|
| API / SDK developer documentation | Dev — reference docs, HTML→PDF | `docs/api-sdk-documentation-template.md` | 🟡 |

> Styled proposal documents already live in the separate **`proposal-doc`** skill.

## Brochure → `brochure/`
Editable-SVG brochure / 제품 소개서 / 1-pager — 12 layouts (V1/V2/V3 × portrait/landscape × front/back) + 32 icons. Spec: [`brochure/SKILL.md`](brochure/SKILL.md). ✅
Trigger: brochure, 브로셔, leaflet, datasheet.

## Social / press kit → `social-kit/`
Editable-SVG platform banners — LinkedIn 1584×396, YouTube 2560×1440, Medium 1500×750, Notion 1500×600, OG 1200×630. `templates/` blank (drop-zones + placeholders), `examples/` filled. Spec: [`social-kit/README.md`](social-kit/README.md). ✅
Trigger: social banner, press/media kit, LinkedIn/YouTube/Medium/Notion cover, OG card.

---

## Adding a new template
1. Pick the artifact type folder (`decks/`, `docs/`, `brochure/`, `social-kit/`).
2. Write a self-contained spec that inherits `brand-core.md` and only defines what's specific (structure, layouts, copy patterns, heading treatment).
3. For decks, reuse the shared HTML→PPTX / page-nav machinery — don't restate it.
4. Add/flip the registry row to ✅. Keep team tags accurate so discovery stays sharp.
