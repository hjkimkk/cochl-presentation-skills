# Corporate Strategy & Roadmap Deck — Cochl Template

Source of truth for the **Corporate strategy / product roadmap** variant. Derived from the official
15-page Cochl "Product Roadmap" deck (1920×1080). Page previews live in
[`corporate-strategy-roadmap-previews/`](corporate-strategy-roadmap-previews/) (`p01`–`p15`). Treat
this file as authoritative. Same Cochl **near-black / indigo / glow** family as the other variants;
heading treatment is **IBM Plex Sans, Title Case** (like B2B) with a **mint secondary accent** and a
distinctive **gradient + glassy-ring cover**.

Ships with placeholder tokens (`NEEDS INPUT`, `<insert … here>`, `xx`, `T1/T2/T3`, `NAME`,
`Committed / Planned / Exploratory`). Map to real content or explicit `NEEDS INPUT`. Never invent
facts — all figures (KPIs, weights, financials, targets) stay `NEEDS INPUT` unless confirmed.

---

## Design system (strategy/roadmap variant)

```css
--bg:        #0b0b12   /* near-black — statement & cover-adjacent slides */
--black:     #000000   /* pure black — most content slides */
--panel:     #14141c   /* dark rounded cards */
--text:      #FFFFFF
--muted:     #9a9aa6
--accent:    #4B68FF   /* indigo — titles accent, priority bars, tier tags, links */
--accent-purple: #832BFB   /* gradient + glow partner */
--mint:      #A6F0CE   /* MINT secondary — OKR badges, roadmap milestones, growth contributions */
--neg:       #EB5B6B   /* risk dot */
--radius:    18px
--mx:        110px

/* Typography */
--font-head: 'IBM Plex Sans'   /* slide titles: BOLD, Title Case (e.g. "Priorities, weighted") */
--font-body: 'IBM Plex Sans'
--font-label:'IBM Plex Mono'   /* kicker + labels + meta, UPPERCASE */
kicker: IBM Plex Mono / 12–13px / .16em / UPPERCASE — the word is "STRATEGIC" on content slides
title:  IBM Plex Sans / ~48px / 700 / Title Case
```

### Chrome
- Content slides: mono kicker **`STRATEGIC`** top-left; footer `cochl.` logo bottom-left +
  `[Presentation Title]` bottom-right; some slides carry a vertical mono meta up the right edge
  (`CONFIDENTIAL | FEB 2023`).

### Glow / signature motifs (CSS gradients / radial — never raster)
1. **Cover:** full-bleed **purple→blue linear gradient** with large **glassy translucent concentric
   rings / orb** (blue-green iridescent highlights) bleeding off the right.
2. **Central radial glow** behind the mission-statement and the-ask slides.
3. Content slides are otherwise flat black — the data is the visual.

---

## The 15 layouts

| # | Layout id | Intent | Preview |
|--:|---|---|---|
| 1 | `cover` | Gradient + ring cover, plan horizon | p01 |
| 2 | `mission-statement` | Big centered statement | p02 |
| 3 | `where-we-are` | KPI snapshot grid | p03 (p04 = pillars in this export) |
| 4 | `pillars` | 3 strategic pillar cards | p04 |
| 5 | `priorities-weighted` | Numbered priorities + weight bars | p05 |
| 6 | `okrs` | 3 objective columns + key results | p06 |
| 7 | `roadmap-gantt` | Quarter columns + workstream bars | p07 |
| 8 | `key-initiatives` | 2×2 initiative cards | p08 |
| 9 | `financial` | Ascending bar chart | p09 |
| 10 | `growth-bridge` | Base → contributions → target bars | p10 |
| 11 | `success-metrics` | KPI target grid | p11 |
| 12 | `risks-mitigations` | 2×2 risk → mitigation cards | p12 |
| 13 | `tiers` | 3 outline tier cards (T1/T2/T3) | p13 |
| 14 | `the-ask` | Centered `<insert>` ask statement | p14 |
| 15 | `thanks-contact` | Thanks + contact row | p15 |

