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

Produce a single self-contained HTML file:
- All assets base64-encoded inline (no external dependencies except Google Fonts CDN).
- File named `{product_slug}_deck.html` saved to the same directory as the input file (or `/Users/hyo/Desktop/challenge/` if no input file path given).
- Google Fonts link: `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap`
- All 13 slides present.
- Bottom page-nav functional.
- Keyboard arrow navigation working.
- Open the file in the browser after writing it.

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
