# Market & Competitive Landscape Analysis Deck — Cochl Template

Source of truth for the **market & competitive landscape analysis** variant. Derived from the
official 13-page Cochl "Competitive Landscape Analysis" deck (1920×1080). Previews in
[`market-competitive-previews/`](market-competitive-previews/) (`p01`–`p13`).

Same Cochl **near-black / indigo / mint / glow** system as the strategy/roadmap and QBR variants
(IBM Plex Sans titles + IBM Plex Mono `NN · SECTION` kickers, gradient + glassy-ring cover). This
variant's job is **competitor analysis**: size the market, rank players, profile alternatives,
benchmark capabilities, map positioning, and stake Cochl's white space.

Placeholders: competitor **names, market shares, HQ, and the buyer-gap stat are `NEEDS INPUT`**;
market size uses confirmed research (Grand View Research). Competitor **categories** (Speech AI,
Audio analytics, Computer vision, Traditional sensors) are qualitative capability framing, not
fabricated company facts. Never invent specific competitor data.

---

## Design system

```css
--bg:#0b0b12 (near-black)  --black:#000 (data slides)  --panel:#14141c
--accent:#4B68FF (indigo)  --accent-purple:#832BFB  --mint:#A6F0CE (leader/positive)  --grey:#2b2b38 (neutral bars)
title: IBM Plex Sans Bold, Title Case   kicker: IBM Plex Mono UPPERCASE, "NN · SECTION"
chrome: cochl. logo bottom-left + "Market & Competitive Landscape" bottom-right
cover: purple→blue gradient + glassy concentric-ring orb; content slides flat near-black/black
```

Signature components: **bar charts** (market performance, share — Cochl bar in indigo→purple, rivals
grey), a **capability dot-matrix** (mint = category leader · indigo = competitive · hollow ring =
underdeveloped), a **2×2 positioning map** with a dashed `WHITE SPACE` marker + a "reading the map"
panel, a **big-stat customer-gaps split**, **competitor archetype cards**, a **two-column
strengths/weaknesses** contrast (dark panel + cream/light panel), and **numbered levers**.

---

## The 13 layouts

| # | Layout id | Intent | Preview |
|--:|---|---|---|
| 1 | `cover` | Gradient+ring cover — "Competitive Landscape Analysis" + market/horizon/prepared-by meta | p01 |
| 2 | `objective` | Analysis objective + 3 goal pillars (evaluate / position / opportunity) | p02 |
| 3 | `market-performance` | Ascending bar chart + market snapshot (industry, size, CAGR, drivers; GVR-sourced) | p03 |
| 4 | `market-share` | Share bar chart (Cochl highlighted, rivals `NEEDS INPUT`) + "what the bars say" | p04 |
| 5 | `key-players` | Table — Company / Market share / HQ / Differentiator (rows `NEEDS INPUT`) | p05 |
| 6 | `competitor-profiles` | 4 archetype cards (Speech AI · Audio analytics · Computer vision · Traditional sensors) | p06 |
| 7 | `strengths-weaknesses` | Two columns — dark "where alternatives are strong" / cream "where they fall short" | p07 |
| 8 | `capability-matrix` | Rows × approaches dot-matrix (mint leader / indigo competitive / hollow) — Cochl leads | p08 |
| 9 | `positioning-map` | 2×2 quadrant scatter, Cochl top-right, dashed WHITE SPACE + reading panel | p09 |
| 10 | `customer-gaps` | Voice-of-the-buyer split: big `NEEDS INPUT` stat + 4 gap rows | p10 |
| 11 | `strategic-takeaways` | Centered title + 4 edge cards (image placeholder + caption) | p11 |
| 12 | `differentiation-levers` | Numbered 01–04 differentiation levers | p12 |
| 13 | `action-plan` | Centered "Own the sound-intelligence category." + numbered plan + contact | p13 |

### Layout notes
- **cover** — purple→blue gradient + glassy ring orb; `cochl.` top-left; "Competitive" (white) /
  "Landscape Analysis" (indigo); subtitle; meta MARKET / HORIZON / PREPARED BY.
- **market-performance** — left ascending indigo→purple bar chart with year labels + baseline; right
  snapshot rows (Industry, Market size `$4.08B`, CAGR `22.4%`, Trend drivers) + `Source: Grand View
  Research (2025)`. Bar shape illustrative.
- **market-share** — grey rival bars + one indigo→purple Cochl bar; rival names `NEEDS INPUT`; right
  reading panel with 3 takeaways (fragmented field / value buyers underserved / category open).
- **key-players** — gradient header row (Company / Market share / HQ / Differentiator); 5 `NEEDS INPUT`
  rows; caption points to the archetype profiles for the real alternatives.
- **competitor-profiles** — 4 dark cards, each an image strip + category tag + name + one-line limit
  (what each alternative misses).
- **strengths-weaknesses** — left dark panel (mint heading, `+` rows) vs right cream panel (dark-green
  heading, `–` rows) — a deliberate light/dark contrast echoing an editorial compare.
- **capability-matrix** — capabilities (rows) × Speech AI / Audio analytics / Computer vision / Cochl
  (cols, Cochl indigo header); dots: **mint leader · indigo competitive · hollow underdeveloped**;
  Cochl is all-leader. Legend below.
- **positioning-map** — axes NARROW↔FULL-RANGE (x) and ↑REAL-TIME (y); Cochl indigo pill top-right;
  rivals as `NEEDS INPUT` grey dots; dashed `WHITE SPACE` marker; right "READING THE MAP" panel.
- **customer-gaps** — left dark panel with an oversized `NEEDS INPUT` stat + caption; right 4 gap rows
  (mono key + bold + sub): off-camera, alert fatigue, no context, audio unused.
- **strategic-takeaways / differentiation-levers / action-plan** — Cochl's edge: real-time sound
  intelligence, rides existing infra, edge+cloud, multi-industry; closing anchors the category.

---

## Mapping content

Flow: cover → objective → market size → share → key players → competitor profiles → strengths/
weaknesses → capability benchmark → positioning map → customer gaps → takeaways → differentiation →
action plan. Keep the dark Cochl system + `NN · SECTION` mono kickers + `cochl.` footer; emit the
bottom page-nav + keyboard nav (SKILL.md Step 6); per Step 7 build HTML then ask PPTX / HTML / both.
Confirmed HTML + Figma builds of this deck already exist (`cochl-market-competitive_deck.html`;
Figma `VqAHZ80ep3lUplymkT56f5`) and can seed a build.
