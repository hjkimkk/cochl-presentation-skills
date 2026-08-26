---
name: cochl-pitch-deck
description: Creates a production-grade Cochl pitch deck from minimal user input. Use this skill when the user wants to build a slide deck, presentation, or pitch — especially for Cochl products or B2B enterprise pitches. Takes product info, key messages, and data points, then outputs a fully self-contained interactive HTML pitch deck following the Cochl Design System (dark enterprise theme, IBM Plex Sans, #0B1F3A base) plus frontend-design aesthetic principles.
license: Complete terms in LICENSE.txt
---

This skill combines the **Cochl Presentation System** (design tokens, layout grammar, density rules) with **frontend-design** aesthetic principles to produce memorable, production-grade pitch decks from raw user content.

---

## What the user provides

The user gives you some combination of:
- Product or company name
- The pitch audience (investors, government, enterprise buyers, etc.)
- Key messages, data points, or bullet lists
- Optionally: a JSON file, PRD, or plain-text brief

You infer the rest. Never ask for more than what's needed to start building.

---

## Template Variants

Some pitch types have an official Cochl template that must be treated as the source of truth for slide structure, copy patterns, and layout — use it instead of freehanding from Step 2's generic slide map.

| Variant | Trigger | Source of truth |
|---|---|---|
| Investor / fundraising pitch deck | Audience is investors, VCs, or a fundraising round (seed, Series A/B/…) | **Bundled spec: [`references/investor-template.md`](references/investor-template.md)** — 15 layouts, tokens, glow motifs; previews in `references/investor-template-previews/`. Figma mirror (needs MCP auth): https://www.figma.com/slides/O5ORoGcBjP57OxhCHrAZ2n/Investor---fundraising-pitch-deck?node-id=8-1354 |
| B2B partnership / sales proposal deck | Audience is a prospective partner or enterprise buyer; goal is a partnership, sale, or proposal (agenda, capabilities, clients, case studies, pricing, timeline, next steps) | **Bundled spec: [`references/b2b-sales-proposal-template.md`](references/b2b-sales-proposal-template.md)** — 22 layouts, tokens, glow motifs; previews in `references/b2b-sales-proposal-previews/`. |
| Corporate strategy / product roadmap deck | Internal or exec-facing strategy, planning, or roadmap review (pillars, priorities, OKRs, roadmap timeline, financials, risks, tiers, the ask) | **Bundled spec: [`references/corporate-strategy-roadmap-template.md`](references/corporate-strategy-roadmap-template.md)** — 15 layouts, tokens, glow motifs; previews in `references/corporate-strategy-roadmap-previews/`. |
| Quarterly business review (QBR) / board update deck | Board or leadership review of the quarter just completed (where-we-are KPIs, financials, success metrics, risks, then roadmap + the ask) | **Bundled spec: [`references/qbr-board-update-template.md`](references/qbr-board-update-template.md)** — 15 layouts (sibling of the strategy/roadmap template; QBR framing); previews in `references/qbr-board-update-previews/`. |
| Market & competitive landscape analysis deck | Competitor / market analysis (market sizing, share ranking, competitor profiles, capability benchmark, positioning map, white space) | **Bundled spec: [`references/market-competitive-template.md`](references/market-competitive-template.md)** — 13 layouts, tokens, chart/matrix/map components; previews in `references/market-competitive-previews/`. |

**For a template variant, read its bundled spec first and follow it as authoritative** — it overrides Step 2's generic slide map and Step 3's generic tokens. All variants share the Cochl **near-black / indigo / glow** system (NOT `#0B1F3A`) but differ in heading treatment: **Investor = IBM Plex Mono, UPPERCASE**; **B2B = IBM Plex Sans, Title Case** (mint secondary accent); **Corporate strategy/roadmap = IBM Plex Sans, Title Case** with mono `STRATEGIC` kicker, mint secondary accent, and a gradient + glassy-ring cover. The specs are self-contained, so they work even when the Figma MCP is unauthorized; when Figma *is* authorized you may reconcile against the node via `get_design_context` / `get_screenshot` (see `figma-design-to-code`), but keep the bundled structure. A white `cochl.` logo for the footer is bundled at `references/cochl-logo-white.png`.

For any variant without a listed source of truth, fall back to the generic 13-slide map in Step 2.

### Companion brand-asset libraries (not decks)
Two bundled libraries produce non-deck Cochl collateral in the same brand system. Use them when the user asks for that artifact instead of a deck:
- **Brochure** — `references/brochure/` — editable-SVG brochure / 제품 소개서 / 1-pager (12 layouts: V1/V2/V3 × portrait/landscape × front/back, + 32 icons). Trigger: brochure, 브로셔, leaflet, datasheet.
- **Press / social media kit** — `references/social-kit/` — editable-SVG platform banners (LinkedIn 1584×396, YouTube 2560×1440, Medium 1500×750, Notion 1500×600, OG 1200×630). `templates/` = blank (image drop-zones + text placeholders); `examples/` = filled. Fill by replacing `#565b6b` placeholder `<text>` and swapping `image-*` groups; keep the `logo` + `cochlGrad`/`glow`. See `references/social-kit/README.md`. Trigger: social banner, press kit, LinkedIn/YouTube/Medium/Notion cover, OG card.

---

## Step 1 — Understand the context

Before writing a single line of HTML, answer these four questions internally:

1. **Who is the audience?** (investors → emphasis on market + traction; government/defense → credibility + architecture; enterprise → ROI + competitive)
2. **What is the one core message?** (One sentence. Everything else supports it.)
3. **What are the 3 strongest proof points?** (KPIs, technical moats, customer wins)
4. **What should the audience DO after the last slide?** (Fund, buy, partner, approve)

Map the user's content to these four answers before deciding on slides.

---

## Step 2 — Map content to 13 slides

Always produce exactly 13 slides unless the user specifies otherwise. Use these layouts:

| Intent | Layout class | Max density |
|---|---|---|
| cover | hero | LOW |
| problem | three-cols + callout-banner | MEDIUM |
| market | kpi-grid-2x3 + quote-block | HIGH |
| solution | four-pillar (four-cols) | MEDIUM |
| architecture | layer-stack (4 layers max) | HIGH |
| capabilities | data-table (8 rows max) | HIGH |
| performance | kpi-grid-4x2 | HIGH |
| scenarios | three-scenario cards | MEDIUM |
| competitive | comp-table (Cochl col last, highlighted) | HIGH |
| technology | two-cols-list | MEDIUM |
| roadmap | timeline (7 phases max) | MEDIUM-HIGH |
| budget | budget (donut + bars) | HIGH |
| cta | cinematic-cta (frosted cards) | LOW-MEDIUM |
| **quote-break** | **centered quote, no cards** | **VERY LOW** |
| **stat-spotlight** | **single oversized number** | **VERY LOW** |
| **full-image** | **full-bleed image, text bottom only** | **VERY LOW** |
| **section-break** | **chapter title, decorative number** | **VERY LOW** |

**Break slide placement rules:**
- Insert a break slide after every 3–4 consecutive HIGH-density slides
- Always at major topic transitions: Problem→Solution, Solution→Proof, Proof→Next Steps
- Break slides increase the total slide count beyond 13 — that is intentional and correct
- Choose the type by audience need:
  - Emotional reset after bad news → quote-break
  - Wow factor after data → stat-spotlight  
  - Visual relief mid-deck → full-image (only if a strong, real image is available)
  - Chapter transition → section-break

**Content rules:**
- h2 titles: max 8 words. Wrap ONE key phrase in `<span class="grad-text">`.
- Card body: max 2 sentences (≤30 words).
- KPI label: max 6 words.
- Bullet items: max 1 line.
- ONE core message per slide. Split if too dense.

---

## Step 3 — Design tokens (single source of truth)

```css
--c-enterprise: #0B1F3A    /* all slide backgrounds */
--c-ai:         #6B4EFF    /* primary accent, purple */
--c-analytics:  #2F80ED    /* secondary accent, blue */
--c-emergency:  #EB5757
--c-success:    #10B981
--c-warning:    #F59E0B
--col-bg:       #06101E    /* body background */
--col-card:     #0F2847    /* all cards and table surfaces */
--col-text:     #FFFFFF
--col-muted:    #8B9BB4
--col-border:   rgba(255,255,255,0.07)
--grad-main:    linear-gradient(135deg, #6B4EFF 0%, #2F80ED 100%)
--section-gap:  64px
--card-gap:     24px
--grid-padding: 40px
--max-width:    1280px
--radius-card:  20px
font-family: 'IBM Plex Sans', sans-serif
h1: 48px / 700 / lh 1.1 / tracking -0.025em
h2: 32px / 600 / lh 1.2 / tracking -0.015em
body: 18px / 400 / lh 1.5
```

**Gradient rule — ONLY apply `--grad-main` to:**
- KPI value text (`-webkit-background-clip: text`)
- Accent lines (3px height, max 120px wide)
- Cover/CTA background overlay
- Timeline track line
- Budget bar fills
- Pillar card top border (2px)

Never apply to card backgrounds, body text, or table rows.

---

## Step 4 — Cover and CTA backgrounds

The cover (slide-1) and CTA (slide-13) share the same dramatic background image. If the source deck HTML exists at `/Users/hyo/Desktop/challenge/cochl_acousticshield_deck.html`:

```python
import re
with open('/Users/hyo/Desktop/challenge/cochl_acousticshield_deck.html') as f:
    c = f.read()
bg = re.search(r"#slide-1\{[^}]*background:url\('(data:[^']+)'\)", c).group(1)
logo = re.search(r'cover-logo-bottom[^>]*src="(data:[^"]+)"', c).group(1)
```

If the source deck is unavailable, use a pure CSS fallback:
```css
#slide-1, #slide-13 {
  background: linear-gradient(135deg, #0B1F3A 0%, #06101E 40%, #1a0b3a 100%);
}
```

White Cochl logo always appears at `bottom: 60px; left: 40px; height: 20px; opacity: 0.70; filter: brightness(0) invert(1)` on the cover slide.

---

## Step 5 — Frontend-design aesthetic layer

Apply these principles on top of the Cochl token system:

**Typography choices:**
- IBM Plex Sans is the required deck font — use it consistently.
- Vary weight intentionally: 700 for KPI values, 600 for headings, 400 for body, 300 italic for taglines/quotes.

**Motion (CSS only):**
- Slides should feel alive but not distracting.
- Add `@keyframes fadeUp` on `.slide-inner` children with staggered `animation-delay` (0.1s increments).
- KPI values: subtle `@keyframes countUp` shimmer on load (opacity 0→1 + translateY 8px→0).
- No looping animations. One-shot reveal only.

**Spatial composition:**
- Cover: left-aligned text, generous top padding (100px), full-bleed background.
- Content slides: max-width 1280px centered, 40px horizontal padding.
- CTA: center-aligned, frosted-glass outcome cards, dramatic closing statement.

**Backgrounds & depth:**
- Content slides: flat `#0B1F3A` — the data is the visual.
- Cover/CTA: full-bleed PPTX image + `rgba` gradient overlay for legibility.
- Cards: `#0F2847` — slightly lighter than slide background to create depth without color noise.

**Anti-AI-look rules:**
- No glassmorphism on content slides (only CTA and cover elements).
- Max 2 accent elements per slide (grad-text span + accent line OR grad-text span only).
- No rainbow charts.
- No decorative icon overuse — max 1 icon per card.
- Whitespace is not empty — it's breathing room. Never fill every pixel.

---

## Step 6 — Page navigation (required)

Always include the bottom pill navigator. Never include a top navigation bar.

```html
<div id="page-nav">
  <button class="pn-btn" id="pn-prev" onclick="pnPrev()">&#8249;</button>
  <span id="pn-counter">1 / 13</span>
  <button class="pn-btn" id="pn-next" onclick="pnNext()">&#8250;</button>
</div>
```

```css
#page-nav {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  z-index: 1000; display: flex; align-items: center; gap: 18px;
  background: rgba(6,16,30,0.82); backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 99px; padding: 9px 22px;
}
```

```javascript
const TOTAL = 13; let current = 1;
function goTo(n) {
  if (n < 1 || n > TOTAL) return; current = n;
  document.getElementById('slide-' + n).scrollIntoView({behavior:'smooth'});
  document.getElementById('pn-counter').textContent = n + ' / ' + TOTAL;
  document.getElementById('pn-prev').style.opacity = n === 1 ? '0.3' : '1';
  document.getElementById('pn-next').style.opacity = n === TOTAL ? '0.3' : '1';
}
function pnPrev() { goTo(current - 1); }
function pnNext() { goTo(current + 1); }
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && e.intersectionRatio >= 0.4) {
      const n = parseInt(e.target.id.replace('slide-',''));
      current = n;
      document.getElementById('pn-counter').textContent = n + ' / ' + TOTAL;
      document.getElementById('pn-prev').style.opacity = n === 1 ? '0.3' : '1';
      document.getElementById('pn-next').style.opacity = n === TOTAL ? '0.3' : '1';
    }
  });
}, {threshold: 0.4});
document.querySelectorAll('section[id^="slide-"]').forEach(s => obs.observe(s));
document.addEventListener('keydown', e => {
  if (e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();goTo(current+1);}
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();goTo(current-1);}
});
document.getElementById('pn-prev').style.opacity = '0.3';
```

---

## Step 7 — Output

**Always build the HTML first (it is the source of truth), then ASK the user which format(s) to save and deliver accordingly:**

> **"How should I save the presentation — PPTX, HTML, or both?"**  → options: **Both** (recommended) · **PPTX only** · **HTML only**

Use the host's choice prompt (in Claude Code: the `AskUserQuestion` tool) after the HTML is ready. Then:
- **Both** → keep the `.html` and also export the `.pptx` (7b).
- **HTML only** → deliver just `{product_slug}_deck.html`.
- **PPTX only** → still generate the HTML internally (needed to render the PPTX), export the `.pptx`, and deliver the `.pptx` (you may keep the `.html` on disk but lead with the PPTX).

Both files share the same basename and directory. Report the path(s) of whatever was produced.

### 7a — HTML (source of truth)
Produce a single self-contained HTML file:
- All assets base64-encoded inline (no external dependencies except Google Fonts CDN).
- File named `{product_slug}_deck.html` saved to the same directory as the input file (or `/Users/hyo/Desktop/challenge/` if no input file path given).
- Google Fonts link: `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap` (add `IBM+Plex+Mono` for the investor variant).
- All slides present (13 for the generic map; the variant's own count otherwise).
- Bottom page-nav functional; keyboard arrow navigation working.
- Open the file in the browser after writing it.

### 7b — PPTX (pixel-faithful export)
Export the finished HTML to a 16:9 PowerPoint where **each slide is a full-bleed 1920×1080 image** of the rendered HTML slide — this preserves glows, discs, gradients and mono type exactly (the primitive text/shape APIs cannot). Recipe:
1. Render each slide to a 1920×1080 PNG with headless Chrome. Reliable method: emit each `<section>` as its own standalone page (same CSS, `html,body{width:1920px;height:1080px;overflow:hidden}` + `.slide{min-height:1080px;height:1080px}`), then `chrome --headless=new --screenshot=sNN.png --window-size=1920,1080 --force-device-scale-factor=1 --hide-scrollbars --virtual-time-budget=3500 file://…/slide-N.html`. (Anchor/JS scroll on the combined deck is unreliable in headless; standalone per-slide pages are not.)
2. Build the deck with python-pptx (`pip install --user python-pptx` if missing):
   ```python
   from pptx import Presentation; from pptx.util import Inches; import glob
   prs = Presentation(); prs.slide_width = Inches(13.333); prs.slide_height = Inches(7.5)
   blank = prs.slide_layouts[6]
   for p in sorted(glob.glob('build/png/s*.png')):
       s = prs.slides.add_slide(blank)
       s.shapes.add_picture(p, 0, 0, width=prs.slide_width, height=prs.slide_height)
   prs.save('{product_slug}_deck.pptx')
   ```
3. Delete the intermediate PNGs; keep only the `.html` and `.pptx`.

Report both file paths when done.

---

## Input format the user can provide

Anything works — the skill adapts. These are examples from simplest to richest:

**Minimal (freeform text):**
```
Product: Cochl SoundSense
Audience: Enterprise factory buyers
Core pitch: Turn machine sound into operational insight
Key numbers: $50B market, 94% detection accuracy, 3-minute setup
```

**Structured JSON:**
```json
{
  "product": "string",
  "audience": "investors | government | enterprise | partner",
  "tagline": "string",
  "slides": [
    {
      "intent": "cover | problem | market | solution | architecture | capabilities | performance | scenarios | competitive | technology | roadmap | budget | cta",
      "title": "string",
      "key_phrase": "the part to highlight with grad-text",
      "content": { ... }
    }
  ]
}
```

**Rich (PRD / existing document):**
Point to a file path. The skill reads it, extracts key facts, and maps them to slides automatically.

---

## QA before output

Run these checks on every generated deck:

- [ ] All slides use `#0B1F3A` background (except cover/CTA)
- [ ] Cards use `#0F2847`, not black or custom colors
- [ ] `--grad-main` only in approved positions (not card BG, not body text)
- [ ] IBM Plex Sans throughout, h2 is 32px semibold
- [ ] Cover has white logo bottom-left, opacity 0.70
- [ ] Bottom page-nav present, no top nav bar
- [ ] Every h2 has exactly ONE `<span class="grad-text">` key phrase
- [ ] No card body exceeds 2 sentences
- [ ] No glassmorphism on content slides
- [ ] Break slides present at each major topic transition
- [ ] quote-break: ≤ 20 words, no cards
- [ ] stat-spotlight: exactly 1 number, nothing else
- [ ] section-break: no cards, no bullets, decorative chapter number
- [ ] File is self-contained (no broken external asset refs)
