---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, applications, or pitch decks — especially for Cochl products. Applies Cochl Design System tokens (@cochlearai/ui) automatically when working in a React/Vite project, and applies the Cochl Presentation System when building HTML pitch decks. Avoids generic AI aesthetics in all output.
license: Complete terms in LICENSE.txt
---

This skill combines **Cochl Design System** integration with **production-grade aesthetic principles** to produce interfaces that are both on-brand and memorable. It covers two modes: React app components and self-contained HTML pitch decks.

---

## Mode Detection

Before writing any code, determine which mode applies:

| Signal | Mode |
|---|---|
| React / Vite project, `package.json` present | **React DS Mode** — install `@cochlearai/ui`, use `BaseTheme` |
| Request is for a pitch deck / slides / presentation | **Pitch Deck Mode** — use Cochl Presentation System (HTML) |
| Static HTML page, landing page, web artifact | **HTML Mode** — apply Cochl tokens as CSS variables |

---

## Design Thinking (all modes)

Before writing a single line of code, answer these four questions internally:

1. **Purpose** — What problem does this interface solve? Who uses it?
2. **Tone** — Pick one direction and commit: enterprise-dark, editorial-minimal, cinematic, data-dense, conversational. No default choices.
3. **Differentiation** — What makes this UNFORGETTABLE? One specific detail someone will remember.
4. **Constraints** — Framework, performance, accessibility requirements.

NEVER default to generic AI aesthetics: no Inter/Roboto on non-Cochl work, no purple gradients on white, no cookie-cutter card grids without intent.

---

## Cochl Design System Tokens (single source of truth)

Always apply these tokens when building anything Cochl-branded:

```css
/* Colors */
--c-enterprise: #0B1F3A     /* slide / section backgrounds */
--c-ai:         #6B4EFF     /* primary accent — purple */
--c-analytics:  #2F80ED     /* secondary accent — blue */
--c-emergency:  #EB5757
--c-success:    #10B981
--c-warning:    #F59E0B
--col-bg:       #06101E     /* body / page background */
--col-card:     #0F2847     /* card and table surfaces */
--col-text:     #FFFFFF
--col-muted:    #8B9BB4
--col-border:   rgba(255,255,255,0.07)
--grad-main:    linear-gradient(135deg, #6B4EFF 0%, #2F80ED 100%)

/* Typography */
font-family: 'IBM Plex Sans', sans-serif
h1: 48px / 700 / lh 1.1 / tracking -0.025em
h2: 32px / 600 / lh 1.2 / tracking -0.015em
body: 18px / 400 / lh 1.5
caption: 14px / 400 / lh 1.4

/* Spacing */
--section-gap:  64px
--card-gap:     24px
--grid-padding: 40px
--max-width:    1280px
--radius-card:  20px
--radius-btn:   14px
```

**Gradient rule — apply `--grad-main` ONLY to:**
- KPI value text (`-webkit-background-clip: text`)
- Accent lines (3px height, max 120px wide)
- Cover/CTA background overlays
- Timeline track line, budget bar fills, pillar card top borders

Never apply to card backgrounds, body text, or table rows.

---

## React DS Mode — @cochlearai/ui Setup

Use when project has `package.json`. Steps:

### 1. Create `.npmrc` at project root
```ini
@cochlearai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${COCHLEARAI_NPM_TOKEN}
```
Add `.npmrc` to `.gitignore`. Never hardcode the token.

### 2. Install packages
```bash
yarn add @cochlearai/ui @cochlearai/util
# or: npm install @cochlearai/ui @cochlearai/util
# or: pnpm add @cochlearai/ui @cochlearai/util
```

### 3. Wrap root with BaseTheme
```tsx
import { BaseTheme, ThemeType } from '@cochlearai/ui';

export default function App() {
  return (
    <BaseTheme theme={ThemeType.LIGHT}>
      {/* existing app content */}
    </BaseTheme>
  );
}
```

Rules: Place `BaseTheme` as high as possible. Never nest multiple providers. Don't remove existing Router/QueryClient — wrap inside or around them.

### 4. Verify with a test component
```tsx
import { Button } from '@cochlearai/ui';
<Button variant="primary">Design System Active</Button>
```

### React QA checklist
- [ ] `.npmrc` uses env variable, not raw token
- [ ] `.npmrc` in `.gitignore`
- [ ] `@cochlearai/ui` and `@cochlearai/util` in `package.json`
- [ ] `BaseTheme` wraps root with `ThemeType.LIGHT`
- [ ] `npm run build` completes with no errors
- [ ] No unrelated layout changes made