### Layout notes
- **cover** — purple→blue gradient bg + glassy ring orb (right); `cochl.` logo top-left; bold Sans
  title (e.g. "Product Roadmap"); short gradient underline; `xx MONTH BUILD PLAN` (mono bold) +
  `Description` (muted); bottom meta row of three: `NOW/Q1-Q2 → Committed`, `NEXT/Q3 → Planned`,
  `LATER/Q4 → Exploratory` (mono labels + bold values). The plan-horizon triplet is the signature.
- **mission-statement** — mono kicker + large centered Sans statement over a central purple→blue glow.
- **where-we-are** — kicker `STRATEGIC` + title "Where we are today" + lead; **3×2 grid** of dark KPI
  cards, each a big mono value (`NEEDS INPUT`) + muted label (ARR, Customers, Deployments, NRR, Gross
  margin, Team).
- **pillars** — 3 dark cards with a **2px indigo→purple top border**; `PILLAR N` (mono) + bold title
  + body. (Grow the core / Expand the surface / Operational excellence.)
- **priorities-weighted** — numbered rows (`01`–`04`, indigo mono) + title + `owner · NEEDS INPUT` +
  a track with an **indigo→purple fill** (illustrative width) + a `NEEDS INPUT` weight; caption notes
  weights are illustrative.
- **okrs** — 3 dark columns; each has a **mint `O1/O2/O3` badge** + objective title, then key-result
  rows (label + `NEEDS INPUT`).
- **roadmap-gantt** — kicker + "The roadmap"; left: `Horizon: NEEDS INPUT quarters` + legend
  (white = workstream, **mint = milestone / quick win**); right: **Q1–Q4** columns with vertical
  rules and horizontal **task bars** (white; mint for milestones) spanning their quarters.
- **key-initiatives** — 2×2 dark cards: bold title + body + `owner` / `timing` `NEEDS INPUT` chips.
- **financial** — left lead + a big `NEEDS INPUT` "Full-year revenue target"; right an **ascending
  bar chart** (indigo→purple bars, Q1–Q4) with a baseline; caption "values NEEDS INPUT · shape
  illustrative".
- **growth-bridge** — bar bridge: **grey Base**, **mint contributions** (Core growth / Expansion /
  New segment), **indigo→purple Target**; caption flags values `NEEDS INPUT`.
- **success-metrics** — 3×2 KPI target grid (`NEEDS INPUT`): ARR target, NRR, Gross margin,
  Recognition accuracy, Platform uptime, Customer count.
- **risks-mitigations** — 2×2 dark cards: **red-dot risk** title → **mint arrow** mitigation line.
- **tiers** — 3 **1px-outline** cards: indigo mono tag `T1/T2/T3` + bold tier name (Activation /
  Platform & Scale / Enterprise) + body + divider + `DRIVERS` (mono) + `NAME` (bold).
- **the-ask** — centered statement with `<insert what you want to utilize investment for>, with a
  <insert target here> by <insert date here>` over a central glow; `<insert …>` → `NEEDS INPUT`.
- **thanks-contact** — mono kicker + bold `THANKS!` + sub-line + contact row (`contact@cochl.ai` ·
  `www.cochl.ai` · `San Francisco, CA, USA`; confirm before using, else `NEEDS INPUT`).

---

## Mapping content onto the template

A corporate strategy / product-roadmap review runs: cover → mission/north-star → where-we-are →
pillars → priorities → OKRs → roadmap → initiatives → financials → growth bridge → metrics → risks →
tiers/teams → the-ask → thanks. Drop slides you don't need. Keep the Sans-Title-Case + Mono-`STRATEGIC`
system, the mint secondary accent, and the gradient-ring cover signature. Every unconfirmed number is
a visible `NEEDS INPUT`. Emit the bottom page-nav + keyboard nav from `SKILL.md` Step 6, and per Step 7
build HTML then ask PPTX / HTML / both. A ready-made HTML generator for this deck exists in the project
output (`cochl-strategy-roadmap_deck.html`) and can seed a build.
