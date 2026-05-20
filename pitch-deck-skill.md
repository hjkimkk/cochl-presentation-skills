---
name: pitch-deck-skill
description: Preserves the Cochl pitch deck visual system and maps new content into it. Use this skill when updating slide content, replacing individual slides, or building a new deck for a different product using the same Cochl dark enterprise theme (IBM Plex Sans, #0B1F3A, AI purple #6B4EFF). Encodes 30 named layout archetypes — 13 core content layouts, 4 break/emphasis layouts, and 13 Cochl-template-derived layouts (agenda, mission-statement, split-left/right-image, text-image-bottom, icon-columns, numerical-value, photo-mosaic, team-grid, simple-text, sidebar-image, chart-sidebar, image-right-list) — plus design tokens, flow rules, and a QA checklist. Always outputs both HTML and PPTX formats.
license: Complete terms in LICENSE.txt
---

# Cochl Slide Deck Agent Skill
**Version:** 1.0  
**Source deck:** `cochl_acousticshield_deck.html`  
**Last updated:** 2026-05-12

---

## Purpose

This skill preserves the visual system of the Cochl pitch deck and maps new content into it — without redesigning, restyling, or reinventing any layout. The deck is the source of truth. The agent only replaces and adapts content.

---

## Part 1 — Design Tokens (source of truth)

```css
/* Colors */
--col-bg:         #06101E        /* page/body background */
--c-enterprise:   #0B1F3A        /* every slide background */
--col-card:       #0F2847        /* card, table, layer surfaces */
--col-text:       #FFFFFF
--col-muted:      #8B9BB4
--col-border:     rgba(255,255,255,0.07)
--c-ai:           #6B4EFF        /* primary accent: purple */
--c-analytics:    #2F80ED        /* secondary accent: blue */
--c-emergency:    #EB5757
--c-success:      #10B981
--c-warning:      #F59E0B
--grad-main:      linear-gradient(135deg, #6B4EFF 0%, #2F80ED 100%)

/* Typography */
font-family: 'IBM Plex Sans', sans-serif
h1: 48px / bold / lh 1.1 / tracking -0.025em
h2: 32px / semibold / lh 1.2 / tracking -0.015em
body: 18px / regular / lh 1.5
caption: 14px / regular / lh 1.4
small: 13px / muted color

/* Spacing */
--section-gap:    64px           /* margin below section headings */
--card-gap:       24px           /* gap between grid cards */
--grid-padding:   40px           /* slide horizontal padding */
--max-width:      1280px
--radius-card:    20px
--radius-btn:     14px
```

**Gradient use rule:** `--grad-main` is applied ONLY to:
- Cover and CTA slide backgrounds (as PPTX image overlay)
- Accent lines (`3px`, max 120px wide)
- KPI value text (`-webkit-background-clip: text`)
- Bottom progress bars on KPI cards
- Architecture layer color progression
- Timeline track

Never apply `--grad-main` to card backgrounds, body text, or table cells.

---

## Part 2 — Slide Layout Library

Each slide type below is a named layout. New content must be mapped to the closest matching type.

---

### LAYOUT: hero
**Used on:** S1 (Cover), S13 (CTA)  
**Density:** LOW — max 6 text elements + 1 meta row  
**Structure:**
```
[logo: bottom-left, 20px, opacity 70%]
[label: 11px uppercase, letter-spacing 0.12em, muted color]
[h1: large, white, bold]
[accent-line: 3px gradient, width 100px]
[subtitle: regular, white]
[tagline: 18px italic, 70% white, max 1 line]
[meta-row: flex, 4 items max, gap 36px]
  └── each item: [label 11px uppercase muted] + [value 15px semibold white]
```
**Cover:** PPTX gradient background image + `linear-gradient(130deg, rgba(11,31,58,0.5) 0%, rgba(6,16,30,0.2) 60%, transparent 100%)` overlay  
**CTA:** Same background. Outcome cards use `rgba(255,255,255,0.10)` + `backdrop-filter: blur(12px)`.

**Content rule:** Title must be max 6 words. Tagline must be 1 sentence, italic, under 120 chars. Meta row max 4 items.

---

### LAYOUT: three-cols
**Used on:** S2 (Problem), S8 (Scenarios)  
**Density:** MEDIUM  
**Structure:**
```
[h2 section-head]
  └── [.sub: subtitle text if needed]
[.three-cols grid: 3 equal cards]
  └── each card: [icon 44px] + [h4 warning-color] + [body text]
[full-width callout banner]
  └── [content text] + [stat line: warning color, 13px bold]
```
**Content rule:** Each card: 1 heading + max 2 sentences body. Callout: 1–2 sentences + 1 stat line. Do not add a 4th card — split to new slide.

---

### LAYOUT: kpi-grid-2x3
**Used on:** S3 (Market)  
**Density:** HIGH  
**Structure:**
```
[h2 section-head]
[.kpi-grid-2x3: 3-column, 2-row grid → 6 KPI cards]
  └── each: [.kpi-value: grad-text] + [.kpi-label: 13px muted] + [.kpi-sub: 12px optional]
[.quote-block: blue left-border, italic quote + attribution]
```
**Content rule:** Max 6 KPI cards. Value: short number/metric. Label: max 6 words. Sub: optional date or CAGR. If more than 6 KPIs, create a second slide.

---

### LAYOUT: four-pillar
**Used on:** S4 (Solution)  
**Density:** MEDIUM  
**Structure:**
```
[h2 + .sub subtitle]
[.four-cols grid: 4 equal pillar cards]
  └── each: [.pillar-number: grad-text 34px] + [2px accent line] + [h4] + [body 14px]
```
**Pillar numbers:** 01 / 02 / 03 / 04  
**Content rule:** Each pillar: 1 heading (max 4 words) + 1–2 sentences. No sub-bullets inside pillars.

---

### LAYOUT: layer-stack
**Used on:** S5 (Architecture)  
**Density:** HIGH  
**Structure:**
```
[h2 with keyword in grad-text]
[.layer-stack: vertical flex column, gap 10px]
  └── each layer: [.layer-number circle] + [.layer-heading accent-color] + [.layer-body muted]
  └── between layers: [.layer-arrow: ▼ in muted color]
```
**Layer color progression:** top→bottom: `#2F80ED → #4B72F4 → #5D5BF8 → #6B4EFF`  
**Content rule:** Max 4 layers. Each: 1 heading + 1 sentence. Layer numbers: ① ② ③ ④.

---

### LAYOUT: data-table
**Used on:** S6 (Capabilities)  
**Density:** HIGH  
**Structure:**
```
[h2]
[.table-wrap > table.data-table]
  └── thead: [th: 11px uppercase, muted, bottom border]
  └── tbody: [td first-col: semibold, ai-purple] [td last-col: success green]
  └── even rows: rgba(255,255,255,0.02) tint
[.table-footnote: blue left-border, 13px muted]
```
**Content rule:** Max 8 rows. Max 4 columns. First column is the category name (purple). Last column is the outcome/result (green). Middle columns are neutral (muted).

---

### LAYOUT: kpi-grid-4x2
**Used on:** S7 (Performance)  
**Density:** HIGH  
**Structure:**
```
[h2]
[.kpi-grid-4x2: 4-column, 2-row grid → 8 KPI cards]
[.kpi-footer: centered text, top-border accent, 13px muted]
```
**Content rule:** 8 KPI cards maximum. If fewer than 8, center-align the last row. Footer: 1 short certification or verification statement.

---

### LAYOUT: three-scenario
**Used on:** S8 (Scenarios)  
**Density:** MEDIUM  
**Structure:**
```
[h2 with key metric in grad-text]
[.three-cols: 3 scenario cards]
  └── each: [.scenario-label: gradient badge] + [h4 heading] + [.steps list]
     └── each step: [.step plain] or [.step.highlight: purple border, italic, bg tint]
```
**Content rule:** Each scenario: 1 badge label + 1 heading + max 4 steps. Highlight step = AI agent quote or key result. Steps are short sentences, not bullets.

---

### LAYOUT: comparison-table
**Used on:** S9 (Competitive)  
**Density:** HIGH  
**Structure:**
```
[h2 with competitor descriptor in grad-text]
[.table-wrap > table.comp-table]
  └── thead: [blank] [competitor cols muted] [Cochl col: ai-purple bg, #a08bff text]
  └── tbody: [feature rows] [Cochl col: ai-purple bg tint]
  └── No/Yes values: ✗ emergency-red / ✓ success-green
```
**Content rule:** Max 6 feature rows. Max 4 competitor columns + 1 Cochl column. Cochl column always last, always highlighted.

---

### LAYOUT: two-cols-list
**Used on:** S10 (Technology)  
**Density:** MEDIUM  
**Structure:**
```
[h2]
[.two-cols grid]
  └── left card: [.tech-col-head: analytics-blue] + [bullet list]
  └── right card: [.tech-col-head: ai-purple] + [bullet list]
  └── bullets: ▸ symbol, ai-purple, 15px, muted body color
```
**Content rule:** Max 8 bullets per column. Each bullet: 1 line. No sub-bullets. Left = technical/product facts. Right = credentials/proof.

---

### LAYOUT: timeline
**Used on:** S11 (Roadmap)  
**Density:** MEDIUM-HIGH  
**Structure:**
```
[h2]
[.timeline-wrap > .timeline-track]
  └── phase columns: [dot] + [.tl-card with label/period/desc/budget pill]
  └── checkpoint phases: warning-yellow dot + card border
  └── final phase: success-green dot + card border
[.timeline-total: centered, total budget in grad-text]
```
**Content rule:** Max 7 phases. Each phase card: label (1 word), period (M1–M2), dates, 1–2 sentence description, budget pill. Checkpoint phases (mid-review): warning color. Final phase: success color.

---

### LAYOUT: budget
**Used on:** S12 (Budget)  
**Density:** HIGH  
**Structure:**
```
[h2 with amount in grad-text]
[.budget-layout: 2-column grid, 1fr 1fr]
  └── left: [SVG donut chart: 2 segments] + [legend items]
  └── right: [section heading muted] + [horizontal bar rows]
             └── each bar: [label] [percent] [.bar-track > .bar-fill grad-main]
[.roi-note: success-green border, 14px]
```
**Donut segments:** max 3. Bar rows: max 6.  
**Content rule:** Left = funding structure (where money comes from). Right = allocation (where money goes). ROI note = 1 sentence ROI/value statement.

---

### LAYOUT: cinematic-cta
**Used on:** S13 (CTA)  
**Density:** LOW-MEDIUM  
**Structure:**
```
[hero background: same as cover]
[h2 centered]
[.outcome-cards: 3-col grid of frosted glass cards]
  └── each: [large number 01/02/03 in white grad-text] + [h4 white] + [body 72% white]
[.closing-stmt: centered, grad-subtle bg, 22px semibold]
[.pipeline: flex row of steps with → arrows]
  └── last step: grad-main background, white text
[footer: 12px, 50% white, contact info]
```
**Content rule:** Max 3 outcome cards. Closing statement: 1 sentence, under 80 chars. Pipeline: max 5 steps.

---

## Part 2B — Break & Emphasis Layouts

These four layouts exist to give the audience breathing room, reset attention, and make individual messages land harder. Insert them between dense content slides. They follow the same design tokens but strip away all cards, grids, and data.

---

### LAYOUT: quote-break
**Used on:** Any position between content slides  
**Density:** VERY LOW — max 2 visible text elements  
**Purpose:** One powerful statement lands before the audience moves on  
**Structure:**
```
[#0B1F3A background]
[optional: radial glow behind text: rgba(107,78,255,0.06) — no glassmorphism]
[centered column, vertically centered:]
  [decorative " glyph: 120px, rgba(255,255,255,0.06), positioned top-left]
  [.quote-text: 32–40px italic, white, centered, max 20 words]
  [.quote-attr: 15px, muted (#8B9BB4), centered — format: "— Name, Title"]
  [optional: 60px accent line, grad-main, centered, below attribution]
```
**HTML class names:** `.quote-break-slide`, `.quote-text`, `.quote-attr`, `.quote-deco`  
**Content rules:**
- No section heading, no cards, no grid, no icons
- Quote: ≤ 20 words. If longer, cut — do not abbreviate
- Attribution always present. If source unknown, omit rather than fabricate
- Do not add a second quote on the same slide

---

### LAYOUT: stat-spotlight
**Used on:** After a data-heavy slide, or to isolate a defining metric  
**Density:** VERY LOW — 1 number + max 2 support lines  
**Purpose:** A single number gets cinematic weight — for a genuinely striking metric  
**Structure:**
```
[#0B1F3A background]
[centered column, vertically centered:]
  [.stat-eyebrow: 11px uppercase, letter-spacing 0.15em, muted — context label]
  [.stat-value: 96–120px, bold, grad-text — the number]
  [.stat-label: 22px, white, bold, max 6 words — what it means]
  [.stat-context: 14px, muted, 1 line — optional date or source]
```
**HTML class names:** `.stat-spotlight-slide`, `.stat-eyebrow`, `.stat-value`, `.stat-label`, `.stat-context`  
**Content rules:**
- ONE number only. No cards, no grid, no table
- Must be a genuinely striking metric — not a percentage under 50%, not a count under 100
- Vertical + horizontal centering required. Generous whitespace: do not fill remaining space
- Grad-text on value only. Nothing else gets gradient treatment on this slide

---

### LAYOUT: full-image
**Used on:** After the problem section, or before a solution — dramatic visual pause  
**Density:** VERY LOW — image + optional 1-line caption  
**Purpose:** One strong visual (photo, diagram, screenshot) fills the entire slide  
**Structure:**
```
[full-bleed image: object-fit cover, width 100%, height 100%]
[overlay: linear-gradient(to top, rgba(6,16,30,0.88) 0%, rgba(6,16,30,0.1) 55%, transparent 100%)]
[bottom-left text zone — bottom 20% of slide:]
  [.fi-caption: 11px uppercase, letter-spacing 0.12em, muted]
  [.fi-headline: 24px, white, bold, max 8 words — optional]
```
**HTML class names:** `.full-image-slide`, `.fi-overlay`, `.fi-caption`, `.fi-headline`  
**Content rules:**
- No section heading, no cards, no bullets
- Image must be base64-encoded (self-contained file rule)
- Text only in the bottom 20% of the slide — never overlapping the main subject of the image
- Never use stock AI-generated imagery. Use: product screenshots, architecture diagrams, field/deployment photos, or data visualizations rendered as images

---

### LAYOUT: section-break
**Used on:** As chapter dividers between major topic groups (e.g., Problem → Solution, Solution → Proof)  
**Density:** VERY LOW — max 3 text elements  
**Purpose:** Signals a topic shift, resets audience attention before a new chapter  
**Structure:**
```
[#0B1F3A background]
[optional: subtle radial glow at center — rgba(107,78,255,0.08)]
[centered column, vertically centered:]
  [.sb-number: 80–100px, bold, rgba(255,255,255,0.05) — large decorative chapter number]
  [.sb-title: 40–48px, bold, white, max 4 words — 1 key word in grad-text]
  [optional: 60px accent line, centered, grad-main]
  [optional: .sb-sub: 16px, muted, 1 sentence max — brief framing of what follows]
```
**HTML class names:** `.section-break-slide`, `.sb-number`, `.sb-title`, `.sb-sub`  
**Content rules:**
- No cards, no data, no bullets, no icons
- The large chapter number is decorative (extremely low opacity) — the title is the primary read
- Exactly one keyword in grad-text in `.sb-title`
- `.sb-sub` is optional. Use it only when the transition needs a single framing sentence

---

## Part 2C — Cochl Template-Derived Layouts

Extracted from `Cochl_PT_template.pptx` (22 slides, 10×5.62in). Each layout below maps directly to a slide archetype in the official Cochl visual system. Use these when the content type matches — they are brand-validated patterns.

---

### LAYOUT: agenda
**Source:** Template slide 3  
**Used on:** Opening slide after Cover, or before a multi-section presentation  
**Density:** LOW-MEDIUM  
**Structure:**
```
[left panel: ~40% width, full-height background image]
[right panel: ~60% width]
  [.agenda-title: h2, 36px, white]
  [.agenda-list: vertical list of items]
    └── each item: [.agenda-time: muted, 12px] + [.agenda-label: white, 12px bold] + [.agenda-sub: muted, 9px optional]
    └── separator lines between items
```
**HTML class names:** `.agenda-slide`, `.agenda-panel-left`, `.agenda-panel-right`, `.agenda-list`, `.agenda-item`, `.agenda-time`, `.agenda-label`, `.agenda-sub`  
**Content rules:** Max 6 agenda items. Time label is optional (omit for non-timed agendas). Left image should be brand/product photo. No cards — items are plain list rows with thin dividers.

---

### LAYOUT: mission-statement
**Source:** Template slide 4  
**Used on:** "Who we are" moment, product philosophy, brand positioning  
**Density:** VERY LOW  
**Structure:**
```
[full-bleed background image (base64 inline)]
[semi-transparent overlay: rgba(6,16,30,0.55) or brand-tuned opacity]
[centered text zone, vertically ~40% from top:]
  [.mission-quote: 34–40px, white, max 12 words — the core statement]
  [.mission-body: 13px, 80% white, 2 sentences max — supporting context]
  [.mission-source: 12px, muted — optional attribution or product name]
```
**HTML class names:** `.mission-statement-slide`, `.mission-overlay`, `.mission-quote`, `.mission-body`, `.mission-source`  
**Content rules:** The quote is the entire message — do not add cards, lists, or icons. Body text is optional context; omit if the quote stands alone. Different from `quote-break` (which is a break slide with minimal text) — this layout has a full background image and can carry 2–3 lines.

---

### LAYOUT: split-left-image
**Source:** Template slide 9  
**Used on:** Product in action, deployment photos, "show then explain" moments  
**Density:** LOW-MEDIUM  
**Structure:**
```
[.sli-image: left ~60% width, full-height, object-fit cover]
[.sli-content: right ~40% width, vertically centered, padding 40px]
  [.sli-title: 27px bold, white]
  [.sli-body: 13px, muted, max 3 sentences]
  [optional: .sli-cta button or accent line below body]
```
**HTML class names:** `.split-left-image-slide`, `.sli-image`, `.sli-content`, `.sli-title`, `.sli-body`  
**Content rules:** Image occupies left 58–62% — never less than 50%. Text stays right. No cards inside the text panel. Max 3 sentences body. Do not add a grid or KPI inside the content panel.

---

### LAYOUT: split-right-image
**Source:** Template slide 11  
**Used on:** Case study narrative, technical diagram explanation, "explain then show"  
**Density:** LOW-MEDIUM  
**Structure:**
```
[.sri-content: left ~50% width, vertically centered, padding 40px]
  [.sri-title: 34–40px bold, white, max 6 words — 1 key phrase grad-text]
  [.sri-sub: 13px, muted, 1 sentence]
  [.sri-body: 12px, muted, 2 sentences max]
[.sri-image: right ~50% width, full-height, object-fit cover]
```
**HTML class names:** `.split-right-image-slide`, `.sri-content`, `.sri-title`, `.sri-sub`, `.sri-body`, `.sri-image`  
**Content rules:** Image occupies right 48–52%. One grad-text span on the title. No cards. Text panel padding min 40px from edge.

---

### LAYOUT: text-image-bottom
**Source:** Template slide 12  
**Used on:** Product overview with screenshot, architecture diagram below explanation  
**Density:** MEDIUM  
**Structure:**
```
[top zone: ~55% height]
  [.tib-title: 27px bold, white]
  [.tib-body: 13px, muted, 3 sentences max]
[bottom zone: ~40% height, borderless]
  [.tib-image: full-width image strip, object-fit cover, border-radius 12px top]
  [optional: .tib-caption: 11px muted, below or overlay bottom-left]
```
**HTML class names:** `.text-image-bottom-slide`, `.tib-top`, `.tib-title`, `.tib-body`, `.tib-image-wrap`, `.tib-image`, `.tib-caption`  
**Content rules:** Image must be a real product/system visual — not a stock photo. Caption optional (max 10 words). Body text in top zone only. Do not put text over the image.

---

### LAYOUT: icon-columns
**Source:** Template slide 15  
**Used on:** Features, benefits, principles — when each point has a distinct icon  
**Density:** MEDIUM  
**Structure:**
```
[h2 section heading]
[.icon-cols: 3-column grid]
  └── each column:
      [.ic-icon: 48×48px icon (SVG or img), centered above text]
      [.ic-title: 13px bold, white]
      [.ic-body: 12px, muted, 2 sentences max]
```
**HTML class names:** `.icon-columns-slide`, `.icon-cols`, `.ic-col`, `.ic-icon`, `.ic-title`, `.ic-body`  
**Content rules:** Exactly 3 columns (no 2-col or 4-col variant for this layout). One icon per column — max 48px. No card backgrounds — columns are borderless. Max 2 sentences per column body. Icons must be consistent in style (all line or all filled).

---

### LAYOUT: numerical-value
**Source:** Template slide 16  
**Used on:** Headline metrics as a trio — market size + key stat + milestone  
**Density:** LOW-MEDIUM  
**Structure:**
```
[h2 section heading]
[.num-val-grid: 3-column grid, vertically centered]
  └── each column:
      [.nv-value: 36–44px bold, grad-text — the number]
      [.nv-title: 13px bold, white — what it is]
      [.nv-body: 11px, muted, 2 sentences max — context]
```
**HTML class names:** `.numerical-value-slide`, `.num-val-grid`, `.nv-col`, `.nv-value`, `.nv-title`, `.nv-body`  
**Content rules:** Exactly 3 values. Use grad-text on values only. Each value must be a real metric — no placeholder text. Different from `stat-spotlight` (single number, fullscreen) and `kpi-grid-2x3` (6 cards, dense) — this is 3 headline numbers with narrative below each. No card backgrounds — columns are open.

---

### LAYOUT: photo-mosaic
**Source:** Template slide 17  
**Used on:** Deployment photos, partner logos, customer evidence, team shots  
**Density:** MEDIUM  
**Structure:**
```
[left panel: ~38% width]
  [.pm-title: 27px bold, white]
  [.pm-body: 12px, muted, 2 sentences]
[right panel: ~60% width]
  [.pm-grid: CSS grid, rows of equal-size image cells]
    └── layout option A: 1 large top + 2×2 bottom (5 images)
    └── layout option B: 3×2 equal grid (6 images)
    └── each cell: object-fit cover, border-radius 8px, gap 6px]
```
**HTML class names:** `.photo-mosaic-slide`, `.pm-left`, `.pm-title`, `.pm-body`, `.pm-right`, `.pm-grid`, `.pm-cell`  
**Content rules:** Minimum 4 images, maximum 6. All images must be base64-encoded. Images should be thematically consistent. Do not mix photos and icons in the same grid. No text overlay on images.

---

### LAYOUT: team-grid
**Source:** Template slide 18  
**Used on:** Team introduction, advisory board, key stakeholders  
**Density:** MEDIUM  
**Structure:**
```
[h2 section heading]
[.team-grid: responsive grid, 4–5 columns × 2 rows]
  └── each cell:
      [.tg-photo: square image, 120×120px, border-radius 8px]
      [.tg-name: 11px bold, white, centered, below photo]
      [.tg-role: 10px, muted, centered — optional]
```
**HTML class names:** `.team-grid-slide`, `.team-grid`, `.tg-card`, `.tg-photo`, `.tg-name`, `.tg-role`  
**Content rules:** 4–10 people max. Grid auto-fills. Photo aspect ratio must be 1:1 (square crop). Name: first + last. Role: max 3 words. No card backgrounds — each cell is borderless with just the photo and name.

---

### LAYOUT: simple-text
**Source:** Template slide 5  
**Used on:** Concept explanation, background context, single-topic deep-dive  
**Density:** LOW  
**Structure:**
```
[left-aligned column, max-width 760px, padding 60px]
  [h2: 27px bold, white — slide title]
  [.st-intro: 13px, white, 1 sentence — bold framing statement]
  [.st-body: 12px, muted, 2–3 short paragraphs — detailed explanation]
```
**HTML class names:** `.simple-text-slide`, `.st-intro`, `.st-body`  
**Content rules:** No cards, no icons, no grid. Pure reading layout — use when the idea itself needs space. Each paragraph: max 3 sentences. Total body text: max 120 words. Add one `<span class="grad-text">` in the h2 only.

---

### LAYOUT: sidebar-image
**Source:** Template slide 10  
**Used on:** Product diagram, system overview, architecture visualization alongside explanation  
**Density:** MEDIUM  
**Structure:**
```
[.si-left: ~36% width, full-height image column]
  [image: object-fit cover, full bleed]
  [optional: .si-caption — 11px muted, bottom-left of image]
[.si-right: ~64% width, padding 52px]
  [h2: 27px bold, white]
  [.si-subtitle: 13px, accent-color — 1-line context]
  [.si-body: 12px, muted, max 4 sentences]
  [optional: .si-list — 3–4 bullet items, plain, no icons]
```
**HTML class names:** `.sidebar-image-slide`, `.si-left`, `.si-right`, `.si-subtitle`, `.si-body`, `.si-list`  
**Content rules:** Image column is narrower than `split-left-image` (36% vs 60%). Right panel carries the full explanation. Subtitle line uses `--c-ai` or `--c-analytics` color. No cards inside right panel.

---

### LAYOUT: chart-sidebar
**Source:** Template slide 14  
**Used on:** Performance data, accuracy comparisons, metric breakdowns with context  
**Density:** HIGH  
**Structure:**
```
[.cs-left: ~30% width, padding 48px — text context]
  [h2: 22px bold]
  [.cs-intro: 12px, white, 1 sentence]
  [.cs-body: 11px, muted, 2 sentences]
  [.cs-list: 3–4 labeled data points, muted]
[.cs-right: ~70% width — visual chart area]
  [SVG or CSS bar chart: horizontal or grouped bars]
  [axis labels: 10px muted]
  [bar labels: 11px, values in grad-text or success/warning colors]
  [legend: 10px, 3 items max]
```
**HTML class names:** `.chart-sidebar-slide`, `.cs-left`, `.cs-right`, `.cs-chart`, `.cs-bar`, `.cs-bar-label`, `.cs-axis`  
**Content rules:** Chart bars use `--grad-main` (primary series), `--c-analytics` (secondary), `--c-success` / `--c-warning` (status). Max 6 bars or 4 groups of 3. No pie charts — horizontal or vertical bars only. Always include data value labels on bars. Chart must be SVG or pure CSS — no external chart libraries.

---

### LAYOUT: image-right-list
**Source:** Template slide 19  
**Used on:** Case study narrative, feature showcase with supporting image  
**Density:** MEDIUM  
**Structure:**
```
[.irl-left: ~52% width, padding 52px 40px]
  [h2: 27px bold, white]
  [.irl-sub: 13px, accent-color — 1 sentence]
  [.irl-body: 12px, muted, 2 sentences]
  [.irl-items: 3–4 items with small dot + text]
[.irl-right: ~48% width, padding 28px]
  [.irl-image: inset image, border-radius 16px, not full-bleed]
  [image fills right panel with 28px gap from edges]
```
**HTML class names:** `.image-right-list-slide`, `.irl-left`, `.irl-right`, `.irl-sub`, `.irl-body`, `.irl-items`, `.irl-item`, `.irl-image`  
**Content rules:** Image is inset (not full-bleed) — 28px gap on all sides of right panel. Left panel carries title + subtitle + 3–4 dot-list items. Different from `split-right-image` (full-bleed image) — this layout has the image as a framed element within the right panel.

---

## Part 2D — HTML Code Templates (all 30 layouts)

Copy-paste ready. Replace `PLACEHOLDER` text with real content. Never alter class names or structural tags.

---

### TEMPLATE 01 — hero (Cover / CTA)
```html
<section id="slide-N">
  <div class="cover-bg" style="background-image:url('data:image/png;base64,BASE64_BG');"></div>
  <div class="cover-overlay"></div>
  <div class="cover-inner">
    <div class="slabel">LABEL TEXT</div>
    <h1>HEADLINE <span class="grad-text">KEY PHRASE</span></h1>
    <div class="accent-bar"></div>
    <div style="font-size:20px;color:#fff;margin-bottom:8px;">Subtitle sentence here.</div>
    <div style="font-size:18px;font-style:italic;color:rgba(255,255,255,0.7);margin-bottom:40px;">Tagline — one memorable line.</div>
    <div class="cover-meta">
      <div class="cover-meta-item"><div class="cover-meta-label">DATE</div><div class="cover-meta-val">2026-Q1</div></div>
      <div class="cover-meta-item"><div class="cover-meta-label">VERSION</div><div class="cover-meta-val">v1.0</div></div>
      <div class="cover-meta-item"><div class="cover-meta-label">AUDIENCE</div><div class="cover-meta-val">Enterprise</div></div>
    </div>
  </div>
  <img class="cover-logo-bottom" src="data:image/png;base64,BASE64_LOGO" alt="Cochl">
</section>
```

---

### TEMPLATE 02 — three-cols (Problem / Scenarios)
```html
<section id="slide-N" class="three-cols-wrap">
  <div class="slabel">CHALLENGE</div>
  <h2>방산 드론 탐지의 <span class="grad-text">세 가지 핵심 난제</span></h2>
  <div class="three-cols">
    <div class="card">
      <div class="card-top"></div>
      <div class="prob-icon">🎯</div>
      <div class="prob-title">카드 제목 1</div>
      <div class="prob-body">카드 본문. 최대 2문장, 30단어 이하.</div>
    </div>
    <div class="card">
      <div class="card-top"></div>
      <div class="prob-icon">📡</div>
      <div class="prob-title">카드 제목 2</div>
      <div class="prob-body">카드 본문. 최대 2문장, 30단어 이하.</div>
    </div>
    <div class="card">
      <div class="card-top"></div>
      <div class="prob-icon">⚡</div>
      <div class="prob-title">카드 제목 3</div>
      <div class="prob-body">카드 본문. 최대 2문장, 30단어 이하.</div>
    </div>
  </div>
  <div class="callout">
    <div style="font-size:13px;color:#fff;margin-bottom:4px;">콜아웃 핵심 메시지 — 1~2문장으로 가장 어려운 케이스를 설명.</div>
    <div style="font-size:12px;font-weight:700;color:#4B68FF;">→ 모델의 진짜 실력이 시험되는 구간</div>
  </div>
</section>
```

---

### TEMPLATE 03 — kpi-grid-2x3 (Market)
```html
<section id="slide-N" class="kpi-wrap">
  <div class="slabel">MARKET</div>
  <h2>시장 규모와 <span class="grad-text">성장 지표</span></h2>
  <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);">
    <div class="kpi-card"><div class="kpi-value">$4.2B</div><div class="kpi-label">글로벌 드론 탐지 시장</div><div class="kpi-sub">CAGR 18%</div></div>
    <div class="kpi-card"><div class="kpi-value">94%</div><div class="kpi-label">탐지 정확도</div><div class="kpi-sub">Top-1 Lab</div></div>
    <div class="kpi-card"><div class="kpi-value">17종</div><div class="kpi-label">지원 드론 프로토콜</div><div class="kpi-sub">OcuSync·LightBridge 포함</div></div>
    <div class="kpi-card"><div class="kpi-value">200ms</div><div class="kpi-label">평균 추론 지연</div></div>
    <div class="kpi-card"><div class="kpi-value">3분</div><div class="kpi-label">엣지 디바이스 설치 시간</div></div>
    <div class="kpi-card"><div class="kpi-value">$8B</div><div class="kpi-label">미 연방 AI 보안 예산</div><div class="kpi-sub">FY2026</div></div>
  </div>
  <div class="quote-block">"인용구 — 최대 20단어, 이탤릭체." <span style="font-style:normal;font-size:13px;color:var(--col-muted);">— 이름, 직책</span></div>
</section>
```

---

### TEMPLATE 04 — four-pillar (Solution)
```html
<section id="slide-N" class="four-pillar-wrap">
  <div class="slabel">SOLUTION</div>
  <h2>4개 <span class="grad-text">핵심 기술 필러</span></h2>
  <div class="four-cols">
    <div class="card">
      <div class="card-top"></div>
      <div class="pillar-number">01</div>
      <div class="accent-bar" style="width:40px;margin:6px 0 10px;"></div>
      <h4>필러 제목 1</h4>
      <div class="prob-body">필러 설명. 최대 2문장.</div>
    </div>
    <div class="card">
      <div class="card-top"></div>
      <div class="pillar-number">02</div>
      <div class="accent-bar" style="width:40px;margin:6px 0 10px;"></div>
      <h4>필러 제목 2</h4>
      <div class="prob-body">필러 설명. 최대 2문장.</div>
    </div>
    <div class="card">
      <div class="card-top"></div>
      <div class="pillar-number">03</div>
      <div class="accent-bar" style="width:40px;margin:6px 0 10px;"></div>
      <h4>필러 제목 3</h4>
      <div class="prob-body">필러 설명. 최대 2문장.</div>
    </div>
    <div class="card">
      <div class="card-top"></div>
      <div class="pillar-number">04</div>
      <div class="accent-bar" style="width:40px;margin:6px 0 10px;"></div>
      <h4>필러 제목 4</h4>
      <div class="prob-body">필러 설명. 최대 2문장.</div>
    </div>
  </div>
</section>
```

---

### TEMPLATE 05 — layer-stack (Architecture)
```html
<section id="slide-N" class="layer-stack-wrap">
  <div class="slabel">ARCHITECTURE</div>
  <h2>4계층 <span class="grad-text">앙상블 아키텍처</span></h2>
  <div class="lstk">
    <div class="layer" style="border-left:3px solid #2F80ED;">
      <div class="layer-num" style="background:#2F80ED;">①</div>
      <div><div class="layer-head" style="color:#2F80ED;">레이어 1 제목</div><div class="layer-body">레이어 1 설명. 1문장.</div></div>
    </div>
    <div class="layer-arrow">▼</div>
    <div class="layer" style="border-left:3px solid #4B72F4;">
      <div class="layer-num" style="background:#4B72F4;">②</div>
      <div><div class="layer-head" style="color:#4B72F4;">레이어 2 제목</div><div class="layer-body">레이어 2 설명. 1문장.</div></div>
    </div>
    <div class="layer-arrow">▼</div>
    <div class="layer" style="border-left:3px solid #5D5BF8;">
      <div class="layer-num" style="background:#5D5BF8;">③</div>
      <div><div class="layer-head" style="color:#5D5BF8;">레이어 3 제목</div><div class="layer-body">레이어 3 설명. 1문장.</div></div>
    </div>
    <div class="layer-arrow">▼</div>
    <div class="layer" style="border-left:3px solid #6B4EFF;">
      <div class="layer-num" style="background:#6B4EFF;">④</div>
      <div><div class="layer-head" style="color:#6B4EFF;">레이어 4 제목</div><div class="layer-body">레이어 4 설명. 1문장.</div></div>
    </div>
  </div>
</section>
```

---

### TEMPLATE 06 — data-table (Capabilities)
```html
<section id="slide-N" class="data-table-wrap">
  <div class="slabel">CAPABILITIES</div>
  <h2>지원 <span class="grad-text">드론 프로토콜</span> 목록</h2>
  <div class="table-wrap">
    <table class="data-table">
      <thead>
        <tr><th>프로토콜</th><th>대상 드론</th><th>난이도</th><th>비고</th></tr>
      </thead>
      <tbody>
        <tr><td class="ai-td">OcuSync 3.0</td><td>Mavic 3 / Mini 3 Pro</td><td class="warn-td">높음</td><td style="color:var(--col-muted)">4×4 vs 2×2 안테나 차이</td></tr>
        <tr><td class="ai-td">OcuSync 2.0</td><td>Mavic 2 / Air 2</td><td class="check">보통</td><td style="color:var(--col-muted)">2.4/5.8GHz 듀얼밴드</td></tr>
        <tr><td class="ai-td">LightBridge 2</td><td>Inspire 2 / Phantom 4</td><td class="check">낮음</td><td style="color:var(--col-muted)">고정 OFDM</td></tr>
      </tbody>
    </table>
  </div>
  <div class="table-fn">각주 또는 데이터 출처. 최대 1문장.</div>
</section>
```

---

### TEMPLATE 07 — kpi-grid-4x2 (Performance)
```html
<section id="slide-N" class="kpi-wrap">
  <div class="slabel">PERFORMANCE</div>
  <h2>핵심 <span class="grad-text">성능 지표</span></h2>
  <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(2,1fr);">
    <div class="kpi-card"><div class="kpi-value">≥95%</div><div class="kpi-label">Lab 탐지 정확도</div></div>
    <div class="kpi-card"><div class="kpi-value">200ms</div><div class="kpi-label">추론 지연</div></div>
    <div class="kpi-card"><div class="kpi-value">17종</div><div class="kpi-label">지원 프로토콜</div></div>
    <div class="kpi-card"><div class="kpi-value">>0.90</div><div class="kpi-label">Open-Set AUROC</div></div>
    <div class="kpi-card"><div class="kpi-value">3분</div><div class="kpi-label">엣지 설치 시간</div></div>
    <div class="kpi-card"><div class="kpi-value">26ms</div><div class="kpi-label">단일 추론 속도</div></div>
    <div class="kpi-card"><div class="kpi-value">80%</div><div class="kpi-label">설치비 절감</div></div>
    <div class="kpi-card"><div class="kpi-value">~12주</div><div class="kpi-label">개발 기간</div></div>
  </div>
  <div class="kpi-footer">NVIDIA Jetson Orin · TensorRT · Phase 1 기준 · 실측 데이터 fine-tuning 후 추가 향상</div>
</section>
```

---

### TEMPLATE 08 — three-scenario (Scenarios)
```html
<section id="slide-N" class="three-cols-wrap">
  <div class="slabel">SCENARIOS</div>
  <h2>3가지 <span class="grad-text">운용 시나리오</span></h2>
  <div class="three-cols">
    <div class="card">
      <div class="card-top"></div>
      <div class="scenario-label">시나리오 A</div>
      <h4>시나리오 제목</h4>
      <div class="step">1단계: 상황 설명</div>
      <div class="step">2단계: AI 동작</div>
      <div class="step highlight">3단계: 핵심 결과 (강조)</div>
      <div class="step">4단계: 최종 조치</div>
    </div>
    <div class="card">
      <div class="card-top"></div>
      <div class="scenario-label">시나리오 B</div>
      <h4>시나리오 제목</h4>
      <div class="step">1단계: 상황 설명</div>
      <div class="step highlight">2단계: 핵심 결과 (강조)</div>
      <div class="step">3단계: 최종 조치</div>
    </div>
    <div class="card">
      <div class="card-top"></div>
      <div class="scenario-label">시나리오 C</div>
      <h4>시나리오 제목</h4>
      <div class="step">1단계: 상황 설명</div>
      <div class="step">2단계: AI 동작</div>
      <div class="step highlight">3단계: 핵심 결과 (강조)</div>
    </div>
  </div>
</section>
```

---

### TEMPLATE 09 — comparison-table (Competitive)
```html
<section id="slide-N" class="comp-table-wrap">
  <div class="slabel">COMPETITIVE</div>
  <h2>경쟁사 대비 <span class="grad-text">Cochl 우위</span></h2>
  <div class="table-wrap">
    <table class="comp-table">
      <thead>
        <tr>
          <th></th>
          <th style="color:var(--col-muted)">경쟁사 A</th>
          <th style="color:var(--col-muted)">경쟁사 B</th>
          <th style="color:var(--col-muted)">경쟁사 C</th>
          <th style="background:rgba(107,78,255,0.15);color:#a08bff;">Cochl</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>드론 탐지</td>
          <td class="cross">✗</td><td class="check">✓</td><td class="cross">✗</td>
          <td style="background:rgba(107,78,255,0.08);" class="check">✓</td>
        </tr>
        <tr>
          <td>Edge 운용</td>
          <td class="cross">✗</td><td class="cross">✗</td><td class="check">✓</td>
          <td style="background:rgba(107,78,255,0.08);" class="check">✓</td>
        </tr>
        <tr>
          <td>설치 시간</td>
          <td style="color:var(--col-muted)">수일</td><td style="color:var(--col-muted)">수주</td><td style="color:var(--col-muted)">수일</td>
          <td style="background:rgba(107,78,255,0.08);color:#10B981;">3분</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="table-fn">비교 기준: 2025년 공개 데이터시트 및 현장 평가 기준.</div>
</section>
```

---

### TEMPLATE 10 — two-cols-list (Technology)
```html
<section id="slide-N" class="two-cols-wrap">
  <div class="slabel">TECHNOLOGY</div>
  <h2>기술 스택과 <span class="grad-text">검증 이력</span></h2>
  <div class="two-cols">
    <div class="card">
      <div class="card-top"></div>
      <div class="tech-col-head" style="color:var(--c-analytics);">기술 스택</div>
      <ul class="tech-list">
        <li>▸ AST (Audio Spectrogram Transformer)</li>
        <li>▸ CRNN + 앙상블 퓨전</li>
        <li>▸ Metric Learning (Prototypical Net)</li>
        <li>▸ TensorRT 최적화</li>
        <li>▸ NVIDIA Jetson Orin</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-top"></div>
      <div class="tech-col-head" style="color:var(--c-ai);">검증 이력</div>
      <ul class="tech-list">
        <li>▸ 실험실 SNR ≥25dB: Top-1 ≥95%</li>
        <li>▸ Open-Set AUROC &gt;0.90</li>
        <li>▸ LIG넥스원 공동 연구</li>
        <li>▸ 방위산업기술보호법 준거</li>
      </ul>
    </div>
  </div>
</section>
```

---

### TEMPLATE 11 — timeline (Roadmap)
```html
<section id="slide-N" class="timeline-wrap">
  <div class="slabel">ROADMAP</div>
  <h2>개발 <span class="grad-text">4 Phase 로드맵</span></h2>
  <div class="accent-bar"></div>
  <div class="tl-track"></div>
  <div class="phase-grid">
    <div class="phase">
      <div class="ph-dot" style="background:#4B68FF;"></div>
      <div class="ph-id" style="color:#4B68FF;">Phase 1</div>
      <div class="ph-dates">2~3주</div>
      <div class="ph-lbl">AST 단독 모델</div>
      <div class="ph-desc">데이터 파이프라인 구축. Baseline 성능 확인.</div>
      <div class="ph-badge" style="border-color:#4B68FF;color:#4B68FF;">≥90% 목표</div>
    </div>
    <div class="phase">
      <div class="ph-dot" style="background:#832BFB;"></div>
      <div class="ph-id" style="color:#832BFB;">Phase 2</div>
      <div class="ph-dates">2~3주</div>
      <div class="ph-lbl">CRNN + 비교 분석</div>
      <div class="ph-desc">모델 비교. 앙상블 전략 결정.</div>
      <div class="ph-badge" style="border-color:#832BFB;color:#832BFB;">의사결정 포인트</div>
    </div>
    <div class="phase">
      <div class="ph-dot" style="background:#001974;"></div>
      <div class="ph-id" style="color:#4B68FF;">Phase 3</div>
      <div class="ph-dates">2~3주</div>
      <div class="ph-lbl">앙상블 고도화</div>
      <div class="ph-desc">Robustness 극대화. Open-Set 완성.</div>
      <div class="ph-badge" style="border-color:#001974;color:#4B68FF;">Open-Set 완성</div>
    </div>
    <div class="phase">
      <div class="ph-dot" style="background:#00C853;"></div>
      <div class="ph-id" style="color:#00C853;">Phase 4</div>
      <div class="ph-dates">2~3주</div>
      <div class="ph-lbl">실전 최적화·배포</div>
      <div class="ph-desc">TensorRT 변환. 원거리 fine-tuning.</div>
      <div class="ph-badge" style="border-color:#00C853;color:#00C853;">배포 준비</div>
    </div>
  </div>
  <div class="card" style="margin-top:20px;display:flex;justify-content:space-between;align-items:center;padding:12px 20px;">
    <div style="font-size:13px;color:var(--col-muted);">Phase 1 → Phase 4 순차 진행</div>
    <div style="font-size:15px;font-weight:700;background:var(--grad-main);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">총 ~12주</div>
  </div>
</section>
```

---

### TEMPLATE 12 — budget (Budget / Finance)
```html
<section id="slide-N" class="budget-wrap">
  <div class="slabel">BUDGET</div>
  <h2>총 예산 <span class="grad-text">₩480M 운용 계획</span></h2>
  <div class="budget-layout">
    <div class="budget-donut-col">
      <svg viewBox="0 0 200 200" width="180" height="180">
        <circle cx="100" cy="100" r="70" fill="none" stroke="#0F2847" stroke-width="30"/>
        <circle cx="100" cy="100" r="70" fill="none" stroke="#6B4EFF" stroke-width="30"
          stroke-dasharray="263 175" stroke-dashoffset="0" transform="rotate(-90 100 100)"/>
        <circle cx="100" cy="100" r="70" fill="none" stroke="#2F80ED" stroke-width="30"
          stroke-dasharray="175 263" stroke-dashoffset="-263" transform="rotate(-90 100 100)"/>
        <text x="100" y="95" text-anchor="middle" fill="#fff" font-size="22" font-weight="700" font-family="IBM Plex Sans">60%</text>
        <text x="100" y="115" text-anchor="middle" fill="#8B9BB4" font-size="11" font-family="IBM Plex Sans">정부 지원</text>
      </svg>
      <div class="donut-legend">
        <div class="legend-item"><span style="background:#6B4EFF;"></span>정부 지원 60%</div>
        <div class="legend-item"><span style="background:#2F80ED;"></span>자체 투자 40%</div>
      </div>
    </div>
    <div class="budget-bars-col">
      <div class="bars-head">예산 배분</div>
      <div class="bar-row"><span class="bar-label">R&D 인건비</span><span class="bar-pct">45%</span><div class="bar-track"><div class="bar-fill" style="width:45%"></div></div></div>
      <div class="bar-row"><span class="bar-label">GPU 인프라</span><span class="bar-pct">25%</span><div class="bar-track"><div class="bar-fill" style="width:25%"></div></div></div>
      <div class="bar-row"><span class="bar-label">현장 데이터 수집</span><span class="bar-pct">20%</span><div class="bar-track"><div class="bar-fill" style="width:20%"></div></div></div>
      <div class="bar-row"><span class="bar-label">기타 운영</span><span class="bar-pct">10%</span><div class="bar-track"><div class="bar-fill" style="width:10%"></div></div></div>
    </div>
  </div>
  <div class="roi-note">ROI 메모: 기존 RF 센서 대비 운영비 60% 절감, 탐지 속도 5× 향상.</div>
</section>
```

---

### TEMPLATE 13 — cinematic-cta (CTA / Closing)
```html
<section id="slide-N">
  <div class="cover-bg" style="background-image:url('data:image/png;base64,BASE64_BG');"></div>
  <div class="cover-overlay"></div>
  <div class="cover-inner" style="align-items:center;text-align:center;">
    <h2 style="font-size:36px;margin-bottom:32px;">지금 <span class="grad-text">시작할 수 있습니다</span></h2>
    <div class="outcome-cards">
      <div class="outcome-card">
        <div class="outcome-num">01</div>
        <h4>파일럿 계약</h4>
        <div class="outcome-body">3개월 POC. 실제 환경 데이터로 검증.</div>
      </div>
      <div class="outcome-card">
        <div class="outcome-num">02</div>
        <h4>기술 이전</h4>
        <div class="outcome-body">소스코드 + 학습 파이프라인 일괄 제공.</div>
      </div>
      <div class="outcome-card">
        <div class="outcome-num">03</div>
        <h4>공동 연구</h4>
        <div class="outcome-body">LIG넥스원과 방산 특화 모델 공동 개발.</div>
      </div>
    </div>
    <div class="closing-stmt">음향 AI로 드론을 탐지하는 첫 번째 팀이 되세요.</div>
    <div class="pipeline">
      <span class="pip-step">파일럿 계약</span>→
      <span class="pip-step">데이터 수집</span>→
      <span class="pip-step">모델 학습</span>→
      <span class="pip-step">현장 검증</span>→
      <span class="pip-step pip-final">양산 배포</span>
    </div>
    <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:24px;">contact@cochl.ai · cochl.ai</div>
  </div>
</section>
```

---

### TEMPLATE 14 — quote-break
```html
<section id="slide-N" class="quote-break-slide">
  <div class="qdeco">"</div>
  <div class="qtext">방산 실전에서의 false negative는 보안 위협이다.</div>
  <div style="font-size:15px;color:var(--col-muted);margin-bottom:16px;">— 현장 운용 요구사항, 2025</div>
  <div class="accent-bar" style="width:60px;margin:0 auto;"></div>
</section>
```

---

### TEMPLATE 15 — stat-spotlight
```html
<section id="slide-N" class="stat-spotlight-slide">
  <div class="stat-eyebrow">DETECTION ACCURACY · LAB CONDITION</div>
  <div class="stat-value">≥95%</div>
  <div class="stat-label">Top-1 정확도 달성</div>
  <div class="stat-context">SNR ≥25dB · Phase 1 목표 · 17종 프로토콜 기준</div>
</section>
```

---

### TEMPLATE 16 — full-image
```html
<section id="slide-N" class="full-image-slide">
  <img src="data:image/jpeg;base64,BASE64_IMAGE" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" alt="">
  <div class="fi-overlay"></div>
  <div style="position:absolute;bottom:10%;left:52px;z-index:2;">
    <div class="fi-caption">DEPLOYMENT · 2025</div>
    <div class="fi-headline">실전 환경에서의 음향 탐지</div>
  </div>
</section>
```

---

### TEMPLATE 17 — section-break
```html
<section id="slide-N" class="section-break-slide">
  <div class="sb-num">02</div>
  <div class="sb-title"><span class="grad-text">해법</span>: 앙상블 AI</div>
  <div class="accent-bar" style="width:60px;margin:12px auto;"></div>
  <div class="sb-sub">4개 모델이 투표하는 방식으로 불확실성을 제거한다</div>
</section>
```

---

### TEMPLATE 18 — agenda
```html
<section id="slide-N" class="agenda-slide">
  <div class="agenda-panel-left">
    <img src="data:image/jpeg;base64,BASE64_IMAGE" style="width:100%;height:100%;object-fit:cover;" alt="">
  </div>
  <div class="agenda-panel-right">
    <div class="slabel">AGENDA</div>
    <h2 style="font-size:28px;margin-bottom:24px;">오늘의 <span class="grad-text">발표 순서</span></h2>
    <div class="agenda-list">
      <div class="agenda-item">
        <div class="agenda-time">00:05</div>
        <div class="agenda-label">문제 정의</div>
        <div class="agenda-sub">방산 드론 탐지의 핵심 난제</div>
      </div>
      <div class="agenda-item">
        <div class="agenda-time">00:10</div>
        <div class="agenda-label">Cochl 솔루션</div>
        <div class="agenda-sub">앙상블 AI 아키텍처</div>
      </div>
      <div class="agenda-item">
        <div class="agenda-time">00:08</div>
        <div class="agenda-label">성능 지표</div>
        <div class="agenda-sub">실험실 및 현장 검증 데이터</div>
      </div>
      <div class="agenda-item">
        <div class="agenda-time">00:05</div>
        <div class="agenda-label">로드맵 및 Next Step</div>
      </div>
    </div>
  </div>
</section>
```

---

### TEMPLATE 19 — mission-statement
```html
<section id="slide-N" class="mission-statement-slide">
  <img src="data:image/jpeg;base64,BASE64_IMAGE" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" alt="">
  <div class="mission-overlay"></div>
  <div style="position:relative;z-index:2;text-align:center;padding:0 80px;">
    <div class="mission-quote">소리가 들리는 곳이라면 어디서든, 위협을 식별한다.</div>
    <div class="mission-body">Cochl의 음향 AI는 RF 없이도 드론을 탐지합니다. 진동 센서 없이도 기계 고장을 예측합니다.</div>
    <div class="mission-source">— Cochl, 2026</div>
  </div>
</section>
```

---

### TEMPLATE 20 — split-left-image
```html
<section id="slide-N" class="split-left-image-slide">
  <div class="sli-image">
    <img src="data:image/jpeg;base64,BASE64_IMAGE" style="width:100%;height:100%;object-fit:cover;" alt="">
  </div>
  <div class="sli-content">
    <div class="slabel">DEPLOYMENT</div>
    <div class="sli-title">실전 현장 <span class="grad-text">배포 사례</span></div>
    <div class="sli-body">현장 설명 텍스트. 최대 3문장. 구체적인 배포 환경과 결과를 설명합니다. 기술적 세부사항보다 임팩트를 강조하세요.</div>
    <div class="accent-bar" style="width:48px;margin-top:16px;"></div>
  </div>
</section>
```

---

### TEMPLATE 21 — split-right-image
```html
<section id="slide-N" class="split-right-image-slide">
  <div class="sri-content">
    <div class="slabel">TECHNOLOGY</div>
    <div class="sri-title">음향 AI가 <span class="grad-text">RF를 대체한다</span></div>
    <div class="sri-sub" style="color:var(--c-analytics);font-size:13px;margin:8px 0;">핵심 차별점 한 줄 설명</div>
    <div class="sri-body">본문 설명. 최대 2문장. 기술적 우위를 명확히 서술합니다. 수치가 있으면 포함하세요.</div>
  </div>
  <div class="sri-image">
    <img src="data:image/jpeg;base64,BASE64_IMAGE" style="width:100%;height:100%;object-fit:cover;" alt="">
  </div>
</section>
```

---

### TEMPLATE 22 — text-image-bottom
```html
<section id="slide-N" class="text-image-bottom-slide">
  <div class="tib-top">
    <div class="slabel">OVERVIEW</div>
    <div class="tib-title">시스템 <span class="grad-text">전체 흐름</span></div>
    <div class="tib-body">상단 설명 텍스트. 최대 3문장. 아래 다이어그램이나 스크린샷을 보완하는 맥락을 설명합니다. 간결하고 직접적으로 작성하세요.</div>
  </div>
  <div class="tib-image-wrap">
    <img class="tib-image" src="data:image/png;base64,BASE64_IMAGE" alt="시스템 다이어그램">
    <div class="tib-caption">시스템 아키텍처 다이어그램 · 2026</div>
  </div>
</section>
```

---

### TEMPLATE 23 — icon-columns
```html
<section id="slide-N" class="icon-columns-wrap">
  <div class="slabel">ROBUSTNESS</div>
  <h2>13종 <span class="grad-text">Augmentation</span> 전략</h2>
  <div class="ic-grid">
    <div class="ic-col">
      <div class="ic-icon">🎚</div>
      <div class="ic-title">SNR 제어</div>
      <ul class="ic-items">
        <li>White Noise 추가</li>
        <li>Pink Noise 추가</li>
        <li>SNR 5~25dB 랜덤화</li>
      </ul>
    </div>
    <div class="ic-col">
      <div class="ic-icon">📡</div>
      <div class="ic-title">채널 시뮬레이션</div>
      <ul class="ic-items">
        <li>다경로 페이딩</li>
        <li>도플러 시프트</li>
        <li>거리별 감쇠</li>
      </ul>
    </div>
    <div class="ic-col">
      <div class="ic-icon">⚡</div>
      <div class="ic-title">간섭 주입</div>
      <ul class="ic-items">
        <li>Wi-Fi 간섭</li>
        <li>Bluetooth 간섭</li>
        <li>멀티드론 혼합</li>
      </ul>
    </div>
  </div>
</section>
```

---

### TEMPLATE 24 — numerical-value
```html
<section id="slide-N" class="numerical-value-wrap">
  <div class="slabel">KEY METRICS</div>
  <h2>3가지 <span class="grad-text">핵심 수치</span></h2>
  <div class="nv-grid">
    <div class="nv-col">
      <div class="nv-value">17종</div>
      <div class="nv-title">드론 프로토콜</div>
      <div class="nv-body">OcuSync 1~3, LightBridge, Autel SkyLink 등 주요 상용 프로토콜 전 커버.</div>
    </div>
    <div class="nv-col">
      <div class="nv-value">200ms</div>
      <div class="nv-title">추론 지연</div>
      <div class="nv-body">Jetson Orin 기준 단일 추론 26ms. 앙상블 포함 200ms 이하 달성.</div>
    </div>
    <div class="nv-col" style="border-right:none;">
      <div class="nv-value">≥95%</div>
      <div class="nv-title">탐지 정확도</div>
      <div class="nv-body">실험실 SNR ≥25dB 기준 Top-1 목표. 원거리 fine-tuning 후 추가 향상.</div>
    </div>
  </div>
</section>
```

---

### TEMPLATE 25 — photo-mosaic
```html
<section id="slide-N" class="photo-mosaic-slide">
  <div class="pm-left">
    <div class="slabel">EVIDENCE</div>
    <div class="pm-title">현장 배포 <span class="grad-text">사진</span></div>
    <div class="pm-body">실제 배포 환경 설명. 최대 2문장. 어디에, 어떤 조건에서 운용했는지 구체적으로.</div>
  </div>
  <div class="pm-right">
    <div class="pm-grid">
      <div class="pm-cell"><img src="data:image/jpeg;base64,BASE64_1" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" alt=""></div>
      <div class="pm-cell"><img src="data:image/jpeg;base64,BASE64_2" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" alt=""></div>
      <div class="pm-cell"><img src="data:image/jpeg;base64,BASE64_3" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" alt=""></div>
      <div class="pm-cell"><img src="data:image/jpeg;base64,BASE64_4" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" alt=""></div>
      <div class="pm-cell"><img src="data:image/jpeg;base64,BASE64_5" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" alt=""></div>
      <div class="pm-cell"><img src="data:image/jpeg;base64,BASE64_6" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" alt=""></div>
    </div>
  </div>
</section>
```

---

### TEMPLATE 26 — team-grid
```html
<section id="slide-N" class="team-grid-slide">
  <div class="slabel">TEAM</div>
  <h2>핵심 <span class="grad-text">개발팀</span></h2>
  <div class="team-grid">
    <div class="tg-card">
      <img class="tg-photo" src="data:image/jpeg;base64,BASE64_PHOTO" alt="이름">
      <div class="tg-name">홍길동</div>
      <div class="tg-role">AI Research Lead</div>
    </div>
    <div class="tg-card">
      <img class="tg-photo" src="data:image/jpeg;base64,BASE64_PHOTO" alt="이름">
      <div class="tg-name">김철수</div>
      <div class="tg-role">Signal Processing</div>
    </div>
    <div class="tg-card">
      <img class="tg-photo" src="data:image/jpeg;base64,BASE64_PHOTO" alt="이름">
      <div class="tg-name">이영희</div>
      <div class="tg-role">Edge Deployment</div>
    </div>
    <div class="tg-card">
      <img class="tg-photo" src="data:image/jpeg;base64,BASE64_PHOTO" alt="이름">
      <div class="tg-name">박민준</div>
      <div class="tg-role">Data Engineering</div>
    </div>
  </div>
</section>
```

---

### TEMPLATE 27 — simple-text
```html
<section id="slide-N" class="simple-text-slide">
  <div class="slabel">BACKGROUND</div>
  <h2>음향 AI가 <span class="grad-text">RF를 대체하는 이유</span></h2>
  <div class="st-intro">RF 기반 탐지는 주파수 호핑과 암호화에 의해 점점 무력화되고 있습니다.</div>
  <div class="st-body">
    <p>현대 드론은 OcuSync 3.0처럼 주파수 호핑 속도가 초당 200회에 달해 전통적인 스펙트럼 분석이 어렵습니다. 암호화된 링크는 패킷 내용 분석도 차단합니다.</p>
    <p>반면, 음향 신호는 드론 제조사와 관계없이 물리적 특성(날개 회전수, 모터 주파수, 프로토콜 타이밍 패턴)을 드러냅니다. Cochl의 AI는 이 패턴을 학습합니다.</p>
    <p>결과: RF 차단 상황에서도 탐지 가능. 추가 하드웨어 없이 소프트웨어 업데이트만으로 신규 드론 지원.</p>
  </div>
</section>
```

---

### TEMPLATE 28 — sidebar-image
```html
<section id="slide-N" class="sidebar-image-slide">
  <div class="si-left">
    <div class="si-left-content">
      <div style="font-size:48px;opacity:.2;">🖥</div>
      <div style="font-size:11px;color:var(--col-muted);letter-spacing:.1em;text-transform:uppercase;text-align:center;">GPU 인프라</div>
      <div style="margin-top:16px;display:flex;flex-direction:column;gap:10px;width:100%;">
        <div style="background:rgba(75,104,255,.12);border:1px solid rgba(75,104,255,.25);border-radius:8px;padding:10px 14px;text-align:center;">
          <div style="font-size:18px;font-weight:700;color:#fff;">A100 × 4</div>
          <div style="font-size:10px;color:var(--col-muted);">학습 클러스터</div>
        </div>
        <div style="background:rgba(75,104,255,.12);border:1px solid rgba(75,104,255,.25);border-radius:8px;padding:10px 14px;text-align:center;">
          <div style="font-size:18px;font-weight:700;color:#fff;">Jetson Orin</div>
          <div style="font-size:10px;color:var(--col-muted);">추론 엣지</div>
        </div>
      </div>
    </div>
  </div>
  <div class="si-right">
    <div class="slabel">INFRASTRUCTURE</div>
    <h2 style="font-size:24px;font-weight:700;color:#fff;margin-bottom:8px;">GPU 인프라와 <span class="grad-text">작업 분배</span></h2>
    <div class="si-subtitle" style="color:var(--c-analytics);font-size:13px;margin-bottom:14px;">클라우드 학습 + 엣지 추론 하이브리드 구조</div>
    <div class="si-body" style="font-size:12px;color:var(--col-muted);line-height:1.6;">상세 설명. 최대 4문장. 학습-추론 분리 전략과 비용 최적화 방법을 설명합니다.</div>
  </div>
</section>
```

---

### TEMPLATE 29 — chart-sidebar
```html
<section id="slide-N" class="chart-sidebar-slide">
  <div class="cs-left">
    <div class="slabel">PERFORMANCE</div>
    <div class="cs-h2">거리별 <span class="grad-text">정확도 목표</span></div>
    <div class="cs-intro">실전 환경의 SNR 변화에 따른 Top-1 정확도 목표치.</div>
    <div class="cs-body">augmentation만으로 Phase 1에서 SNR 10dB 기준 ≥70% 달성. fine-tuning 후 +10~20%p 향상.</div>
    <div class="cs-note">Open-Set AUROC &gt;0.90 · 추론 ~26ms</div>
  </div>
  <div class="cs-right">
    <div class="cs-chart-title">Top-1 정확도 목표 vs 운용 거리</div>
    <svg viewBox="0 0 520 310" style="width:100%;max-height:290px;" xmlns="http://www.w3.org/2000/svg">
      <!-- axis -->
      <line x1="80" y1="20" x2="80" y2="248" stroke="#1E3050" stroke-width="1"/>
      <line x1="80" y1="248" x2="500" y2="248" stroke="#1E3050" stroke-width="1"/>
      <!-- grid lines -->
      <line x1="80" y1="66" x2="500" y2="66" stroke="#1E3050" stroke-width="0.5" stroke-dasharray="4,4"/>
      <line x1="80" y1="112" x2="500" y2="112" stroke="#1E3050" stroke-width="0.5" stroke-dasharray="4,4"/>
      <line x1="80" y1="158" x2="500" y2="158" stroke="#1E3050" stroke-width="0.5" stroke-dasharray="4,4"/>
      <line x1="80" y1="204" x2="500" y2="204" stroke="#1E3050" stroke-width="0.5" stroke-dasharray="4,4"/>
      <!-- y labels -->
      <text x="70" y="70" text-anchor="end" fill="#8B9BB4" font-size="11" font-family="IBM Plex Sans">100%</text>
      <text x="70" y="116" text-anchor="end" fill="#8B9BB4" font-size="11" font-family="IBM Plex Sans">75%</text>
      <text x="70" y="162" text-anchor="end" fill="#8B9BB4" font-size="11" font-family="IBM Plex Sans">50%</text>
      <text x="70" y="208" text-anchor="end" fill="#8B9BB4" font-size="11" font-family="IBM Plex Sans">25%</text>
      <!-- bars: use #7240FF / #4B68FF / #4B68FF(0.65) / #000CC8 -->
      <rect x="110" y="74" width="64" height="174" rx="5" fill="#7240FF"/>
      <text x="142" y="68" text-anchor="middle" fill="#fff" font-size="12" font-weight="700" font-family="IBM Plex Sans">≥95%</text>
      <text x="142" y="265" text-anchor="middle" fill="#8B9BB4" font-size="10" font-family="IBM Plex Sans">실험실</text>
      <rect x="210" y="92" width="64" height="156" rx="5" fill="#4B68FF"/>
      <text x="242" y="86" text-anchor="middle" fill="#fff" font-size="12" font-weight="700" font-family="IBM Plex Sans">≥85%</text>
      <text x="242" y="265" text-anchor="middle" fill="#8B9BB4" font-size="10" font-family="IBM Plex Sans">수백m</text>
      <rect x="310" y="120" width="64" height="128" rx="5" fill="#4B68FF" opacity="0.65"/>
      <text x="342" y="114" text-anchor="middle" fill="#fff" font-size="12" font-weight="700" font-family="IBM Plex Sans">≥70%</text>
      <text x="342" y="265" text-anchor="middle" fill="#8B9BB4" font-size="10" font-family="IBM Plex Sans">500m</text>
      <rect x="410" y="138" width="64" height="110" rx="5" fill="#000CC8"/>
      <text x="442" y="132" text-anchor="middle" fill="#fff" font-size="12" font-weight="700" font-family="IBM Plex Sans">50~70%</text>
      <text x="442" y="265" text-anchor="middle" fill="#8B9BB4" font-size="10" font-family="IBM Plex Sans">1km</text>
      <!-- legend -->
      <circle cx="108" cy="298" r="5" fill="#7240FF"/>
      <text x="118" y="302" fill="#8B9BB4" font-size="10" font-family="IBM Plex Sans">실험실</text>
      <circle cx="178" cy="298" r="5" fill="#4B68FF"/>
      <text x="188" y="302" fill="#8B9BB4" font-size="10" font-family="IBM Plex Sans">수백m</text>
      <circle cx="248" cy="298" r="5" fill="#4B68FF" opacity="0.65"/>
      <text x="258" y="302" fill="#8B9BB4" font-size="10" font-family="IBM Plex Sans">500m</text>
      <circle cx="308" cy="298" r="5" fill="#000CC8"/>
      <text x="318" y="302" fill="#8B9BB4" font-size="10" font-family="IBM Plex Sans">1km</text>
    </svg>
  </div>
</section>
```

---

### TEMPLATE 30 — image-right-list
```html
<section id="slide-N" class="image-right-list-slide">
  <div class="irl-left">
    <div class="slabel">TECHNOLOGY</div>
    <h2 style="font-size:24px;font-weight:700;color:#fff;margin-bottom:8px;">기술 스택과 <span class="grad-text">파이프라인</span></h2>
    <div style="font-size:13px;color:var(--c-analytics);margin-bottom:10px;">엣지-클라우드 하이브리드 추론 구조</div>
    <div style="font-size:12px;color:var(--col-muted);margin-bottom:16px;">설명 텍스트. 최대 2문장. 아키텍처 선택의 이유를 간결하게.</div>
    <ul class="irl-items">
      <li class="irl-item"><span class="irl-dot" style="background:var(--c-ai);"></span>AST + CRNN 앙상블</li>
      <li class="irl-item"><span class="irl-dot" style="background:var(--c-analytics);"></span>TensorRT 최적화</li>
      <li class="irl-item"><span class="irl-dot" style="background:#10B981;"></span>NVIDIA Jetson Orin</li>
      <li class="irl-item"><span class="irl-dot" style="background:#8B9BB4;"></span>실시간 스트리밍 파이프라인</li>
    </ul>
  </div>
  <div class="irl-right">
    <div class="irl-image" style="background:#0F2847;border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:10px;">
      <!-- inline diagram: replace with base64 image or keep as HTML diagram -->
      <div style="background:rgba(107,78,255,.18);border:1px solid rgba(107,78,255,.4);border-radius:8px;padding:10px 16px;font-size:12px;color:#a08bff;font-weight:700;">RF 안테나 입력</div>
      <div style="text-align:center;color:var(--col-muted);font-size:16px;">↓</div>
      <div style="background:rgba(47,128,237,.15);border:1px solid rgba(47,128,237,.35);border-radius:8px;padding:10px 16px;font-size:12px;color:#7FB3F5;font-weight:700;">신호 전처리 · 스펙트로그램</div>
      <div style="text-align:center;color:var(--col-muted);font-size:16px;">↓</div>
      <div style="background:rgba(107,78,255,.18);border:1px solid rgba(107,78,255,.4);border-radius:8px;padding:10px 16px;font-size:12px;color:#a08bff;font-weight:700;">AST + CRNN 앙상블</div>
      <div style="text-align:center;color:var(--col-muted);font-size:16px;">↓</div>
      <div style="background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.35);border-radius:8px;padding:10px 16px;font-size:12px;color:#10B981;font-weight:700;">탐지 결과 출력</div>
    </div>
  </div>
</section>
```

---

## Part 3 — Content Mapping Rules

When new content is dropped in, follow this decision tree:

```
1. IDENTIFY content type:
   - Has a big metric/number?         → kpi-grid-2x3 or kpi-grid-4x2
   - Is it a process/flow?            → layer-stack or timeline
   - Is it a comparison?              → comparison-table or two-cols-list
   - Is it a problem statement?       → three-cols (problem cards)
   - Is it a product overview?        → four-pillar or two-cols-list
   - Is it data with rows?            → data-table
   - Is it a story/scenario?          → three-scenario
   - Is it financial?                 → budget or kpi-grid
   - Is it an intro/closing?          → hero or cinematic-cta
   - Is it ONE striking number?       → stat-spotlight (break layout)
   - Is it ONE powerful quote?        → quote-break (break layout)
   - Is it a topic transition?        → section-break (break layout)
   - Is there a strong visual?        → full-image (break layout)
   - Opening agenda / TOC?            → agenda
   - Brand mission / philosophy?      → mission-statement
   - Photo-left + explain-right?      → split-left-image
   - Explain-left + photo-right?      → split-right-image
   - Text above + diagram/image below?→ text-image-bottom
   - 3 features each with an icon?    → icon-columns
   - 3 headline numbers + context?    → numerical-value
   - Multiple deployment photos?      → photo-mosaic
   - Team / advisors / stakeholders?  → team-grid
   - Just text, concept explanation?  → simple-text
   - Narrow image + wide explanation? → sidebar-image (36/64 split)
   - Performance data as visual bars? → chart-sidebar
   - Title/list left + framed image right? → image-right-list

2. MAP heading hierarchy:
   Content H1   → deck h2 (section title, 32px)
   Content H2   → deck h4 (card heading, 17px semibold)
   Body text    → deck .body (18px muted, max 2 sentences per block)
   Bold callout → .quote-block or .callout banner
   Data point   → kpi-card value

3. SHORTEN text:
   - Body per card: max 2 sentences (≤ 30 words)
   - KPI label: max 6 words
   - H2 title: max 8 words (use grad-text on the key phrase)
   - Timeline description: max 2 sentences
   - Bullet item: max 1 line (≤ 12 words)

4. SPLIT if too dense:
   > 4 pillars              → two slides of 4-pillar or 2+2 two-cols
   > 6 KPIs                 → two kpi-grid slides
   > 8 table rows           → two data-table slides
   > 7 timeline phases      → two timeline slides with a divider slide

5. ACCENT placement:
   - Exactly ONE key phrase per h2 gets grad-text
   - Accent line: always below h2 on hero slides only
   - All other slides: no accent line, just section-head margin

6. BREAK slide placement — required rules:
   - Insert a break slide after every 3–4 consecutive HIGH-density slides
   - Always insert a break slide at a major topic transition:
     Problem → Solution: use section-break (e.g., "The Answer")
     Solution → Proof:    use stat-spotlight (your single most striking metric)
     Proof → Next Steps:  use quote-break (a customer quote or expert statement)
   - Cover and CTA never have a break slide immediately before or after them
   - Break slides do NOT count toward the density budget of adjacent slides
   - When a break slide is inserted, the total slide count increases beyond 13 — that is correct
   - Choose the break type by what the audience needs at that moment:
       Emotional reset after bad news   → quote-break
       Wow factor after data dump       → stat-spotlight
       Visual relief mid-deck           → full-image (if a strong image is available)
       Clear chapter transition         → section-break
```

---

## Part 4 — Per-Slide Density Rules

| Slide purpose | Max text elements | Max components | Tone |
|---|---|---|---|
| Cover / Intro | 5 | logo + h1 + tagline + meta | cinematic |
| Problem | 6 per card | 3 cards + 1 callout | urgent |
| Market | 6 KPI values | 6 cards + 1 quote | credible |
| Solution | 4 per pillar | 4 pillars | confident |
| Architecture | 1 line per layer | 4 layers | structured |
| Capabilities | 6–8 rows | 1 table + footnote | precise |
| Performance | 8 values | 8 KPI cards + footer | verified |
| Scenarios | 4 steps per card | 3 scenario cards | narrative |
| Competitive | 6 rows | 1 comp table | assertive |
| Technology | 8 bullets per col | 2 columns | credible |
| Roadmap | 2 lines per phase | 7 phases max | strategic |
| Budget | 2 segments + 5 bars | donut + bars + note | transparent |
| CTA / Closing | 3 outcomes | 3 cards + 1 stmt + pipeline | decisive |
| **quote-break** | **2 (quote + attr)** | **quote text only** | **contemplative** |
| **stat-spotlight** | **3 (eyebrow + value + label)** | **1 number** | **striking** |
| **full-image** | **2 (caption + optional headline)** | **1 image** | **visceral** |
| **section-break** | **2 (title + optional sub)** | **decorative number + title** | **transitional** |
| **agenda** | **6 items max** | **left image + item list** | **structured** |
| **mission-statement** | **3 (quote + body + source)** | **full-bg image + text** | **brand** |
| **split-left-image** | **3 (title + body + cta)** | **left image + right text** | **narrative** |
| **split-right-image** | **3 (title + sub + body)** | **left text + right image** | **narrative** |
| **text-image-bottom** | **4 (title + body + image + caption)** | **top text + bottom image** | **explanatory** |
| **icon-columns** | **3 cols × 3 elements** | **3 icon-title-body cols** | **feature** |
| **numerical-value** | **3 cols × 3 elements** | **3 big numbers + context** | **credible** |
| **photo-mosaic** | **6 images + title + body** | **left text + right grid** | **evidence** |
| **team-grid** | **10 people max** | **photo grid + names** | **human** |

---

## Part 5 — QA Checklist

Run this check before outputting any generated or updated slide:

### Visual Consistency
- [ ] All slides use `#0B1F3A` as the slide background (except cover/CTA)
- [ ] Cards use `#0F2847` background, not black or custom colors
- [ ] No hardcoded colors outside of the design token set
- [ ] `--grad-main` used only in approved positions (not card BG, not headings)
- [ ] Font is IBM Plex Sans throughout
- [ ] h2 is 32px semibold — never larger on content slides
- [ ] Body text is 18px — never smaller than 14px (caption only)

### Layout Integrity
- [ ] Cover and CTA slides use the PPTX gradient background image (base64)
- [ ] White Cochl logo appears at bottom-left of cover, `height: 20px`, `opacity: 0.70`
- [ ] Bottom page-nav (`‹ X / N ›`) is present and functional
- [ ] No top navigation bar exists
- [ ] Section-head margin is `64px` below h2 on every content slide
- [ ] Card gap is `24px` in all grids
- [ ] Max content width is `1280px`

### Content Rules
- [ ] Each slide communicates exactly ONE core message
- [ ] No slide has more components than its density limit (see Part 4)
- [ ] No card body text exceeds 2 sentences
- [ ] Every h2 title has exactly one key phrase wrapped in `<span class="grad-text">`
- [ ] Comparison table always has Cochl column last and highlighted
- [ ] Timeline milestone dots use correct colors (default / warning / success)
- [ ] No bullet lists outside of two-cols-list layout
- [ ] No paragraph blocks (use cards or KPI values instead)

### Break & Flow Rules
- [ ] At least one break slide inserted per 3–4 consecutive HIGH-density slides
- [ ] Every major topic transition (Problem→Solution, Solution→Proof) has a break slide
- [ ] quote-break slides contain ≤ 20 words in the quote
- [ ] stat-spotlight slides show exactly 1 number — no secondary metrics
- [ ] full-image slides have text only in the bottom 20% of the frame
- [ ] section-break slides have no cards, no data, no bullets
- [ ] Break slides do not carry section headings (h2) — they are exempt from that rule

### Anti-AI-Look Rules
- [ ] No perfectly identical card sizes across different slide types
- [ ] No rainbow or multi-gradient charts
- [ ] Whitespace is present — slides are not fully packed
- [ ] No glassmorphism on content slides (CTA/cover only)
- [ ] No more than 2 visual accent elements per slide (line + grad-text only)
- [ ] No decorative icon overuse — max 1 icon per card

---

## Part 6 — Example Input Format

Drop new content in this JSON structure. The agent will map it automatically.

```json
{
  "deck_title": "string",
  "theme": "dark",
  "slides": [
    {
      "intent": "cover | problem | market | solution | architecture | capabilities | performance | scenarios | competitive | technology | roadmap | budget | cta | quote-break | stat-spotlight | full-image | section-break | agenda | mission-statement | split-left-image | split-right-image | text-image-bottom | icon-columns | numerical-value | photo-mosaic | team-grid",
      "title": "string (max 8 words)",
      "subtitle": "string (optional, 1 sentence)",
      "tagline": "string (optional, italic, max 120 chars)",
      "key_phrase": "string (the part of the title to highlight with grad-text)",
      "content": {
        "type": "kpi_cards | pillar_cards | layer_stack | data_table | comp_table | two_cols | timeline | budget | scenario_cards | outcome_cards",
        "items": []
      },
      "footer_note": "string (optional)",
      "density": "low | medium | high | cinematic"
    }
  ]
}
```

### Example: Market Slide Input
```json
{
  "intent": "market",
  "title": "A $50B Security AI Market Emerging",
  "key_phrase": "$50B Security AI Market",
  "content": {
    "type": "kpi_cards",
    "items": [
      { "value": "$50B", "label": "Global Security AI Market 2030", "sub": "CAGR 31%" },
      { "value": "2,400", "label": "Enterprise Deployments 2025", "sub": null },
      { "value": "$8B",  "label": "US Federal AI Security Budget", "sub": "FY2026" }
    ]
  },
  "footer_note": "\"AI-native defense is no longer optional.\" — DARPA Director"
}
```

**Output:** Agent maps this to `kpi-grid-2x3` layout. Title replaces S3 h2. KPI values map to existing `.kpi-card` structure. Quote maps to `.quote-block`. No layout changes made.

---

## Part 7 — Agent Execution Instructions

When invoked with new content:

```
STEP 1 — Parse input
  Read the incoming content (JSON, markdown, plain text, or paste).
  Identify: title, key data points, headings, body text, images, callouts.

STEP 2 — Map to layout
  For each content block, select the closest layout from Part 2.
  If no perfect match, use the closest density match.
  Do NOT invent new CSS classes or new layouts.

STEP 3 — Apply token rules
  Replace all colors with design tokens from Part 1.
  Apply correct font sizes per type scale.
  Apply spacing rules (section-gap, card-gap, grid-padding).

STEP 4 — Shorten content
  Apply text length rules from Part 3.
  Split dense slides into multiple slides if needed.
  Remove filler words; keep strategic, executive tone.

STEP 5 — Build slide HTML
  Use exact class names from the source deck.
  Copy the HTML structure of the matched layout.
  Only replace text content and data values.
  Preserve all CSS — never modify the stylesheet.

STEP 6 — QA
  Run every check in Part 5.
  Fix any failing checks before output.

STEP 7 — Output (always produce BOTH formats)

  FORMAT 1: HTML (self-contained, interactive)
    File: {deck_name}.html
    - Single file, all assets base64-encoded inline
    - Fully interactive: bottom page-nav (‹ X / N ›), keyboard arrow navigation
    - Cover/CTA background images embedded
    - Editable by opening in any text editor or IDE

  FORMAT 2: PPTX (editable PowerPoint)
    File: {deck_name}.pptx
    Generated via Python using python-pptx:

    from pptx import Presentation
    from pptx.util import Inches, Pt, Emu
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN

    Rules for PPTX generation:
    - Slide size: 13.33 × 7.5 inches (widescreen 16:9)
    - Background: fill each slide with #0B1F3A (RGB 11, 31, 58)
    - Cover/CTA slide background: insert image5.png from Cochl_PT_template.pptx
    - All text boxes must be real text boxes (not images) — keep fully editable
    - Font: use "IBM Plex Sans" for all text (fallback: "Calibri" if not installed)
    - Headings: 32pt, bold, white (RGB 255,255,255)
    - Body: 18pt, regular, muted (RGB 139, 155, 180)
    - KPI values: 40pt, bold, use gradient simulation (apply #6B4EFF for first half, #2F80ED for second)
    - Cards: add rectangle shapes with fill #0F2847, corner radius 12pt, no outline
    - Accent lines: thin rectangle 3pt height, gradient fill #6B4EFF → #2F80ED
    - Cochl logo: insert image2.png (white logo) bottom-left of cover, height 20pt
    - Never rasterize text — all text elements must remain text boxes
    - Save as: {deck_name}.pptx

  Both files saved to the same directory as the source deck.
  Confirm both file paths in the output message.
```

---

## File Locations

```
/Users/hyo/Desktop/challenge/
├── cochl_acousticshield_deck.html    ← source deck (visual source of truth, interactive)
├── cochl_acousticshield_deck.pptx    ← editable PowerPoint export (generated by agent)
├── cochl_acousticshield_deck.json    ← structured slide content
├── Cochl_PT_template.pptx            ← cover background + white logo source
├── SKILL.md                          ← this file
└── USAGE.md                          ← how to use this skill
```

**Export naming convention:**  
Given source deck `{name}.html`, agent always produces:  
- `{name}.html` — updated self-contained interactive deck  
- `{name}.pptx` — editable PowerPoint with the same content  

Both files are produced in a single agent run. Do not produce one without the other.

---

## Quick Reference Card

```
Need a number?          → kpi-card (.kpi-value grad-text)
Need a comparison?      → comp-table (Cochl col last, highlighted)
Need a process?         → layer-stack (4 layers, ①②③④)
Need a timeline?        → timeline (7 phases max)
Need to list features?  → four-pillar (01/02/03/04)
Need credentials?       → two-cols-list (IP stack | Track record)
Need scenarios?         → three-scenario (badge + steps)
Need financial?         → budget (donut + bars)
Need to open?           → hero (cover, PPTX bg, white logo bottom-left)
Need to close?          → cinematic-cta (frosted cards + pipeline)

── Break layouts (always strip all cards/grids) ─────────────────────────
Need ONE quote to land?      → quote-break (≤20 words, attribution, centered)
Need ONE number to hit hard? → stat-spotlight (96–120px grad-text, nothing else)
Have a strong visual?        → full-image (full-bleed, text bottom 20% only)
Changing topics?             → section-break (chapter number + 1–4 word title)

── Template-derived layouts (from Cochl_PT_template.pptx) ──────────────
Opening TOC?                 → agenda (left image + timed/numbered list)
Brand moment / mission?      → mission-statement (full-bg + centered quote)
Photo left, text right?      → split-left-image (60/40 split)
Text left, photo right?      → split-right-image (50/50 split)
Explanation + diagram below? → text-image-bottom (top text + full-width image)
3 features with icons?       → icon-columns (no cards, borderless)
3 headline numbers?          → numerical-value (open columns, grad values)
Multiple deployment photos?  → photo-mosaic (left text + right 2×3 grid)
Team / advisors?             → team-grid (square photos + name labels)

Flow rule:              Insert a break slide after every 3–4 consecutive HIGH slides.
Accent rule:            ONE grad-text span per h2. Nowhere else on content slides.
Density rule:           ONE core message per slide. Split if needed.
Text rule:              Max 2 sentences per card body. Max 8 words per h2.
Break slide count:      Does not cap at 13 — total slides increase when breaks are added.
```
