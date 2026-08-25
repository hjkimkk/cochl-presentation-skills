# Investor / Fundraising Pitch Deck — Official Cochl Template

Source of truth for the **Investor / fundraising** variant. Derived from the official
15-page Cochl investor deck (`Investor _ fundraising pitch deck`, 1920×1080). Page
previews live in [`investor-template-previews/`](investor-template-previews/) (`p01`–`p15`).
Treat this file as authoritative when the Figma MCP is unavailable; when Figma *is*
authorized, reconcile against the Figma node but keep this structure.

The template ships pre-filled with **placeholder tokens** (`XX`, `$XXM`, `add logo here`,
`<insert … here>`, `TIER XXXX`). Those are intentional — map them to real content, or to
explicit **`NEEDS INPUT`** slots when the fact is unconfirmed. Never invent company facts.

---

## Design system (investor variant)

Distinct from the generic deck tokens — the investor template is **mono-headline, near-black,
indigo-accent** with signature glow motifs.

```css
--bg:        #0B0B12   /* near-black base for glow slides (cover, statements, problem, market, closing) */
--bg-black:  #000000   /* pure black for data slides (traction, competitors, offering, revenue, pipeline, financials) */
--panel:     #14141C   /* raised dark cards / competitor cards / tier cards */
--card-img:  #ECECEC   /* light image-placeholder fill (use-case & offering cards) */
--text:      #FFFFFF
--muted:     #8A8A99   /* grey body text on light-heading offering/use-case slides */
--accent:    #4B68FF   /* vivid indigo — subtitle, glows, contact icons, accent underline */
--accent-purple: #832BFB
--glow:      radial/linear #832BFB → #4B68FF   /* purple→blue */
--neg:       #EB5B6B   /* competitor ✕ (pink-red) */
--pos:       #B7E4A0   /* offering ✓ (soft green) */
--radius:    18px
--margin-x:  110px     /* content left/right margin at 1920 */

/* Typography — HEADLINE + KICKER ARE MONOSPACE (this is the signature) */
--font-head: 'IBM Plex Mono'   /* kicker + all slide titles, UPPERCASE, weight 500 */
--font-body: 'IBM Plex Sans'   /* body, statements, metric values, labels */
kicker:  IBM Plex Mono / 13px / 500 / letter-spacing .15em / UPPERCASE / muted-white
title:   IBM Plex Mono / 44px / 500 / UPPERCASE / white
body:    IBM Plex Sans / 22px / 400 / lh 1.5
statement (centered): IBM Plex Sans / ~64px / 500 / lh 1.25 / white
metric value: IBM Plex Sans / ~120px / 700 (length-fitted)
```

### Standard chrome (content slides only — NOT cover/statement slides)
- **Kicker** top-left: `CONFIDENTIAL + PROPRIETARY` (mono, letter-spaced, muted).
- **Title** below kicker, left-aligned, mono uppercase.
- **Footer**: white `cochl.` logo **bottom-left**; `[Presentation Title]` (sans, muted) **bottom-right**.
- Optional vertical mono meta up the right edge on traction (`CONFIDENTIAL | FEB 2023`).

### Glow motifs (CSS radial/linear gradients — never raster)
1. **Crescent** (cover): large purple→blue arc sweeping the **bottom-right**.
2. **Central radial** (mission-statement, the-ask): purple→blue glow centered behind text.
3. **Rim-lit eclipse disc** (problem, market): a dark circle with the glow bleeding from
   behind, strongest on one shoulder (upper-left / upper-right).
4. **Upper-right band** (use-case top strip, closing): radial glow bleeding from top-right.

---

## The 15 layouts

Numbering matches the preview pages. Each entry: **intent → structure → density → placeholders**.

| # | Layout id | Intent | Preview |
|--:|---|---|---|
| 1 | `cover` | Title / subtitle cover | p01 |
| 2 | `mission-statement` | Big centered statement | p02 |
| 3 | `problem-split-callout` | Problem + rim-lit callout disc | p03 |
| 4 | `use-case-band` | Title+body over 4 labeled image cards | p04 |
| 5 | `traction-metrics` | 3×2 oversized metric grid | p05 |
| 6 | `competitors-map` | 2×2 perceptual quadrant map | p06 |
| 7 | `competitors-cards` | 2×2 competitor cards with ✕ reason | p07 |
| 8 | `offering-devices` | 3 device columns + green ✓ bullets | p08 |
| 9 | `use-case-four-column` | 4 image cards + label + body | p09 |
| 10 | `market-nested-circles` | TAM/SAM/SOM concentric circles | p10 |
| 11 | `revenue-tiers` | 3 pricing tier cards | p11 |
| 12 | `pipeline-table` | Left title+body / right rows table | p12 |
| 13 | `financials-bars` | Actual (solid) vs projected (hatch) bars | p13 |
| 14 | `the-ask` | Centered ask statement with `<insert>` | p14 |
| 15 | `thanks-contact` | Thanks + contact row | p15 |

### 1 · cover
Near-black + **bottom-right crescent glow**. `cochl.` logo top-left. Left block low on the
slide: bold white **Title**, indigo **Subtitle** with a short gradient underline, then a white
one-liner and a muted "Description". Meta row at bottom: `DATE / TEAM / SCOPE` (mono labels,
values below). Placeholders: `Title`, `Subtitle`, `xxxx.xx / xx / xxxx`. LOW density.

### 2 · mission-statement
Centered. Mono kicker (`MISSION STATEMENT`) + large centered sans statement over a **central
purple→blue glow**. VERY LOW density (≤ 25 words). No chrome footer.