---

## Pitch Deck Mode — Cochl Presentation System

Use when building slides, pitch decks, or presentations. Always produce a **self-contained HTML file**.

### 13-slide layout grammar

| Intent | Layout | Max elements |
|---|---|---|
| cover | hero — full-bleed bg, left-aligned text | 6 text + meta row |
| problem | three-cols + callout-banner | 3 cards + 1 callout |
| market | kpi-grid-2x3 + quote-block | 6 KPI cards + quote |
| solution | four-pillar (four-cols) | 4 pillars |
| architecture | layer-stack (4 layers, ①②③④) | 4 layers |
| capabilities | data-table (8 rows, 4 cols max) | 1 table + footnote |
| performance | kpi-grid-4x2 | 8 KPI cards + footer |
| scenarios | three-scenario cards | 3 cards × 4 steps |
| competitive | comp-table (Cochl col last, highlighted) | 6 rows |
| technology | two-cols-list | 8 bullets per col |
| roadmap | timeline (7 phases max) | phases + total |
| budget | budget (SVG donut + bar rows) | 3 segments + 6 bars |
| cta | cinematic-cta (frosted glass cards) | 3 cards + pipeline |

### Content rules
- h2 title: max 8 words. ONE key phrase in `<span class="grad-text">`.
- Card body: max 2 sentences (≤30 words).
- KPI label: max 6 words.
- ONE core message per slide. Split if too dense.
- No glassmorphism on content slides — only cover and CTA.
- Max 1 icon per card. No decorative overuse.

### Required navigation
Always bottom pill navigator. Never top nav bar.
```html
<div id="page-nav">
  <button class="pn-btn" id="pn-prev" onclick="pnPrev()">&#8249;</button>
  <span id="pn-counter">1 / 13</span>
  <button class="pn-btn" id="pn-next" onclick="pnNext()">&#8250;</button>
</div>
```

### Cover / CTA backgrounds
Reuse PPTX background from source deck when available:
```python
import re
with open('/Users/hyo/Desktop/challenge/cochl_acousticshield_deck.html') as f:
    c = f.read()
bg = re.search(r"#slide-1\{[^}]*background:url\('(data:[^']+)'\)", c).group(1)
logo = re.search(r'cover-logo-bottom[^>]*src="(data:[^"]+)"', c).group(1)
```
White Cochl logo: `bottom: 60px; left: 40px; height: 20px; opacity: 0.70; filter: brightness(0) invert(1)`.

### Pitch deck QA checklist
- [ ] All slides use `#0B1F3A` background (except cover/CTA)
- [ ] Cards use `#0F2847`, IBM Plex Sans throughout
- [ ] Every h2 has exactly ONE `<span class="grad-text">`
- [ ] No card body exceeds 2 sentences
- [ ] Bottom page-nav present and functional
- [ ] Cover has white logo bottom-left
- [ ] File is fully self-contained (all assets base64 inline)

---

## HTML Mode — Aesthetic Guidelines

For non-deck, non-React HTML interfaces:

**Typography:** Pair a distinctive display font with a refined body font. IBM Plex Sans for Cochl work; for non-Cochl work choose something unexpected and context-specific. Never default to Inter/Roboto/Arial.

**Motion (CSS only):**
- `@keyframes fadeUp` with staggered `animation-delay` on page load (0.1s increments)
- One well-orchestrated reveal beats scattered micro-interactions
- Hover states that surprise — not just opacity changes

**Spatial composition:**
- Asymmetry over symmetry. Grid-breaking elements. Generous negative space OR controlled density — never the safe middle.
- Cover/hero: full-bleed background, dramatic type scale, minimal competing elements

**Backgrounds & depth:**
- Create atmosphere: gradient meshes, noise textures, layered transparencies, dramatic shadows
- Flat solid backgrounds only when the data IS the visual (content slides, data tables)

**Anti-patterns to avoid:**
- Purple gradients on white (cliché)
- Evenly-distributed color palettes (timid)
- Perfectly symmetrical card grids (generic)
- Glassmorphism everywhere (overused)
- Cookie-cutter layouts without context-specific intent

---

## Output rules (all modes)

- Self-contained HTML: all assets base64 inline, Google Fonts CDN only external dependency
- React: run build check before reporting complete
- File naming: `{product_slug}_deck.html` for decks, sensible names for components
- Open browser after writing HTML files
- Never modify unrelated components or routing logic
