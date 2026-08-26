# Generic Deck (no specific template)

Fallback when the request is a deck but matches no dedicated variant in [`../registry.md`](../registry.md). Inherits [`../brand-core.md`](../brand-core.md) for all tokens, the glow motif, page-nav, HTML→PPTX export, output flow, and QA. This file only adds the freehand structure.

## Step 1 — Context (answer internally before building)
1. **Audience?** (investors → market+traction; gov/defense → credibility+architecture; enterprise → ROI+competitive; internal → clarity+decision)
2. **One core message?** (one sentence; everything supports it)
3. **3 strongest proof points?** (KPIs, technical moats, wins)
4. **Desired action after the last slide?** (fund, buy, partner, approve)

## Step 2 — Map content to ~13 slides
Produce ~13 content slides unless told otherwise. Break slides add to that count intentionally.

| Intent | Layout class | Max density |
|---|---|---|
| cover | hero | LOW |
| problem | three-cols + callout-banner | MEDIUM |
| market | kpi-grid-2x3 + quote-block | HIGH |
| solution | four-pillar | MEDIUM |
| architecture | layer-stack (≤4 layers) | HIGH |
| capabilities | data-table (≤8 rows) | HIGH |
| performance | kpi-grid-4x2 | HIGH |
| scenarios | three-scenario cards | MEDIUM |
| competitive | comp-table (Cochl col last, highlighted) | HIGH |
| technology | two-cols-list | MEDIUM |
| roadmap | timeline (≤7 phases) | MEDIUM-HIGH |
| budget | donut + bars | HIGH |
| cta | cinematic-cta (frosted cards) | LOW-MEDIUM |
| quote-break | centered quote, no cards | VERY LOW |
| stat-spotlight | single oversized number | VERY LOW |
| full-image | full-bleed image, text bottom | VERY LOW |
| section-break | chapter title, decorative number | VERY LOW |

**Break slides:** insert after every 3–4 consecutive HIGH slides and at major transitions (Problem→Solution, Solution→Proof, Proof→Next Steps). Pick by need: emotional reset → quote-break; wow after data → stat-spotlight; visual relief → full-image (only with a real image); chapter turn → section-break.

**Content rules:** h2 ≤8 words with exactly one `<span class="grad-text">` phrase; card body ≤2 sentences (≤30 words); KPI label ≤6 words; bullets ≤1 line; one core message per slide.

## Step 3 — Aesthetic layer (frontend-design)
- Vary weight intentionally (700 stat / 600 heading / 400 body / 300 italic tagline).
- Cover: left-aligned text, ~100px top padding, full-bleed background + glow. Content: max-width 1280px, 40px h-padding, flat `#0b0b12` (data is the visual). CTA: centered, frosted outcome cards.
- Anti-AI-look: no glassmorphism on content slides (cover/CTA only); ≤2 accent elements per slide; no rainbow charts; ≤1 icon per card; whitespace is breathing room.

Everything else (colors, gradient rule, fonts, page-nav, motion, PPTX, QA) → **[`../brand-core.md`](../brand-core.md)**.