### 3 · problem-split-callout
Split. **Left:** kicker + mono uppercase title + two body paragraphs. **Right:** a **rim-lit
eclipse disc** (dark circle, glow on one shoulder) holding a bold "Selling Point Statement" +
sub-line. Footer chrome present. MEDIUM density.

### 4 · use-case-band
**Top band** (subtle lighter panel with upper-right glow): kicker + mono title + 1–2 body
paragraphs. **Bottom band** (pure black): 4 cards, each a light image placeholder on top + a
bold label (e.g. `SECURITY /SURVEILLANCE`, `SMART HOME/ APPLIANCES`, `Defense/ CBM`,
`Manufacturing/ PLC`). MEDIUM-HIGH.

### 5 · traction-metrics
Pure black. Kicker + mono title (e.g. `WHAT COCHL HAS ACHIEVED SO FAR?`). **3×2 grid** of
oversized metric values (IBM Plex Sans 700) each with a small bold label beneath:
`$XXM` Annual recurring revenue · `XX` Customers and counting · `%` Year on year growth ·
`%` Customer retention rate · `X+` Years in business · `XX` Team members. Optional vertical
mono meta up the right edge. Values length-fit to one line. HIGH. **Most important slide.**

### 6 · competitors-map
Pure black. Mono title `COMPETITORS`. Two crossed thin-white axes (arrowheads) forming
quadrants; scatter `add logo here` labels across quadrants; one axis carries a `Lorem ipsum`
label. HIGH.

### 7 · competitors-cards
**Left:** mono title `COMPETITORS` + two body paragraphs. **Right:** 2×2 dark rounded cards,
each: `add logo here` heading, two body paragraphs, and a **pink-red ✕ circle** + bold
"Statement about why they are not solution". HIGH.

### 8 · offering-devices
Pure black. Mono title (e.g. `COCHL'S OFFERING`). 3 columns; each: a **light card with a device
mockup** (phone / browser / phone) on top, a bold grey subtitle, and 2 bullets each led by a
**soft-green ✓ circle**. MEDIUM-HIGH.

### 9 · use-case-four-column
Pure black. Mono title. 4 columns; each: light image placeholder on top, bold `Use Cases N`
label, two body paragraphs. MEDIUM-HIGH.

### 10 · market-nested-circles
Split. **Left:** mono title `MARKET` + two body paragraphs. **Right:** three **concentric
circles** (TAM outer → SAM → SOM inner light circle) over a **rim-lit blue glow**; each ring
labeled with a value + caption: `$XXB` Global market · `$XXX Mn` Market in your place · `$XX Mn`
Untouched market. HIGH.

### 11 · revenue-tiers
Pure black. Mono title `REVENUE MODEL`. 3 bordered cards; each: `TIER XXXX` header + divider,
big `$XXXX` + `per month`, then 4 feature rows each led by a white ✓ circle + `Feature goes here`.
HIGH.

### 12 · pipeline-table
Pure black. **Left:** mono title (e.g. `$ XXX M IN THE PIPELINE`) + two body paragraphs.
**Right:** 4 rows, columns `COMPANY` (add logo here) · `AMOUNT` (`$XXM`) · `CONTRACT SIGNED DATE`
(`XX/XX/XX`); mono column headers, large sans values. HIGH.

### 13 · financials-bars
Pure black. Mono title `FINANCIALS`. Legend: `ACTUAL` (solid white swatch) · `PROJECTED`
(45° hatch swatch). Inline-SVG bar chart, `Year 1…6`, actual = solid white / projected = hatch
(a mixed transition bar is fine), 5 `$XX` y-ticks with tick marks + baseline, no gridlines,
no chart library. Left body paragraph optional. HIGH.

### 14 · the-ask
Centered (same frame as mission-statement). Mono kicker `THE ASK` + large centered statement
with `<insert what you want to utilize investment for>, with a <insert target here> by
<insert date here>` — the `<insert …>` tokens become `NEEDS INPUT`. Central glow. VERY LOW.

### 15 · thanks-contact
Near-black with **upper-right glow band**. Kicker + bold mono `THANKS!` + a sub-line
(`Pitch Closing Questions / Ask!`). Bottom row: bold `Contact us:` + email · website · location,
each led by an indigo icon. Real Cochl contact from the source deck: `contact@cochl.ai` ·
`www.cochl.ai` · `San Francisco, CA, USA` (confirm before using; otherwise `NEEDS INPUT`). LOW.

---

## Mapping arbitrary investor content onto the template

Investor decks vary; map the user's sections to the closest layout above. A rich 17-section
deck (cover, problem, opportunity, solution, how-it-works, tech/moat, product, use cases,
traction, market, competition, business model, GTM, team, funding, vision, ask) maps cleanly:

- vision / mission → `mission-statement`   · ask → `the-ask` (+ contact row)
- problem → `problem-split-callout`         · market → `market-nested-circles`
- use cases / opportunity → `use-case-band` / `use-case-four-column`
- traction → `traction-metrics`             · financials → `financials-bars`
- product / solution → `offering-devices`   · competition → `competitors-cards`/`-map`
- business model / pricing → `revenue-tiers` · pipeline → `pipeline-table`
- team / GTM / tech-moat → card grids reusing the offering/use-case card styling.

Keep the mono-headline + near-black + indigo system and the footer chrome throughout. Every
unconfirmed number stays a visible `NEEDS INPUT` slot. Still emit the bottom page-nav and
keyboard nav from `SKILL.md` Step 6.
