# Quarterly Business Review (QBR) / Board Update Deck — Cochl Template

Source of truth for the **QBR / board update** variant. Derived from the official 15-page Cochl
"Quarterly business review" deck (1920×1080). Previews in
[`qbr-board-update-previews/`](qbr-board-update-previews/) (`p01`–`p15`).

> **Sibling template.** This shares the **exact dark Cochl layout system** with
> [`corporate-strategy-roadmap-template.md`](corporate-strategy-roadmap-template.md) — same
> near-black / indigo / mint / glow tokens, same 15 layout archetypes, same gradient + glassy-ring
> cover. The only real difference is **framing**: this variant is a quarterly review / board update
> (retrospective + forward look), where the roadmap sibling is a forward product/strategy plan. Reuse
> that spec's layout detail; this file records the QBR framing, section order, and copy patterns.
> Pick this variant when the audience is a board / leadership review of the **quarter just completed**.

Placeholders (`NEEDS INPUT`, `<insert … here>`, `xx`, `T1/T2/T3`, `NAME`,
`Committed / Planned / Exploratory`) — map to real content or `NEEDS INPUT`. Never invent figures;
KPIs, financials, dates stay `NEEDS INPUT` unless confirmed.

---

## Design system

Identical to the strategy/roadmap sibling:

```css
--bg:#0b0b12 (near-black)  --black:#000  --panel:#14141c
--accent:#4B68FF (indigo)  --accent-purple:#832BFB  --mint:#A6F0CE (positive/secondary)  --neg:#EB5B6B
title: IBM Plex Sans Bold, Title Case   kicker/labels/page-no: IBM Plex Mono UPPERCASE ("STRATEGIC")
chrome: cochl. logo bottom-left + [Presentation Title] bottom-right; optional right-edge vertical mono meta
signature: purple→blue gradient cover with glassy concentric-ring orb; central glow on statement/ask/closing
```

---

## The 15 layouts (QBR framing)

| # | Layout id | QBR intent | Preview |
|--:|---|---|---|
| 1 | `cover` | Gradient+ring cover — "Quarterly business review", `xx MONTH BUILD PLAN`, NOW/NEXT/LATER → Committed/Planned/Exploratory | p01 |
| 2 | `mission-statement` | Centered positioning / mission statement | p02 |
| 3 | `where-we-are` | KPI snapshot of the quarter (ARR, customers, deployments, NRR, margin, team) — `NEEDS INPUT` | p03 |
| 4 | `pillars` | Focus areas / strategic pillars (Grow the core · Expand the surface · Operational excellence) | p04 |
| 5 | `priorities-weighted` | Priorities with weight bars + owners (`NEEDS INPUT`) | p05 |
| 6 | `okrs` | Objectives & key results (mint O-badges) | p06 |
| 7 | `roadmap-gantt` | The roadmap — quarter columns + workstream bars, mint milestones | p07 |
| 8 | `key-initiatives` | 2×2 initiative cards + owner/timing chips | p08 |
| 9 | `financial` | Financial plan — ascending bar chart, `NEEDS INPUT` | p09 |
| 10 | `growth-bridge` | Where the growth comes from — base → mint contributions → target | p10 |
| 11 | `success-metrics` | Success metrics grid — `NEEDS INPUT` | p11 |
| 12 | `risks-mitigations` | 2×2 risk (red dot) → mitigation (mint arrow) | p12 |
| 13 | `tiers` | Teams / tiers — 3 outline cards T1/T2/T3 + DRIVERS/NAME | p13 |
| 14 | `the-ask` | Centered `<insert>` ask statement over glow | p14 |
| 15 | `thanks-contact` | THANKS + contact row (`contact@cochl.ai` · `www.cochl.ai` · `San Francisco, CA, USA`) | p15 |

Layout mechanics (cards, badges, bars, Gantt geometry, chart, glow) are documented in the
[corporate-strategy-roadmap spec](corporate-strategy-roadmap-template.md#the-15-layouts) — follow it
verbatim; only the cover title and section copy change for a QBR.

---

## Recommended QBR / board-update flow

Cover → positioning statement → **where we are** (quarter KPIs) → focus areas → priorities → OKRs →
roadmap → initiatives → **financials** → growth bridge → **success metrics** → **risks & mitigations**
→ teams → the ask / next steps → thanks. A board update leans on where-we-are, financials, metrics,
and risks (the retrospective), then roadmap + the ask (the forward look). Drop slides you don't need.
Keep the dark Cochl system + `STRATEGIC` mono kicker + `cochl.` footer, emit the bottom page-nav +
keyboard nav (SKILL.md Step 6), and per Step 7 build HTML then ask PPTX / HTML / both. A Cochl-styled
Figma Slides QBR built from this template already exists (file `pXQZ3uLG34fLpafWDA92dl`) and can seed a build.
